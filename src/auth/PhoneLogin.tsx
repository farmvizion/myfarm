import { useState } from "react";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useTranslation } from "react-i18next";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const countryOptions = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
];

export default function PhoneLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [countryCode, setCountryCode] = useState("+91");
  const [localPhone, setLocalPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const setupRecaptcha = () => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha resolved");
        },
      }
    );
  };

  const handleSendOTP = async () => {
    setupRecaptcha();
    const recaptchaVerifier = (window as any).recaptchaVerifier;
    if (!recaptchaVerifier) {
      console.log("reCAPTCHA not initialized. Please try again.");
      return;
    }

    const fullPhoneNumber = `${countryCode}${localPhone}`;

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        recaptchaVerifier
      );
      setConfirmationResult(confirmationResult);
      console.log("SMS sent");
    } catch (error: any) {
      console.error("Error during sign-in:", error);
      if (error.code === "auth/billing-not-enabled") {
        alert("Phone authentication not yet enabled. Please try login using email or through Google");
        navigate("/signin"); // ✅ Navigate to LoginSelector
      } else if (error.code === "auth/invalid-phone-number") {
        alert("Invalid phone number. Please use E.164 format (e.g., +91 7790497337).");
      } else {
        alert("Authentication error. Try again.");
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      console.log("User signed in", user);
      alert("Login success");
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-[url('/nature-bg.jpg')] bg-cover flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-green-800 text-center">
          {t("signInWithPhone")}
        </h2>

        <div className="flex space-x-2 mb-4">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-1/3 px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {countryOptions.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.flag} {opt.code}
              </option>
            ))}
          </select>
          <input
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            type="tel"
            placeholder={t("Mobile Number")}
            value={localPhone}
            onChange={(e) => setLocalPhone(e.target.value)}
          />
        </div>

        <button
          onClick={handleSendOTP}
          className="bg-green-600 text-white py-2 px-4 rounded-md w-full hover:bg-green-700 transition"
        >
          {t("sendOtp")}
        </button>

        {confirmationResult && (
          <>
            <input
              className="border border-green-400 p-2 rounded-md w-full mt-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="text"
              placeholder={t("enterOtp")}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOTP}
              className="bg-blue-600 text-white py-2 px-4 rounded-md w-full mt-2 hover:bg-blue-700 transition"
            >
              {t("verifyOtp")}
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
