

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios'; // Add axios import
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import setAuthToken from './utils/setAuthToken';

// --- Lazy Load Pages ---
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const HomePage = lazy(() => import('./pages/HomePage'));

const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const BecomeDriverPage = lazy(() => import('./pages/BecomeDriverPage'));
const RideFarePage = lazy(() => import('./pages/RideFarePage'));
const Chat = lazy(() => import('./pages/Chat'));
const MyRidesPage = lazy(() => import('./pages/MyRidesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const DriverDashboard = lazy(() => import('./pages/DriverDashboard'));
const CreateRidePage = lazy(() => import('./pages/CreateRidePage'));
const RiderDashboard = lazy(() => import('./pages/RiderDashboard'));

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));


// --- Auth Token Initialization ---
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// --- Global Axios Interceptor for 401 handling ---
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is invalid/expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthToken(null);
      window.location.href = '/login'; // Hard redirect to force state clear
    }
    return Promise.reject(error);
  }
);

// --- Renaming for clarity ---
// We can't easily alias lazy components directly in the same way, but we can just use BecomeDriverPage directly
const BecomeRiderPage = BecomeDriverPage;

// Loading Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
  </div>
);

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
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* --- Public Routes --- */}
          <Route
            path="/"
            element={
              localStorage.getItem('token') ? <HomeRedirect /> : <HomePage />
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- Protected Routes (wrapped in MainLayout) --- */}
          <Route element={<MainLayout />}>
            <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
              {/* PASSENGER MODE */}
              <Route element={<ProtectedRoute allowedModes={['PASSENGER', 'USER']} />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/become-rider" element={<BecomeRiderPage />} />
                <Route path="/fare" element={<RideFarePage />} />
                <Route path="/chat" element={<Chat />} />

                {/* Review / History Page */}
                <Route path="/my-rides" element={<MyRidesPage />} />
              </Route>

              {/* DRIVER MODE */}
              <Route element={<ProtectedRoute allowedModes={['DRIVER', 'RIDER']} />}>
                <Route path="/driver/dashboard" element={<DriverDashboard />} />
                <Route path="/rider/create-ride" element={<CreateRidePage />} />
                {/* Keep RiderDashboard for legacy/shared rides if needed */}
                <Route path="/rider/dashboard" element={<RiderDashboard />} />
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
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;