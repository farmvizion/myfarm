import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserAdminDashboard from './UserAdminDashboard';
import CropAdminDashboard from './CropAdminDashboard';
import QueryAdminDashboard from './QueryAdminDashboard';
import DeviceAdminDashboard from './DeviceAdminDashboard';
import FarmAdminDashboard from './FarmAdminDashboard';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'crops' | 'queries' | 'devices' | 'farms'>('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { logout } = useAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-4 mb-6 rounded-lg">
          {success}
        </div>
      )}
      {loading && (
        <div className="mb-6 text-center text-gray-600">Loading...</div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'users'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Users
        </button>
     
        <button
          onClick={() => setActiveTab('queries')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'queries'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Queries
        </button>
          <button
          onClick={() => setActiveTab('devices')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'queries'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Devices
        </button>
          <button
          onClick={() => setActiveTab('farms')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'farms'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Farms
        </button>
           <button
          onClick={() => setActiveTab('crops')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'crops'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Crops
        </button>
      </div>

      {/* Render Active Tab Content */}
      {activeTab === 'users' && (
        <UserAdminDashboard
          apiBaseUrl={API_BASE_URL}
          loading={loading}
          setLoading={setLoading}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      {activeTab === 'crops' && (
        <CropAdminDashboard
          apiBaseUrl={API_BASE_URL}
          loading={loading}
          setLoading={setLoading}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      {activeTab === 'queries' && (
        <QueryAdminDashboard
          apiBaseUrl={API_BASE_URL}
          loading={loading}
          setLoading={setLoading}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      {activeTab === 'devices' && (
        <DeviceAdminDashboard
          apiBaseUrl={API_BASE_URL}
          loading={loading}
          setLoading={setLoading}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      {activeTab === 'farms' && (
        <FarmAdminDashboard
          apiBaseUrl={API_BASE_URL}
          loading={loading}
          setLoading={setLoading}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      
    </div>
  );
};

export default AdminDashboard;