import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useNavigate, Link } from "react-router-dom";
import useIsMobile from "../hooks/uselsMobile";
import { BACKEND_URL } from "../config.js";
import TopBar from "./TopBar.jsx";
import ProfileImg from '../assets/Profile.svg';

function ChatList() {
  const [users, setUsers] = useState([]);
  const {
    setSelectedUser,
    selectedUser,
    loggedInUser,
    setLoggedInUser // ✅ included here
  } = useChat();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/check`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setLoggedInUser(data.user);
        } else {
          setLoggedInUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setLoggedInUser(null);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(`${BACKEND_URL}/users/fetchusers`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    }

    fetchUsers();
  }, []);

  const handleSelect = (user) => {
    setSelectedUser(user);
    if (isMobile) {
      navigate("/chat");
    }
  };

  return (
    <>
      <TopBar />


      <div className="px-4 py-2 mt-5 text-xl text-black font-bold">
        {loggedInUser ? (
          <div className="flex">
            {!isMobile && (
              <Link to="/profile">
                <div className="flex items-center justify-center  h-[40px] cursor-pointer hover:opacity-90">
                  <img className="h-[35px]" src={ProfileImg} alt="Profile" />
                </div>
              </Link>
            )}
            <div className="ml-2  h-[40px] text-2xl">
              {!isMobile ? loggedInUser.name : `Welcome, ${loggedInUser.name}`}
            </div>
          </div>
        ) : (
          "Loading user..."
        )}
      </div>

      <div className="h-[70vh] w-full pt-3 pb-10 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.username}
            onClick={() => handleSelect(user)}
            className={`flex items-center gap-4 my-2 rounded-xl px-5 py-3 mx-2 cursor-pointer ${
              selectedUser?.username === user.username
                ? "bg-purple-200 text-purple-900 ring-2 ring-purple-400 font-semibold"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#9085c6] text-white flex items-center justify-center font-bold">
              {user.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-md">{user.name}</p>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatList;