import { useChat } from "../context/ChatContext";
import { data, useNavigate } from "react-router-dom";

import useIsMobile from '../hooks/uselsMobile';
import TopBar from "./TopBar";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
// import { get } from "mongoose";



function Profile() {

  const [profilePopup, setProfilePopup] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const [profileLink, setProfileLink] = useState(null);
  const { loggedInUser } = useChat();

  //getting profile link
useEffect(()=>{
  const getlink = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/upload/profileData`, {
        method: "GET",
        credentials: "include", // sends cookies like connect.sid
        redirect: "follow"
      });

      const data = await response.json(); // assuming backend returns JSON
      // console.log("Profile link data:", data);

      setProfileLink(data.result)
      console.log(profileLink)

    } catch {
      console.error("Failed to fetch profile link:");
      return null
    }
  };

  getlink();
})







  //upload profile 
  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0]; // Only one file allowed
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file); // Use the actual File object
      setProfilePopup(false)
      setLoading(true)

      const response = await fetch(`${BACKEND_URL}/upload/profileUpload`, {
        method: "POST",
        credentials: "include", // Automatically sends connect.sid cookie
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      setLoading(false)
      const result = await response.text();
      console.log("Upload success:");
      // Optionally refresh profile picture here
    } catch (error) {
      console.error("Upload failed:");
    }
  };



  if (!loggedInUser) {
    return (
      <>
        {useIsMobile && <TopBar />}
        <div className="text-center mt-10 text-gray-500">
          Loading profile...
        </div>
      </>
    );
  }
  // console.log(loggedInUser.profileLink)

  const removeProfile = async () => {
    try {
      const response = await fetch("http://192.168.1.64:8081/upload/profileRemove", {
        method: "POST",
        credentials: "include", // ⬅️ Automatically sends cookies like connect.sid
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log("Photo removed:", result);
      setProfilePopup(false)

      // Optionally refresh user data or show success message
    } catch (error) {
      console.error("Failed to remove profile photo:", error);
    }

  };



  return (
    <>
      <div className="min-h-screen dark:bg-[#161439] transition-colors duration-300">
        {useIsMobile && <TopBar />}

        {/* Back Button */}
        <div className="max-w-md mx-auto mt-6 px-6">
          <button
            onClick={() => { navigate("/") }}
            className="text-sm font-medium text-white hover:bg-purple-700 px-4 py-2 rounded-full  transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" className=" fill=[#7e22cw] dark:fill-white"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
          </button>
        </div>

        <div className="max-w-md mx-auto mt-4 p-6 bg-white dark:bg-gray-800 rounded-xl text-center shadow-md transition-all duration-300">
          {/* Profile DP */}


          <div className="relative group w-32 h-32 mx-auto mb-4 rounded-full bg-[#ad46ff] text-white flex items-center justify-center text-5xl font-bold">
            {
            
              profileLink ? (
                <img className="rounded-full w-full h-full" src={profileLink} alt="ProfilePic" />
            ) : (
              <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                {(loggedInUser?.name || "?")
                  .split(' ')
                  .map(word => word[0])
                  .join('').toUpperCase()}
              </div>
            )}


            {/* Camera icon button */}
            <button
              onClick={() => setProfilePopup(true)}
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer hover:scale-105 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7e22ce">
                <path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z" />
              </svg>
            </button>
          </div>




          {/* Profile Details */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {loggedInUser.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">@{loggedInUser.username}</p>
        </div>
      </div>


      {profilePopup &&
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80 p-6">
            <h2 className="text-lg font-semibold mb-4 text-center dark:text-white">Profile Options</h2>
            <ul className="space-y-2">
              <li>


                <label
                  htmlFor="profile-upload"
                  className="w-full text-left px-4 py-2 rounded hover:bg-purple-100 dark:hover:bg-gray-700 dark:text-white cursor-pointer block"
                >
                  📤 Upload a photo
                </label>

                <input
                  id="profile-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={handleProfileImageUpload}
                />

              </li>
              <li>
                <button
                  onClick={removeProfile}

                  className="w-full text-left px-4 py-2 rounded hover:bg-red-100 dark:hover:bg-gray-700 dark:text-white"
                >
                  🗑️ Remove photo
                </button>
              </li>
            </ul>
            <button
              onClick={() => setProfilePopup(false)}
              className="mt-4 w-full text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      }



      {
        loading &&
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4 shadow-lg">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#9085c6] border-solid"></div>
            <p className="text-[#9085c6] font-semibold text-lg">Loading...</p>
          </div>
        </div>
      }
    </>







  );
}

export default Profile;
