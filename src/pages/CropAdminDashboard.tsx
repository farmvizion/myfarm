import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';

interface Crop {
  id: number;
  cropName: string;
  cropType: string | null;
  cropImageUrl: string | null;
}

interface Props {
  apiBaseUrl: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

const CropAdminDashboard: React.FC<Props> = ({ apiBaseUrl, loading, setLoading, setError, setSuccess }) => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [newCrop, setNewCrop] = useState<Partial<Crop>>({});
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [cropImage, setCropImage] = useState<File | null>(null);
  const { user, token } = useAuth();
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  

  // Fetch Crops
  const fetchCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const res = await axios.get(`${apiBaseUrl}/api/admin/crops`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setCrops(res.data);
      } else {
        setError('Invalid data format received from server.');
      }
    } catch (err) {
      handleAxiosError(err, 'Failed to fetch crops');
    } finally {
      setLoading(false);
    }
  };

  // Create Crop
  const createCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop.cropName) {
      setError('Crop name is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const formData = new FormData();
      formData.append('cropName', newCrop.cropName || '');
      if (newCrop.cropType) formData.append('cropType', newCrop.cropType);
      if (newCrop.cropImageUrl) formData.append('cropImageUrl', newCrop.cropImageUrl);
      await axios.post(`${apiBaseUrl}/api/admin/crops`, formData, {
        headers: {
          Authorization: `Bearer ${token}`},
      });
      setSuccess('Crop created successfully!');
      setNewCrop({});
      setCropImage(null);
      await fetchCrops();
    } catch (err) {
      handleAxiosError(err, 'Failed to create crop');
    } finally {
      setLoading(false);
    }
  };

  // Update Crop
  const updateCrop = async (e: React.FormEvent, crop: Crop) => {
    e.preventDefault();
    if (!crop.cropName) {
      setError('Crop name is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const formData = new FormData();
    
      formData.append('cropName', crop.cropName || '');
      if (crop.cropType) formData.append('cropType', crop.cropType);
      if (cropImage) formData.append('cropImageUrl', cropImage); // ✅ match backend


      await axios.patch(`${apiBaseUrl}/api/admin/crops/${crop.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setSuccess('Crop updated successfully!');
      setEditingCrop(null);
      setCropImage(null);
      await fetchCrops();
    } catch (err) {
      handleAxiosError(err, 'Failed to update crop');
    } finally {
      setLoading(false);
    }
  };

  // Delete Crop
  const deleteCrop = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      await axios.delete(`${apiBaseUrl}/api/admin/crops/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Crop deleted successfully!');
      await fetchCrops();
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
    fetchCrops();
  }, []);

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Crop</h3>
        <form
          onSubmit={createCrop}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label
              htmlFor="crop-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="crop-name"
              placeholder="Enter crop name"
              value={newCrop.cropName || ''}
              onChange={(e) =>
                setNewCrop((prev) => ({ ...prev, cropName: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="crop-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Type
            </label>
            <input
              id="crop-type"
              placeholder="Enter crop type"
              value={newCrop.cropType || ''}
              onChange={(e) =>
                setNewCrop((prev) => ({ ...prev, cropType: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
   
       
          <div>
            <label
              htmlFor="crop-image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image
            </label>
            <input
              id="crop-image"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setCropImage(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
   
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add Crop
            </button>
          </div>
        </form>
      </div>

      <table className="w-full border-collapse" aria-label="Crop management table">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {crops.map((c) =>
            editingCrop?.id === c.id ? (
              <tr key={c.id} className="border">
                <td colSpan={8} className="p-4">
                  <form
                    onSubmit={(e) => updateCrop(e, editingCrop)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label
                        htmlFor={`edit-crop-name-${c.cropName}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`edit-crop-name-${c.cropName}`}
                        placeholder="Enter crop name"
                        value={editingCrop.cropName || ''}
                        onChange={(e) =>
                          setEditingCrop((prev) =>
                            prev ? { ...prev, cropName: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-crop-type-${c.cropType}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Type
                      </label>
                      <input
                        id={`edit-crop-type-${c.cropType}`}
                        placeholder="Enter crop type"
                        value={editingCrop.cropType || ''}
                        onChange={(e) =>
                          setEditingCrop((prev) =>
                            prev ? { ...prev, cropType: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
             
               
                    <div>
                      <label
                        htmlFor={`edit-crop-image-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Image
                      </label>
                      <input
                        id={`edit-crop-image-${c.id}`}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => setCropImage(e.target.files?.[0] || null)}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                      {editingCrop.cropImageUrl && (
                        <img
                          src={`${apiBaseUrl}${editingCrop.cropImageUrl}`}
                          alt={editingCrop.cropImageUrl}
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
                          setEditingCrop(null);
                          setCropImage(null);
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
                <td className="border p-2">{c.cropName}</td>
                <td className="border p-2">{c.cropType || ''}</td>
                <td className="border p-2">
                  {c.cropImageUrl ? (
                  <img
                      src={`${apiBaseUrl}${c.cropImageUrl}`}
                      alt={c.cropImageUrl}
                      onClick={() => setModalImageUrl(`${apiBaseUrl}${c.cropImageUrl}`)}
                      className="h-12 w-12 object-cover rounded cursor-pointer"
                    />
                  ) : (
                    'No image'
                  )}
                </td>
          
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => setEditingCrop(c)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    disabled={loading}
                  >
                    🖌️ Edit
                  </button>
                  <button
                    onClick={() => deleteCrop(c.id)}
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

export default CropAdminDashboard;