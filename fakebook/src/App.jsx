import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import HomeComplete from './components/HomeComplete';
import ChatList from './components/ChatList';
import ChatBox from './components/ChatBox';
import Profile from './components/Profile';
// import TopBar from './components/TopBar';
import BottomBar from './components/BottomBar';
import useIsMobile from './hooks/uselsMobile';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import HomeProfile from './components/HomeProfile';

const AppContent = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const hideTopBarRoutes = ['/login', '/signup'];
  const shouldHideTopBar = hideTopBarRoutes.includes(location.pathname);

  return (
    <>
      {/* {!shouldHideTopBar && <TopBar />} */}

      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

        {isMobile ? (
          <>
            <Route path="/" element={
              <ProtectedRoute>
                <ChatList />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatBox />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </>
        ) : (
          <>
            <Route path="/" element={
              <ProtectedRoute>
                <HomeComplete />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                < HomeProfile/>
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <HomeComplete />
              </ProtectedRoute>
            } />
          </>
        )}
      </Routes>

      {!shouldHideTopBar && isMobile && <BottomBar />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
