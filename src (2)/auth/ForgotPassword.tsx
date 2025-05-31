import React, { useState } from "react";
import axios from "axios";
import NatureBg from "../assets/nature.jpg"; // Ensure this exists
import Logo from "../assets/logo.png"; // Optional logo

interface ForgotPasswordProps {
  onBackToSignIn: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToSignIn }) => {
  const backend_api_url = import.meta.env.VITE_APP_API_URL;

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter email");
      return;
    }

    try {
      const res = await axios.post(`${backend_api_url}/api/request-reset`, {
        email,
      });

      setMessage(res.data.message || "Password reset email sent!");
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${NatureBg})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 max-w-md w-full bg-white/90 p-8 rounded-xl shadow-2xl backdrop-blur-md">
        <div className="text-center mb-6">
          <img src={Logo} alt="Logo" className="mx-auto h-16 w-16" />
          <h2 className="text-2xl font-bold text-green-700 mt-4">
            Forgot Password
          </h2>
        </div>

        {message && <p className="text-green-600 text-sm mb-3 text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Reset Password
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">
          Remembered your password?{" "}
          <button
            type="button"
            className="text-green-700 hover:underline font-medium"
            onClick={onBackToSignIn}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
