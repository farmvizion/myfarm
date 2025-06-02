import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";


const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 text-gray-800 px-4 py-20 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-4">
          {t("ContactUs")}        </h1>
        <p className="text-center text-lg text-green-700 mb-4">
          <a
            href="mailto:developer@farmvizion.com"
            className="text-green-900 font-medium underline hover:text-green-700"
          >
          {t("GotQuestions-")}{" "}
          </a>
        </p>

        <p className="text-center text-lg text-green-700 mb-12">
          <a
            href="https://www.linkedin.com/company/farmvizion.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-green-900 hover:text-green-700 text-2xl transition-transform hover:scale-110"
            aria-label="Farmvizion LinkedIn"
          >
            <FaLinkedin className="mr-2" />
            LinkedIn
          </a>
        </p>

        <div className="grid grid-cols-1 gap-12 items-start">
          {/* Animated World Map */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-green-800">
              {t("countries")}
            </h2>
            <div className="w-full rounded-xl overflow-hidden shadow-lg border border-green-200">
              <iframe
                title="Global Offices Map"
                src="https://www.google.com/maps/d/embed?mid=1cfo93Ljmbr6xWkzpB8pRy85yHsqzeW4&ehbc=2E312F"
                className="w-full h-[600px] md:h-[700px]"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
