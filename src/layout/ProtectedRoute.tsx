import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authContext = useContext(AuthContext);
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!authContext?.isAuthenticated && (!accessToken || !refreshToken)) {
    return <Navigate to="/sign-in" />;
  }

  return children;
};

export default ProtectedRoute;
