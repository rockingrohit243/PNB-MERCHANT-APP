// # 4. Wrapper to prevent unauthorized access
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = () => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />; // Renders the nested route (e.g., Dashboard, Reports)
};

export default ProtectedRoute;