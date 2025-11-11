// client/src/components/Sidebar.jsx

import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
  const activeMode = localStorage.getItem('activeMode');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeMode');
    setAuthToken(null);
    navigate('/login');
  };

  const handleModeSwitch = () => {
    const newMode = activeMode === 'USER' ? 'RIDER' : 'USER';
    localStorage.setItem('activeMode', newMode);
    navigate(newMode === 'USER' ? '/dashboard' : '/rider/dashboard');
    window.location.reload();
  };

  return (
    <div className="w-64 min-h-screen bg-blue-800 text-white flex flex-col p-4 shadow-lg">
      
      <Link to="/" className="flex items-center justify-center space-x-3 mb-10">
        <img 
          src="/logo.png" 
          alt="BRACU-CHAKA Logo" 
          className="h-10 w-auto"
        />
        <h1 className="text-3xl font-bold text-white">
          BRACU-CHAKA
        </h1>
      </Link>

      {user?.isRider && (
        <div className="mb-4">
          <button
            onClick={handleModeSwitch}
            className="w-full px-4 py-3 rounded-md text-center font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
          >
            {activeMode === 'USER' ? 'Switch to Rider Mode' : 'Switch to User Mode'}
          </button> {/* <-- THIS IS THE FIX (was </Nothing>) */}
        </div>
      )}

      <nav className="flex-1 space-y-2">
        {activeMode === 'USER' && (
          <>
            <SidebarLink to="/dashboard">Search Rides</SidebarLink>
            {!user.isRider && (
              <SidebarLink to="/become-rider">Become a Rider</SidebarLink>
            )}
          </>
        )}
        {activeMode === 'RIDER' && (
          <>
            <SidebarLink to="/rider/dashboard">My Offered Rides</SidebarLink>
            <SidebarLink to="/rider/create-ride">Offer a Ride</SidebarLink>
          </>
        )}
        {user?.role === 'ADMIN' && (
          <>
            <SidebarLink to="/admin/dashboard">Pending Approvals</SidebarLink>
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