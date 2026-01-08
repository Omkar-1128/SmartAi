import React, { useContext } from 'react';
import { CrossContext } from "../context";
import "./Navbar.css";

const Navbar = () => {
  const value = useContext(CrossContext);

  function toggleSidebar() {
    value.setCross(!value.cross);
  }

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <button 
          className="mobile-menu-btn" 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="model-badge">Smart AI</div>
      </div>
      
      <div className="navbar-right">
        <button className="profile-btn" aria-label="Profile">
          <i className="fa-solid fa-user"></i>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
