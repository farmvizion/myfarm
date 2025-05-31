import React from "react";
import NatureBg from "../assets/nature.jpg";

const Privacy = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${NatureBg})` }}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-4xl mx-auto p-8 text-gray-800">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Privacy Policy</h1>
        <p className="mb-4">
          At Farmvizion, we are committed to protecting your privacy. This policy
          outlines how we collect, use, and protect your information.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <p className="mb-4">
          We may collect personal information like name, email, farm location, and
          farming preferences. Location may be used to personalize insights.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. Use of Information</h2>
        <p className="mb-4">
          Your data is used to provide you with customized farming insights, send
          notifications, and improve our platform features.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing</h2>
        <p className="mb-4">
          We do not sell your data. We may share anonymized data with researchers or
          partners to improve agricultural models.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Rights</h2>
        <p className="mb-4">
          You can request access to, correction of, or deletion of your data at any time
          by contacting our support team.
        </p>
        <p className="mt-6 italic">Last updated: May 31, 2025</p>
      </div>
    </div>
  );
};

export default Privacy;
