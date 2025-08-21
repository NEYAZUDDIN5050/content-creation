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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(userData.user || userData); // Handle both formats
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, role = 'user') => {
    try {
      console.log('Attempting signup:', { email, role });
      const response = await api.post('/auth/signup', { email, password, role });
      
      console.log('Signup response:', response.data);
      const userData = response.data;
      
      setIsAuthenticated(true);
      setUser(userData.user);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.msg || 'Signup failed');
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login:', { email });
      const response = await api.post('/auth/login', { email, password });
      
      console.log('Login response:', response.data);
      const userData = response.data;
      
      setIsAuthenticated(true);
      setUser(userData.user);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.msg || 'Login failed');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  };

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
        <div className="min-h-screen flex items-center justify-center">
          <div>Loading...</div>
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


