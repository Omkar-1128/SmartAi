import React, { useEffect, useState, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import toast, { Toaster } from "react-hot-toast";
import "./Chat.css";
import { useContext } from "react";
import {
  CrossContext,
  ActiveMessages,
  ActiveThreadId,
  UserMessageContext,
  ThreadContext,
} from "../context.jsx";
import axios from "axios";
import { HashLoader, ScaleLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import Search from "./Search.jsx";
// import "highlight.js/styles/github-dark.css";
// import "highlight.js/styles/github.css";
// import "highlight.js/styles/atom-one-dark.css";
// import "highlight.js/styles/monokai.css";

const Chat = () => {
  const threadMessages = useContext(ActiveMessages);
  const userMessage = useContext(UserMessageContext);
  const currThreadId = useContext(ActiveThreadId);
  const threads = useContext(ThreadContext);
  const crossValues = useContext(CrossContext);
  const API_URL = import.meta.env.VITE_THREAD_API_URL;

  const [loader, setLoader] = useState(false);
  const [fullReply, setFullReply] = useState("");
  const profileRef = useRef(null);
  const bottomRef = useRef(null);

  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (listening) {
      userMessage.setMessage(transcript);
    }
  }, [transcript, listening]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.dismiss();
      toast.error("Browser does not support speech recognition", {
        style: {
          border: "1px solid #dc2626",
          background: "#fee2e2",
          color: "#7f1d1d",
          fontWeight: "500",
          borderRadius: "10px",
        },
      });
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        crossValues.setProfileDropDown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let themeLink = document.getElementById("hljs-theme");

    if (!themeLink) {
      themeLink = document.createElement("link");
      themeLink.id = "hljs-theme";
      themeLink.rel = "stylesheet";
      document.head.appendChild(themeLink);
    }

    themeLink.href = crossValues.theme
      ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.css"
      : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.css";
  }, [crossValues.theme]);

  async function sendRequest(text) {
    try {
      setLoader(true);
      await axios
        .post(`${API_URL}/chat`, {
          threadId: currThreadId.threadId,
          message: { content: text, role: "user" },
        })
        .then((res) => {
          setFullReply(res.data.assistance.content);
          threadMessages.setActiveMessages((prev) => [
            ...prev,
            {
              role: res.data.assistance.role,
              content: "",
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
          setLoader(false);
        });
    } catch (e) {
      console.log("Error occur during getting responce of assistant: " + e);
    }
  }

  useEffect(() => {
    if (!fullReply) return;

    const content = fullReply.split("");

    let idx = 0;
    const interval = setInterval(() => {
      threadMessages.setActiveMessages((prev) => {
        const updated = [...prev];
        const updatedLastIdx = updated.length - 1;

        if (updated[updatedLastIdx]?.role == "assistant") {
          updated[updatedLastIdx] = {
            ...updated[updatedLastIdx],
            content: fullReply.slice(0, idx + 1),
          };
        }

        return updated;
      });

      if (isUserAtBottom) {
        scrollToBottom(false);
      }
      idx++;

      if (idx >= content.length) clearInterval(interval);
    }, 10);

    return () => clearInterval(interval);
  }, [fullReply, isUserAtBottom]);

  useEffect(() => {
    if (crossValues.theme) {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [crossValues.theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    SpeechRecognition.stopListening();

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

  function handleTheme() {
    crossValues.setTheme(!crossValues.theme);
  }

  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom(true);
    }
  }, [currThreadId.threadId]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    // thoda tolerance rakho (10–20px)
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;

    setIsUserAtBottom(isAtBottom);
  };

  const scrollToBottom = (smooth = false) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
    });
  };

  return (
    <>
      {crossValues.profileDropDown && (
        <div className="ProfileDropDown" ref={profileRef}>
          <div className="ProfileUserName">Hello, LightningAce</div>
          <div className="ProfileItems">
            <div>
              <i className="fa-solid fa-crown"></i>Upgrade plan
            </div>
            <div onClick={handleTheme}>
              <i
                className={`fa-solid ${
                  crossValues.theme ? "fa-moon" : "fa-sun"
                }`}
              ></i>
              Theme
            </div>
            <div>
              <i className="fa-regular fa-circle-question"></i>Help
            </div>
            <div>
              <i className="fa-solid fa-arrow-right-from-bracket"></i>Log out
            </div>
          </div>
        </div>
        //     theme light icon
      )}

      {(threadMessages.activeMessages || []).length === 0 && (
        <div className="chat-container">
          {loader && (
            <div className="Loader">
              <HashLoader color="#10A37F" size={50} />
            </div>
          )}
          {crossValues.search && <Search />}
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

      {(threadMessages.activeMessages || []).length != 0 && (
        <div className="parent-container">
          {loader && (
            <div className="Loader">
              <HashLoader color="#10A37F" size={50} />
            </div>
          )}
          {crossValues.search && <Search />}
          <div className="chat-container">
            <div className="chat-content" onScroll={handleScroll}>
              <div className="chat-inner">
                {threadMessages.activeMessages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`message ${
                      msg.role === "user" ? "user" : "assistant"
                    }`}
                  >
                    {msg.role == "user" && msg.content}
                    {msg.role == "assistant" && (
                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                ))}

                <div ref={bottomRef}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="chat-input-wrapper">
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <div className="chat-input">
            {listening && (
              <div className="speech-loader inside-input">
                <ScaleLoader
                  height={25}
                  width={6}
                  radius={3}
                  margin={2}
                  color="#10A37F"
                />
              </div>
            )}
            {listening ? (
              <textarea
                type="text"
                placeholder="Ask anything..."
                value={userMessage.message}
                onChange={(e) => userMessage.setMessage(e.target.value)}
                className="chat-input-field textAreaInput"
              ></textarea>
            ) : (
              <input
                type="text"
                placeholder="Ask anything..."
                value={userMessage.message}
                onChange={(e) => userMessage.setMessage(e.target.value)}
                className="chat-input-field"
              />
            )}

            {listening ? (
              <button
                type="button"
                onClick={SpeechRecognition.stopListening}
                className="microphone-btn micOn"
              >
                <i className="fa-solid fa-microphone"></i>
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  SpeechRecognition.startListening({ continuous: true })
                }
                className="microphone-btn micOff"
              >
                <i className="fa-solid fa-microphone-slash"></i>
              </button>
            )}

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
      <Toaster />
    </>
  );
};

export default Chat;
