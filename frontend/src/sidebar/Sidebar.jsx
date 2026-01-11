import { useContext } from "react";
import { CrossContext , ThreadContext, ActiveMessages , ActiveThreadId } from "../context";
import "./Sidebar.css";

const Sidebar = () => {
  const value = useContext(CrossContext);
  const Allthreads = useContext(ThreadContext);
  const Active = useContext(ActiveMessages);
  const ActiveThread = useContext(ActiveThreadId);

  function toggleSidebar() {
    value.setCross(!value.cross);
  }

  function HandleThreadsClicks(thread) {
    Active.setActiveMessages(thread.messages);
    ActiveThread.setThreadId(thread.threadId);
  }

  function SetNewChat() {
    Active.setActiveMessages([]);
    ActiveThread.setThreadId("null");
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
            <button className="action-btn new-chat-btn" onClick={SetNewChat}>
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
              {Allthreads.threads.length === 0 && <h3 className="section-title">No Recents</h3>} 
              {Allthreads.threads.length != 0 && <h3 className="section-title">Recents</h3>} 
              <div className="recents-list">
                  {Allthreads.threads.map((thread) => {
                    const isActive = ActiveThread.threadId === thread.threadId;
                  return ( <div onClick={() => HandleThreadsClicks(thread)} className={`thread ${isActive? "clickedThread" : ""}`} key={thread.threadId}>{thread.title}</div>);
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
