import { createContext, useState, useContext, useEffect } from 'react';
import { BACKEND_URL } from "../config.js"

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [theme, setTheme] = useState("");
  

  // Get session user once
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`${BACKEND_URL}/auth/check`, {
        credentials: "include"
      });
      const data = await res.json();
      if (data.loggedIn) setLoggedInUser(data.user);
    }

    fetchUser();
  }, [loggedInUser]);

  return (
    <ChatContext.Provider value={{ selectedUser, setSelectedUser, loggedInUser, setLoggedInUser, theme, setTheme }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
