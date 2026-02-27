import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      await API.post("register/", {
        username,
        email,
        password,
      });

      alert("Registered successfully. Please login.");
      navigate("/"); // go to login
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center">Register</h3>

      <input className="form-control mb-2"
        placeholder="Username"
        onChange={e => setUsername(e.target.value)} />

      <input className="form-control mb-2"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)} />

      <input type="password" className="form-control mb-2"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)} />

      <button className="btn btn-success w-100" onClick={registerUser}>
        Register
      </button>
    </div>
  );
}

