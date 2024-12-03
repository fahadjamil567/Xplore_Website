import React, { useState, useRef, useEffect } from "react";
import axios from "axios";  // Importing Axios
import "./Chatbot.css";
import { FaArrowAltCircleRight } from "react-icons/fa";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const quickActions = [
    "Tell me about the latest AI developments",
    "How expensive is it to travel?",
    "Should I explore Pakistan?",
    "Whats best destination in Northern Pakistan?",
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const renderFormattedMessage = (text) => {
    const lines = text.split("\n");

    return lines.map((line, index) => {
      // Clean the line, remove extra spaces or unexpected characters
      const cleanedLine = line.trim();

      // If the line starts with "**" for headings
      if (cleanedLine.startsWith("**")) {
        const heading = cleanedLine.replace(/\*\*/g, ""); // remove the '**' around the heading text
        return <h2 key={index}>{heading}</h2>;
      } 
      // If the line starts with "*" for bullet points
      else if (cleanedLine.startsWith("*") && cleanedLine.length > 1) {
        return <li key={index}>{cleanedLine.slice(1).trim()}</li>; // Removes the '*' and trims the content
      } 
      // For normal paragraphs
      else if (cleanedLine === "") {
        return <br key={index} />;
      } else {
        return <p key={index}>{cleanedLine}</p>;
      }
    });
  };
  const handleSend = async (message = inputMessage) => {
    if (!message.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Make the POST request using Axios
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat/", // API endpoint
        {
          message, // Sending message in the body
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensuring content type is JSON
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
          },
        }
      );

      // Handle the response from the backend
      if (response.data.response) {
        setMessages((prev) => [...prev, { text: response.data.response, isUser: false }]);
      } else if (response.data.error) {
        setMessages((prev) => [
          ...prev,
          { text: `Error: ${response.data.error}`, isUser: false },
        ]);
      }
    } catch (error) {
      // Handle any errors
      setMessages((prev) => [
        ...prev,
        { text: `Error: ${error.message}`, isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="main-container">
      <div className="chat-interface">
        <div className="header">
          <h1>Xplore AI Assistant</h1>
          <p className="subtitle">
            Your personal AI companion for traveling and exploring
          </p>
        </div>

        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleSend(action)}
              disabled={isLoading}
            >
              {action}
            </button>
          ))}
        </div>

        <div className="bot-chat-container" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.isUser ? "user-message" : "ai-message"}`}
            >
              {message.isUser ? (
                <p>{message.text}</p>
              ) : (
                <div>
                  {renderFormattedMessage(message.text)}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message ai-message loading">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={isLoading}
            rows="2"
          />
          <div
            className="send-button-container"
            onClick={() => handleSend()}
            disabled={isLoading || !inputMessage.trim()}
          >
            <FaArrowAltCircleRight className="send-button-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;