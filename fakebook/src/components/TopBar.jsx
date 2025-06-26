import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config.js"


const TopBar = () => {
  const { loggedInUser } = useChat();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await fetch(`${BACKEND_URL}/logout`, {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();
    if (data.success) {
      alert("Logged out successfully");
      navigate("/login");
    } else {
      alert("Logout failed");
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-purple-600 text-white">
      <h1 className="text-xl font-bold">
        {loggedInUser ? `Welcome, ${loggedInUser.name}` : "Loading..."}
      </h1>
      <button
        onClick={handleLogout}
        className="bg-white text-purple-600 px-3 py-1 rounded font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default TopBar;
