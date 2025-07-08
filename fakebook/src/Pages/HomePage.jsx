import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeComplete from '../components/HomeComplete.jsx';
import ChatBox from '../components/ChatBox';
import ChatList from '../components/ChatList';
import useIsMobile from '../hooks/uselsMobile';
import BottomBar from '../components/BottomBar.jsx';
import TopBar from '../components/TopBar.jsx';
import Profile from '../components/Profile.jsx';
import { BACKEND_URL } from "../config.js"

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const res = await fetch(`${BACKEND_URL}/auth/check`, {
        credentials: "include"
      });
      const data = await res.json();

      if (!data.loggedIn) {
        navigate("/login");
      } else {
        setUser(data.user);  // ✅ Store user in state
      }
    }

    checkSession();
  }, [navigate]);

  async function handleLogout() {
    const res = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "GET",
      credentials: "include"
    });

    const result = await res.json();
    if (result.success) {
      alert("You have been logged out.");
      navigate("/login");
    } else {
      alert("Logout failed.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Home Page - You're logged in!
        {user ? ` ${(user.name)}` : ' Loading...'}
      </h1>
      <button 
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
        Logout
      </button>
    </div>
    
  );
}
