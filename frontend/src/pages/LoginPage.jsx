import React, { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-blue-200 px-4 select-none">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-indigo-100 animate-fadein">
        {/* Brand Logo and Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full flex items-center justify-center shadow-md mb-2">
            <span className="text-3xl font-extrabold text-white">CC</span>
          </div>
          <h1 className="text-2xl font-extrabold text-indigo-700 tracking-tight">
            Content Create
          </h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Please log in.</p>
        </div>

        {/* Login heading */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-5">
          Sign in to your account
        </h2>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 rounded p-3 mb-4 text-center text-sm font-medium"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-indigo-700 text-sm font-semibold mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="example@contentcreate.app"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 bg-indigo-50 outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-indigo-700 text-sm font-semibold mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="********"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 bg-indigo-50 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-70"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2 transition"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Same fade-in animation */}
      <style>
        {`
          .animate-fadein {
            animation: fadeIn 1.1s cubic-bezier(.53,-0.14,.24,1.28) 0.2s both;
          }
          @keyframes fadeIn {
            from { opacity:0; transform: translateY(40px);}
            to { opacity:1; transform: none;}
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
