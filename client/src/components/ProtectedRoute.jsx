// client/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, allowedModes }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const activeMode = localStorage.getItem('activeMode');

  // 1. Check for a token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check for base role (USER or ADMIN)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If base role (e.g., ADMIN) is not allowed, kick them out
    return <Navigate to="/" replace />; // Go to home redirect
  }

  // 3. Check for active mode (USER or RIDER)
  if (allowedModes && !allowedModes.includes(activeMode)) {
    // If active mode (e.g., RIDER) is not allowed, kick them out
    return <Navigate to="/" replace />; // Go to home redirect
  }

  // 4. If all checks pass, show the page
  return <Outlet />;
};

export default ProtectedRoute;