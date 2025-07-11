import { useChat } from "../context/ChatContext";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../config.js";
import TopBar from "./TopBar.jsx";
import useIsMobile from "../hooks/uselsMobile.js";
import delete_img from "../assets/delete.svg";
import edit from "../assets/edit.svg";

function ChatBox() {
  const isMobile = useIsMobile();
  const { selectedUser } = useChat();
  const [messages, setMessages] = useState([]);
  const [editingID, seteditingID] = useState(null);
  const [updatedmsg, setUpdatedmsg] = useState("");
  const [deletemsg, setDeletemsg] = useState(null)
  const [input, setInput] = useState("");
  const scrollRef = useRef();

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
  }, [selectedUser, messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      setMessages((prev) => [...prev, result.message]);
      setInput("");
    }
  };

  const handleEditClick = (id, oldContent) => {
    setUpdatedmsg(oldContent);
    seteditingID(id);
  };
  const handleDeleteClick = (id) => {
    setDeletemsg(id)
  }

  const handleDeleteSubmit = async (deletemsg_id) => {
    const raw = ""
    const res = await fetch(`${BACKEND_URL}/messages/delete/${deletemsg}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: "follow",
      credentials: "include",
    });

    const result = await res.json();
    console.log(result)
    
    if (result.success) {
      setMessages(messages.filter(msg => msg._id !== deletemsg_id))
      setDeletemsg(null);
    } else {
      console.error("Edit failed", result.message);
    }

  }

  const handleEditSubmit = async (editingID, updatedmsg) => {
    const res = await fetch(`${BACKEND_URL}/messages/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        messageID: editingID,
        newMessage: updatedmsg,
      }),
    });

    const result = await res.json();

    if (result.success) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === editingID ? { ...msg, content: updatedmsg } : msg
        )
      );
      seteditingID(null);
    } else {
      console.error("Edit failed", result.message);
    }
  };

  if (!selectedUser) {
    return (
      <>
        {isMobile && <TopBar />}
        <div className="h-[80vh] flex items-center justify-center text-gray-500">
          Select a user to start chatting
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
        <div className="flex-1 border-x border-black-300 overflow-y-auto p-4 bg-white">
          {messages.map((msg, i) => (
            <div
              key={msg._id}
              className={`group flex-1 items-center mb-2 flex ${msg.sender === selectedUser.username ? "justify-start" : "justify-end"}`}
            >
              {/* Delete Button */}
              {msg.sender !== selectedUser.username && (

                <div
                  className=" group ml-2 border-2  h-7 w-7 rounded-full bg-[#e5e7eb] opacity-0 translate-x-4 hover:border-[#4f4f51] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out  flex items-center"
                // className="hidden group-hover:flex items-center transition-all duration-3000 transform translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 ml-2"
                >
                  <button
                    onClick={() => handleDeleteClick(msg._id)}
                    className="m-auto"
                  >
                    <img src={delete_img} alt="edit" className="w-4" />
                  </button>
                </div>
              )}

              {/*Edit Button*/}
              {msg.sender !== selectedUser.username && (

                <div
                  className="ml-2  opacity-0 border-2 rounded-full bg-[#e5e7eb] h-7 w-7 mr-2 translate-x-4 hover:border-[#4f4f51] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out flex items-center"
                // className="hidden group-hover:flex items-center transition-all duration-3000 transform translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 ml-2"
                >
                  <button
                    className="m-auto"

                    onClick={() => handleEditClick(msg._id, msg.content)}
                  // className="transition duration-3000 ease-in-out hidden group-hover:block scale-105"
                  >
                    <img src={edit} alt="edit" className="w-4" />
                  </button>
                </div>
              )}


              <div
                className={`group relative  px-4 py-2 rounded-lg  min-w-[10rem] max-w-[70%] ${msg.sender === selectedUser.username
                  ? "bg-gray-200 text-left"
                  : "bg-purple-200 text-left"
                  }`}
              >
                <div
                  className="cursor-default"
                >{msg.content}</div>

                {/* Timestamp */}
                <div className="flex justify-end gap-1 ">

                {msg.__v > 0 && (
                  <div className="text-xs text-left opacity-50 cursor-default">
                  Edited
                </div>
                )}
                <div className="text-xs text-right mt-auto cursor-default">
                  {(new Date(msg.createdAt)).getHours().toString().padStart(2, "0")}:
                  {(new Date(msg.createdAt)).getMinutes().toString().padStart(2, "0")}
                </div>
                </div>
                




              </div>



            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>

        {/* Input Box */}
        <div className="flex items-center border border-t-0 border-gray-300 rounded-b-xl p-2 bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
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

      {/* Edit Modal */}
      {editingID && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Edit Message</h2>
            <input
              type="text"
              value={updatedmsg}
              onChange={(e) => setUpdatedmsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSubmit(editingID, updatedmsg);
              }}
              className="w-full px-4 py-2 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-purple-400"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => seteditingID(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditSubmit(editingID, updatedmsg)}
                className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}






      {/* Trigering Delete Confirm */}
      {deletemsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Do you want to Delete Message</h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletemsg(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSubmit(deletemsg)}
                className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBox;
