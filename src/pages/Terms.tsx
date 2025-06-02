import React from "react";
import { useTranslation } from "react-i18next";
import NatureBg from "../assets/nature.jpg";

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${NatureBg})` }}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-4xl mx-auto p-8 text-gray-800">
        <h1 className="text-3xl font-bold text-green-700 mb-4">{t("termsAndConditions")}</h1>
        <p className="mb-4">{t("termsIntro")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("useOfPlatform")}</h2>
        <p className="mb-4">{t("useOfPlatformDesc")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("accountResponsibilities")}</h2>
        <p className="mb-4">{t("accountResponsibilitiesDesc")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("dataAccuracy")}</h2>
        <p className="mb-4">{t("dataAccuracyDesc")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("modifications")}</h2>
        <p className="mb-4">{t("modificationsDesc")}</p>

        <p className="mt-6 italic">{t("lastUpdated")}</p>
      </div>
    </div>
  );
};

export default Terms;
