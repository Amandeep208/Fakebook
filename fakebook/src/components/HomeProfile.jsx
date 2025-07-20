import ChatBox from './ChatBox.jsx';
import ChatList from './ChatList.jsx';
import Profile from './Profile.jsx';
import TopBar from './TopBar.jsx';

function HomeProfile() {

  // Desktop layout containin Profile and ChatBox in 40-60 split
  return (
    <>
      <div className="px-10 pt-5 w-full flex">
        <div className="w-2/5">
          <Profile />
        </div>
        <div className="w-3/5">
          <ChatBox />
        </div>
      </div>
    </>
  );
}

export default HomeProfile;