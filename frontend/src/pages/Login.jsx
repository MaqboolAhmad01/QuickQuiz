import logo from "../assets/logo.png"; // adjust path based on your folder
import React, { useState } from "react";
import Logo from "../components/logo/Logo"; 

import "./login.css";


const loginUser = async (formData) => {
    try {
      const response = await fetch("http://localhost:8000/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Login failed");
      }
  
      return await response.json(); // return success data
    } catch (error) {
      throw error; // rethrow so caller can handle it
    }
  };

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(form);
      console.log("Login success:", data);
      alert("Logged in successfully!");
    } catch (err) {
      console.error("Signup failed:", err.message);
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
                onChange={setForm}
                className="form-control"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
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