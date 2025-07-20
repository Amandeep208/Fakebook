import ChatBox from './ChatBox.jsx';
import ChatList from './ChatList.jsx';
import TopBar from './TopBar.jsx';

function HomeComplete() {

  // Desktop layout containg 40-60 split of ChatList and ChatBox Components
  return (
    <>
      <div className='min-h-screen dark:bg-[#161439] transition-colors duration-300'>

        <div className="px-10 pt-5 w-full flex dark:bg-[#161439]">
          <div className="w-2/5">
            <ChatList />
          </div>
          <div className="w-3/5">
            <ChatBox />
          </div>
        </div>
      </ div>
    </>
  );
}

export default HomeComplete;
