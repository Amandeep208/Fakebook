import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import useIsMobile from '../hooks/uselsMobile';
import TopBar from "./TopBar";



function Profile() {
  const navigate = useNavigate();
  const { loggedInUser } = useChat();

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

  return (
    <>
      <div className="min-h-screen dark:bg-[#161439] transition-colors duration-300">
        {useIsMobile && <TopBar />}

        {/* Back Button */}
          <div className="max-w-md mx-auto mt-6 px-6">
            <button
            onClick={()=>{navigate("/")}}
              className="text-sm font-medium text-white hover:bg-purple-700 px-4 py-2 rounded-full  transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" className=" fill=[#7e22cw] dark:fill-white"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
            </button>
          </div>

        <div className="max-w-md mx-auto mt-4 p-6 bg-white dark:bg-gray-800 rounded-xl text-center shadow-md transition-all duration-300">
          {/* Profile DP */}
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-[#9085c6] text-white flex items-center justify-center text-5xl font-bold">
            {loggedInUser.name?.[0]?.toUpperCase() || "?"}
          </div>

          {/* Profile Details */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {loggedInUser.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">@{loggedInUser.username}</p>
        </div>
      </div>
    </>
  );
}

export default Profile;
