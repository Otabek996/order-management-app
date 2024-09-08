import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/sign-in/SignIn";
import Authentication from "./pages/Authentication";
import Authorization from "./pages/Authorization";
import Home from "./pages/Home";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./layout/ProtectedRoute";

// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const authContext = useContext(AuthContext);
//   console.log(authContext);
//   if (!authContext?.isAuthenticated) {
//     return <Navigate to="/sign-in" />;
//   }
//   return children;
// };

function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<Authorization />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sign-up"
        element={
          <ProtectedRoute>
            <Authentication />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
