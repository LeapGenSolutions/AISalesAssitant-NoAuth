// src/components/ChatInterface.js
import React, { useContext, useState } from "react";
import {
  FaTimes,
  FaWindowMinimize,
  FaWindowMaximize,
} from "react-icons/fa";
import {IoMdRefreshCircle} from "react-icons/io"
import { AuthContext } from "../helpers/AuthContext";

function ChatBox() {

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isChatMinimized, setIsChatMinimized] = useState(false); // Minimize/maximize state
  const { idTokenClaims } = useContext(AuthContext);
  const [iFrameLink, setIFrameLink] = useState(process.env.REACT_APP_IFRAME_URI+`/?name=${idTokenClaims?.name}&preferred_username=${idTokenClaims?.name}&multiturn=${idTokenClaims.multiTenant}`)

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleMinimizeChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };
  
  const handleRefresh = () => {
    setIFrameLink(null);
    setTimeout(()=>{
      setIFrameLink(process.env.REACT_APP_IFRAME_URI+`/?name=${idTokenClaims.name}&preferred_username=${idTokenClaims.name}&multiturn=${idTokenClaims.multiTenant}`)
    },2000)
  };

  if (!isChatOpen) return null;

  return (
    <div
      style={{ height: isChatMinimized ? "7vh" : "75vh", width: isChatMinimized ? "7vw" : "25vw" }}
      className="bg-[#000] w-full rounded-md flex flex-col items-center p-4 text-primaryText font-sans h-full">
      {/* Header with Minimize/Maximize and Close Buttons */}
      <div className="flex justify-between w-full max-w-md flex-row items-center gap-4">
        <button
          onClick={handleMinimizeChat}
          className="text-gray-400 hover:text-blue-500 transition focus:outline-none"
        >
          {isChatMinimized ? (
            <FaWindowMaximize className="w-5 h-5" />
          ) : (
            <div className="flex flex-row gap-6 items-center">
              <FaWindowMinimize className="w-5 h-5" />
            </div>
          )}
        </button>
        <button
          onClick={handleRefresh}
          className="text-gray-400 hover:text-red-500 transition focus:outline-none"
        >
          <IoMdRefreshCircle className="w-5 h-5" />
        {/* <FaTimes className="w-5 h-5" /> */}
        </button>
        <button
          onClick={handleCloseChat}
          className="text-gray-400 hover:text-red-500 transition focus:outline-none"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Content */}
      <div
        className="chatbox-window"
        style={{ height: "100%", width: "100%", visibility: isChatMinimized ? 'hidden' : "visible" }}>
        <iframe title="chat-window-iframe"
        src={iFrameLink} 
        height="100%" 
        width="100%"></iframe>
      </div>
    </div>
  );
}

export default ChatBox;
