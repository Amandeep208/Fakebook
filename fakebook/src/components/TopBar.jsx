import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config.js";
import { Link } from 'react-router-dom';
import ProfileImg from '../assets/Profile.svg';
import logo from "../assets/fakebook-logo.png";

const TopBar = () => {
  const { loggedInUser } = useChat();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) {
      navigate("/login");
    } else {
      alert("Logout failed");
    }
  };

  return (
    <div className="rounded-xl p-5 m-2 flex justify-between items-center bg-[#f3e8ff] dark:bg-purple-900 dark:border-[#9d8cf5] transition-colors duration-300">
      <div className="logo">
        <img className="w-40" src={logo} alt="Logo" />
      </div>

      <button
        onClick={handleLogout}
        className="bg-purple-600 text-white px-5 py-2 rounded-3xl font-semibold hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default TopBar;
