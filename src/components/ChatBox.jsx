// src/components/ChatInterface.js
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaTimes, FaWindowMinimize, FaWindowMaximize,
  FaUserCircle, FaRegThumbsUp, FaRegThumbsDown, FaThumbsUp, FaThumbsDown,
  FaMicrophone
} from "react-icons/fa";
import { IoMdRefreshCircle } from "react-icons/io"
import { AuthContext } from "../helpers/AuthContext";
import { useMsal } from "@azure/msal-react";
import { handleSendMessage } from "../helpers/handleSendMessage";
import { v4 as uuidv4 } from 'uuid'
import ReactMarkdown from "react-markdown"

function ChatBox() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hi, How can I help? (P.S. I'm orchestrated by Semantic Kernel and I remember our context using long term memory, powered by CosmosDB PostgreSQL vector database) `,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isChatMinimized, setIsChatMinimized] = useState(false); // Minimize/maximize state
  const { idTokenClaims } = useContext(AuthContext);
  const [iFrameLink, setIFrameLink] = useState(process.env.REACT_APP_IFRAME_URI + `/?name=${idTokenClaims?.name}&preferred_username=${idTokenClaims?.name}`)
  const { instance: msalInstance } = useMsal();
  const [feedback, setFeedback] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const sessionId = uuidv4()
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [messages]); // Run this effect once on mount
  // Handle user input change
  const handleFeedback = (feedbackType, messageIndex) => {
    // Update the feedback property of the specific message
    if(feedbackType=="negative"){
      setShowFeedbackModal(true);
      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === messageIndex ? { ...msg, feedback: feedbackType, feedbackText: feedbackText } : msg
        )
      );
      return
    }
    setMessages((prevMessages) =>
      prevMessages.map((msg, index) =>
        index === messageIndex ? { ...msg, feedback: feedbackType } : msg
      )
    );
  };

  const isFeedbackVisible = (message)=>{
    if(message && message.showFeedback != undefined && !message.showFeedback){
      return false
    }
    return true
  }

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  // Handle message sending
  const handleSendMessages = () => {
    handleSendMessage(msalInstance, input, setInput, setMessages, setTyping, messages);
  };
  // Handle "Enter" key press to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessages();
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleMinimizeChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };


  const handleFeedbackSubmit = () => {
    // onFeedbackSubmit(message.id, "negative", feedbackText);
    setMessages((messages) => [...messages, {
      sender: "bot",
      text: "Thanks for the feedback!",
      showFeedback:false
    }])
    setShowFeedbackModal(false);
    setFeedbackText("");
  };

  const handleRefresh = () => {
    setIFrameLink(null);
    setTimeout(() => {
      setIFrameLink(process.env.REACT_APP_IFRAME_URI + `/?name=${idTokenClaims.name}&preferred_username=${idTokenClaims.name}`)
    }, 2000)
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
      <div ref={divRef} className="flex flex-col space-y-4"
        style={{ height: isChatMinimized ? "0vh" : "60vh", width: isChatMinimized ? "10vw" : "100%", overflowY: "auto", scrollbarWidth: "none", margin: isChatMinimized ? "0px" : "1rem 0" }}
      >
        {messages.map((message, index) => (
          <div
            key={sessionId + "-chat-message-" + index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <FaUserCircle className="w-8 h-8 text-gray-400 mr-2" />
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                className={`p-3 max-w-xs text-sm rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
                  }`}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
              {message.sender === "bot" && isFeedbackVisible(message) && (
                <div style={{ display: "flex", flexDirection: "row", marginTop: "0.7rem" }}>
                  {!message.feedback && (
                    <>
                      <FaRegThumbsUp
                        className="text-white ml-2 mr-2 cursor-pointer"
                        size={20}
                        onClick={() => handleFeedback("positive", index)}
                      />
                      <FaRegThumbsDown
                        className="text-white ml-2 cursor-pointer"
                        size={20}
                        onClick={() => handleFeedback("negative", index)}
                      />
                    </>
                  )}
                  {message.feedback === "positive" && (
                    <>
                      <FaThumbsUp className="text-green-500 ml-2 mr-2" size={20} />
                      <FaRegThumbsDown className="text-white ml-2" size={20} />
                    </>
                  )}
                  {message.feedback === "negative" && (
                    <>
                      <FaRegThumbsUp className="text-white ml-2 mr-2" size={20} />
                      <FaThumbsDown className="text-red-500 ml-2" size={20} />
                    </>
                  )}
                </div>
              )}
            </div>
            {message.sender === 'user' && (
              <FaUserCircle className="w-8 h-8 text-gray-400 ml-2" />
            )}
          </div>
        ))}
        {/* ... (typing indicator) */}
        {typing && (
          <div className="flex justify-start space-x-1 ml-10 mt-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2 bg-gray-700 p-3 rounded-lg" style={{ display: isChatMinimized ? "none" : "" }}>
        <FaMicrophone className="text-gray-400 w-6 h-6" />
        <input
          type="text"
          className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-gray-400"
          placeholder="Type a message..."
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button
          className="bg-blue-500 text-white rounded-lg px-4 py-1 hover:bg-blue-600 transition"
          onClick={handleSendMessages}
        >
          Send
        </button>
      </div>
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-2">Provide Feedback</h3>
            <textarea
              className="w-full p-2 border rounded"
              rows="4"
              placeholder="Please share your feedback here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="p-2 text-gray-600 mr-4"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
