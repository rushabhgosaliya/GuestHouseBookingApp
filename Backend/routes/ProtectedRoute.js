// src/ProtectedRoute.jsx
import {React} from "react";
import { Navigate, replace } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;



