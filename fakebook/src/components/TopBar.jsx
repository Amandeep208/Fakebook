import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config.js"
import logo from "../assets/fakebook-logo.png"; 


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
    <div className=" rounded-b-xl p-5 flex justify-between items-center  p-4 bg-[#f3e8ff] ">
      {/* <h1 className="text-xl text-black-600 font-bold">
        {loggedInUser ? `Welcome, ${loggedInUser.name}` : "Loading..."}
      </h1> */}
      <div className="logo">
        <img className="w-40 " src={logo} alt="" />
      </div>
      <button
        onClick={handleLogout}
        className="bg-purple-600 text-white px-3 py-1 rounded font-semibold hover:bg-purple-700"
      >
        Logout
      </button>

    </div>
  );
};

export default TopBar;
