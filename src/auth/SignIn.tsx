import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Logo from "../assets/logo.png"; // Optional logo
import NatureBg from "../assets/nature.jpg"; // Your background image
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';


interface SignInProps {
  onToggle: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onToggle }) => {
  const backend_api_url = import.meta.env.VITE_APP_API_URL;

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);



  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const res = await axios.post(`${backend_api_url}/api/auth/google`, {
          credential: credentialResponse.credential,
        });
  
        if (res.data.token) {
          login(res.data.token, res.data.role);
          setMessage("Signed in with Google!");
          navigate("/");
        } else {
          setMessage("Invalid response from Google sign-in.");
        }
      } catch (err: any) {
        console.error(err);
        setMessage(
          err.response?.data?.error || "Google Sign-in failed. Try again."
        );
      }
    } else {
      setMessage("No Google credential received.");
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${NatureBg})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 max-w-md w-full bg-white/90 p-8 shadow-2xl rounded-xl backdrop-blur-md">
        <div className="mb-6 text-center">
          <img src={Logo} alt="Logo" className="mx-auto h-16 w-16" />
          <h2 className="text-2xl font-bold mt-4 text-green-700">Sign In</h2>
        </div>

        {message && <p className="text-red-600 text-sm mb-3 text-center">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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

          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setMessage("Google Sign-in was unsuccessful.")}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Sign In
          </button>
        </form>

        <p className="mt-3 text-sm text-right">
          <button
            type="button"
            className="text-green-700 hover:underline"
            onClick={clickedForgotPassword}
          >
            Forgot Password?
          </button>
        </p>

        <p className="mt-4 text-center text-sm text-gray-700">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-green-700 hover:underline font-medium"
            onClick={onToggle}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
