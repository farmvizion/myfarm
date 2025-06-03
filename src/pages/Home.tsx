import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MobileHero from "../assets/MobileHero.png";
import DesktopHero from "../assets/DesktopHero.png";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t, i18n } = useTranslation();
  const [backgroundImage, setBackgroundImage] = useState<string>(MobileHero);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const updateBackground = () => {
      setBackgroundImage(window.innerWidth >= 768 ? DesktopHero : MobileHero);
    };

    updateBackground();
    window.addEventListener("resize", updateBackground);
    return () => window.removeEventListener("resize", updateBackground);
  }, []);

  return (
    
    <div className="bg-white text-gray-800">
      
      {/* Hero Section */}
      

      
      <section className="relative w-full min-h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Background Image */}
        <img
          src={backgroundImage}
          alt={t("farmvizionOverview")}
          className="absolute inset-0 w-full h-full object-cover object-top z-0"
          loading="lazy"
        />

        {/* Gradient side overlays */}
        <div className="absolute left-0 top-0 h-full w-12 sm:w-16 bg-gradient-to-r from-white via-white/70 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 h-full w-12 sm:w-16 bg-gradient-to-l from-white via-white/70 to-transparent z-10"></div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-30 z-10"></div>

        {/* Content */}
        <div className="relative z-20 max-w-xl sm:max-w-3xl mx-auto px-4">
          <p className="text-base sm:text-lg md:text-xl mb-6 font-medium text-white drop-shadow-md">
            {t("titleText")}
          </p>

        
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">{t("whyFarmvizion")}</h2>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {[
              {
                title: t("AICropDiagnostic"),
                desc: t("IdentifyPlant-"),
              },
              {
                title: t("IoTSensorIntegration"),
                desc: t("MonitorSoil-"),
              },
              {
                title: t("ActionableInsight"),
                desc: t("ReceiveAlerts-"),
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-transform transform hover:scale-105"
                style={{ willChange: "transform" }}
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section
        id="contact"
        className="bg-green-600 text-white py-16 px-4 text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          {t("ReadyToRevolutionaze")}
        </h2>
        <p className="mb-6 max-w-md mx-auto">
          {t("ConnectWithUs")}
        </p>
        <Link
          to="/contact"
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition inline-block focus:outline-none focus:ring-4 focus:ring-white"
        >
          {t("ContactUs")}
        </Link>
      </section>
    </div>
  );
};

export default Home;
