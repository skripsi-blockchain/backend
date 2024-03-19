// Home.js
import React from "react";

const Home = () => {
  return (
    <div className="app">
      <nav
        className="navbar navbar-inverse navbar-fixed-top"
        role="navigation"
        style={{ backgroundColor: "#4FD6C5" }}
      >
        <div className="navbar-header">
          <img
            src="img/logo.png"
            alt="Logo"
            style={{
              maxWidth: "100%",
              height: "20px",
              marginTop: "15px",
              marginLeft: "20px",
            }}
            className="d-inline-block align-top"
          />
        </div>
      </nav>
      <div className="container text-center" style={{ marginTop: "15%" }}>
        <img
          src="img/login1.png"
          alt="Logo"
          style={{ width: "60%", height: "40%" }}
          className="d-inline-block align-top"
        />
      </div>
    </div>
  );
};

export default Home;
