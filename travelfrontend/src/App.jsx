import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Trips from "./pages/Trips";

export default function App() {

  const isAuthenticated = () => {
    return !!localStorage.getItem("access");
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/trips"
          element={isAuthenticated() ? <Trips /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
