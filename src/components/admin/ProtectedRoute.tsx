import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn } from '../../services/api';

/**
 * Wraps all /admin/* routes.
 * Redirects to /admin/login if there is no valid token.
 */
const ProtectedRoute: React.FC = () => {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
