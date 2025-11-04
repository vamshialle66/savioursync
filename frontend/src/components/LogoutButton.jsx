import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-400 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
