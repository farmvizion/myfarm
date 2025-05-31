import React from "react";
import NatureBg from "../assets/nature.jpg";

const Terms = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${NatureBg})` }}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-4xl mx-auto p-8 text-gray-800">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Terms and Conditions</h1>
        <p className="mb-4">
          Welcome to Farmvizion. By accessing or using our platform, you agree to comply
          with and be bound by these terms. Please read them carefully.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Platform</h2>
        <p className="mb-4">
          You must use the platform in accordance with all applicable laws and for
          agricultural purposes only. Misuse will result in account suspension.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. Account Responsibilities</h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your login
          credentials and for all activities under your account.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Accuracy</h2>
        <p className="mb-4">
          The agricultural data provided is based on best-effort forecasts and analysis.
          It should not be the sole basis for critical farming decisions.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Modifications</h2>
        <p className="mb-4">
          Farmvizion reserves the right to update or modify these terms at any time. We
          will notify users of changes via email or the platform.
        </p>
        <p className="mt-6 italic">Last updated: May 31, 2025</p>
      </div>
    </div>
  );
};

export default Terms;
