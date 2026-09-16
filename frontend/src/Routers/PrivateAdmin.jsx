import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Contex/AuthProvider";


const PrivateAdmin = ({ children }) => {
  const { user, authChecked, authUser } = useContext(AuthContext);
  const location = useLocation();

  const isAdmin = authUser?.role === "admin";

  if (!authChecked) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  if (user && isAdmin) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default PrivateAdmin;
