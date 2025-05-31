import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // get auth token or auth status

  if (!isAuthenticated) {
    // not authenticated, redirect to sign in
    return <Navigate to="/signin" replace />;
  }

  // authenticated, render child routes or component
  return <Outlet />;
};

export default ProtectedRoute;
