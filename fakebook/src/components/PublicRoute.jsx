import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config.js"

const PublicRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  // Checks whether the user is logged in
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/check`, {
          credentials: "include"
        });
        const data = await res.json();
        if (data.loggedIn) {
          navigate("/"); // Redirect to dashboard/home if session is valid
        } else {
          setChecking(false); // Allow access to login/signup
        }
      } catch (err) {
        setChecking(false);
      }
    }

    checkSession();
  }, [navigate]);

  if (checking) return null;

  return children;
};

export default PublicRoute;
