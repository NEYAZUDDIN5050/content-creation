import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';

const UserDashboard = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/content');
        setContent(res.data);
      } catch (err) {
        setError('Failed to fetch content.');
        console.error(err);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-indigo-700">My Content</h1>
        <Link
          to="/submit"
          className="inline-block bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Submit New Content
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 text-lg animate-pulse">Loading your content...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-medium">{error}</p>
      ) : content.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-2xl shadow-md border border-indigo-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">No content submitted yet!</h2>
          <p className="text-gray-600 mb-6">Start creating amazing content now.</p>
          <Link
            to="/submit"
            className="inline-block bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Submit New Content
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-indigo-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {content.map((item) => (
                <tr key={item._id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 whitespace-normal text-gray-900">{item.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : item.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
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

export default UserDashboard;

