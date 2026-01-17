import React, { useState } from "react";
import Logo from "../components/logo/Logo"; 
import { useNavigate } from "react-router-dom";

import "./login.css";


const loginUser = async (formData) => {
      const response = await fetch("http://localhost:8000/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "include", // include cookies in the request

        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const err = await response.json();
        console.log("Error response:", err);

        throw new Error(err.detail);
      }

      const data = await response.json();

      if (data.access) {
        localStorage.setItem("access_token", data.access);
      }
      return data; // return success data
    
  };

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await loginUser(form);
      console.log("Login successful:------", resp);
      alert("Logged in successfully!");
        
      navigate('/upload');
    } catch (err) {
      console.error("Login failed:", err.message);
      alert("Error: " + err.message);
    }
  };

  return (
    <div>
      {/* Logo on top-left */}
      <Logo/>

      <div className="login-container">
        {/* Right side card */}
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                className="form-control"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                placeholder="Password"
                value={form.password}
                className="form-control"
                required
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-password`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <button type="submit" className="btn-login">
              login

            </button>
            <div className="signup-link">
              Don't have an account? <a href="/signup" >Sign up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


export default Login;