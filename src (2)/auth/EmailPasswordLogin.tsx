import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EmailPasswordLogin: React.FC = () => {
  const backend_api_url = import.meta.env.VITE_APP_API_URL;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${backend_api_url}/api/login`, { email, password });
      if (res.data.token) {
        login(res.data.token, res.data.role);
        navigate("/");
      } else {
        setMessage("Invalid response from server.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Sign in failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && <p className="text-red-600 text-sm text-center">{message}</p>}
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoFocus
      />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="absolute right-2 top-2 text-sm text-gray-600 hover:text-gray-900"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
      >
        Sign In
      </button>
    </form>
  );
};

export default EmailPasswordLogin;
