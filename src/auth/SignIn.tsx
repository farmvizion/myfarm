import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface SignInProps {
  onToggle: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onToggle }) => {
  const backend_api_url = import.meta.env.VITE_APP_API_URL;

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(backend_api_url);
    e.preventDefault();
    setMessage("");
    console.log("Sending login request with:", { email, password });

    try {
      const res = await axios.post(`${backend_api_url}/api/login`, {
        email,
        password,
      });

      if (res.data.token) {
        login(res.data.token, res.data.role);
        setMessage("Signed in successfully!");
        navigate("/");
      } else {
        setMessage("Invalid response from server.");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(
        err.response?.data?.error ||
          "Sign in failed. Please check your credentials."
      );
    }
  };

  const clickedForgotPassword = () => {
    navigate("/forgotpassword");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      {message && <p className="text-red-500 mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded"
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
          className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800"
        >
          Sign In
        </button>
      </form>

      <p className="mt-2 text-right">
        <button
          type="button"
          className="text-green-700 hover:underline"
          onClick={clickedForgotPassword}
        >
          Forgot Password?
        </button>
      </p>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-green-700 hover:underline"
          onClick={onToggle}
        >
          Register here
        </button>
      </p>
    </div>
  );
};

export default SignIn;
