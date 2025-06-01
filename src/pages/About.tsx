import Logo from '../assets/drone.jpg' // Adjust the path if needed
import { useTranslation } from "react-i18next";

const About = () => {
    const { t } = useTranslation();
  
  return (
    <div className="bg-white text-gray-800 px-4 py-16">
      <div className="max-w-5xl mx-auto text-center">
        {/* Logo */}
        <img
          src={Logo} // Adjust path if needed
          alt="Farmvizion Logo"
          className="mx-auto mb-8 h-24 w-24 object-contain"
        />

        <h1 className="text-4xl font-bold mb-8">About Us</h1>

        <p className="text-lg max-w-3xl mx-auto mb-12">
           <span className="font-semibold text-green-600">{t("AtFarmVizion-")}</span>
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-green-50 p-6 rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-700"> {t("WeAim-")}
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-2">Our Vision</h3>
            <p className="text-gray-700">{t("ToEnable-")}
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">What Sets Us Apart</h2>
          <ul className="text-gray-700 space-y-3 max-w-2xl mx-auto list-disc list-inside">
            <li>{t("Realtime-")}</li>
            <li>{t("EdgeComputing-")}</li>
            <li>{t("CustomAI-")}</li>
            <li>{t("MultiSensor-")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
