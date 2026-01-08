import React, { useState } from "react";
import "./Chat.css";

const Chat = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission here
      console.log("Message:", message);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-content">
        <div className="welcome-section">
          <div className="welcome-icon">
            <i className="fa-solid fa-robot"></i>
          </div>
          <h1 className="welcome-title">How can I help you today?</h1>
          <p className="welcome-subtitle">
            Ask me anything, and I'll do my best to help you.
          </p>
        </div>
      </div>

      <div className="chat-input-wrapper">
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="chat-input-field"
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={!message.trim()}
              aria-label="Send message"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </form>

        <p className="chat-footer">
          Smart AI can make mistakes. Check important info.
          <span className="footer-link"> Learn more</span>
        </p>
      </div>
    </div>
  );
};

export default Chat;
