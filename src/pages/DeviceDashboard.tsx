import React, { useEffect, useState } from 'react';
import { ArrowLeft, Thermometer, Droplet, CloudRain } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import FieldSensorDashboard from '../components/FieldSensorDashboard';
import TimeSeriesChart from '../components/TimeSeriesChart';
import VideoStream from '../components/VideoStream';
import DetectedEvents from '../components/DetectedEvents';

interface DeviceData {
  id?: number;
  deviceID: string;
  apiKey: string;
  updated: string;
  deviceName: string;
  name: string;
  location: string;
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

const DeviceDashboard: React.FC = () => {
  const backend_api_url = import.meta.env.VITE_APP_API_URL;
  const { id } = useParams();
  const [device, setDevice] = useState<DeviceData | null>(null);
  const { user, token } = useAuth();
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Farm' | 'Vizion' | 'Live' | "Detections">('Farm');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await fetch(`${backend_api_url}/api/device/iot/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setDevice(data);
      } catch (error) {
        console.error("Error fetching device:", error);
      }
    };

    fetchDevice();
  }, [id]);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-white rounded-xl shadow-lg w-full md:max-w-none relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/myfarm')}
        className="absolute bottom-6 right-6 flex items-center gap-1 text-green-600 hover:text-green-800 transition"
      >
        <ArrowLeft className="h-6 w-6" />
        <span className="hidden sm:inline font-semibold">Back</span>
      </button>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'Farm'
              ? 'text-green-700 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-green-600'
            }`}
          onClick={() => setActiveTab('Farm')}
        >
          Farm
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'Vizion'
              ? 'text-green-700 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-green-600'
            }`}
          onClick={() => setActiveTab('Vizion')}
        >
          Vizion
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'Live'
              ? 'text-green-700 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-green-600'
            }`}
          onClick={() => setActiveTab('Live')}
        >
          Live
        </button>
            <button
          className={`px-4 py-2 font-medium ${activeTab === 'Detections'
              ? 'text-green-700 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-green-600'
            }`}
          onClick={() => setActiveTab('Detections')}
        >
          Detections
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'Farm' && (
        <>
          {!device ? (
            <p className="text-center">Loading device details...</p>
          ) : (
            <>
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
            </>
          )}
        </>
      )}

      {activeTab === 'Vizion' && device?.deviceID ? (
        <div className="text-center text-gray-500 text-lg py-10 italic">
          <section>
            <h2 className="text-xl font-semibold mb-4">Sensor Data & Metrics</h2>
            <div className="space-y-8">
              <FieldSensorDashboard deviceId={device.deviceID} apiKey={device.apiKey} />
              <div className="h-[400px]">
                <TimeSeriesChart deviceId={device.deviceID} apiKey={device.apiKey} />
              </div>
            </div>
          </section>
        </div>
      ) : activeTab === 'Vizion' ? (
        <p className="text-center text-gray-400 italic py-10">Device ID not available</p>
      ) : null}

        {activeTab === 'Live' && device?.deviceID ? (
        <div className="text-center text-gray-500 text-lg py-10 italic">
          <section>
            <h2 className="text-xl font-semibold mb-4">Live View</h2>
            <div className="space-y-8">
              <VideoStream deviceId={device.deviceID} apiKey={device.apiKey} />
             
            </div>
          </section>
        </div>
      ) : activeTab === 'Live' ? (
        <p className="text-center text-gray-400 italic py-10">Device ID not available</p>
      ) : null}

 {activeTab === 'Detections' && device?.deviceID ? (
        <div className="text-center text-gray-500 text-lg py-10 italic">
          <section>
            <h2 className="text-xl font-semibold mb-4">Live View</h2>
            <div className="space-y-8">
              <DetectedEvents deviceId={device.deviceID} apiKey={device.apiKey} />
             
            </div>
          </section>
        </div>
      ) : activeTab === 'Detections' ? (
        <p className="text-center text-gray-400 italic py-10">Device ID not available</p>
      ) : null}


      {/* Modal */}
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
