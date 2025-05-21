import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="bg-white text-gray-800 px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>
        <p className="text-center text-lg text-gray-600 mb-6">
          Got questions or want to collaborate? Reach out to us at{" "}
          <a
            href="mailto:developer@farmvizion.com"
            className="text-green-600 hover:underline"
          >
            developer@farmvizion.com
          </a>
        </p>
        <p className="text-center text-lg text-gray-600 mb-12">
          <a
            href="https://www.linkedin.com/company/farmvizion.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-2xl transition-transform hover:scale-110"
            aria-label="Farmvizion LinkedIn"
          >
            <FaLinkedin className="mr-2" />
            LinkedIn
          </a>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <iframe
              src="https://forms.gle/b3STPM36jYKKF6vF6"
              className="w-full h-[600px] md:h-[700px] rounded-lg shadow-lg"
              title="Contact Form"
              loading="lazy"
            ></iframe>
          </div>

          {/* Animated World Map */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-4">Our Global Presence</h2>
            <iframe
              title="Global Offices Map"
              src="https://www.google.com/maps/d/embed?mid=11xRNIRmnqYzFTD9r0xufY0DJN5Xeakc&ehbc=2E312F"
              className="w-full h-[600px] md:h-[700px] rounded-xl shadow"
              loading="lazy"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
