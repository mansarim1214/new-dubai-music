import React from 'react';
import { Navigate } from 'react-router-dom'; // Assuming you're using react-router
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        // If not authenticated, redirect to login
        return <Navigate to="/login" />;
    }

    if (user.role !== 'admin') {
        // If not an admin, redirect to unauthorized page
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
