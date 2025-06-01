import React, { useState } from "react";
import EmailPasswordLogin from "./EmailPasswordLogin";
import GoogleLoginButton from "./GoogleLoginButton";
import PhoneLogin from "./PhoneLogin";
import { useTranslation } from "react-i18next";

interface LoginSelectorProps {
  onToggle: () => void;
}

const LoginSelector: React.FC<LoginSelectorProps> = ({ onToggle }) => {
    const { t } = useTranslation();
    const [method, setMethod] = useState<"email" | "google" | "phone" | null>(null);
  
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-tr from-green-100 via-green-50 to-white px-4">
        {/* Top bar */}
  
        {!method ? (
          <div className="max-w-md w-full p-8 bg-white/90 rounded-xl shadow-lg backdrop-blur-md text-center">
            <h2 className="text-3xl font-bold mb-8 text-green-700">{t("chooseLoginMethod")}</h2>
            <div className="space-y-5">
              <button
                onClick={() => setMethod("email")}
                className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                {t("loginWithEmail")}
              </button>
              <button
                onClick={() => setMethod("google")}
                className="w-full py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition flex items-center justify-center space-x-2"
              >
                {/* Google icon SVG */}
                <svg
    className="w-6 h-6"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 46 46"
    aria-hidden="true"
  >
    <defs>
      <path id="a" d="M44.5 20H24v6h11.9C34.1 32.9 29.1 36 24 36c-7 0-13-5.7-13-13s6-13 13-13c3.4 0 6.5 1.3 8.9 3.4l4.7-4.7C33.3 6.6 28.9 5 24 5 12.4 5 3 14.4 3 26s9.4 21 21 21c11.5 0 21-9.4 21-21 0-1.4-.2-2.7-.5-4z" />
    </defs>
    <clipPath id="b">
      <use xlinkHref="#a" overflow="visible" />
    </clipPath>
    <path
      clipPath="url(#b)"
      fill="#FBBC05"
      d="M0 37V9l17 14z"
    />
    <path
      clipPath="url(#b)"
      fill="#EA4335"
      d="M0 9l17 14 7-6.1L48 14V0H0z"
    />
    <path
      clipPath="url(#b)"
      fill="#34A853"
      d="M0 37l30-23 7.9 1L48 0v48H0z"
    />
    <path
      clipPath="url(#b)"
      fill="#4285F4"
      d="M48 48L17 24l-4-3 35-10z"
    />
  </svg>                <span>{t("loginWithGoogle")}</span>
              </button>
              <button
                onClick={() => setMethod("phone")}
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                {t("loginWithPhone")}
              </button>
            </div>
            <p className="mt-8 text-sm text-gray-700">
              {t("dontHaveAccount")}{" "}
              <button
                onClick={onToggle}
                className="text-green-700 hover:underline font-medium"
              >
                {t("registerHere")}
              </button>
            </p>
          </div>
        ) : (
          <div className="max-w-md w-full p-8 bg-white/90 rounded-xl shadow-lg backdrop-blur-md">
            <button
              onClick={() => setMethod(null)}
              className="mb-6 text-sm text-green-700 hover:underline"
            >
              &larr; {t("back_to_login_selection")}
            </button>
  
            {method === "email" && <EmailPasswordLogin />}
            {method === "google" && <GoogleLoginButton />}
            {method === "phone" && <PhoneLogin />}
          </div>
        )}
      </div>
    );
  };
  

export default LoginSelector;
