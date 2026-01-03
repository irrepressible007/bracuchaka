import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import BecomeDriverPage from './pages/BecomeDriverPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateRidePage from './pages/CreateRidePage';
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
};

function App() {
  return (
    <BrowserRouter>
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
        {/* --- Protected Routes (wrapped in MainLayout) --- */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            {/* PASSENGER MODE */}
            <Route element={<ProtectedRoute allowedModes={['PASSENGER']} />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/become-rider" element={<BecomeRiderPage />} />
              <Route path="/fare" element={<RideFarePage />} />


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
      </Routes>
    </BrowserRouter>
  );
}

export default App;