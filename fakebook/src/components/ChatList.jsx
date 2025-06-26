import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../hooks/uselsMobile";
import { BACKEND_URL } from "../config.js"


function ChatList() {
  const [users, setUsers] = useState([]);
  const { setSelectedUser, selectedUser } = useChat();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(`${BACKEND_URL}/users`, {
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
    <div className="h-[75vh] w-full pt-3 pb-10 overflow-y-auto">
      {users.map((user) => (
        <div
          key={user.username}
          onClick={() => handleSelect(user)}
          className={`cursor-pointer p-4 border-b hover:bg-gray-100 ${
            selectedUser?.username === user.username ? "bg-purple-100 font-semibold" : ""
          }`}
        >
          <p>{user.name} ({user.username})</p>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
