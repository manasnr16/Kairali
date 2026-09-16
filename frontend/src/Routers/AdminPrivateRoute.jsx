import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AdminAuthContext } from "../Contex/AdminAuthContext";

const AdminPrivateRoute = ({ children }) => {
  const { admin, loading } = useContext(AdminAuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminPrivateRoute;
