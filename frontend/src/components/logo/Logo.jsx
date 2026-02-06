import logo from "../../assets/logo.png"; // adjust path based on your folder
import React from "react";


const Logo = ({ width = "w-32", height = "h-32", className = " top-0 left-0" }) => {
  return (
    <div className={`${className}`}>
      <img
        src={logo}
        alt="App Logo"
        className={`${width} ${height}  `}
      />
    </div>
  );
};

export default Logo;