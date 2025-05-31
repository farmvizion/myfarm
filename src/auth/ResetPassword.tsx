import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NatureBg from "../assets/nature.jpg";
import Logo from "../assets/logo.png";

const ResetPassword: React.FC = () => {
  const backend_api_url = import.meta.env.VITE_APP_API_URL;
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`${backend_api_url}/api/reset-password`, {
        token,
        newPassword,
      });

      setMessage(res.data.message || "Password reset successfully.");
      setTimeout(() => navigate("/signin"), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password.");
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
            Reset Your Password
          </h2>
        </div>

        {message && <p className="text-green-600 text-sm text-center mb-3">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Save Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
