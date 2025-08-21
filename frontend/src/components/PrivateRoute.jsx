import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ roles }) => {
    const { isAuthenticated, user } = useContext(AuthContext);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Add null check for user
    if (roles && (!user || !roles.includes(user.role))) {
        return <Navigate to="/dashboard" />;
    }

    return <Outlet />;
};

export default PrivateRoute;