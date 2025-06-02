import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

interface Query {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  apiBaseUrl: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

const QueryAdminDashboard: React.FC<Props> = ({ apiBaseUrl, loading, setLoading, setError, setSuccess }) => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [editingQuery, setEditingQuery] = useState<Query | null>(null);

  // Fetch Queries
  const fetchQueries = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const res = await axios.get(`${apiBaseUrl}/api/admin/list/queries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setQueries(res.data);
      } else {
        setError('Invalid data format received from server.');
      }
    } catch (err) {
      handleAxiosError(err, 'Failed to fetch queries');
    } finally {
      setLoading(false);
    }
  };

  // Update Query
  const updateQuery = async (e: React.FormEvent, query: Query) => {
    e.preventDefault();
    if (!query.status) {
      setError('Query status is required.');
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
      const payload = {
        email: query.email,
        message: query.message,
        status: query.status,
      };
      await axios.patch(`${apiBaseUrl}/api/admin/query/${query.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSuccess('Query updated successfully!');
      setEditingQuery(null);
      await fetchQueries();
    } catch (err) {
      handleAxiosError(err, 'Failed to update query');
    } finally {
      setLoading(false);
    }
  };

  // Delete Query
  const deleteQuery = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      await axios.delete(`${apiBaseUrl}/api/admin/query/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Query deleted successfully!');
      await fetchQueries();
    } catch (err) {
      handleAxiosError(err, 'Failed to delete query');
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
    fetchQueries();
  }, []);

  return (
    <table className="w-full border-collapse" aria-label="Queries management table">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">ID</th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Message</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Created</th>
          <th className="border p-2">Updated</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {queries.map((c) =>
          editingQuery?.id === c.id ? (
            <tr key={c.id} className="border">
              <td colSpan={8} className="p-4">
                <form
                  onSubmit={(e) => updateQuery(e, editingQuery)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="md:col-span-2">
                    <label
                      htmlFor={`edit-query-status-${c.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Status
                    </label>
                    <textarea
                      id={`edit-query-status-${c.id}`}
                      placeholder="Enter status"
                      value={editingQuery.status || ''}
                      onChange={(e) =>
                        setEditingQuery((prev) =>
                          prev ? { ...prev, status: e.target.value } : prev
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
                      onClick={() => setEditingQuery(null)}
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
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">{c.email || ''}</td>
                <td className="border p-2">{c.message || ''}</td>
                <td className="border p-2">{c.status || ''}</td>
                <td className="border p-2">{c.created_at || ''}</td>
                <td className="border p-2">{c.updated_at || ''}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => setEditingQuery(c)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                    disabled={loading}
                  >
                    🖌️ Edit
                  </button>
                  <button
                    onClick={() => deleteQuery(c.id)}
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
    );
};

export default QueryAdminDashboard;