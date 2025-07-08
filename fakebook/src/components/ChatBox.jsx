import { useChat } from "../context/ChatContext";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../config.js";
import TopBar from "./TopBar.jsx";
import useIsMobile from "../hooks/uselsMobile.js";
import { redirect } from "react-router-dom";

function ChatBox() {
  const isMobile = useIsMobile();
  const { selectedUser } = useChat();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef();

  // Fetch messages every 2 seconds
  useEffect(() => {
    if (!selectedUser) return;

    async function fetchMessages() {
      const res = await fetch(`${BACKEND_URL}/messages/${selectedUser.username}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (JSON.stringify(data) !== JSON.stringify(messages)) {
        setMessages(data);
      }
    }

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;

    const res = await fetch(`${BACKEND_URL}/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ receiver: selectedUser.username, content: input }),
    });

    const result = await res.json();

    if (result.success) {
      setMessages((prev) => [...prev, result.message]); // Instantly show message
      setInput("");
    }
   
  };

  if (!selectedUser) {
    return (
      <>
        {isMobile && <TopBar />}
        <div className="h-[80vh]">
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        </div>
      </>
    );
  }

  const height = isMobile ? "70vh" : "90vh";

  return (
    <>
      {isMobile && <TopBar />}
      <div className={`h-[${height}] flex flex-col px-6 mb-5 pt-2`}>
        {/* Chat Header */}
        <div className="py-2 px-4 border border-gray-300 rounded-t-xl bg-purple-100 text-center font-semibold">
          {selectedUser.name} ({selectedUser.username})
        </div>

        {/* Messages */}
        <div className="flex-1 border-x border-gray-300 overflow-y-auto p-4 bg-white">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 flex ${msg.sender === selectedUser.username ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[70%] ${
                  msg.sender === selectedUser.username
                    ? "bg-gray-200 text-left"
                    : "bg-purple-100 text-right font-bold"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>

        {/* Input */}
        <div className="flex items-center border border-t-0 border-gray-300 rounded-b-xl p-2 bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 outline-none focus:ring-2 focus:ring-[#9085c6]"
          />
          <button
            onClick={sendMessage}
            className="ml-3 bg-[#9085c6] text-white py-3 px-6 rounded-full hover:bg-[#7d72c3] transition"
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatBox;
