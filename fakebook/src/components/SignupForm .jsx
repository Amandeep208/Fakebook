import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for routing
import logo from '../assets/fakebook-logo.png';
import { useState } from 'react';
import { BACKEND_URL } from "../config.js"

const SignupForm = () => {
  const navigator = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    signupConfirmPassword: ""
  })

  // Handles sign up request
  async function handelSubmit() {
    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {

      alert("Signup successful!");
      navigator("/login")
    } else {
      alert(`Signup failed: ${result.message}`);
    }
  }

  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-xl shadow-2xl w-[300px]">
      {/* fakebook logo */}
      <div className="flex justify-center mb-4">
        <img src={logo} alt="Fakebook Logo" className="h-10" />
      </div>

      {/* Name input */}
      <label className="block text-sm font-semibold mb-1">Name</label>
      <input

        type="text"
        placeholder="Enter Your Name"
        className="w-full p-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handelSubmit(); // Replace this with your function
          }
        }}
        onChange={(e) => {
          setFormData({ ...formData, name: e.target.value })
        }}
      />

      {/* Username input */}
      <label className="block text-sm font-semibold mb-1">Username</label>
      <input
        type="text"
        placeholder="Enter the Username"
        className="w-full p-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handelSubmit(); // Replace this with your function
          }
        }}
        onChange={(e) => {
          setFormData({ ...formData, username: e.target.value })
        }}
      />
      
      {/* Password input */}
      <label className="block text-sm font-semibold mb-1">Password</label>
      <input
        type="password"
        placeholder="Enter the Password"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handelSubmit(); // Replace this with your function
          }
        }}
        className="w-full p-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
        onChange={(e) => {
          setFormData({ ...formData, password: e.target.value })
        }}
      />

      {/* Confirm password input */}
      <label className="block text-sm font-semibold mb-1">Confirm Password</label>
      <input
        type="password"
        placeholder="Confirm Password"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handelSubmit(); // Replace this with your function
          }
        }}
        className="w-full p-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
        onChange={(e) => {
          setFormData({ ...formData, signupConfirmPassword: e.target.value })
        }}
      />

      {/* Sign-up button */}
      <button onClick={handelSubmit}
        className="bg-purple-400 w-full py-2 rounded-md text-white text-lg font-semibold hover:bg-purple-500 transition">
        Register
      </button>
      
      {/* Navigate to login */}
      <p className="text-sm text-center mt-4">
        Already registered?{' '}
        <Link to="/login" className="text-purple-600 font-medium hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
