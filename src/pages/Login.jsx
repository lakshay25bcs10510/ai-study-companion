import { useState } from "react";
import { auth } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Login error:", err.message);
    }
  };

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Signup error:", err.message);
    }
  };

  return (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="bg-white p-6 rounded-xl shadow-md w-80">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full bg-blue-500 text-white p-2 rounded mb-2"
        onClick={login}
      >
        Login
      </button>

      <button
        className="w-full bg-gray-200 p-2 rounded"
        onClick={signup}
      >
        Signup
      </button>
    </div>
  </div>
);
}