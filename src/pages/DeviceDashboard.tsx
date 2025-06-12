import React, { useEffect, useState } from 'react';
import { ArrowLeft, Thermometer, Droplet, CloudRain } from "lucide-react";

import axios, { AxiosError } from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../context/AuthContext';



interface DeviceData {
  id?: number;
  deviceID: string;
  updated:string;
  deviceName: string;
  name: string;
  location:string;
  allocated: string | null;
  status: string;
  userID: any;
  farmID: any;
  temperature?: number;
  humidity?: number;
  soilType?: string;
  soilWaterLevel?: number;
  farmImageUrl?: string;
  cropName?: string | null;
  cropType?: string | null;
  cropImageUrl?: string | null;
}

const DeviceDashboard:  React.FC = () => {
  const backend_api_url = import.meta.env.VITE_APP_API_URL;
  const { id } = useParams();
  const [device, setDevice] = useState<DeviceData | null>(null);
  const { user, token } = useAuth();
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchDevice = async () => {
      try {
         //console.log("Fetched token:", token); // ADD THIS

         const response = await fetch(`${backend_api_url}/api/device/iot/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
        
        const data = await response.json();
        //console.log(data);
        setDevice(data);
      } catch (error) {
        console.error("Error fetching device:", error);
      }
    };

    fetchDevice();
  }, [id]);

  if (!device) {
    return <p className="text-center">Loading device details...</p>;
  }

 
  return (
    <div className="p-6 space-y-6 bg-white rounded-xl shadow-lg max-w-5xl mx-auto relative">
      
      {/* Back Arrow */}
      <button
        onClick={() => navigate('/myfarm')}
        className="absolute bottom-6 right-6 flex items-center gap-1 text-green-600 hover:text-green-800 transition"
        aria-label="Go back"
      >
        <ArrowLeft className="h-6 w-6" />
        <span className="hidden sm:inline font-semibold">Back</span>
      </button>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-green-800">{device.deviceName}</h1>
        <h2 className="text-lg text-gray-600">{device.location}</h2>
        <p className="text-sm text-gray-400">Last updated: {device.updated}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section */}
        <div className="space-y-4">
          <p><strong>Status:</strong> {device.status}</p>
          <p><strong>Allocated:</strong> {device.allocated || "No"}</p>
          <p><strong>Soil Type:</strong> {device.soilType || "N/A"}</p>

          {/* Soil Water Level */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Droplet className="h-4 w-4 text-blue-500" /> Soil Water Level
            </label>
            <div className="w-full bg-gray-200 rounded h-3 mt-1">
              <div
                className="bg-blue-500 h-3 rounded"
                style={{ width: `${device.soilWaterLevel ?? 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{device.soilWaterLevel ?? "N/A"}%</p>
          </div>

          {/* Temperature */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Thermometer className="h-4 w-4 text-red-500" /> Temperature
            </label>
            <div className="w-full bg-gray-200 rounded h-3 mt-1">
              <div
                className="bg-red-500 h-3 rounded"
                style={{ width: `${Math.min((device.temperature ?? 0) * 2, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{device.temperature ?? "N/A"}°C</p>
          </div>

          {/* Humidity */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <CloudRain className="h-4 w-4 text-cyan-500" /> Humidity
            </label>
            <div className="w-full bg-gray-200 rounded h-3 mt-1">
              <div
                className="bg-cyan-500 h-3 rounded"
                style={{ width: `${device.humidity ?? 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{device.humidity ?? "N/A"}%</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-2">
          <p><strong>Crop Name:</strong> {device.cropName || "N/A"}</p>
          <p><strong>Crop Type:</strong> {device.cropType || "N/A"}</p>

          <div className="flex gap-4 mt-4">
            {device.cropImageUrl && (
              <div>
                <p className="text-sm font-medium text-gray-700">Crop Image</p>
                <img
                  src={device.cropImageUrl}
                  alt="Crop"
                  onClick={() => setModalImageUrl(device.cropImageUrl!)}
                  className="h-28 w-28 object-cover rounded-lg shadow cursor-pointer hover:scale-105 transition"
                />
              </div>
            )}
            {device.farmImageUrl && (
              <div>
                <p className="text-sm font-medium text-gray-700">Farm Image</p>
                <img
                  src={device.farmImageUrl}
                  alt="Farm"
                  onClick={() => setModalImageUrl(device.farmImageUrl!)}
                  className="h-28 w-28 object-cover rounded-lg shadow cursor-pointer hover:scale-105 transition"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal View */}
      {modalImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setModalImageUrl(null)}
        >
          <div
            className="bg-white p-4 rounded shadow-lg max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImageUrl}
              alt="Full Size"
              className="max-h-[80vh] max-w-[90vw] object-contain"
            />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setModalImageUrl(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceDashboard;
