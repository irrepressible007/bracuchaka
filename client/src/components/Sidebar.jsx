// client/src/components/Sidebar.jsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import setAuthToken from '../utils/setAuthToken';

const SidebarLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-3 rounded-md text-gray-200 hover:bg-blue-700 hover:text-white transition-colors duration-200 ${
        isActive ? 'bg-blue-900 font-semibold' : ''
      }`
    }
  >
    {children}
  </NavLink>
);

function Sidebar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const activeMode = localStorage.getItem('activeMode'); // Reads the mode set at login
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeMode'); // Clear the mode
    setAuthToken(null);
    navigate('/login');
  };

  return (
    <div className="w-64 min-h-screen bg-blue-800 text-white flex flex-col p-4 shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-10 text-white">
        BRACU-CHAKA
      </h1>
      
      {/* --- SWITCH MODE BUTTON IS REMOVED --- */}

      <nav className="flex-1 space-y-2">
        {/* --- Links for USER Mode --- */}
        {activeMode === 'USER' && (
          <>
            <SidebarLink to="/dashboard">Search Rides</SidebarLink>
            {/* <SidebarLink to="/my-bookings">My Bookings</SidebarLink> */}
            {!user.isRider && (
              <SidebarLink to="/become-rider">Become a Rider</SidebarLink>
            )}
          </>
        )}

        {/* --- Links for RIDER Mode --- */}
        {activeMode === 'RIDER' && (
          <>
            <SidebarLink to="/rider/dashboard">My Offered Rides</SidebarLink>
            <SidebarLink to="/rider/create-ride">Offer a Ride</SidebarLink>
          </>
        )}

        {/* --- Links for ADMIN Mode --- */}
        {user?.role === 'ADMIN' && (
          <>
            <SidebarLink to="/admin/dashboard">Pending Approvals</SidebarLink>
            {/* <SidebarLink to="/admin/all-users">Manage Users</SidebarLink> */}
          </>
        )}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-md text-gray-200 hover:bg-red-700 hover:text-white transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;


