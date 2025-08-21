import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

const AdminDashboard = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchContent = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/content');
      setContent(res.data);
    } catch (err) {
      setError('Failed to fetch content.');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/content/${id}/approve`);
      setContent(content.map(item => (item._id === id ? { ...item, status: 'approved' } : item)));
    } catch (err) {
      console.error('Failed to approve content', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/content/${id}/reject`);
      setContent(content.map(item => (item._id === id ? { ...item, status: 'rejected' } : item)));
    } catch (err) {
      console.error('Failed to reject content', err);
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-700">All Content Submissions</h1>
      {loading ? (
        <p className="text-center text-gray-600 animate-pulse text-lg">Loading content submissions...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      ) : content.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-2xl shadow-md border border-indigo-100">
          <h2 className="text-2xl font-semibold text-gray-800">No content has been submitted yet.</h2>
          <p className="mt-2 text-gray-600">There is nothing to review currently.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-indigo-100">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {content.map(item => (
                <tr key={item._id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 whitespace-normal text-gray-900 font-medium">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.createdBy?.email || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`capitalize px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'approved' ? 'bg-green-100 text-green-800' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {item.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApprove(item._id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(item._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500 italic text-sm">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;

