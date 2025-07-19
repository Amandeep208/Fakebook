import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useNavigate, Link } from "react-router-dom";
import useIsMobile from "../hooks/uselsMobile";
import { BACKEND_URL } from "../config.js";
import TopBar from "./TopBar.jsx";
import ProfileImg from "../assets/Profile.svg";

function ChatList() {
  const [users, setUsers] = useState([]);
  const {
    setSelectedUser,
    selectedUser,
    loggedInUser,
    setLoggedInUser,
    theme,
    setTheme,
  } = useChat();

  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [status, setStatus] = useState("")

  // ✅ Fetch logged-in user
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

  // ✅ Fetch all users
  // useEffect(() => {
  //   async function fetchUsers() {
  //     const res = await fetch(`${BACKEND_URL}/users/fetchusers`, {
  //       credentials: "include",
  //     });
  //     const data = await res.json();
  //     if (data.success) setUsers(data.users);
  //   }

  //   fetchUsers();
  // }, []);
  useEffect(() => {

    async function fetchUsers() {
      const res = await fetch(`${BACKEND_URL}/users/fetchusers`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        console.log(data)
      }
    }
    fetchUsers();

    const fetchUsersInterval = setInterval(fetchUsers, 5000);
    return () => clearInterval(fetchUsersInterval);
  }, []);

  // ✅ Set initial theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const activeTheme = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(activeTheme);
    if (activeTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // ✅ Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // ✅ Handle user select
  const handleSelect = (user) => {
    setSelectedUser(user);
    if (isMobile) {
      navigate("/chat");
    }
  };

  //Status Update
  // const statusUpdate = (lastSeen) => {

  const statusUpdate = (lastSeen) => {
    if (lastSeen == null) {
      return "";
    }
    const diffInSeconds = Math.floor((Date.now() - new Date(lastSeen)) / 1000);

    if (diffInSeconds < 5) {
      return "Online";
    } else if (diffInSeconds < 60) {
      return `Active few seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Active ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Active ${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Active ${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };




  return (
    <>
      <div className="dark:bg=[#161439]">

        <TopBar />

        <div className="px-4 py-2 mt-5 text-xl text-black dark:text-white font-bold transition-colors duration-300">
          {loggedInUser ? (
            <div className="flex items-center">
              {/* {!isMobile && ()}+++ */}
              <Link to="/profile">
                <div className="flex items-center h-[40px] cursor-pointer hover:opacity-90">
                  {/* Profile Icon */}
                  {!isMobile && (

                    <div className="flex items-center justify-center h-full w-[40px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        className="fill-[#7e22ce] dark:fill-white"
                      >
                        <path d="M200-246q54-53 125.5-83.5T480-360q83 0 154.5 30.5T760-246v-514H200v514Zm280-194q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm69-80h422q-44-39-99.5-59.5T480-280q-56 0-112.5 20.5T269-200Zm211-320q-25 0-42.5-17.5T420-580q0-25 17.5-42.5T480-640q25 0 42.5 17.5T540-580q0 25-17.5 42.5T480-520Zm0 17Z" />
                      </svg>
                    </div>
                  )}


                  {/* User Name */}
                  <div className="ml-2 text-[18px] font-medium leading-none h-full flex items-center font1">
                    <b>{` ${loggedInUser.name}`}</b>
                  </div>
                </div>
              </Link>


              {/* <div className="ml-2 h-[40px] text-2xl">
              {!isMobile ? loggedInUser.name : `Welcome, ${loggedInUser.name}`}
            </div> */}

              <button
                onClick={toggleTheme}
                className="ml-auto mr-5 p-2 px-4 transition duration-300 hover:cursor-pointer text-black dark:text-white"
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
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
              className={`flex items-center gap-4 my-2 rounded-xl px-5 py-3 mx-2 cursor-pointer transition-colors duration-200 ${selectedUser?.username === user.username
                ? "bg-purple-200 text-purple-900 ring-2 ring-purple-400 font-semibold dark:bg-purple-800 dark:text-white dark:ring-purple-600"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                }`}
            >
              <div className="w-12 h-10 rounded-full bg-[#9085c6] text-white flex items-center justify-center font-bold">
                {user.profileLink ? (
                  <img
                    src={user.profileLink}
                    alt="ProfilePic"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  (user.name?.split(' ').map(word => word[0]).join('').toUpperCase() || "?")
                )}
              </div>

              <div className="w-full">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-md font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                  </div>

                  <div>
                    {statusUpdate(user.lastSeen) === "Online" ? (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <span className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse"></span>
                        <span>{statusUpdate(user.lastSeen)}</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {statusUpdate(user.lastSeen)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </>
  );
}

export default ChatList;
