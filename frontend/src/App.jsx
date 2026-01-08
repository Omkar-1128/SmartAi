import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";
import Chat from "./chat/Chat";
import { CrossContext } from "./context";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [cross, setCross] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setCross(false); // Close sidebar on mobile by default
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile && cross) {
      setCross(false);
    }
  };

  return (
    <div className="app-container">
      <CrossContext.Provider value={{ cross, setCross }}>
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
    </div>
  );
}

export default App;
