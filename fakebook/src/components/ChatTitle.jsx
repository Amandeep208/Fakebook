function ChatTitle({ title = "Temp Chat" }) {
    return (
        // <div className='chat-title'>
        //     <div className="profile-logo">{title[0]}</div>
        //     <h3>{title}</h3>
        // </div>

        <div className="w-full pt-2">
            <div className="flex items-center gap-4 bg-gray-100 hover:bg-gray-200 rounded-xl px-5 py-3 mx-2 cursor-pointer">
                <div className="h-15 w-15 min-w-[60px] min-h-[60px] flex items-center justify-center rounded-full bg-[#b8aafe] text-white text-2xl">
                    {title[0]}
                </div>
                <h3 className="font-semibold">{title}</h3>
            </div>
        </div>
    );
}

export default ChatTitle;