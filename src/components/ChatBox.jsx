// src/components/ChatInterface.js
import React, { useState } from "react";
import {
  FaTimes,
  FaWindowMinimize,
  FaWindowMaximize,
} from "react-icons/fa";
import Logo from "../assets/Past-present-future.png";

function ChatBox() {

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isChatMinimized, setIsChatMinimized] = useState(false); // Minimize/maximize state

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleMinimizeChat = () => {
    setIsChatMinimized(!isChatMinimized);
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
              <img src={Logo} alt="" className="h-5 w-5" />
            </div>
          )}
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
        src="https://webapp-frontend-gy4phravzt2ak-staging.azurewebsites.net/" 
        height="100%" 
        width="100%"></iframe>
      </div>
    </div>
  );
}

export default ChatBox;
