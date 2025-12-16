// client/src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import BecomeDriverPage from './pages/BecomeDriverPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateRidePage from './pages/CreateRidePage';
import HomePage from './pages/HomePage'; // 1. Import new Homepage
import RiderDashboard from './pages/RiderDashboard';

// --- Renaming for clarity ---
const BecomeRiderPage = BecomeDriverPage;
const UserDashboard = () => <h1 className="text-3xl font-bold">Search for Rides</h1>;
// const RiderDashboard = () => <h1 className="text-3xl font-bold">My Offered Rides</h1>; // REMOVED inline component

// This component now decides where a logged-in user goes
const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" />;

  // Default for all 'USER' roles (Riders or not)
  return <Navigate to="/dashboard" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}

        {/* 2. UPDATE THE ROOT ROUTE (/) */}
        <Route
          path="/"
          element={
            localStorage.getItem('token') ? <HomeRedirect /> : <HomePage />
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Protected Routes (wrapped in MainLayout) --- */}
        <Route element={<MainLayout />}>

          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route element={<ProtectedRoute allowedModes={['USER']} />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/become-rider" element={<BecomeRiderPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedModes={['RIDER']} />}>
              <Route path="/rider/dashboard" element={<RiderDashboard />} />
              <Route path="/rider/create-ride" element={<CreateRidePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;