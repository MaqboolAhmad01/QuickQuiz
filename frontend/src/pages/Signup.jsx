import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import Logo from "../components/logo/Logo";
import { useNavigate } from "react-router-dom";

// api call function
const signupUser = async (formData) => {
  const response = await fetch("http://localhost:8000/auth/signup/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Signup failed");
  }

  return response.json();
};

const Signup = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&.])[A-Za-z\d@$!.#%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setError(
        validatePassword(value)
          ? ""
          : "Password must be at least 8 chars, include upper, lower, number & special character."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validatePassword(form.password)) {
      setLoading(false);
      return;
    }

    try {
      await signupUser(form);
      localStorage.setItem("otp_email", form.email);
      navigate("/otp-sent", { state: { email: form.email } });
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">

      {/* Logo */}
      <div className="md:absolute">
        <Logo className=""/>
      </div>

      {/* Main container */}
      <div className="
          flex min-h-screen flex-col items-center justify-center
          px-4
          lg:flex-row lg:justify-between lg:px-10
        "
      >

        {/* Left text (always visible) */}
        <div className="w-full lg:flex-1 mb-8 lg:mb-0  text-left  lg:pr-10 text-black">
          <h1 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold">
            Let's Evaluate your Knowledge
          </h1>
          <p className="text-base sm:text-lg leading-relaxed">
            Create your account today and start your journey with us.
          </p>
        </div>

        {/* Signup card */}
        <div className="
            w-full max-w-[400px]
            min-h-[520px]
            rounded-xl bg-white/70
            p-6 sm:p-8 lg:p-10
            backdrop-blur-md
            shadow-[0px_6px_20px_rgba(0,0,0,0.15)]
          "
        >
          <h2 className="mb-6 text-center text-2xl sm:text-3xl font-bold text-gray-900">
            Sign Up
          </h2>

          <form onSubmit={handleSubmit}>

            {/* First name */}
            <div className="mb-4">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a01a87]"
                required
              />
            </div>

            {/* Last name */}
            <div className="mb-4">
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a01a87]"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a01a87]"
                required
              />
            </div>

            {/* Password */}
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#a01a87]"
                required
              />
              <i
                className={`bi ${
                  showPassword ? "bi-eye-slash" : "bi-eye"
                } absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-lg text-gray-600 hover:text-black`}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            {error && (
              <small className="block mb-4 text-red-600">{error}</small>
            )}

            {/* Button / Spinner */}
            {loading ? (
              <div className="flex h-10 items-center justify-center">
                <FaSpinner className="animate-spin text-lg" />
              </div>
            ) : (
              <button
                type="submit"
                className="
                  mx-auto block w-full sm:w-1/2
                  rounded-full bg-[#a01a87]
                  py-2 text-lg text-white
                  transition hover:bg-[#5a164d]
                "
              >
                Let's go
              </button>
            )}
          </form>

          {/* Login link */}
          <div className="mt-5 text-center text-gray-700">
            Already have an account?{" "}
            <a href="/login" className="text-[#a01a87] hover:underline">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
