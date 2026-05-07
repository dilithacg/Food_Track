import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Adjust path based on your setup

const ShopRoute = ({ children }) => {
  const { user, userData, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Check if logged in AND if role is 'shop'
  if (user && userData?.role === "shop") {
    return children;
  }

  // Redirect everyone else to login or home
  return <Navigate to="/" replace />;
};

export default ShopRoute;
