// src/components/Sidebar.js
import React, { useContext } from "react";
// import { AuthContext } from "../helpers/AuthContext";
import StarImage from "../assets/Past-present-future.png";
import GHEALogo from "../assets/Full-Logo.png";
import BackIcon from "../assets/back_icon.svg";
import HeritageLogo from "../assets/Postal-Heritage.png";
import { useMsal } from "@azure/msal-react";
import { AuthContext } from "../helpers/AuthContext";

function Sidebar({ addChat, activeTab, setActiveTab }) {
  const { instance } = useMsal();
  const {idTokenClaims, logout} = useContext(AuthContext)

  const handleLogout = (logoutType) => {
    if (logoutType === "redirect") {
      instance.logoutRedirect({
        postLogoutRedirectUri: "/",
      });
      logout();
    }
  };

  return (
    <div className="bg-[#00172F] text-white w-64 h-screen p-6 border-r">
      <img className="h-15" src={GHEALogo} alt="" />
      {(activeTab === "User" || activeTab === "Profile") && (
        <div className="my-6">
          <h4 className="text-lg font-semibold">{idTokenClaims?.name}</h4>
          <p className="text-sm">(Sales Agent)</p>
        </div>
      )}
      {(activeTab === "Representation" ||
        activeTab === "Configuration") && (
        <img
          className="h-8 my-4"
          src={BackIcon}
          alt=""
          onClick={() => setActiveTab("User")}
        />
      )}
      {activeTab === "Representation" ||
      activeTab === "Configuration" ? (
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab("Representation")}
            className={`text-left w-full p-2 ${
              activeTab === "Representation"
                ? "bg-[#FFF39F] text-black"
                : "text-white"
            } rounded-lg `}
          >
            Representation
          </button>
          <button
            onClick={() => setActiveTab("Configuration")}
            className={`text-left w-full p-2 ${
              activeTab === "Configuration"
                ? "bg-[#FFF39F] text-black"
                : "text-white"
            } rounded-lg `}
          >
            Configuration
          </button>
        </nav>
      ) : (
        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab("User")}
            className={`text-left w-full p-2 ${
              activeTab === "User" ? "bg-[#FFF39F] text-black" : "bg-[]"
            } rounded-lg `}
          >
            User
          </button>
          {idTokenClaims?.roles?.includes("AISalesAssistantAdmin") && <button
            onClick={() => setActiveTab("Representation")}
            className={`text-left w-full p-2 ${
              activeTab === "Admin" ? "bg-[#FFF39F] text-black" : "bg-[]"
            } rounded-lg `}
          >
            Admin
          </button>}
          <button
            onClick={() => setActiveTab("Profile")}
            className={`text-left w-full p-2 ${
              activeTab === "Profile" ? "bg-[#FFF39F] text-black" : "bg-[]"
            } rounded-lg `}
          >
            Profile
          </button>
        </nav>
      )}
      <div className="mt-3">
        <div
          className="h-[11rem] w-[11rem] p-4"
          style={{
            backgroundImage: `url(${HeritageLogo})`,
            backgroundSize: "cover", // Ensures image covers the container
            backgroundPosition: "center",
          }}
        >
          <div className="p-2">
            <h3 className="text-xl font-bold">AI Assistant</h3>
            <p>Intelligent AI Assistant</p>
            <button
              onClick={addChat}
              className="bg-[#FFF39F] text-black p-1 rounded-lg mt-2 w-full"
            >
              New Chat
            </button>
            <button
              onClick={()=>handleLogout("redirect")}
              style={{
                backgroundColor: "#FF4040",
                padding: "5px",
                borderRadius: 4,
              }}
              className=" text-white mt-12 p-5 flex flex-row items-center gap-2"
            >
              <img className="h-7 w-7" src={StarImage} alt="" />
              <p className="pr-2">Logout</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;