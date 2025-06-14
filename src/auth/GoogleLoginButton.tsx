import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AlertBox from "../components/AlertBox";
//import { isMobile } from "react-device-detect";


// Extend Navigator for userAgentData in TS
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
  const [successMessage, setSuccessMessage] = useState("");




  // Robust iPad detection (iPadOS often reports as Mac with touch)
  const isIPad = (() => {
    const uaData = navigator.userAgentData;
    if (uaData) {
      return (
        uaData.platform === "iPad" ||
        (uaData.platform === "macOS" && navigator.maxTouchPoints > 1)
      );
    }
    const ua = navigator.userAgent || "";
    return /\b(iPad)\b/.test(ua) || (/\bMacintosh\b/.test(ua) && navigator.maxTouchPoints > 1);
  })();

  // If iPad, skip Google entirely
  if (isIPad) {
    return (
      <div className="text-center">
        {message && <p className="text-red-600 mb-2">{message}</p>}
        <p className="mb-4 text-gray-700">
          Google Sign-In isn’t supported on this device. Please register and choose "Login with e-mail".
        </p>

      </div>
    );
  }



  // Desktop vs Android/other mobile
  //const forceRedirect = isMobile; // on Android or other phones, use redirect


  // If popup fails (desktop), send user to Login Selector
  const handleError = () => {
    setMessage("Google Sign-in failed. Redirecting to other options...");
    navigate("/signin");
  };

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      setMessage("No Google credential received.");
      return;
    }

    try {
      const res = await axios.post(`${backendApiUrl}/api/auth/google`, {
        credential: credentialResponse.credential,
      });

      if (res.data.token && res.data.user) {
        const { token, role, user } = res.data;
        login(token, role, { name: user.name, email: user.email });
        //console.log("Login successful");
        setSuccessMessage("🎉 Login Successful!");
        setTimeout(() => {
          navigate("/myfarm"); // or wherever you want to go
        }, 2000);
      } else {
        setMessage("Invalid response from Google sign-in.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Google Sign-in failed. Try again.");
    }
  };

  /*
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
   */

  return (
    <div>   {successMessage && (
      <div className="relative z-10 max-w-md w-full mb-4">
        <AlertBox message={successMessage} onClose={() => setSuccessMessage("")} />
      </div>
    )}
      <div className="text-center">
        {message && <p className="text-red-600 mb-2">{message}</p>}
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default GoogleLoginButton;
