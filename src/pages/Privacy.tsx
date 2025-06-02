import React from "react";
import { useTranslation } from "react-i18next";

import NatureBg from "../assets/nature.jpg";

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${NatureBg})` }}
    >
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-4xl mx-auto p-8 text-gray-800">
        <h1 className="text-3xl font-bold text-green-700 mb-4">{t("privacyPolicy")}</h1>
        <p className="mb-4">{t("privacyIntro")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("infoWeCollect")}</h2>
        <p className="mb-4">{t("infoWeCollectDesc")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("useOfInformation")}</h2>
        <p className="mb-4">{t("useOfInformationDesc")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("dataSharing")}</h2>
        <p className="mb-4">{t("dataSharingDesc")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("yourRights")}</h2>
        <p className="mb-4">{t("yourRightsDesc")}</p>

        <p className="mt-6 italic">{t("lastUpdated")}</p>
      </div>
    </div>
  );
};

export default Privacy;
