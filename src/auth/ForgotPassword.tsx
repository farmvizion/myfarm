import React, { useState } from "react";
import axios from "axios";

interface ForgotPasswordProps {
  onBackToSignIn: () => void; // callback to go back to sign in page
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToSignIn }) => {
  const backend_api_url = import.meta.env.VITE_APP_API_URL;
  //`${backend_api_url}/api/request-reset`
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
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800"
        >
          Reset Password
        </button>
      </form>

      <p className="mt-4 text-center">
        Remembered your password?{" "}
        <button
          className="text-green-700 hover:underline"
          onClick={onBackToSignIn}
          type="button"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default ForgotPassword;
