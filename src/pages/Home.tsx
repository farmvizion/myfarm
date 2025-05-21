import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MobileHero from "../assets/MobileHero.png";
import DesktopHero from "../assets/DesktopHero.png";

const Home = () => {
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
          alt="Farmvizion Hero"
          className="absolute inset-0 w-full h-full object-cover object-top z-0"
        />

        {/* Gradient side overlays */}
        <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white via-white/50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white via-white/50 to-transparent z-10"></div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-30 z-10"></div>

        {/* Content */}
        <div className="relative z-20 max-w-3xl mx-auto px-4 text-white">
          <p className="text-lg md:text-xl mb-6">
            Farmvizion leverages AI and IoT to transform farms into intelligent
            ecosystems—monitor, diagnose, and act in real time.
          </p>

          {!showVideo ? (
            <button
              onClick={() => setShowVideo(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              Watch Video
            </button>
          ) : (
            <div className="relative aspect-video w-full max-w-xl mx-auto rounded-lg overflow-hidden shadow-lg mt-6">
              <iframe
                src="https://www.youtube.com/embed/br4h19Tv0ok?autoplay=1"
                title="Farmvizion Overview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>

              {/* Close Button */}
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-2 right-2 bg-white text-gray-800 rounded-full px-2 py-1 text-sm font-bold shadow hover:bg-red-500 hover:text-white transition"
                aria-label="Close video"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Farmvizion?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "AI Crop Diagnostics",
                desc: "Identify plant diseases, pests, and health issues using AI-powered analysis of images and data.",
              },
              {
                title: "IoT Sensor Integration",
                desc: "Monitor soil, climate, and crop conditions in real-time with intelligent sensor networks.",
              },
              {
                title: "Actionable Insights",
                desc: "Receive alerts and treatment suggestions tailored to each crop and region.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
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
        <h2 className="text-3xl font-bold mb-4">
          Ready to revolutionize your farm?
        </h2>
        <p className="mb-6">
          Connect with us and bring intelligence to your fields.
        </p>
        <Link
          to="/contact"
          className="bg-white text-green-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
};

export default Home;
