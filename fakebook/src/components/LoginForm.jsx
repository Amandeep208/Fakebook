import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/fakebook-logo.png';
import { BACKEND_URL } from "../config.js"
import { useChat } from '../context/ChatContext.jsx';



const LoginForm = () => {
  const { setLoggedInUser } = useChat();
  const navigate = useNavigate(); // Must be called here, inside the component

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  async function handleSubmit() {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      setLoggedInUser(result.user); // Set the logged-in user in context
      navigate("/"); // Correct usage
    } else {
      alert(`Login failed: ${result.message}`);
    }
  }

  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow-2xl w-[300px]">
      <div className="flex justify-center mb-4">
        <img src={logo} alt="Fakebook Logo" className="h-10" />
      </div>

      <label className="block text-sm font-semibold mb-1">Username</label>
      <input
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        type="text"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(); // Replace this with your function
          }
        }}
        placeholder="Enter the Username"
        className="w-full p-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
      />

      <label className="block text-sm font-semibold mb-1">Password</label>
      <input
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        type="password"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(); // Replace this with your function
          }
        }}

        placeholder="Enter the Password"
        className="w-full p-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
      />

      <button
        onClick={handleSubmit}
        className="bg-purple-400 w-full py-2 rounded-md text-white text-lg font-semibold hover:bg-purple-500 transition"
      >
        Login
      </button>

      <p className="text-sm text-center mt-4">
        New user?{' '}
        <Link to="/signup" className="text-purple-600 font-medium hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;