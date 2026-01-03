<<<<<<< HEAD
// client/src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
=======
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
>>>>>>> origin/Sanzid
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import BecomeDriverPage from './pages/BecomeDriverPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateRidePage from './pages/CreateRidePage';
<<<<<<< HEAD
import HomePage from './pages/HomePage'; // 1. Import new Homepage
import RiderDashboard from './pages/RiderDashboard';
import UserDashboard from './pages/UserDashboard'; // IMPORT the new page

// --- Renaming for clarity ---
const BecomeRiderPage = BecomeDriverPage;
// const UserDashboard = ... REMOVED inline placeholder
// const RiderDashboard = () => <h1 className="text-3xl font-bold">My Offered Rides</h1>; // REMOVED inline component

// This component now decides where a logged-in user goes
const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" />;

  // Default for all 'USER' roles (Riders or not)
  return <Navigate to="/dashboard" />;
=======
import HomePage from './pages/HomePage';
import RideRequestForm from './components/RideRequestForm';
import RideFarePage from './pages/RideFarePage';
import Chat from './pages/Chat';
import DriverDashboard from './pages/DriverDashboard';
import UserDashboard from './pages/UserDashboard';
import ProfilePage from './pages/ProfilePage';
import MyRidesPage from './pages/MyRidesPage';
import AdminLogin from './pages/AdminLogin';
import setAuthToken from './utils/setAuthToken';

// --- Auth Token Initialization ---
if (localStorage.token) {
  setAuthToken(localStorage.token);
}


// --- Renaming for clarity ---
const BecomeRiderPage = BecomeDriverPage;

// --- Sanzid's Inline Components ---
// Tanisha: Using RideRequestForm as the main dashboard content
// Decide where a logged-in user goes
const HomeRedirect = () => {
  let user = null;
  let activeMode = localStorage.getItem('activeMode');

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    console.error("Error parsing user from local storage", e);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }

  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" />;

  // Smart Redirection based on Mode
  if (activeMode === 'DRIVER') {
    return <Navigate to="/driver/dashboard" />;
  } else {
    // Default to Passenger Dashboard
    return <Navigate to="/dashboard" />;
  }
>>>>>>> origin/Sanzid
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
<<<<<<< HEAD

        {/* 2. UPDATE THE ROOT ROUTE (/) */}
=======
>>>>>>> origin/Sanzid
        <Route
          path="/"
          element={
            localStorage.getItem('token') ? <HomeRedirect /> : <HomePage />
          }
        />
<<<<<<< HEAD

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

=======
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Protected Routes (wrapped in MainLayout) --- */}
        {/* --- Protected Routes (wrapped in MainLayout) --- */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            {/* PASSENGER MODE */}
            <Route element={<ProtectedRoute allowedModes={['PASSENGER']} />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/become-rider" element={<BecomeRiderPage />} />
              <Route path="/fare" element={<RideFarePage />} />
<<<<<<< HEAD

=======
              <Route path="/chat" element={<Chat />} />
>>>>>>> 95c9c18c5c3bc5a1d8b70e1427ea909619b2bfbf

              {/* Tanisha's Restored Routes */}
              <Route path="/my-rides" element={<MyRidesPage />} />

            </Route>

            {/* DRIVER MODE */}
            <Route element={<ProtectedRoute allowedModes={['DRIVER']} />}>
              <Route path="/driver/dashboard" element={<DriverDashboard />} />
              <Route path="/rider/create-ride" element={<CreateRidePage />} />
            </Route>



            {/* Shared User Routes */}
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES - Separate Layout */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
>>>>>>> origin/Sanzid
      </Routes>
    </BrowserRouter>
  );
}

export default App;