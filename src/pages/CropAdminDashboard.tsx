import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

interface Crop {
  id: number;
  name: string;
  type: string | null;
  season: string | null;
  imageUrl: string | null;
  unit: string | null;
  pricePerUnit: number | null;
  notes: string | null;
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

  // Fetch Crops
  const fetchCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
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
    if (!newCrop.name) {
      setError('Crop name is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const formData = new FormData();
      formData.append('name', newCrop.name || '');
      if (newCrop.type) formData.append('type', newCrop.type);
      if (newCrop.season) formData.append('season', newCrop.season);
      if (newCrop.unit) formData.append('unit', newCrop.unit);
      if (newCrop.pricePerUnit)
        formData.append('pricePerUnit', newCrop.pricePerUnit.toString());
      if (newCrop.notes) formData.append('notes', newCrop.notes);
      if (cropImage) formData.append('image', cropImage);
      await axios.post(`${apiBaseUrl}/api/admin/crops`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
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
    if (!crop.name) {
      setError('Crop name is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const formData = new FormData();
      formData.append('name', crop.name || '');
      if (crop.type) formData.append('type', crop.type);
      if (crop.season) formData.append('season', crop.season);
      if (crop.unit) formData.append('unit', crop.unit);
      if (crop.pricePerUnit)
        formData.append('pricePerUnit', crop.pricePerUnit.toString());
      if (crop.notes) formData.append('notes', crop.notes);
      if (cropImage) formData.append('image', cropImage);
      await axios.patch(`${apiBaseUrl}/api/admin/crops/${crop.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
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
              value={newCrop.name || ''}
              onChange={(e) =>
                setNewCrop((prev) => ({ ...prev, name: e.target.value }))
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
              value={newCrop.type || ''}
              onChange={(e) =>
                setNewCrop((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="crop-season"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Season
            </label>
            <input
              id="crop-season"
              placeholder="Enter season"
              value={newCrop.season || ''}
              onChange={(e) =>
                setNewCrop((prev) => ({ ...prev, season: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="crop-unit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Unit
            </label>
            <input
              id="crop-unit"
              placeholder="Enter unit (e.g., kg)"
              value={newCrop.unit || ''}
              onChange={(e) =>
                setNewCrop((prev) => ({ ...prev, unit: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="crop-price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price per Unit
            </label>
            <input
              id="crop-price"
              type="number"
              step="0.01"
              placeholder="Enter price per unit"
              value={newCrop.pricePerUnit ?? ''}
              onChange={(e) =>
                setNewCrop((prev) => ({
                  ...prev,
                  pricePerUnit: e.target.value ? parseFloat(e.target.value) : null,
                }))
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
            <label
              htmlFor="crop-notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes
            </label>
            <textarea
              id="crop-notes"
              placeholder="Enter notes"
              value={newCrop.notes || ''}
              onChange={(e) =>
                setNewCrop((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
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
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Season</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Unit</th>
            <th className="border p-2">Price/Unit</th>
            <th className="border p-2">Notes</th>
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
                        htmlFor={`edit-crop-name-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`edit-crop-name-${c.id}`}
                        placeholder="Enter crop name"
                        value={editingCrop.name || ''}
                        onChange={(e) =>
                          setEditingCrop((prev) =>
                            prev ? { ...prev, name: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-crop-type-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Type
                      </label>
                      <input
                        id={`edit-crop-type-${c.id}`}
                        placeholder="Enter crop type"
                        value={editingCrop.type || ''}
                        onChange={(e) =>
                          setEditingCrop((prev) =>
                            prev ? { ...prev, type: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-crop-season-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Season
                      </label>
                      <input
                        id={`edit-crop-season-${c.id}`}
                        placeholder="Enter season"
                        value={editingCrop.season || ''}
                        onChange={(e) =>
                          setEditingCrop((prev) =>
                            prev ? { ...prev, season: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-crop-unit-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Unit
                      </label>
                      <input
                        id={`edit-crop-unit-${c.id}`}
                        placeholder="Enter unit (e.g., kg)"
                        value={editingCrop.unit || ''}
                        onChange={(e) =>
                          setEditingCrop((prev) =>
                            prev ? { ...prev, unit: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-crop-price-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Price per Unit
                      </label>
                      <input
                        id={`edit-crop-price-${c.id}`}
                        type="number"
                        step="0.01"
                        placeholder="Enter price per unit"
                        value={editingCrop.pricePerUnit ?? ''}
                        onChange={(e) =>
                          setEditingCrop((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  pricePerUnit: e.target.value
                                    ? parseFloat(e.target.value)
                                    : null,
                                }
                              : prev
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
                      {editingCrop.imageUrl && (
                        <img
                          src={`${apiBaseUrl}${editingCrop.imageUrl}`}
                          alt={editingCrop.name}
                          className="mt-2 h-16 w-16 object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor={`edit-crop-notes-${c.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Notes
                      </label>
                      <textarea
                        id={`edit-crop-notes-${c.id}`}
                        placeholder="Enter notes"
                        value={editingCrop.notes || ''}
                        onChange={(e) =>
                          setEditingCrop((prev) =>
                            prev ? { ...prev, notes: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                      />
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
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">{c.type || ''}</td>
                <td className="border p-2">{c.season || ''}</td>
                <td className="border p-2">
                  {c.imageUrl ? (
                    <img
                      src={`${apiBaseUrl}${c.imageUrl}`}
                      alt={c.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    'No image'
                  )}
                </td>
                <td className="border p-2">{c.unit || ''}</td>
                <td className="border p-2">
                  {c.pricePerUnit ? `$${c.pricePerUnit.toFixed(2)}` : ''}
                </td>
                <td className="border p-2">{c.notes || ''}</td>
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
    </>
  );
};

export default CropAdminDashboard;