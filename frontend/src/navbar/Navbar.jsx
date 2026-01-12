import React, { useContext, useEffect } from 'react';
import { CrossContext } from "../context";
import "./Navbar.css";

const Navbar = () => {
  const value = useContext(CrossContext);

  function toggleSidebar() {
    value.setCross(!value.cross);
  }

  function handleProfile() {
    value.setProfileDropDown(!value.profileDropDown);
  }

  useEffect(() => {
    if(value.theme) {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  } , [value.theme])

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
        <button onClick={handleProfile} className="profile-btn" aria-label="Profile">
          <i className="fa-solid fa-user"></i>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
