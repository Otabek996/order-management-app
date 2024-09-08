import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Adjust the path as needed

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authContext = useContext(AuthContext);

  // Check for tokens in local storage
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  console.log("AuthContext:", authContext);
  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);

  // Check if the user is authenticated either by context or tokens in local storage
  if (!authContext?.isAuthenticated && (!accessToken || !refreshToken)) {
    return <Navigate to="/sign-in" />;
  }

  // If authenticated, return the protected child component
  return children;
};

export default ProtectedRoute;
