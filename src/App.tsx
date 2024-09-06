import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Authorization from "./pages/Authorization";
import Authentication from "./pages/Authentication";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Authorization />} />
        <Route path="/sign-up" element={<Authentication />} />
      </Routes>
    </div>
  );
}

export default App;
