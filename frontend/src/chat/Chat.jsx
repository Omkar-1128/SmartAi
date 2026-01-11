import React from "react";
import "./Chat.css";
import { useContext } from "react";
import {
  ActiveMessages,
  ActiveThreadId,
  UserMessageContext,
  ThreadContext,
} from "../context.jsx";
import axios from "axios";

const Chat = () => {
  const threadMessages = useContext(ActiveMessages);
  const userMessage = useContext(UserMessageContext);
  const currThreadId = useContext(ActiveThreadId);
  const threads = useContext(ThreadContext);
  const API_URL = import.meta.env.VITE_THREAD_API_URL;

  async function sendRequest(text) {
    try {
      await axios
        .post(`${API_URL}/chat`, {
          threadId: currThreadId.threadId,
          message: { content: text, role: "user" },
        })
        .then((res) => {
          threadMessages.setActiveMessages((prev) => [
            ...prev,
            {
              role: res.data.assistance.role,
              content: res.data.assistance.content,
            },
          ]);
          currThreadId.setThreadId(res.data.threadId);

          threads.setThreads((prev) => {
            const updatedThread = {
              title: res.data.title,
              threadId: res.data.threadId,
              updatedAt: Date.now(),
            };

            const filtered = prev.filter(
              (t) => t.threadId !== res.data.threadId
            );

            return [updatedThread, ...filtered];
          });
        });
    } catch (e) {
      console.log("Error occur during getting responce of assistant: " + e);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = userMessage.message.trim();
    if (!text) return;

    // UI update
    threadMessages.setActiveMessages((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);

    userMessage.setMessage(""); // clear early (safe)

    await sendRequest(text);
  };

  return (
    <>
      {threadMessages.activeMessages.length === 0 && (
        <div className="chat-container">
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
      )}

      {threadMessages.activeMessages.length != 0 && (
        <div className="parent-container">
          <div className="chat-container">
            <div className="chat-content">
              <div className="chat-inner">
                {threadMessages.activeMessages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`message ${
                      msg.role === "user" ? "user" : "assistant"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="chat-input-wrapper">
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask anything..."
              value={userMessage.message}
              onChange={(e) => userMessage.setMessage(e.target.value)}
              className="chat-input-field"
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!userMessage.message.trim()}
              aria-label="Send message"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;
