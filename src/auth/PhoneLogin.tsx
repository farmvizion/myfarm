import { useState } from "react";

import {
    getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useTranslation } from "react-i18next";
import { auth } from "../firebase";

export default function PhoneLogin() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);


  const setupRecaptcha = () => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
      "recaptcha-container", // The ID of the HTML element for reCAPTCHA
      {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha resolved");
        },
      }
    );
  };
  const handleSendOTP = async () => {
    setupRecaptcha()
    const recaptchaVerifier = (window as any).recaptchaVerifier;
    if (!recaptchaVerifier) {
        console.log("reCAPTCHA not initialized. Please try again.");
      return;
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaVerifier
      );
      console.log("SMS sent", confirmationResult);
      console.log(""); // Clear any previous errors
      // Handle OTP confirmation (e.g., prompt for code)
    } catch (error: any) {
      console.error("Error during sign-in:", error);
      if (error.code === "auth/billing-not-enabled") {
        console.log(
          "Phone authentication requires a billing account. Please enable billing in the Firebase Console."
        );
      } else if (error.code === "auth/invalid-phone-number") {
        console.log("Invalid phone number format. Please use E.164 format (e.g., +1234567890).");
      } else {
        console.log("An error occurred during authentication. Please try again.");
      }
    }
  };
  const handleVerifyOTP = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      console.log("User signed in", user);
      alert("Login success");
      // You can now send `user.phoneNumber` to your backend to create a JWT or session
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
        <input
          className="border border-green-400 p-2 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          type="text"
          placeholder={t("enterPhoneNumber")}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
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
