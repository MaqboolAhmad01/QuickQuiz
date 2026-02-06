import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Logo from "../components/logo/Logo";
import toast, { Toaster } from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.replace(/\/$/, ""); // get token from URL if exists
    console.log("Token:", token);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/auth/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const err = await response.json();
        toast.error("Invalid Email: " + err.error);
        return;
      }
      toast.success("Password reset link sent to your email.");
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/auth/update-password/${token}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (!response.ok) {
        const err = await response.json();
        toast.error(err.error || "Failed to reset password");
        return;
      }

      toast.success("Password reset successfully!");
      // optionally redirect to login page here
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div>
      {/* Logo stays absolute at the top */}
      <div className="absolute">
        <Logo />
      </div>
    <div className="relative min-h-screen flex items-center justify-center w-full px-10">
      <Toaster />


      {/* Main card */}
      <div className="w-[400px] flex flex-col mb-4 border rounded-xl bg-white/70 px-10 py-10 backdrop-blur-md shadow-[0px_6px_20px_rgba(0,0,0,0.15)] z-10">
        {!token ? (
          <>
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Reset Password
            </h2>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#a01a87]"
                required
              />
              <button
                type="submit"
                className="mx-auto block w-[40%] rounded-full bg-[#a01a87] text-lg text-white py-2 transition hover:bg-[#5a164d]"
              >
                Reset
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              Enter New Password
            </h2>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-4 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#a01a87]"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mb-4 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#a01a87]"
                required
              />
              <button
                type="submit"
                className="mx-auto block w-[40%] rounded-full bg-[#a01a87] text-lg text-white py-2 transition hover:bg-[#5a164d]"
              >
                Update
              </button>
            </form>
          </>
        )}
      </div>
    </div>
</div>
  );
};

export default ResetPassword;
