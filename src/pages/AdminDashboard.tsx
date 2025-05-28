import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";

// Define environment variable for API base URL
const API_BASE_URL = "http://localhost:3000";

interface User {
  id: number;
  email: string;
  name: string;
  location: string;
  userType: string;
  role: string;
}

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

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [newCrop, setNewCrop] = useState<Partial<Crop>>({});
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [cropImage, setCropImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "crops">("users");
  const { logout } = useAuth();

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setError("Invalid data format received from server.");
      }
    } catch (err) {
      handleAxiosError(err, "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Crops
  const fetchCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      const res = await axios.get(`${API_BASE_URL}/api/admin/crops`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setCrops(res.data);
      } else {
        setError("Invalid data format received from server.");
      }
    } catch (err) {
      handleAxiosError(err, "Failed to fetch crops");
    } finally {
      setLoading(false);
    }
  };

  // Create User
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.name || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      await axios.post(
        `${API_BASE_URL}/api/admin/users`,
        { ...newUser, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("User created successfully!");
      setNewUser({});
      setPassword("");
      await fetchUsers();
    } catch (err) {
      handleAxiosError(err, "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // Create Crop
  const createCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop.name) {
      setError("Crop name is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      const formData = new FormData();
      formData.append("name", newCrop.name || "");
      if (newCrop.type) formData.append("type", newCrop.type);
      if (newCrop.season) formData.append("season", newCrop.season);
      if (newCrop.unit) formData.append("unit", newCrop.unit);
      if (newCrop.pricePerUnit)
        formData.append("pricePerUnit", newCrop.pricePerUnit.toString());
      if (newCrop.notes) formData.append("notes", newCrop.notes);
      if (cropImage) {
        formData.append("image", cropImage);
      }
      await axios.post(`${API_BASE_URL}/api/admin/crops`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Crop created successfully!");
      setNewCrop({});
      setCropImage(null);
      await fetchCrops();
    } catch (err) {
      handleAxiosError(err, "Failed to create crop");
    } finally {
      setLoading(false);
    }
  };

  // Update User
  const updateUser = async (e: React.FormEvent, user: User) => {
    e.preventDefault();
    if (!user.email || !user.name) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      await axios.patch(
        `${API_BASE_URL}/api/admin/users/${user.id}`,
        {
          email: user.email,
          name: user.name,
          location: user.location,
          userType: user.userType,
          role: user.role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("User updated successfully!");
      setEditingUser(null);
      await fetchUsers();
    } catch (err) {
      handleAxiosError(err, "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // Update Crop
  const updateCrop = async (e: React.FormEvent, crop: Crop) => {
    e.preventDefault();
    if (!crop.name) {
      setError("Crop name is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      const formData = new FormData();
      formData.append("name", crop.name || "");
      if (crop.type) formData.append("type", crop.type);
      if (crop.season) formData.append("season", crop.season);
      if (crop.unit) formData.append("unit", crop.unit);
      if (crop.pricePerUnit)
        formData.append("pricePerUnit", crop.pricePerUnit.toString());
      if (crop.notes) formData.append("notes", crop.notes);
      if (cropImage) {
        formData.append("image", cropImage);
      }
      await axios.patch(
        `${API_BASE_URL}/api/admin/crops/${crop.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess("Crop updated successfully!");
      setEditingCrop(null);
      setCropImage(null);
      await fetchCrops();
    } catch (err) {
      handleAxiosError(err, "Failed to update crop");
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const deleteUser = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("User deleted successfully!");
      await fetchUsers();
    } catch (err) {
      handleAxiosError(err, "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Delete Crop
  const deleteCrop = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      await axios.delete(`${API_BASE_URL}/api/admin/crops/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Crop deleted successfully!");
      await fetchCrops();
    } catch (err) {
      handleAxiosError(err, "Failed to delete crop");
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (id: number) => {
    const newPassword = prompt("Enter new password (minimum 8 characters):");
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }
      await axios.post(
        `${API_BASE_URL}/api/admin/users/${id}/reset-password`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Password reset successfully!");
    } catch (err) {
      handleAxiosError(err, "Failed to reset password");
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
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchCrops();
    }
  }, [activeTab]);

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
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "users"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("crops")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "crops"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Crops
        </button>
      </div>

      {/* Users Section */}
      {activeTab === "users" && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Add New User
            </h3>
            <form
              onSubmit={createUser}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label
                  htmlFor="user-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="user-email"
                  placeholder="Enter email"
                  value={newUser.email || ""}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="user-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="user-name"
                  placeholder="Enter name"
                  value={newUser.name || ""}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="user-location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  id="user-location"
                  placeholder="Enter location"
                  value={newUser.location || ""}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="user-type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  User Type
                </label>
                <select
                  id="user-type"
                  value={newUser.userType || ""}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      userType: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select user type
                  </option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="user-role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="user-role"
                  value={newUser.role || ""}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="relative">
                <label
                  htmlFor="user-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="user-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-9 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>

          <table
            className="w-full border-collapse"
            aria-label="User management table"
          >
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Email</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) =>
                editingUser?.id === u.id ? (
                  <tr key={u.id} className="border">
                    <td colSpan={4} className="p-4">
                      <form
                        onSubmit={(e) => updateUser(e, editingUser)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <label
                            htmlFor={`edit-user-email-${u.id}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            id={`edit-user-email-${u.id}`}
                            placeholder="Enter email"
                            value={editingUser.email}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, email: e.target.value } : prev
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`edit-user-name-${u.id}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id={`edit-user-name-${u.id}`}
                            placeholder="Enter name"
                            value={editingUser.name}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, name: e.target.value } : prev
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`edit-user-location-${u.id}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Location
                          </label>
                          <input
                            id={`edit-user-location-${u.id}`}
                            placeholder="Enter location"
                            value={editingUser.location}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev
                                  ? { ...prev, location: e.target.value }
                                  : prev
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`edit-user-type-${u.id}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            User Type
                          </label>
                          <select
                            id={`edit-user-type-${u.id}`}
                            value={editingUser.userType}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev
                                  ? { ...prev, userType: e.target.value }
                                  : prev
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="" disabled>
                              Select user type
                            </option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor={`edit-user-role-${u.id}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Role
                          </label>
                          <select
                            id={`edit-user-role-${u.id}`}
                            value={editingUser.role}
                            onChange={(e) =>
                              setEditingUser((prev) =>
                                prev ? { ...prev, role: e.target.value } : prev
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="" disabled>
                              Select role
                            </option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
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
                            onClick={() => setEditingUser(null)}
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
                  <tr key={u.id} className="border">
                    <td className="border p-2">{u.email}</td>
                    <td className="border p-2">{u.name}</td>
                    <td className="border p-2">{u.role}</td>
                    <td className="border p-2 flex gap-2">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                        disabled={loading}
                      >
                        🖌️ Edit
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                        disabled={loading}
                      >
                        🗑 Delete
                      </button>
                      <button
                        onClick={() => resetPassword(u.id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
                        disabled={loading}
                      >
                        🔑 Reset
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </>
      )}

      {/* Crops Section */}
      {activeTab === "crops" && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Add New Crop
            </h3>
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
                  value={newCrop.name || ""}
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
                  value={newCrop.type || ""}
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
                  value={newCrop.season || ""}
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
                  value={newCrop.unit || ""}
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
                  value={newCrop.pricePerUnit ?? ""}
                  onChange={(e) =>
                    setNewCrop((prev) => ({
                      ...prev,
                      pricePerUnit: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
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
                  value={newCrop.notes || ""}
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

          <table
            className="w-full border-collapse"
            aria-label="Crop management table"
          >
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
                            value={editingCrop.name || ""}
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
                            value={editingCrop.type || ""}
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
                            value={editingCrop.season || ""}
                            onChange={(e) =>
                              setEditingCrop((prev) =>
                                prev
                                  ? { ...prev, season: e.target.value }
                                  : prev
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
                            value={editingCrop.unit || ""}
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
                            value={editingCrop.pricePerUnit ?? ""}
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
                            onChange={(e) =>
                              setCropImage(e.target.files?.[0] || null)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2"
                          />
                          {editingCrop.imageUrl && (
                            <img
                              src={`${API_BASE_URL}${editingCrop.imageUrl}`}
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
                            value={editingCrop.notes || ""}
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
                    <td className="border p-2">{c.type || ""}</td>
                    <td className="border p-2">{c.season || ""}</td>
                    <td className="border p-2">
                      {c.imageUrl ? (
                        <img
                          src={`${API_BASE_URL}${c.imageUrl}`}
                          alt={c.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td className="border p-2">{c.unit || ""}</td>
                    <td className="border p-2">
                      {c.pricePerUnit ? `$${c.pricePerUnit.toFixed(2)}` : ""}
                    </td>
                    <td className="border p-2">{c.notes || ""}</td>
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
      )}
    </div>
  );
};

export default AdminDashboard;
