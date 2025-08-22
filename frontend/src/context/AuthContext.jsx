import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Checking stored authentication...');
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    console.log('📦 Stored user data:', storedUser);
    console.log('🔑 Stored token exists:', !!storedToken);
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('📊 Parsed user data:', userData);
        
        // Handle both response formats
        const userInfo = userData.user || userData;
        console.log('👤 Final user info:', userInfo);
        console.log('🎭 User role:', userInfo?.role);
        
        setIsAuthenticated(true);
        setUser(userInfo);
      } catch (error) {
        console.error('❌ Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      console.log('📭 No stored user data found');
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, role = 'user') => {
    try {
      console.log('🚀 Attempting signup:', { email, role });
      const response = await api.post('/auth/signup', { email, password, role });
      
      console.log('📡 Signup response:', response.data);
      const userData = response.data;
      
      // Store both token and full response
      if (userData.token) {
        localStorage.setItem('token', userData.token);
      }
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('✅ Setting user after signup:', userData.user);
      
      setIsAuthenticated(true);
      setUser(userData.user);
      
      return userData;
    } catch (error) {
      console.error('❌ Signup error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.msg || 'Signup failed');
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🚀 Attempting login:', { email });
      const response = await api.post('/auth/login', { email, password });
      
      console.log('📡 Login response:', response.data);
      const userData = response.data;
      
      // Store both token and full response
      if (userData.token) {
        localStorage.setItem('token', userData.token);
        console.log('🔑 Token stored:', userData.token.substring(0, 20) + '...');
      }
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('✅ Setting user after login:', userData.user);
      console.log('🎭 User role after login:', userData.user?.role);
      
      setIsAuthenticated(true);
      setUser(userData.user);
      
      // Add a small delay to ensure state is updated before navigation
      setTimeout(() => {
        console.log('🔄 Final auth state:', {
          isAuthenticated: true,
          user: userData.user,
          role: userData.user?.role
        });
      }, 100);
      
      return userData;
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.msg || 'Login failed');
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Debug current state
  console.log('🔍 Current AuthContext state:', {
    isAuthenticated,
    user,
    userRole: user?.role,
    loading
  });

  const value = {
    isAuthenticated,
    user,
    signup,
    login,
    logout,
    loading,
    setIsAuthenticated,
    setUser
  };

  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading authentication...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


