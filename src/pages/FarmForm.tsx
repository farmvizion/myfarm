import React, { useState } from "react";

import RiceImage from "../assets/rice.jpg";
import WheatImage from "../assets/wheat.jpeg";
import AppleImage from "../assets/apple.jpg";
import OliveImage from "../assets/olive.jpeg";

// Define your 16 images here (adjust paths as needed)
const items = [
  { id: 1, label: "Rice", image: RiceImage },
  { id: 2, label: "Wheat", image: WheatImage },
  { id: 3, label: "Apple", image: AppleImage },
  { id: 4, label: "Olive", image: OliveImage },
];

const FarmForm: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>(
    {}
  );

  const toggleItem = (id: number) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = Object.keys(selectedItems).filter(
      (k) => selectedItems[parseInt(k, 10)]
    );
    alert("Contact Farmvizion Team for your device and onboarding");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-inner">
      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 p-6 rounded-xl shadow-xl space-y-6 border border-green-200"
      >
        <h2 className="text-3xl font-bold text-green-800 text-center mb-4 tracking-wide">
          🌿 Welcome to My Farm – Willkommen auf meiner Farm!
        </h2>

        {/* 4x4 Image Checkbox Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`relative w-full h-36 border-2 rounded-xl overflow-hidden transition transform hover:scale-105 ${
                selectedItems[item.id]
                  ? "border-green-600"
                  : "border-green-100"
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-full bg-white bg-opacity-80 text-center text-green-800 font-medium py-1">
                {item.label}
              </div>
              {selectedItems[item.id] && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              <input
                type="checkbox"
                checked={!!selectedItems[item.id]}
                onChange={() => toggleItem(item.id)}
                className="hidden"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          onClick={() => {}}
          className="w-full py-3 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 transition shadow-md"
        >
          🌾 Submit
        </button>
      </form>

      {/* Embedded Contact Form */}
      <div className="bg-white/90 p-6 rounded-xl shadow-xl border border-green-200">
        <h2 className="text-2xl font-bold mb-4 text-green-800">📬 Get in Touch</h2>
        <iframe
          src="https://forms.gle/b3STPM36jYKKF6vF6"
          className="w-full h-[600px] md:h-[700px] rounded-lg shadow-lg border border-green-100"
          title="Contact Form"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default FarmForm;
