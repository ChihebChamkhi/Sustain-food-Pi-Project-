import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; 
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user } = useContext(AuthContext); // Get user from context

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
