import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  // Not logged in
  if (!token) return <Navigate to="/login" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // If a specific role is required and it doesn't match, redirect
    if (role && payload.role !== role) {
      return <Navigate to="/" replace />;
    }
  } catch (err) {
    console.error("Invalid token:", err);
    return <Navigate to="/login" replace />; // Malformed token
  }

  return children;
};

export default ProtectedRoute;
