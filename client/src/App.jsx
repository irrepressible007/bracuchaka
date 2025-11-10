// client/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import BecomeDriverPage from './pages/BecomeDriverPage'; 
import AdminDashboard from './pages/AdminDashboard';
import CreateRidePage from './pages/CreateRidePage'; 

// Import your new LandingPage component
import LandingPage from './pages/LandingPage'; 

// --- Renaming for clarity ---
const BecomeRiderPage = BecomeDriverPage; // Alias
const UserDashboard = () => <h1 className="text-3xl font-bold">Search for Rides</h1>;
const RiderDashboard = () => <h1 className="text-3xl font-bold">My Offered Rides</h1>;

// A simple component to redirect users on login/root access if authenticated
const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" />;
  
  // Default for all 'USER' roles (Riders or not)
  // Check activeMode from localStorage for USER/RIDER dashboard split
  const activeMode = localStorage.getItem('activeMode');
  if (activeMode === 'RIDER') {
    return <Navigate to="/rider/dashboard" />;
  }
  return <Navigate to="/dashboard" />; // Default to user dashboard
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* --- Landing Page or Redirect --- */}
        {/* If a token exists, redirect authenticated users via HomeRedirect. */}
        {/* Otherwise, show the LandingPage for unauthenticated users at the root. */}
        <Route 
          path="/" 
          element={
            localStorage.getItem('token') ? <HomeRedirect /> : <LandingPage />
          } 
        />

        {/* --- Protected Routes (wrapped in MainLayout) --- */}
        <Route element={<MainLayout />}>
          
          {/* --- Routes for 'USER' role --- */}
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            
            {/* Page for 'USER' Mode */}
            <Route element={<ProtectedRoute allowedModes={['USER']} />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/become-rider" element={<BecomeRiderPage />} /> 
            </Route>

            {/* Page for 'RIDER' Mode */}
            {/* The Dashboard here will now correctly point to /rider/dashboard */}
            <Route element={<ProtectedRoute allowedModes={['RIDER']} />}>
              <Route path="/rider/dashboard" element={<RiderDashboard />} />
              <Route path="/rider/create-ride" element={<CreateRidePage />} />
            </Route>

          </Route>

          {/* --- Routes for 'ADMIN' role --- */}
          {/* Admin routes also use ProtectedRoute but don't need MainLayout if it's specific */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          
        </Route>

        {/* --- Fallback Route --- */}
        {/* If no other route matches, and not handled by /, redirect to landing page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;