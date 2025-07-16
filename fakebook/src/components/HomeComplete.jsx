import ChatBox from './ChatBox.jsx';
import ChatList from './ChatList.jsx';
import TopBar from './TopBar.jsx';

function HomeComplete() {

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



// import ChatBox from './ChatBox.jsx';
// import ChatList from './ChatList.jsx';

// function HomeComplete() {
//   return (
//     <div className="px-10 pt-5 w-full h-screen flex">
//       <div className="w-2/5">
//         <ChatList />
//       </div>
//       <div className="w-3/5 h-full border-l overflow-hidden">
//         {/* ChatBox takes full height and internal messages can scroll */}
//         <div className="h-full overflow-y-auto">
//           <ChatBox />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HomeComplete;
