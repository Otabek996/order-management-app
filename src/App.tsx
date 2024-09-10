import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Authorization from "./pages/Authorization";
import Home from "./pages/Home";
import ProtectedRoute from "./layout/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/order-management-app/sign-in" element={<Authorization />} />
      <Route
        path="/order-management-app"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-management-app/sign-up"
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
