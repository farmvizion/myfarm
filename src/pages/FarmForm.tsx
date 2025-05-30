import React, { useState } from "react";
import RiceImage from "../assets/rice.jpg";
import WheatImage from "../assets/wheat.jpeg";
import AppleImage from "../assets/apple.jpg";
import OliveImage from "../assets/olive.jpeg";

const backend_api_url = import.meta.env.VITE_BACKEND_API_URL;

const items = [
  { id: 1, label: "Rice", image: RiceImage },
  { id: 2, label: "Wheat", image: WheatImage },
  { id: 3, label: "Apple", image: AppleImage },
  { id: 4, label: "Olive", image: OliveImage },
];

const FarmForm: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);

  const toggleItem = (id: number) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = Object.keys(selectedItems)
      .filter((k) => selectedItems[parseInt(k, 10)])
      .map((id) => items.find((item) => item.id === parseInt(id))?.label);

    const payload = {
      ...formData,
      crops: chosen,
    };

    try {
      const response = await fetch(`${backend_api_url}/api/farm/create/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please check your network.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-inner">
      {/* Success Message */}
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg shadow-md text-center text-xl font-medium">
          🎉 Congratulations! Your journey with Farmvizion has begun. Let's make this world a better place to live and grow.
        </div>
      ) : (
        <>
          {/* Farm Crop Selection */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 p-6 rounded-xl shadow-xl space-y-6 border border-green-200"
          >
            <h2 className="text-3xl font-bold text-green-800 text-center mb-4 tracking-wide">
              🌿 Welcome to My Farm – Willkommen auf meiner Farm!
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`relative w-full h-36 border-2 rounded-xl overflow-hidden transition transform hover:scale-105 ${
                    selectedItems[item.id] ? "border-green-600" : "border-green-100"
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

            {/* Contact Details */}
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="message"
                placeholder="Tell us more about your farm or needs..."
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 transition shadow-md"
            >
              🌾 Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default FarmForm;
