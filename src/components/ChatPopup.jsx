// src/components/ChatPopup.js
import React from "react";
import ChatBox from "./ChatBox";

function ChatPopup({ chats }) {
  return (
    <div className="fixed bottom-4 right-4">
      <div className="flex items-end space-x-4 mt-2">
        {chats.map((chat) => (
          <ChatBox key={chat.id} title={chat.title} />
        ))}
      </div>
    </div>
  );
}

export default ChatPopup;
