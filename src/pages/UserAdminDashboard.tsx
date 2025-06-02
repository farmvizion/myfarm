import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

interface User {
  id: number;
  email: string;
  name: string;
  location: string;
  userType: string;
  role: string;
  phone?: string;
}

interface Props {
  apiBaseUrl: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

const countryOptions = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
];

const UserAdminDashboard: React.FC<Props> = ({ apiBaseUrl, loading, setLoading, setError, setSuccess }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Partial<User> & { countryCode?: string }>({
    countryCode: "+91", // Default to India
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCountryCode, setEditingCountryCode] = useState("+91"); // Default for edit form

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const res = await axios.get(`${apiBaseUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setError('Invalid data format received from server.');
      }
    } catch (err) {
      handleAxiosError(err, 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Create User
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.name || !password) {
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
      const payload: Partial<User> & { password: string } = {
        email: newUser.email,
        name: newUser.name,
        location: newUser.location,
        userType: newUser.userType,
        role: newUser.role,
        password,
      };
      if (newUser.phone && newUser.countryCode) {
        payload.phone = `${newUser.countryCode}${newUser.phone}`;
      }
      await axios.post(`${apiBaseUrl}/api/admin/users`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('User created successfully!');
      setNewUser({ countryCode: "+91" });
      setPassword('');
      await fetchUsers();
    } catch (err) {
      handleAxiosError(err, 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Update User
  const updateUser = async (e: React.FormEvent, user: User) => {
    e.preventDefault();
    if (!user.email || !user.name) {
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
      const payload: Partial<User> = {
        email: user.email,
        name: user.name,
        location: user.location,
        userType: user.userType,
        role: user.role,
      };
      if (user.phone && editingCountryCode) {
        payload.phone = `${editingCountryCode}${user.phone}`;
      } else {
        payload.phone = undefined;
      }
      await axios.patch(`${apiBaseUrl}/api/admin/users/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('User updated successfully!');
      setEditingUser(null);
      setEditingCountryCode("+91");
      await fetchUsers();
    } catch (err) {
      handleAxiosError(err, 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const deleteUser = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      await axios.delete(`${apiBaseUrl}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('User deleted successfully!');
      await fetchUsers();
    } catch (err) {
      handleAxiosError(err, 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const resetPassword = async (id: number) => {
    const newPassword = prompt('Enter new password (minimum 8 characters):');
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
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
      await axios.post(
        `${apiBaseUrl}/api/admin/users/${id}/reset-password`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('Password reset successfully!');
    } catch (err) {
      handleAxiosError(err, 'Failed to reset password');
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
  const handleEditUser = (user: User) => {
    if (user.phone) {
      // Find matching country code
      const matchedCode = countryOptions.find((option) =>
        user.phone!.startsWith(option.code)
      );
      setEditingCountryCode(matchedCode ? matchedCode.code : "+91");
      setEditingUser({
        ...user,
        phone: matchedCode ? user.phone.replace(matchedCode.code, '') : user.phone,
      });
    } else {
      setEditingCountryCode("+91");
      setEditingUser(user);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New User</h3>
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
              type="email"
              placeholder="Enter email"
              value={newUser.email || ''}
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
              type="text"
              placeholder="Enter name"
              value={newUser.name || ''}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="user-phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mobile Number
            </label>
            <div className="flex space-x-2">
              <select
                id="user-phone-select"
                value={newUser.countryCode || '+91'}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, countryCode: e.target.value }))
                }
                className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countryOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.flag} {option.code}
                  </option>
                ))}
              </select>
              <input
                id="user-phone-input"
                type="tel"
                placeholder="Enter mobile number (optional)"
                value={newUser.phone || ''}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              type="text"
              placeholder="Enter location"
              value={newUser.location || ''}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, location: e.target.value }))
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
              value={newUser.userType || ''}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, userType: e.target.value }))
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
              value={newUser.role || ''}
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
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-9 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? 'Hide' : 'Show'}
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

      <table className="w-full border-collapse" aria-label="User management table">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Email</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) =>
            editingUser?.id === u.id ? (
              <tr key={u.id} className="border">
                <td colSpan={5} className="p-4">
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
                        type="email"
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
                        htmlFor={`edit-user-phone-${u.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Mobile Number
                      </label>
                      <div className="flex space-x-2">
                        <select
                          id={`edit-user-phone-select-${u.id}`}
                          value={editingCountryCode}
                          onChange={(e) => setEditingCountryCode(e.target.value)}
                          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {countryOptions.map((option) => (
                            <option key={option.code} value={option.code}>
                              {option.flag} {option.code}
                            </option>
                          ))}
                        </select>
                        <input
                          id={`edit-user-phone-input-${u.id}`}
                          type="tel"
                          placeholder="Enter mobile number (optional)"
                          value={editingUser.phone || ''}
                          onChange={(e) =>
                            setEditingUser((prev) =>
                              prev ? { ...prev, phone: e.target.value } : prev
                            )
                          }
                          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
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
                        type="text"
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
                        type="text"
                        placeholder="Enter location"
                        value={editingUser.location || ''}
                        onChange={(e) =>
                          setEditingUser((prev) =>
                            prev ? { ...prev, location: e.target.value } : prev
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
                            prev ? { ...prev, userType: e.target.value } : prev
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
                        onClick={() => {
                          setEditingUser(null);
                          setEditingCountryCode("+91");
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
              <tr key={u.id} className="border">
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.name}</td>
                <td className="border p-2">{u.phone || 'N/A'}</td>
                <td className="border p-2">{u.role}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEditUser(u)}
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
                    🗑️ Delete
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
  );
};

export default UserAdminDashboard;