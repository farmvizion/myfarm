import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

/*

    deviceID: '709db414-1263-4fe8-9678-fa8d1c11fad4',
    name: 'Device-1',
    allocated: null,
    status: 'active',
    userID: null,
    farmID: null

*/


interface Device {
  id: number;
  deviceID: string;
  name: string;
  allocated: string;
  status: string;
  userID:any;
  farmID:any
}

interface Props {
  apiBaseUrl: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}


const DeviceAdminDashboard: React.FC<Props> = ({ apiBaseUrl, loading, setLoading, setError, setSuccess }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  // Fetch Users
  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const res = await axios.get(`${apiBaseUrl}/api/admin/devices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //console.log(res);
      if (Array.isArray(res.data)) {
        setDevices(res.data);
      } else {
        setError('Invalid data format received from server.');
      }
    } catch (err) {
      handleAxiosError(err, 'Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };


  // Update Device
  const updateDevice = async (e: React.FormEvent, device: Device) => {
    e.preventDefault();
    if (!device.deviceID || !device.name) {
      setError('Please fill in all required fields.');
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
      const payload: Partial<Device> = {
        id:device.id,
        deviceID: device.deviceID,
        name: device.name,
        allocated: device.allocated,
        status: device.status      };

      await axios.patch(`${apiBaseUrl}/api/admin/device/${device.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Device updated successfully!');
      setEditingDevice(null);
      await fetchDevices();
    } catch (err) {
      handleAxiosError(err, 'Failed to update device');
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const deleteDevice = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      await axios.delete(`${apiBaseUrl}/api/admin/device/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Device deleted successfully!');
      await fetchDevices();
    } catch (err) {
      handleAxiosError(err, 'Failed to delete device');
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

  // Initialize edit form with mobile and country code
  const handleEditDevice = (device: Device) => {

    setEditingDevice(device);
    
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
     <>
    
      <table className="w-full border-collapse" aria-label="Device management table">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Device ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Allocated</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Farm</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>

          </tr>
        </thead>
        <tbody>
          {devices.map((c) =>
            editingDevice?.deviceID === c.deviceID ? (
              <tr key={c.deviceID} className="border">
                <td colSpan={8} className="p-4">
                  <form
                    onSubmit={(e) => updateDevice(e, editingDevice)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label
                        htmlFor={`edit-device-id-${c.deviceID}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Device ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`edit-device-id-${c.deviceID}`}
                        placeholder="Enter Device ID"
                        value={editingDevice.deviceID || ''}
                        onChange={(e) =>
                          setEditingDevice((prev) =>
                            prev ? { ...prev, deviceID: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-device-name-${c.name}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name  <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`edit-device-name-${c.name}`}
                        placeholder="Enter device name"
                        value={editingDevice.name || ''}
                        onChange={(e) =>
                          setEditingDevice((prev) =>
                            prev ? { ...prev, name: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`edit-device-allocated-${c.allocated}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Allocation
                      </label>
                      <select
                        id={`edit-device-allocated-${c.allocated}`}
                        value={editingDevice.allocated || ''}
                        onChange={(e) =>
                          setEditingDevice((prev) =>
                            prev ? { ...prev, allocated: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Allocation</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                        <div>
                      <label
                        htmlFor={`edit-device-user-id-${c.userID}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        User 
                      </label>
                      <input
                        id={`edit-device-user-id-${c.userID}`}
                        placeholder="Enter User ID"
                        value={editingDevice.userID || ''}
                        onChange={(e) =>
                          setEditingDevice((prev) =>
                            prev ? { ...prev, userID: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        
                      />
                    </div>
                      <div>
                      <label
                        htmlFor={`edit-device-farm-id-${c.farmID}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Farm 
                      </label>
                      <input
                        id={`edit-device-farm-id-${c.farmID}`}
                        placeholder="Enter Farm ID"
                        value={editingDevice.farmID || ''}
                        onChange={(e) =>
                          setEditingDevice((prev) =>
                            prev ? { ...prev, farmID: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`edit-device-status-${c.status}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Status
                      </label>
                      <select
                        id={`edit-device-status-${c.status}`}
                        value={editingDevice.status || ''}
                        onChange={(e) =>
                          setEditingDevice((prev) =>
                            prev ? { ...prev, status: e.target.value } : prev
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Deprovisioned">Deprovisioned</option>
                      </select>
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
                          setEditingDevice(null);
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
              <tr key={c.deviceID} className="border">
                <td className="border p-2">{c.id}</td>
                <td className="border p-2">{c.deviceID}</td>
                <td className="border p-2">{c.name || ''}</td>
                <td className="border p-2">{c.allocated || ''}</td>
                <td className="border p-2">{c.userID || ''}</td>
                <td className="border p-2">{c.farmID || ''}</td>
                <td className="border p-2">{c.status || ''}</td>
                
                
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEditDevice(c)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    disabled={loading}
                  >
                    🖌️ Edit
                  </button>
                    <button
                    onClick={() => deleteDevice(c.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                    disabled={loading}
                  >
                    🖌️ Unlink
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

export default DeviceAdminDashboard;