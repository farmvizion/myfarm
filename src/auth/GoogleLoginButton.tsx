import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isMobile } from "react-device-detect";

// Extend Navigator to support userAgentData
declare global {
  interface NavigatorUAData {
    platform: string;
  }

  interface Navigator {
    userAgentData?: NavigatorUAData;
  }
}

const GoogleLoginButton: React.FC = () => {
  const backendApiUrl = import.meta.env.VITE_APP_API_URL;
  const { login } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // Detect iPad including newer iPadOS using macOS + touch
  const isIPad = (() => {
    const uaData = navigator.userAgentData;
    if (uaData) {
      return (
        uaData.platform === "iPad" ||
        (uaData.platform === "macOS" && navigator.maxTouchPoints > 1)
      );
    }

    const ua = navigator.userAgent || "";
    return (
      /\biPad\b/.test(ua) ||
      (/\bMacintosh\b/.test(ua) && navigator.maxTouchPoints > 1)
    );
  })();

  const forceRedirect = isMobile || isIPad;

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      setMessage("No Google credential received.");
      return;
    }

    try {
      const res = await axios.post(`${backendApiUrl}/api/auth/google`, {
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
  };

  if (forceRedirect) {
    return (
      <div className="text-center">
        {message && <p className="text-red-600 mb-2">{message}</p>}
        <button
          className="btn btn-primary"
          onClick={() =>
            (window.location.href = `${backendApiUrl}/api/auth/google/redirect`)
          }
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
