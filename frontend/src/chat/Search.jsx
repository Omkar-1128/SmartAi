import React, { useRef, useState , useEffect} from "react";
import { useContext } from "react";
import "./Search.css";
import {
  CrossContext,
  ActiveMessages,
  ActiveThreadId,
} from "../context";

function Search() {
  const value = useContext(CrossContext);
  const Active = useContext(ActiveMessages);
  const ActiveThread = useContext(ActiveThreadId);
  const [foundTitles, setFoundTitles] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const SearchBoxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (SearchBoxRef.current && !SearchBoxRef.current.contains(e.target)) {
        value.setSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSearchChange(e) {
    value.setSearchTitle(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.searchTitle.trim()) {
      setIsSearched(false);
      return;
    }
    const result = value.userThreads.filter((thread) =>
      thread.title.toLowerCase().includes(value.searchTitle.toLowerCase())
    );
    setFoundTitles(result);
    setIsSearched(true);
  }

  function HandleThreadsClicks(thread) {
    Active.setActiveMessages(thread.messages);
    ActiveThread.setThreadId(thread.threadId);
    value.setSearch(false);
  }

  return (
    <div ref={SearchBoxRef}>
      <form onSubmit={handleSubmit}>
        <div className="SearchBox">
          <div className="search-input-outer">
            <input
              type="text"
              className="search-input-inner"
              placeholder="Search chats..."
              value={value.searchTitle}
              onChange={handleSearchChange}
            />
            <button className="search-btn" type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          <div className="recents-section">
            <div className="recents-list">
              {value.userThreads.length === 0 && (
                <h3 className="section-title">No Recents</h3>
              )}
              {value.userThreads.length != 0 && (
                <h3 className="section-title">Recents</h3>
              )}
              {isSearched
                ? foundTitles.map((thread) => {
                    const isActive = ActiveThread.threadId === thread.threadId;
                    return (
                      <div
                        onClick={() => HandleThreadsClicks(thread)}
                        className={`thread ${isActive ? "clickedThread" : ""}`}
                        key={thread.threadId}
                      >
                        {thread.title}
                      </div>
                    );
                  })
                : value.userThreads.map((thread) => {
                    const isActive = ActiveThread.threadId === thread.threadId;
                    return (
                      <div
                        onClick={() => HandleThreadsClicks(thread)}
                        className={`thread ${isActive ? "clickedThread" : ""}`}
                        key={thread.threadId}
                      >
                        {thread.title}
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Search;
