import React from 'react';
import BackgroundLayout from './components/BackgroundLayout';
import LoginForm from './components/LoginForm';
import Login from './Pages/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './Pages/Signup';
import HomePage from './Pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
