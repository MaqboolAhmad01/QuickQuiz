import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const access = localStorage.getItem("access_token");

      // Call backend logout (refresh token is in cookies)
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: access ? `Bearer ${access}` : "",
        },
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    // Clear local storage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // Navigate to login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-lg 
             hover:text-white/50 transition-colors duration-200"
    >
      <LogOut size={18} />
      Logout
    </button>
  );
};

export default LogoutButton;
