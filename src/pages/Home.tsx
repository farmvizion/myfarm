import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MobileHero from "../assets/MobileHero.png";
import DesktopHero from "../assets/DesktopHero.png";

const features = [
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
];

const Home = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>(MobileHero);

  useEffect(() => {
    const updateBackground = () => {
      setBackgroundImage(window.innerWidth >= 768 ? DesktopHero : MobileHero);
    };

    updateBackground();
    window.addEventListener("resize", updateBackground);
    return () => window.removeEventListener("resize", updateBackground);
  }, []);

  return (
    <div className="bg-black text-white font-sans">
      {/* Nav */}
      <header className="absolute top-0 left-0 w-full z-30 py-6 px-8 flex justify-between items-center bg-black/60 backdrop-blur-md">
        <h1 className="text-2xl font-extrabold tracking-wide text-green-400">Farmvizion</h1>
        <nav className="space-x-6 text-sm sm:text-base font-medium">
          <Link to="/" className="hover:text-green-400 transition">Home</Link>
          <Link to="/farm" className="hover:text-green-400 transition">My Farm</Link>
          <Link to="/about" className="hover:text-green-400 transition">About</Link>
          <Link to="/contact" className="hover:text-green-400 transition">Contact</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center text-center overflow-hidden">
        <img
          src={backgroundImage}
          alt="Farmvizion smart farming background"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />

        <div className="relative z-20 max-w-4xl px-6 mt-16">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Revolutionize Agriculture with AI & IoT
          </h1>
          <p className="text-xl sm:text-2xl max-w-2xl mx-auto text-gray-200">
            Farmvizion transforms traditional farms into intelligent ecosystems—observe, analyze, and act instantly.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-400 transition focus:ring-4 focus:ring-green-300"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-16">Why Choose Farmvizion?</h2>
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-neutral-800 p-8 rounded-3xl shadow-xl hover:shadow-green-500/30 transition hover:-translate-y-1"
              >
                <h3 className="text-2xl font-semibold mb-3 text-green-400">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="bg-green-600 text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Bring Intelligence to Your Fields
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Connect with us to explore the next era of precision agriculture.
          </p>
          <Link
            to="/contact"
            className="bg-black text-white font-semibold px-8 py-4 rounded-full hover:bg-gray-800 transition focus:outline-none focus:ring-4 focus:ring-white"
          >
            Contact Our Team
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-neutral-800 text-gray-400 py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} Farmvizion. Built with precision, powered by innovation.</p>
      </footer>
    </div>
  );
};

export default Home;
