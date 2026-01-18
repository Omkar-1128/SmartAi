import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";
import Chat from "./chat/Chat";
import {
  CrossContext,
  ActiveMessages,
  ActiveThreadId,
  UserMessageContext,
} from "./context";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function App() {
  const [cross, setCross] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMessages, setActiveMessages] = useState([]);
  const [threadId, setThreadId] = useState("null");
  const [message, setMessage] = useState("");
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [theme, setTheme] = useState(true); // false for dark theme and true for light theme
  const [search, setSearch] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [userThreads, setUserThreads] = useState([]);
  const API_URL = import.meta.env.VITE_THREAD_API_URL;

  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState({});
  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const { data } = await axios.post(
          API_URL,
          {},
          { withCredentials: true },
        );

        if (data.success) {
          setUser(data.user);
          toast(`Hello ${data.user.username}`, { position: "bottom-left" });
        } else {
          removeCookie("token");
          navigate("/");
        }
      } catch (err) {
        console.log("Error occur to verify Cookie at frontend" + err);
        removeCookie("token");
        navigate("/");
      }
    };

    verifyCookie();
  }, [navigate, removeCookie]);
  const Logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (e) {
      console.log("Logout error", e);
    } finally {
      navigate("/");
    }
  };

  function GetThreads() {
    if (!user?.id) return;
    const GetThreads = import.meta.env.VITE_THREAD_API_URL;
    axios
      .get(`${GetThreads}/thread/user/${user.id}`)
      .then((res) => {
        const threadArr = res.data;
        setUserThreads(threadArr);
      })
      .catch((e) => {
        console.log("Error Occured during featching thread: " + e.message);
      });
  }

  useEffect(() => {
    if (user?.id) {
      GetThreads();
    }
  }, [user.id]);

  useEffect(() => {
    if (theme) {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [theme]);

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
          value={{
            activeMessages: activeMessages,
            setActiveMessages: setActiveMessages,
          }}
        >
          <ActiveThreadId.Provider
            value={{ threadId: threadId, setThreadId: setThreadId }}
          >
            <CrossContext.Provider
              value={{
                cross,
                setCross,
                profileDropDown,
                setProfileDropDown,
                theme,
                setTheme,
                search,
                setSearch,
                searchTitle,
                setSearchTitle,
                user,
                Logout,
                userThreads,
                setUserThreads,
              }}
            >
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
        </ActiveMessages.Provider>
      </UserMessageContext.Provider>
      <ToastContainer />
    </div>
  );
}

export default App;
