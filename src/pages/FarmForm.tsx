import React, { useEffect, useState } from "react";
import RiceImage from "../assets/rice.jpg";
import WheatImage from "../assets/wheat.jpeg";
import AppleImage from "../assets/apple.jpg";
import OliveImage from "../assets/olive.jpeg";
import {
  SunIcon,
  CloudIcon,
  BoltIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";


function CloudSunIconCombined() {
  return (
    <div className="relative w-6 h-6">
      {/* Sun behind */}
      <SunIcon className="absolute top-0 left-0 w-6 h-6 text-yellow-400" />
      {/* Cloud in front, offset a bit */}
      <CloudIcon className="absolute bottom-0 right-0 w-4 h-4 text-gray-400" />
    </div>
  );
}





const items = [
  { id: 1, label: "Rice", image: RiceImage },
  { id: 2, label: "Wheat", image: WheatImage },
  { id: 3, label: "Apple", image: AppleImage },
  { id: 4, label: "Olive", image: OliveImage },
];



const FarmForm: React.FC = () => {



  function getWeatherIconAndText(code: number) {
    switch (code) {
      case 0:
        return { icon: <SunIcon className="w-6 h-6 text-yellow-400" />, text: "Clear sky" };
      case 1:
      case 2:
        return { icon: <CloudSunIconCombined />, text: "Partly cloudy" };
      case 3:
        return { icon: <CloudIcon className="w-6 h-6 text-gray-500" />, text: "Cloudy" };
      // ... other cases
      default:
        return { icon: <QuestionMarkCircleIcon className="w-6 h-6 text-gray-400" />, text: "Unknown" };
    }
  }
  
  







  const backend_api_url = import.meta.env.VITE_APP_API_URL;

  // 🔹 State
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [recommendedCrops, setRecommendedCrops] = useState<string[]>([]);
  const [soilMoisture, setSoilMoisture] = useState<number | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);





  // 🔹 Handlers
  const toggleItem = (id: number) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { ...formData };
    try {
      const response = await fetch(`${backend_api_url}/api/farm/create/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      response.ok ? setSuccess(true) : alert("Something went wrong. Please try again later.");
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please check your network.");
    }
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      const name = data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.state || "Unknown location";
      const country = data?.address?.country || "";
      setLocationName(`${name}, ${country}`);
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      setLocationName("Unknown");
    }
  };
  

  // 🔹 Weather + Soil Fetcher
  const fetchWeather = async (lat: number, lon: number) => {
    try {
      // Fetch current weather (temperature, etc)
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const weatherData = await weatherRes.json();
      setWeather(weatherData.current_weather);
  
      // Fetch hourly soil moisture data
      const soilRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=soil_moisture&timezone=auto`
      );
      const soilData = await soilRes.json();
  
      // Get latest soil moisture value (e.g. first value)
      const latestSoilMoisture = soilData?.hourly?.soil_moisture?.[0] ?? null;
      setSoilMoisture(latestSoilMoisture);
  
    } catch (error) {
      console.error("Weather or soil fetch failed:", error);
    }
  };
  
  
  
  const fetchCropRecommendations = () => {
    if (!weather || soilMoisture === null) return;
  
    const temp = weather.temperature_2m;
    const humidity = weather.relative_humidity_2m;
    const moisture = soilMoisture;
  
    let crops: string[] = [];
    if (temp > 25 && humidity > 60 && moisture > 0.2) crops.push("Rice");
    if (temp >= 10 && temp <= 25 && humidity <= 60 && moisture <= 0.2) crops.push("Wheat");
    if (temp >= 15 && temp <= 25 && humidity >= 50 && moisture > 0.15) crops.push("Apple");
    if (temp >= 18 && temp <= 28 && humidity <= 50 && moisture <= 0.15) crops.push("Olive");
  
    setRecommendedCrops(crops);
  };
  

  // 🔹 Location + Weather + Crop Init
  useEffect(() => {
    const getLocationAndWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            reverseGeocode(latitude, longitude);
            fetchWeather(latitude, longitude);
          },
          (error) => {
            console.error("Geolocation error:", error);
            const fallbackLat = 17.385;
            const fallbackLon = 78.4867;
            setLocation({ latitude: fallbackLat, longitude: fallbackLon });
            reverseGeocode(fallbackLat, fallbackLon);
            fetchWeather(fallbackLat, fallbackLon);
          }
        );
      } else {
        console.warn("Geolocation not supported");
        const fallbackLat = 17.385;
        const fallbackLon = 78.4867;
        setLocation({ latitude: fallbackLat, longitude: fallbackLon });
        reverseGeocode(fallbackLat, fallbackLon);
        fetchWeather(fallbackLat, fallbackLon);
      }
    };
  
    getLocationAndWeather();
  }, []);
  
  const { icon, text } = weather ? getWeatherIconAndText(weather.weathercode) : { icon: null, text: "--" };

  // 🔹 Update Crop Suggestions Once Weather & Soil Are Fetched
  useEffect(() => {
    if (weather && soilMoisture !== null) {
      fetchCropRecommendations();
    }
  }, [weather, soilMoisture]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-inner">
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg shadow-md text-center text-xl font-medium">
          🎉 Congratulations! Your journey with Farmvizion has begun. Let's make this world a better place to live and grow.
        </div>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 p-6 rounded-xl shadow-xl space-y-6 border border-green-200"
          >
            <h2 className="text-3xl font-bold text-green-800 text-center mb-4 tracking-wide">
              🌿 Welcome to My Farm – Willkommen auf meiner Farm!
            </h2>

            {/* Weather Info */}
            <div className="bg-white/80 p-4 rounded-lg shadow mb-6">
            <h3 className="text-xl font-semibold text-green-700 mb-2">🌤️ Local Weather Info</h3>
            <p>
              Location: {locationName ?? (location ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}` : "Fetching...")}
            </p>
            <p>Temperature: {weather?.temperature_2m ?? "--"}°C</p>
            <p>Humidity: {weather?.relative_humidity_2m ?? "--"}%</p>
            <p className="flex items-center gap-2">
              Condition: {icon} {text}
            </p>
          </div>

    


            {/* Recommendations */}
            {recommendedCrops.length > 0 && (
              <div className="bg-white/90 p-4 rounded-lg shadow border border-green-200 mb-4">
                <h3 className="text-xl font-semibold text-green-800 mb-2">🌱 Recommended Crops</h3>
                <ul className="list-disc ml-6 text-green-700">
                  {recommendedCrops.map((crop, idx) => (
                    <li key={idx}>{crop}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Crop Selector */}
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

            {/* Contact Form */}
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
