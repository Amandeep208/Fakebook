import { useChat } from "../context/ChatContext";
import useIsMobile from '../hooks/uselsMobile';
import TopBar from "./TopBar";

function Profile() {
  const { loggedInUser } = useChat();

  if (!loggedInUser) {
    return (
      <>
      {useIsMobile && <TopBar/>}
      <div className="text-center mt-10 text-gray-500">
        Loading profile...
      </div>
      </>
    );
  }

  return (
    <>
   <div className="min-h-screen bg-gray-100 dark:bg-[#161439] transition-colors duration-300">
        {useIsMobile && <TopBar />}
        
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl text-center shadow-md transition-all duration-300">
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
