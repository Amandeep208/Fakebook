import ChatBox from './ChatBox.jsx';
import ChatList from './ChatList.jsx';
import TopBar from './TopBar.jsx';

function HomeComplete() {

return (
  <>
  <div className="w-full flex">
    <div className="w-1/2">
      <ChatList />
    </div>
    <div className="w-1/2">
      <ChatBox />
    </div>
  </div>
  </>
);
}

export default HomeComplete;