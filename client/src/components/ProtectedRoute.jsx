// client/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, allowedModes }) => {
  const token = localStorage.getItem('token');
<<<<<<< HEAD
  const user = JSON.parse(localStorage.getItem('user'));
  const activeMode = localStorage.getItem('activeMode');

  // 1. Check for a token
  if (!token) {
=======
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
    // Attempt to access a property to ensure it's a valid object
    const check = user?.role;
  } catch (e) {
    console.error("ProtectedRoute: Invalid user data", e);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  let activeMode = localStorage.getItem('activeMode');

  // FIX: Default to 'PASSENGER' if missing, and auto-migrate legacy modes
  if (!activeMode || activeMode === 'RIDER' || activeMode === 'USER') {
    activeMode = 'PASSENGER';
    localStorage.setItem('activeMode', 'PASSENGER');
  }

  // 1. Check for a token
  if (!token) {
    if (window.location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" replace />;
    }
>>>>>>> origin/Sanzid
    return <Navigate to="/login" replace />;
  }

  // 2. Check for base role (USER or ADMIN)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If base role (e.g., ADMIN) is not allowed, kick them out
    return <Navigate to="/" replace />; // Go to home redirect
  }

<<<<<<< HEAD
  // 3. Check for active mode (USER or RIDER)
=======
  // 3. Security: STRICT Admin Check
  const isAdminPath = window.location.pathname.startsWith('/admin');
  if (isAdminPath && user.role !== 'ADMIN') {
    // Redirect to Admin Login if they are not an admin
    return <Navigate to="/admin/login" replace />;
  }

  // 4. Check for active mode (USER or RIDER)
>>>>>>> origin/Sanzid
  if (allowedModes && !allowedModes.includes(activeMode)) {
    // If active mode (e.g., RIDER) is not allowed, kick them out
    return <Navigate to="/" replace />; // Go to home redirect
  }

  // 4. If all checks pass, show the page
  return <Outlet />;
};

export default ProtectedRoute;