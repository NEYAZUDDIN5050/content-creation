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

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      // More detailed error handling
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Invalid credentials. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle redirection after successful login
  if (isAuthenticated && user) {
    return user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
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
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 bg-indigo-50 outline-none transition"
              disabled={loading}
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
              placeholder="Enter your password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 bg-indigo-50 outline-none transition"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-gradient-to-br from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Admin Quick Login (for development/testing) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Quick Admin Login (Dev Mode):</p>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  email: 'admin@example.com',
                  password: 'admin123'
                });
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Fill Admin Credentials
            </button>
          </div>
        )}

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2 transition"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Styles */}
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
