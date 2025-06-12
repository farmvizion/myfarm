import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';



interface Farm {
  id: number;
  soilType: string;
  soilWaterLevel: number;
  temperature: number;
  humidity: number;
  cropID: number;
  farmImageUrl: string | null;
}

interface Props {
  apiBaseUrl: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

const FarmAdminDashboard: React.FC<Props> = ({ apiBaseUrl, loading, setLoading, setError, setSuccess }) => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [newFarm, setNewFarm] = useState<Partial<Farm>>({});
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [farmImage, setFarmImage] = useState<File | null>(null);
  const { user, token } = useAuth();
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);


  // Fetch Farms
  const fetchFarms = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const res = await axios.get(`${apiBaseUrl}/api/admin/farms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setFarms(res.data);
      } else {
        setError('Invalid data format received from server.');
      }
    } catch (err) {
      handleAxiosError(err, 'Failed to fetch crops');
    } finally {
      setLoading(false);
    }
  };

  // Create Farm
  const createFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const formData = new FormData();
      formData.append('soilType', newFarm.soilType || '');
      if (newFarm.soilWaterLevel !== undefined) {
        formData.append('soilWaterLevel', newFarm.soilWaterLevel.toString());
      }
      if (newFarm.temperature !== undefined) {
        formData.append('temperature', newFarm.temperature.toString());
      }
      if (newFarm.humidity !== undefined) {
        formData.append('humidity', newFarm.humidity.toString());
      }
      if (newFarm.cropID !== undefined) {
        formData.append('humidity', newFarm.cropID.toString());
      }
      formData.append('farmImageUrl', newFarm.farmImageUrl || '');

      await axios.post(`${apiBaseUrl}/api/admin/farm/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`},
      });
      setSuccess('Crop created successfully!');
      setNewFarm({});
      setFarmImage(null);
      await fetchFarms();
    } catch (err) {
      handleAxiosError(err, 'Failed to create crop');
    } finally {
      setLoading(false);
    }
  };

  // Update Farm
  const updateFarm = async (e: React.FormEvent, farm: Farm) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const formData = new FormData();
    
      formData.append('soilType', farm.soilType || '');
      if (farm.soilWaterLevel !== undefined) {
        formData.append('soilWaterLevel', farm.soilWaterLevel.toString());
      }
      if (farm.temperature !== undefined) {
        formData.append('temperature', farm.temperature.toString());
      }
      if (farm.humidity !== undefined) {
        formData.append('humidity', farm.humidity.toString());
      }
      if (farm.cropID !== undefined) {
        formData.append('humidity', farm.cropID.toString());
      }formData.append('farmImageUrl', farm.farmImageUrl || '');

      await axios.patch(`${apiBaseUrl}/api/admin/farm/${farm.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setSuccess('Crop updated successfully!');
      setEditingFarm(null);
      setFarmImage(null);
      await fetchFarms();
    } catch (err) {
      handleAxiosError(err, 'Failed to update crop');
    } finally {
      setLoading(false);
    }
  };

  // Delete Farm
  const deleteFarm = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      await axios.delete(`${apiBaseUrl}/api/admin/farm/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Farm deleted successfully!');
      await fetchFarms();
    } catch (err) {
      handleAxiosError(err, 'Failed to delete crop');
    } finally {
      setLoading(false);
    }
  };

  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (err instanceof AxiosError) {
      setError(err.response?.data?.message || defaultMessage);
    } else {
      setError(defaultMessage);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Farm</h3>
        <form
          onSubmit={createFarm}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label
              htmlFor="farm-soil"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="farm-soil"
              placeholder="Enter Soil Type"
              value={newFarm.soilType || ''}
              onChange={(e) =>
                setNewFarm((prev) => ({ ...prev, soilType: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              
            />
          </div>
          <div>
            <label
              htmlFor="water-level"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Soil Water Level
            </label>
            <input
              id="water-level"
              placeholder="Enter water level"
              value={newFarm.soilWaterLevel}
              onChange={(e) =>
                setNewFarm((prev) => ({ ...prev, soilWaterLevel: parseFloat(e.target.value) }))
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
             <div>
            <label
              htmlFor="farm-temperature"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Temperature
            </label>
            <input
              id="farm-temperature"
              placeholder="Enter temperature"
              value={newFarm.temperature || ''}
              onChange={(e) =>
                setNewFarm((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
            <div>
            <label
              htmlFor="farm-humidity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Humidity
            </label>
            <input
              id="farm-humidity"
              placeholder="Enter humidity"
              value={newFarm.humidity || ''}
              onChange={(e) =>
                setNewFarm((prev) => ({ ...prev, humidity: parseFloat(e.target.value) }))
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
           <div>
            <label
              htmlFor="farm-crop"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Crop
            </label>
            <input
              id="farm-crop"
              placeholder="Enter Crop"
              value={newFarm.cropID}
              onChange={(e) =>
                setNewFarm((prev) => ({ ...prev, cropID: parseInt(e.target.value) }))
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
   
       
          <div>
            <label
              htmlFor="farm-image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image
            </label>
            <input
              id="farm-image"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setFarmImage(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
   
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add Farm
            </button>
          </div>
        </form>
      </div>

      <table className="w-full border-collapse" aria-label="Crop management table">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Soil Type</th>
            <th className="border p-2">Soil Water Level</th>
            <th className="border p-2">Temperature</th>
            <th className="border p-2">Humidity</th>
            <th className="border p-2">Crop</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Actions</th>

          </tr>
        </thead>
        <tbody>
          {farms.map((c) =>
            editingFarm?.id === c.id ? (
              <tr key={c.id} className="border">
                <td colSpan={8} className="p-4">
                  <form
                    onSubmit={(e) => updateFarm(e, editingFarm)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label
                        htmlFor={`edit-farm-soil-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Soil Type 
                      </label>
                      <input
                        id={`edit-farm-soil-${c.id}`}
                        placeholder="Enter soil type"
                        value={editingFarm.soilType || ''}
                        onChange={(e) =>
                          setEditingFarm((prev) =>
                            prev ? { ...prev, soilType: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-farm-level-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Water Level
                      </label>
                      <input
                        id={`edit-farm-level-${c.id}`}
                        placeholder="Enter Water Level"
                        value={editingFarm.soilWaterLevel || ''}
                        onChange={(e) =>
                          setEditingFarm((prev) =>
                            prev ? { ...prev, soilWaterLevel: parseFloat(e.target.value) } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-farm-temp-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Temperature
                      </label>
                      <input
                        id={`edit-farm-temp-${c.id}`}
                        placeholder="Enter Temperature"
                        value={editingFarm.temperature || ''}
                        onChange={(e) =>
                          setEditingFarm((prev) =>
                            prev ? { ...prev, temperature: parseFloat(e.target.value) } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                 
                     <div>
                      <label
                        htmlFor={`edit-farm-humidity-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Humidity
                      </label>
                      <input
                        id={`edit-farm-humidity-${c.id}`}
                        placeholder="Enter Humidity"
                        value={editingFarm.humidity || ''}
                        onChange={(e) =>
                          setEditingFarm((prev) =>
                            prev ? { ...prev, humidity: parseFloat(e.target.value) } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>    
                        <div>
                      <label
                        htmlFor={`edit-farm-crop-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Crop
                      </label>
                      <input
                        id={`edit-farm-crop-${c.id}`}
                        placeholder="Enter Crop"
                        value={editingFarm.cropID || ''}
                        onChange={(e) =>
                          setEditingFarm((prev) =>
                            prev ? { ...prev, cropID: parseInt(e.target.value) } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>    

               
                    <div>
                      <label
                        htmlFor={`edit-farm-image-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Image
                      </label>
                      <input
                        id={`edit-farm-image-${c.id}`}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => setFarmImage(e.target.files?.[0] || null)}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                      {editingFarm.farmImageUrl && (
                        <img
                          src={`${apiBaseUrl}${editingFarm.farmImageUrl}`}
                          alt={editingFarm.farmImageUrl}
                          className="mt-2 h-16 w-16 object-cover rounded"
                        />
                      )}
                    </div>
               
                    <div className="md:col-span-2 flex gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingFarm(null);
                          setFarmImage(null);
                        }}
                        disabled={loading}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </td>
              </tr>
            ) : (
              <tr key={c.id} className="border">
                <td className="border p-2">{c.id}</td>
                <td className="border p-2">{c.soilType}</td>
                <td className="border p-2">{c.soilWaterLevel || ''}</td>
                <td className="border p-2">{c.temperature || ''}</td>
                <td className="border p-2">{c.humidity || ''}</td>
                <td className="border p-2">{c.cropID || ''}</td>

                <td className="border p-2">
                  {c.farmImageUrl ? (
                    <img
                      src={`${apiBaseUrl}${c.farmImageUrl}`}
                      alt={c.farmImageUrl}
                      onClick={() => setModalImageUrl(`${apiBaseUrl}${c.farmImageUrl}`)}
                      className="h-12 w-12 object-cover rounded cursor-pointer"
                    />
                  ) : (
                    'No image'
                  )}
                </td>
          
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => setEditingFarm(c)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    disabled={loading}
                  >
                    🖌️ Edit
                  </button>
                  <button
                    onClick={() => deleteFarm(c.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                    disabled={loading}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      {modalImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setModalImageUrl(null)}
        >
          <div
            className="bg-white p-4 rounded shadow-lg max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()} // prevents modal from closing on image click
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

    </>
    
  );
};

export default FarmAdminDashboard;