import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatPopup from "../components/ChatPopup";
import Admin from "./Admin";
import GEHAGrey from "../assets/GHEA-grey.png"

function Dashboard() {
  const [chats, setChats] = useState([]);
  // const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("User");

  const addChat = () => {
    setChats([...chats, { id: Date.now(), title: `Chat ${chats.length + 1}` }]);
  };

  // Handle user input change
  // const handleInputChange = (e) => {
  //   setInput(e.target.value);
  // };

  // // Handle "Enter" key press to send message
  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //   }
  // };

  return (
    <div className="flex bg-[#00172F] min-h-screen">
      <Sidebar
        addChat={addChat}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      {activeTab === "User" && (
        <main className="flex-1 p-6 pt-20 flex h-screen w-full flex-col flex-start items-center">
          <h1 className="text-4xl text-white font-bold mb-8">
            AI Sales Assistant
          </h1>

          <div className="w-full">
            <img src={GEHAGrey} height={30} alt="" />
          </div>
        </main>
      )}
      {(activeTab === "Representation" ||
        activeTab === "Configuration" ||
        activeTab === "Customize") && <Admin activeTab={activeTab} />}
      <ChatPopup chats={chats} />
    </div>
  );
}

export default Dashboard;
