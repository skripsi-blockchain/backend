// Navbar.js
import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation" style={{ backgroundColor: "#4FD6C5" }}>
      <div className="navbar-header">
        <img
          src="img/logo.png"
          alt="Logo"
          style={{ maxWidth: "100%", height: "20px", marginTop: "15px", marginLeft: "20px" }}
          className="d-inline-block align-top"
        />
      </div>
      <button
        type="button"
        className="navbar-toggle"
        data-toggle="collapse"
        data-target=".navbar-collapse"
      >
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
    </nav>
  );
};

export default Navbar;
