import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config.js"

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/check`, {
          credentials: "include"
        });
        const data = await res.json();
        if (!data.loggedIn) {
          navigate("/login");
        } else {
          setLoading(false);
        }
      } catch (err) {
        navigate("/login");
      }
    }

    checkSession();
  }, [navigate]);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white/60 flex justify-center items-center z-50">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-800 font-semibold">Loading...</p>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;
