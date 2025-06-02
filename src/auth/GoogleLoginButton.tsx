import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isMobile } from "react-device-detect";

const GoogleLoginButton: React.FC = () => {
  const backend_api_url = import.meta.env.VITE_APP_API_URL;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const handleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const res = await axios.post(`${backend_api_url}/api/auth/google`, {
          credential: credentialResponse.credential,
        });

        if (res.data.token) {
          login(res.data.token, res.data.role);
          navigate("/");
        } else {
          setMessage("Invalid response from Google sign-in.");
        }
      } catch (err: any) {
        setMessage(err.response?.data?.error || "Google Sign-in failed. Try again.");
      }
    } else {
      setMessage("No Google credential received.");
    }
  };

  if (isMobile) {
    return (
      <div className="text-center">
        {message && <p className="text-red-600 mb-2">{message}</p>}
        <button
          className="btn btn-primary"
          onClick={() => {
            window.location.href = `${backend_api_url}/api/auth/google/redirect`;
          }}
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      {message && <p className="text-red-600 mb-2">{message}</p>}
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => setMessage("Google Sign-in was unsuccessful.")}
      />
    </div>
  );
};

export default GoogleLoginButton;
