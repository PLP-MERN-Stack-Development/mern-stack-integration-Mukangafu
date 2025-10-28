// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, adminOnly = false }) {
  const { auth } = useAuth();

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && auth.user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
