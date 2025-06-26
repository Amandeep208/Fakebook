import ChatBox from './ChatBox.jsx';
import ChatList from './ChatList.jsx';
import TopBar from './TopBar.jsx';

function HomeComplete() {

return (
  <>
  <div className="px-10 pt-5 w-full flex">
    <div className="w-2/5">
      <ChatList />
    </div>
    <div className="w-3/5">
      <ChatBox />
    </div>
  </div>
  </>
);
}

export default HomeComplete;