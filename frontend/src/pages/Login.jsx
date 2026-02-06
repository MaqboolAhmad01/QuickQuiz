import React, { useState } from "react";
import Logo from "../components/logo/Logo";
import { useNavigate } from "react-router-dom";
import {API_BASE_URL} from "../config";

const loginUser = async (formData) => {
  const response = await fetch(API_BASE_URL+"auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail);
  }

  const data = await response.json();

  if (data.access) {
    localStorage.setItem("access_token", data.access);
  }
  return data;
};

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(form);
      alert("Logged in successfully!");
      navigate("/upload");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="relative min-h-screen">

      {/* Logo top-left */}
      <div className="absolute">
        <Logo />
      </div>

      {/* Centered container */}
      <div className="flex min-h-screen items-center justify-center px-10">
        <div className="w-[400px] rounded-xl bg-white/70 p-10 backdrop-blur-md shadow-[0px_6px_20px_rgba(0,0,0,0.15)]">

          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Login
          </h2>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a01a87]"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a01a87]"
                required
              />

              <i
                className={`bi ${
                  showPassword ? "bi-eye-slash" : "bi-eye"
                } absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600`}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="mx-auto block w-[30%] rounded-full bg-[#a01a87] py-2 text-lg text-white transition hover:bg-[#5a164d]"
            >
              Login
            </button>

            {/* Signup */}
            <div className="mt-4 text-center text-gray-700">
              Don’t have an account?{" "}
              <a href="/signup" className="text-[#a01a87] hover:underline">
                Sign up
              </a>
            </div>
            <div className="mt-2 text-center ">
              <a href="/reset-password" className="text-[#a01a87]">
              Forgot password?
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
