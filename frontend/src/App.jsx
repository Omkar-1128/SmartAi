import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";
import Chat from "./chat/Chat";
import { CrossContext, ThreadContext, ActiveMessages , ActiveThreadId , UserMessageContext} from "./context";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [cross, setCross] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [threads, setThreads] = useState([]);
  const [activeMessages, setActiveMessages] = useState([]);
  const [threadId , setThreadId] = useState("null");
  const [message, setMessage] = useState("");
  const [profileDropDown , setProfileDropDown] = useState(false);
  const [theme , setTheme] = useState(true);   // false for dark theme and true for light theme
  const [search , setSearch] = useState(false);
  const [searchTitle , setSearchTitle] = useState("");

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

  useEffect(() => {
    if(theme) {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [theme])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setCross(false); // Close sidebar on mobile by default
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile && cross) {
      setCross(false);
    }
  };

  return (
    <div className="app-container">
      <UserMessageContext.Provider value={{ message, setMessage }}>
      <ActiveMessages.Provider
        value={{ activeMessages: activeMessages, setActiveMessages: setActiveMessages }}
      >
        <ThreadContext.Provider value={{threads , setThreads}}>
          <ActiveThreadId.Provider value={{threadId: threadId , setThreadId: setThreadId}}>
          <CrossContext.Provider value={{ cross, setCross , profileDropDown , setProfileDropDown , theme , setTheme , search , setSearch , searchTitle , setSearchTitle}}>
            {/* Mobile overlay */}
            {isMobile && cross && (
              <div className="mobile-overlay" onClick={handleOverlayClick} />
            )}

            <div className={`sidebar ${cross ? "open" : "closed"}`}>
              <Sidebar />
            </div>

            <div className="page">
              <div className="navbar">
                <Navbar />
              </div>

              <div className="chat">
                <Chat />
              </div>
            </div>
          </CrossContext.Provider>
          </ActiveThreadId.Provider>
        </ThreadContext.Provider>
      </ActiveMessages.Provider>
      </UserMessageContext.Provider>
    </div>
  );
}

export default App;
