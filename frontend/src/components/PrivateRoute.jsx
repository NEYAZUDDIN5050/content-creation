import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ roles }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // If roles are specified, check if user has the required role
    if (roles && roles.length > 0) {
        if (!roles.includes(user.role)) {
            // Instead of always redirecting to /dashboard, 
            // redirect based on user's actual role
            if (user.role === 'admin') {
                return <Navigate to="/admin" replace />;
            } else {
                return <Navigate to="/dashboard" replace />;
            }
        }
    }

    // User is authenticated and has proper role access
    return <Outlet />;
};

export default PrivateRoute;