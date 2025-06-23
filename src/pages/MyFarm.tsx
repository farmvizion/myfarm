import React, { useEffect, useState } from "react";
import { Leaf } from 'lucide-react';

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  SunIcon,
  CloudIcon,
  BoltIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";


const MyFarm: React.FC = () => {
  const backend_api_url = import.meta.env.VITE_APP_API_URL;
  const { user, token } = useAuth();

  const [devices, setDevices] = useState<{id:number; deviceID: string; name?: string; status?: string; allocated?: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [deviceID, setDeviceID] = useState("");
  const [apiKey, setApiKey] = useState("");
  
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);


  // 🔹 State
  const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
  const [success, setSuccess] = useState(false);
  const [recommendedCrops, setRecommendedCrops] = useState<string[]>([]);
  const [soilMoisture, setSoilMoisture] = useState<number | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);



  function MyDevicesHeader() {
    return (
      <h1 className="flex items-center text-3xl font-extrabold text-green-800 mb-6 select-none drop-shadow-md">
        <Leaf className="w-8 h-8 mr-3 text-green-600" />
        My Devices
        <span className="ml-3 inline-block w-24 h-1 rounded-full bg-gradient-to-r from-green-400 via-green-600 to-green-400 opacity-70" />
      </h1>
    );
  }


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


  // 🔹 Weather + Soil Fetcher
  const fetchWeather = async (lat: number, lon: number) => {
    try {
      // Fetch current weather (temperature, etc)
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const weatherData = await weatherRes.json();
      setWeather(weatherData.current_weather);

        
    } catch (error) {
      console.error("Weather or soil fetch failed:", error);
    }
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
  const navigate = useNavigate();
 

  const fetchDevices = async () => {
    try {
      const response = await fetch(`${backend_api_url}/api/device/list/iot`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setDevices(data || []);
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    }
  };

  const linkDevice = async () => {
    try {
      const response = await fetch(`${backend_api_url}/api/device/link/iot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deviceID , apiKey }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error(data.error || "Linking failed");

      setMessage({ type: "success", text: "Device linked successfully" });
      setDeviceID("");
      setShowForm(false);
      fetchDevices();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  useEffect(() => {
    if (token) fetchDevices();
  }, [token]);

  return (
    <>
      <h2 className="text-2xl font-bold text-green-800 text-center mb-4 tracking-wide">
        🌿 Welcome {user?.name || "Guest"}
        {user?.email && user?.email !== user?.name && (
          <div className="text-base font-medium text-green-700 mt-1">{user.email}</div>
        )}
      </h2>
      {/* Weather Info */}
      <div className="bg-white/80 p-4 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold text-green-700 mb-2">🌤️ Local Weather Info</h3>
        <p>
          Location: {locationName ?? (location ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}` : "Fetching...")}
        </p>
        <p className="flex items-center gap-2">
          Condition: {icon} {text}
        </p>
      </div>
      <div className="p-4">
        <MyDevicesHeader />

        {showForm && (
          <div className="bg-white shadow p-4 rounded mb-4 max-w-md">
            <label className="block mb-2 font-medium">Enter Device ID</label>
            <input
              type="text"
              value={deviceID}
              onChange={(e) => setDeviceID(e.target.value)}
              className="border p-2 w-full mb-2 rounded"
            />
            <label className="block mb-2 font-medium">Enter Key</label>

              <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="border p-2 w-full mb-2 rounded"
            />
            <div className="flex space-x-2">
              <button
                onClick={linkDevice}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setMessage(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {message && (
          <p
            className={`mt-2 ${message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
          >
            {message.text}
          </p>
        )}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Device Name</th>
              <th className="p-3 border">Allocated</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {devices.length > 0 ? (
              devices.map((device) => (
                <tr
                  key={device.id}
                  onClick={() => navigate(`/dashboard/${device.id}`)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <td className="p-3 border">{device.id}</td>
                  <td className="p-3 border">{device.name}</td>
                  <td className="p-3 border">{device.allocated}</td>
                  <td className="p-3 border">{device.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                  <td colSpan={3} className="p-3 text-center">
                    No devices found
                  </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4 mt-4"
        >
          Link New Device
        </button>


      </div>
    </>
  );
};

export default MyFarm;
