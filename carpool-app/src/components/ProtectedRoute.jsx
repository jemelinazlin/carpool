// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // Wait for AuthContext to finish loading
  if (loading) return <p className="text-center mt-6">Loading...</p>;

  // If no user, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Otherwise, render the child component
  return children;
}
