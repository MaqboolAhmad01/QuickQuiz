import logo from "../../assets/logo.png"; // adjust path based on your folder
import React from "react";
import "./logo.css";

const Logo = () => {
    console.log(logo);
    return (<div className="logo-container">
        <img src={logo} alt="App Logo" className="logo" />
    </div>)
}
export default Logo;