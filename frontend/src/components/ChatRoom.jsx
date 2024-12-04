import React, { Component } from "react";
import "./ChatRoom.css";

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        { 
          text: "Hello! Welcome to the travel chat.", 
          sender: "bot", 
          created_at: new Date().toISOString(), // Example ISO timestamp 
          email: "bot@example.com" 
        },
      ],
      newMessage: "",
      userNames: {}, // Store usernames mapped by email
    };
  }

  // Fetch all chat messages when the component mounts
  componentDidMount() {
    this.fetchAllMessages();
  }

  // Fetch all messages from the backend
  fetchAllMessages = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/fetch-messages/");
      const data = await response.json();
      if (data.messages) {
        this.setState({ messages: data.messages });
        this.fetchUserNames(data.messages); // Fetch usernames for all messages
      } else {
        console.error("Failed to fetch messages:", data.error);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch username for each email in the messages
  fetchUserNames = async (messages) => {
    const userNames = {};
    for (const msg of messages) {
      if (!userNames[msg.email]) {
        await this.fetchUsername(msg.email, userNames);
      }
    }
    this.setState({ userNames });
  };

  // Fetch username for a specific email
  fetchUsername = async (email, userNames) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user-profile/?email=${email}`);
      const data = await response.json();

      if (data.user) {
        userNames[email] = data.user.Username; // Add the fetched username to the map
      } else {
        console.error("Failed to fetch user details for email:", email);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  handleSendMessage = async () => {
    const { newMessage, messages } = this.state;

    if (newMessage.trim() !== "") {
      const currentTime = new Date().toISOString(); // Store as ISO timestamp
      const userMessage = {
        message: newMessage,
        sender: "user",
        created_at: currentTime, // Use current ISO timestamp
        email: localStorage.getItem("userEmail"), // Store email of the logged-in user
      };

      // Update the UI with the new message
      this.setState({
        messages: [...messages, userMessage],
        newMessage: "",
      });

      // Save the message to the backend (API call)
      await this.saveMessageToDatabase(newMessage, currentTime);
    }
  };

  // Function to make an API call to save the message in the database
  saveMessageToDatabase = async (message, time) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/save-chat-message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          message: message,
          time: time, // Send as ISO timestamp
        }),
      });

      if (!response.ok) {
        console.error("Failed to save message");
      }
    } catch (error) {
      console.error("Error while saving message:", error);
    }
  };

  // Helper function to format timestamps into user-friendly strings
  formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  render() {
    const { messages, newMessage, userNames } = this.state;

    return (
      <div className="chat-container">
        <div className="chat-header">Travel Chat Room</div>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === "user" ? "cr-user-message" : "bot-message"}`}
            >
              <div className="message-info">
                <span className="username">{userNames[msg.email] || msg.email}</span>
                <span className="chat-time">{this.formatDateTime(msg.created_at)}</span>
              </div>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="message"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => this.setState({ newMessage: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevent default action like form submission
                this.handleSendMessage();
              }
            }}
          />
          <button onClick={this.handleSendMessage}>Send</button>
        </div>
      </div>
    );
  }
}

export default ChatRoom;
