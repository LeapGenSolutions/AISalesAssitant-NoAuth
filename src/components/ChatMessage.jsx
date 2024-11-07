// src/components/ChatMessage.js
import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const ChatMessage = ({ message, onFeedbackSubmit }) => {
  const [feedback, setFeedback] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const handleThumbsUp = () => {
    setFeedback("positive");
    onFeedbackSubmit(message.id, "positive", "");
  };

  const handleThumbsDown = () => {
    setFeedback("negative");
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = () => {
    onFeedbackSubmit(message.id, "negative", feedbackText);
    setShowFeedbackModal(false);
    setFeedbackText("");
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow-md my-2 text-primaryText">
      <p>{message.text}</p>

      <div className="flex items-center mt-2">
        <button onClick={handleThumbsUp} className="text-green-500 mr-2">
          <FaThumbsUp size={20} />
        </button>
        <button onClick={handleThumbsDown} className="text-red-500">
          <FaThumbsDown size={20} />
        </button>
        {feedback && (
          <span className="ml-2 text-sm">
            {feedback === "positive" ? "👍" : "👎"}
          </span>
        )}
      </div>

      {/* Feedback Modal */}
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
};

export default ChatMessage;
