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
    {useIsMobile && <TopBar/>}
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl text-center">
      {/* Profile DP - use first letter of name */}
      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-[#9085c6] text-white flex items-center justify-center text-5xl font-bold">
        {loggedInUser.name?.[0]?.toUpperCase() || "?"}
      </div>

      {/* Profile Details */}
      <h2 className="text-xl font-semibold">{loggedInUser.name}</h2>
      <p className="text-gray-600">@{loggedInUser.username}</p>
    </div>
    </>
  );
}

export default Profile;
