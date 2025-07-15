import { Link } from 'react-router-dom';
import ListImg from '../assets/1.svg'
import ChatImg from '../assets/2.svg'
import ProfileImg from '../assets/3.svg'

function BottomBar() {

    return (
        <div className="absolute bottom-0 w-full bg-[#9085c6] text-white flex justify-around items-center h-16 z-50 dark:bg-[#59168b]">
            <Link to="/">
                <div className="flex flex-col items-center cursor-pointer hover:opacity-90">
                    <img src={ListImg} alt="List Image"></img>
                    {/* <span className="text-sm">Chats</span> */}
                </div>
            </Link>

            <Link to="/chat">
                <div className="flex flex-col items-center cursor-pointer hover:opacity-90">
                    <img src={ChatImg} alt="Chat Image"></img>
                    {/* <span className="text-sm">Chat Box</span> */}
                </div>
            </Link>

            <Link to="/profile">
                <div className="flex flex-col items-center cursor-pointer hover:opacity-90">
                    <img src={ProfileImg} alt="Profile Imgage"></img>
                    {/* <span className="text-sm font-bold">Profile</span> */}
                </div>
            </Link>
        </div>
    );
}

export default BottomBar;