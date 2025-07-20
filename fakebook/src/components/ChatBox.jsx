import { useChat } from "../context/ChatContext";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../config.js";
import TopBar from "./TopBar.jsx";
import useIsMobile from "../hooks/uselsMobile.js";
import delete_img from "../assets/delete.svg";
import edit from "../assets/edit.svg";
import EmojiPicker from "emoji-picker-react";
import EmojiIcon from "../assets/emoji_icon.svg";

function ChatBox() {
  const isMobile = useIsMobile();
  const { selectedUser } = useChat();
  const [messages, setMessages] = useState([]);
  const [editingID, seteditingID] = useState(null);
  const [updatedmsg, setUpdatedmsg] = useState("");
  const [deletemsg, setDeletemsg] = useState(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef();
  const [showPicker, setShowPicker] = useState(false);
  const [emojiButtonColor, setEmojiButtonColor] = useState("bg-white");
  const messagesContainerRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);
  const [newMessagesIndicator, setNewMessagesIndicator] = useState(false);
  const [newMessagesCounter, setNewMessagesCounter] = useState(0);
  const [oldestPageLoaded, setOldestPageLoaded] = useState(1);
  const oldestPageLoadedRef = useRef(oldestPageLoaded);
  const [trigger, setTrigger] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const messagesRef = useRef(messages.length);

  // Show new messages indicator only when newMessagesCounter > 0
  useEffect(() => {
    if (newMessagesCounter <= 0) {
      setNewMessagesIndicator(false);
    }
    else {
      setNewMessagesIndicator(true);
    }
  }, [newMessagesCounter]);

  // Keep messagesRef in sync with messages.
  useEffect(() => {
    messagesRef.current = messages.length;
  }, [messages]);

  // Disable the Load more button if first messages are less than 20
  useEffect(() => {
    if (messagesRef.current < 20) {
      setShowLoadMore(false);
    }
  }, [messages]);

  // Keeps OldestPageLoadedRef in sync with OPL
  useEffect(() => {
    oldestPageLoadedRef.current = oldestPageLoaded;
  }, [oldestPageLoaded]);

  // Runns when scrolled
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 90;
    setAtBottom(isNearBottom);

    // Resets Unread messages Indicator
    if (isNearBottom) {
      setNewMessagesCounter(0);
      setNewMessagesIndicator(false);
    }

    // If current messages are less than 20, disables Load More
    if (messagesRef.current < 20) {
      setShowLoadMore(false);
    }
    else {
      if (container.scrollTop == 0) {
        setShowLoadMore(true);
      }
      else {
        setShowLoadMore(false);
      }
    }
  };

  // Adds event listener to messages container
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [selectedUser]);

  // Scrolls messages container to bottom
  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Teleports messsages container to the bottom
  const goToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  };

  // Resets all selected user dependent values
  useEffect(() => {
    setAtBottom(true);
    setNewMessagesIndicator(false);
    setNewMessagesCounter(0);
    setOldestPageLoaded(1);
    setShowLoadMore(false);
  }, [selectedUser]);

  // Appends emojis into text field
  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  // Adds backgroud to emoji button when emoji picker is open
  useEffect(() => {
    setEmojiButtonColor(showPicker ? "bg-gray-200 dark:bg-gray-700" : "bg-white dark:bg-[#1e1e1e]");
  }, [showPicker]);


  // Fetching first 20 messages automatically
  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`${BACKEND_URL}/messages/${selectedUser.username}?page=1`, {
        credentials: "include",
      });
      const data = await res.json();
      if (JSON.stringify(data) !== JSON.stringify(messages)) {
        setMessages(data);
      }
    }
    if (!selectedUser) return;
    fetchMessages();
  }, [selectedUser]);

  // Subsequent 2 Sec automatic request for messages, loads current number of loaded pages
  useEffect(() => {
    // Helper function 1
    async function fetchMessages(page) {
      const res = await fetch(`${BACKEND_URL}/messages/${selectedUser.username}?page=${page}`, {
        credentials: "include",
      });
      const data = await res.json();
      return data;
    }

    // Helper function 2
    async function fetchMessagesUptoPage(uptoPage) {
      let compiledData = [];
      for (let i = uptoPage; i > 0; i--) {
        const dataSegment = await fetchMessages(i);
        compiledData = compiledData.concat(dataSegment);
      }
      return compiledData;
    }

    // Helper function 3
    async function fetchMessagesUpto() {
      const finalData = await fetchMessagesUptoPage(oldestPageLoadedRef.current);
      if (JSON.stringify(finalData) != JSON.stringify(messages)) {
        console.log("\nNew messages are different");
        setMessages(finalData);
      }
      else {
        console.log("\nNew messages are same");
      }
    }

    if (!selectedUser) return;

    // function call to load messages instantly
    fetchMessagesUpto();

    // Subsequent call every two seconds
    const interval = setInterval(fetchMessagesUpto, 2000);

    return () => clearInterval(interval);

  }, [selectedUser, messages]);

  // Conditional autoscroll: Scrolls to bottom only when the user is near bottom of messages
  useEffect(() => {
    if (atBottom) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    else {
      setNewMessagesCounter((prev) => prev + 1);
    }
  }, [messages]);

  // API request to send a message.
  const sendMessage = async () => {
    setShowPicker(false);
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
      goToBottom();
    }
  };

  // Sets state variable to values needed for edit message request
  const handleEditClick = (id, oldContent) => {
    setUpdatedmsg(oldContent);
    seteditingID(id);
  };

  // Sets state variable to value(s) needed to delete amessage request
  const handleDeleteClick = (id) => {
    setDeletemsg(id);
  };

  // Sends request for deleting a message by using state variables
  const handleDeleteSubmit = async (deletemsg_id) => {
    const res = await fetch(`${BACKEND_URL}/messages/delete/${deletemsg}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const result = await res.json();
    if (result.success) {
      setMessages(messages.filter((msg) => msg._id !== deletemsg_id));
      setDeletemsg(null);
      setNewMessagesCounter((prev) => prev - 2);
    }
  };

  // Sends request for editing a message using state variables.
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
      setNewMessagesCounter((prev) => prev - 2);
      seteditingID(null);
    }
  };

  // Places placeholder text in place of chat box when no user is selected in the begining
  if (!selectedUser) {
    return (
      <>
        {isMobile && <TopBar />}
        <div className="h-[80vh] flex items-center justify-center text-gray-500 dark:text-gray-300">
          Select a user to start chatting
        </div>
      </>
    );
  }

  // Loads the next page to the currently oldest loaded and appends it to messages array
  const handleLoadMore = () => {
    console.log("Load more clicked");

    async function fetchMessages() {
      const res = await fetch(`${BACKEND_URL}/messages/${selectedUser.username}?page=${oldestPageLoaded + 1}`, {
        credentials: "include",
      });
      const data = await res.json();
      setMessages((prev) => data.concat(prev));
      setNewMessagesCounter((prev) => prev - 1);

      if (data.length != 0) {
        setOldestPageLoaded((prev) => prev + 1);
        messagesContainerRef.current.scrollTop = 0.5;
      }
      else {
        setShowLoadMore(false);
      }
    }
    fetchMessages();
  }

  // Returns the complete chat box with messages
  return (
    <>
      {/* Renders top bar only if the device is a mobile device */}
      {isMobile && <TopBar />}

      {/* Chat Box container */}
      <div className={`flex flex-col px-6 mb-5 pt-2 dark:bg-[#161439] ${isMobile ? "h-[70vh]" : "h-[90vh]"}`}>

        {/* Chat header */}
        <div className="relative py-2 px-4 border border-gray-300 rounded-t-xl bg-purple-100 text-center font-semibold dark:bg-[#2d1a40] dark:text-white dark:border-gray-600">
          {selectedUser.name} ({selectedUser.username})

          {showLoadMore && <button onClick={handleLoadMore} className="left-1/2 -translate-x-1/2 top-13 text-sm absolute z-10 bg-[#7d72c3] px-2 py-1 rounded-2xl cursor-pointer text-white">Load More</button>}
        </div>

        {/* Messages container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 border-x border-black-300 overflow-y-auto pt-13 p-4 bg-white dark:bg-[#121212]"
          onClick={() => setShowPicker(false)}
        >
          {messages.map((msg) => (
            // Individual message super container
            <div
              key={msg._id}
              className={`group flex-1 items-center mb-2 flex ${msg.sender === selectedUser.username ? "justify-start" : "justify-end"
                }`}
            >

              {/* Delete message button container*/}
              {msg.sender !== selectedUser.username && (
                <div className="group ml-2 border-2 h-7 w-7 rounded-full bg-[#e5e7eb] dark:bg-gray-600 opacity-0 translate-x-4 hover:border-[#4f4f51] hover:cursor-pointer group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out flex items-center">

                  {/* Delete message button */}
                  <button onClick={() => handleDeleteClick(msg._id)} className="m-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" className="fill-[#7e22ce] dark:fill-white hover:cursor-pointer" ><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" /></svg>
                  </button>
                </div>
              )}

              {/* Edit message button conatiner*/}
              {msg.sender !== selectedUser.username && (
                <div className="ml-2 opacity-0 border-2 rounded-full bg-[#e5e7eb] dark:bg-gray-600 h-7 w-7 mr-2 translate-x-4 hover:border-[#4f4f51] hover:cursor-pointer group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out flex items-center">

                  {/* Edit message button */}
                  <button className="m-auto" onClick={() => handleEditClick(msg._id, msg.content)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" className="fill-[#7e22ce] dark:fill-white hover:cursor-pointer"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>
                  </button>
                </div>
              )}

              {/* Individual message continer */}
              <div
                className={`group relative px-4 py-2 rounded-lg min-w-[10rem] max-w-[70%] ${msg.sender === selectedUser.username
                  ? "bg-gray-200 dark:bg-gray-700 text-left dark:text-white"
                  : "bg-purple-200 dark:bg-purple-800 text-left dark:text-white"
                  }`}
              >
                {/* Message content */}
                <div className="cursor-default">{msg.content}</div>

                {/* Additional message info container*/}
                <div className="flex justify-end gap-1">

                  {/* Conditional Edited Flag */}
                  {msg.__v > 0 && (
                    <div className="text-xs text-left opacity-50 cursor-default">Edited</div>
                  )}

                  {/* Message time display */}
                  <div className="text-xs text-right mt-auto cursor-default">
                    {new Date(msg.createdAt).getHours().toString().padStart(2, "0")}:
                    {new Date(msg.createdAt).getMinutes().toString().padStart(2, "0")}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Reference to absolute bottom of the messages container */}
          <div ref={scrollRef}></div>
        </div>


        <div className="flex relative items-center border border-t-0 border-gray-300 rounded-b-xl p-2 bg-white dark:bg-[#1e1e1e] dark:border-gray-600">

          {/* Conditional scroll-to-bottom button */}
          {!atBottom && (
            <div>
              <button
                onClick={scrollToBottom}
                className="absolute right-7 bottom-20 bg-[#9e9e9e] text-white h-10 w-10 rounded-full cursor-pointer"
              >
                ↓
              </button>

              {/* Unread messages indicator */}
              {newMessagesIndicator && <div className="absolute bottom-27 right-6 rounded-full bg-[#7d72c3] h-4 w-4 text-xs text-center text-white">
                {newMessagesCounter}
              </div>}
            </div>
          )}

          {/* Emoji picker toggle button */}
          <svg
            onClick={() => setShowPicker((val) => !val)}
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            className={`cursor-pointer ml-2 mr-2 w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-1 ${emojiButtonColor} dark:fill-white`}
            fill="#444746"
          >
            <path d="M620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400h-66q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-66q25 63 80.5 101.5T480-260Zm0 180q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
          </svg>

          {/* Emoji picker */}
          {showPicker && (
            <div className="absolute z-10 mb-16 -translate-y-1/2">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}

          {/* Input text-field for typing message */}
          <input
            type="text"
            value={input}
            onClick={() => setShowPicker(false)}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Type a message..."
            className="min-w-0 flex-1 px-4 py-2 rounded-full border border-gray-300 outline-none focus:ring-2 focus:ring-[#9085c6] dark:bg-gray-800 dark:text-white"
          />

          {/* Send-message button */}
          <button
            onClick={sendMessage}
            className="ml-3 bg-[#9085c6] text-white py-3 px-6 rounded-full hover:bg-[#7d72c3] transition"
          >
            ➤
          </button>
        </div>
      </div>

      {/* Editing message prompt overlay */}
      {editingID && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">

          {/* Editing prompt box */}
          <div className="bg-white dark:bg-[#2c2c2c] text-black dark:text-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Edit Message</h2>

            {/* Input text-field containing original message */}
            <input
              type="text"
              value={updatedmsg}
              onChange={(e) => setUpdatedmsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSubmit(editingID, updatedmsg);
              }}
              className="w-full px-4 py-2 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
              autoFocus
            />

            <div className="flex justify-end space-x-3">
              {/* Cancel edit button */}
              <button
                onClick={() => seteditingID(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              {/* Submit edit button */}
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


      {/* Delete message prompt overlay */}
      {deletemsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">

          {/* Delete prompt box */}
          <div className="bg-white dark:bg-[#2c2c2c] text-black dark:text-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Do you want to Delete Message</h2>
            <div className="flex justify-end space-x-3">

              {/* Cancel delete button */}
              <button
                onClick={() => setDeletemsg(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              {/* Confirm delete button */}
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