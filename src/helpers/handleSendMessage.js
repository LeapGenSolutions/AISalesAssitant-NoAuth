import axios from "axios";
import { loginRequest } from "../authConfig";

export const handleSendMessage = async (msalInstance, input, setInput, setMessages, setTyping, messages) => {
  if (!input.trim()) return;

  const userMessage = {
    sender: "user",
    text: input.trim(),
    showFeedback:false
  };
  setInput("");
  setTyping(true);
  setMessages([...messages, userMessage]);
  try {
    // Acquire token silently or interactively if needed
    const accounts = msalInstance.getAllAccounts();
    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest, // Add your API scope
      account: accounts[0],
    });

    const accessToken = tokenResponse.accessToken;
    console.log("Access Toekn: Bearer "+accessToken)

    // Make the POST request with the access token
    const response = await axios.post(
      process.env.REACT_APP_SERVER_URI + "/api/chat",
      {
        user_query: userMessage.text,
        session_id: "1234",
        user_id: "5678",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Include the token here
        },
      }
    );

    const botMessage = {
      sender: "bot",
      text: response.data["response"],
    };
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Error sending message:", error);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Something went wrong. Please try again later." },
    ]);
  } finally {
    setTyping(false);
  }
};
