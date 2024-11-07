// src/components/Chat.js
import React, { useState } from "react";
import ChatBox from "./ChatBox";

function Chat() {
  const [chatBoxes, setChatBoxes] = useState([]);

  const openNewChat = () => {
    setChatBoxes([
      ...chatBoxes,
      { id: Date.now(), content: `Chat ${chatBoxes.length + 1}` },
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={openNewChat}
        className="bg-green-600 text-white p-2 rounded-lg mb-2"
      >
        New Chat
      </button>
      <div className="flex space-x-2">
        {chatBoxes.map((chat) => (
          <ChatBox key={chat.id} content={chat.content} />
        ))}
      </div>
    </div>
  );
}

export default Chat;
