import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';

const SubmitContentPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { title, description } = formData;
  const MAX_DESC_LENGTH = 500;

  const onChange = (e) => {
    if (e.target.name === 'description' && e.target.value.length > MAX_DESC_LENGTH) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/content', { title, description });
      setSuccess('Content submitted successfully! Redirecting...');
      setFormData({ title: '', description: '' });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to submit content. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-indigo-100 animate-fadein select-text">
        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
          aria-label="Go back to dashboard"
          type="button"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
          Submit New Content
        </h1>

        {error && (
          <p
            className="bg-red-100 text-red-700 p-4 rounded mb-6 text-center font-semibold text-sm"
            role="alert"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            className="bg-green-100 text-green-700 p-4 rounded mb-6 text-center font-semibold text-sm animate-fadeout"
            role="alert"
          >
            {success}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-indigo-700 font-semibold mb-2"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={onChange}
              type="text"
              placeholder="Enter a title"
              required
              autoComplete="off"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 text-gray-900 transition"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-indigo-700 font-semibold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={onChange}
              placeholder="Enter a description (max 500 characters)"
              required
              rows={5}
              maxLength={MAX_DESC_LENGTH}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl resize-y focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 text-gray-900 transition"
            />
            <p className="mt-1 text-right text-sm text-gray-500">
              {description.length} / {MAX_DESC_LENGTH} characters
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-transform transform ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
              } focus:outline-none focus:ring-4 focus:ring-indigo-300`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadein {
          animation: fadeIn 1s cubic-bezier(.53,-0.14,.24,1.28) both;
        }
        .animate-fadeout {
          animation: fadeOut 2s ease forwards;
          animation-delay: 1.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          to { opacity: 0; }
        }
      `}</style>
    </Layout>
  );
};

export default SubmitContentPage;
