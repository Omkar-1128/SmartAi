import { useContext, useState, useEffect } from "react";
import { CrossContext } from "../context";
import "./Sidebar.css";
import axios from "axios";

const Sidebar = () => {
  const [threads, setThreads] = useState([]);
  const value = useContext(CrossContext);

  const GetThreads = import.meta.env.VITE_THREAD_API_URL;

  useEffect(() => {
    axios
      .get(`${GetThreads}/thread`)
      .then((res) => {
        const threadArr = res.data;
        setThreads(threadArr);
      })
      .catch((e) => {
        console.log("Error Occured during featching thread: " + e.message);
      });
  }, []);

  function toggleSidebar() {
    value.setCross(!value.cross);
  }

  return (
    <>
      {value.cross && (
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="header-controls">
              <button
                className="toggle-btn"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                <i className="fa-solid fa-bars"></i>
              </button>
              <button className="search-btn" aria-label="Search">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>

          <div className="sidebar-actions">
            <button className="action-btn new-chat-btn">
              <i className="fa-regular fa-comment"></i>
              <span>New Chat</span>
            </button>
            <button className="action-btn explore-btn">
              <i className="fa-solid fa-gem"></i>
              <span>Explore Gems</span>
            </button>
          </div>

          <div className="sidebar-footer">
            <div className="recents-section">
              <h3 className="section-title">Recents</h3>
              <div className="recents-list">
                  {threads.map((thread) => {
                  return ( <div className="thread" key={thread.threadId}>{thread.title}</div>);
                })}
              </div>
            </div>

            <button className="settings-btn" aria-label="Settings">
              <i className="fa-solid fa-gear"></i>
            </button>
          </div>
        </div>
      )}

      {!value.cross && (
        <div className="sidebar-collapsed">
          <button
            className="collapsed-btn toggle-btn"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <button className="collapsed-btn" aria-label="New chat">
            <i className="fa-regular fa-comment"></i>
          </button>

          <div className="collapsed-spacer"></div>

          <button className="collapsed-btn settings-btn" aria-label="Settings">
            <i className="fa-solid fa-gear"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
