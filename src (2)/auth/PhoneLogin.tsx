import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../firebase";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

const PhoneLogin: React.FC = () => {
  const backend_api_url = import.meta.env.VITE_APP_API_URL;
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [message, setMessage] = useState("");

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => handleSendOTP(),
      });
    }
  };

  const handleSendOTP = async () => {
    setMessage("");
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      setMessage("OTP sent to " + phone);
    } catch (err) {
      setMessage("Failed to send OTP. Check the phone number.");
    }
  };

  const handleVerifyOTP = async () => {
    setMessage("");
    try {
      const result = await confirmationResult.confirm(otp);
      const phoneNumber = result.user.phoneNumber;

      const res = await axios.post(`${backend_api_url}/api/auth/phone`, { phone: phoneNumber });

      if (res.data.token) {
        login(res.data.token, res.data.role);
        navigate("/");
      } else {
        setMessage("Failed to authenticate via phone.");
      }
    } catch (err) {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      {message && <p className="text-red-600 text-sm mb-3 text-center">{message}</p>}
      {!confirmationResult && (
        <>
          <input
            type="tel"
            placeholder="Mobile Number (+91...)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSendOTP}
            className="w-full mt-2 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition font-semibold"
          >
            Send OTP
          </button>
          <div id="recaptcha-container" />
        </>
      )}

      {confirmationResult && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="button"
            onClick={handleVerifyOTP}
            className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
};

export default PhoneLogin;
