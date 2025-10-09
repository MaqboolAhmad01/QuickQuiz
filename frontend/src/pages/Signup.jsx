import React, { useState } from "react";
import "./Signup.css";
import logo from "../assets/logo.png"; // adjust path based on your folder


// api call function
const signupUser = async (formData) => {
  try {
    const response = await fetch("http://localhost:8000/auth/signup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Signup failed");
    }

    return await response.json(); // return success data
  } catch (error) {
    throw error; // rethrow so caller can handle it
  }
};



const Signup = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);


  const [error, setError] = useState("");

  // Password validation function
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&.])[A-Za-z\d@$!.#%*?&]{8,}$/;
    return regex.test(password);
  };

  // Update state + check password validity while typing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      if (!validatePassword(value)) {
        setError(
          "Password must be at least 8 chars, include upper, lower, number & special character."
        );
      } else {
        setError(""); // clear error when valid
      }
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!validatePassword(form.password)) {
      setError(
        "Password must be at least 8 chars, include upper, lower, number & special character."
      );
      return;
    }
    try {
      const data = await signupUser(form);
      console.log("Signup success:", data);
      alert("Account created successfully!");
    } catch (err) {
      console.error("Signup failed:", err.message);
      alert("Error: " + err.message);
    }
  };


  return (
    <div>
      {/* Logo on top-left */}
      <div className="logo-container">
        <img src={logo} alt="App Logo" className="logo" />
      </div>
  
      {/* Signup content */}
      <div className="signup-container">
        {/* Left side text */}
        <div className="signup-text">
          <h1>Let's Evaluate your Knowledge</h1>
          <p>
            Create your account today 
            and start your journey with us.
          </p>
        </div>
  
        {/* Right side card */}
        <div className="signup-card">
          <h2 className="signup-title">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <div className="mb-3">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
  
            {/* Last Name */}
            <div className="mb-3">
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={form.last_name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
  
            {/* Email */}
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
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
                onChange={handleChange}
                className="form-control"
                required
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-password`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            {error && <small style={{ color: "red" }}>{error}</small>}
  
            <button type="submit" className="btn-signup">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}  
export default Signup;