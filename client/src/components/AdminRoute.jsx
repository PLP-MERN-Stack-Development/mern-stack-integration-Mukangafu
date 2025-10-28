// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, token } = useAuth();

  // If no token or role is not admin, redirect to admin login
  if (!token || user?.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  // User is admin, render children
  return <>{children}</>;
}
