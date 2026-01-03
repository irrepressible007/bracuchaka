import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import setAuthToken from '../utils/setAuthToken';

const SidebarLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
        ? 'bg-brand-600 text-white shadow-md'
        : 'text-brand-100 hover:bg-white/10 hover:text-white'
      }`
    }
  >
    {children}
  </NavLink>
);

function Sidebar() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    user = {};
  }
  // Only 'PASSENGER' or 'DRIVER' as values
  let activeModeRaw = localStorage.getItem('activeMode') || 'PASSENGER';
  // FIX: Map old 'USER'/'RIDER' mode to 'PASSENGER'
  if (activeModeRaw === 'USER' || activeModeRaw === 'RIDER') activeModeRaw = 'PASSENGER';
  const activeMode = activeModeRaw;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeMode');
    setAuthToken(null);
    navigate('/login');
  };

  // Switch between PASSENGER and DRIVER only
  // Removed handleModeSwitch as per user request (strict session separation)

  // Set up switch button label
  // Removed getSwitchButtonLabel

  return (
    <div className="w-72 h-screen bg-brand-900 text-white flex flex-col p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-800 to-brand-950 -z-10"></div>
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl"></div>

      <Link to="/" className="flex items-center space-x-3 mb-10 z-10">
        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 w-8 object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-heading font-bold text-white tracking-tight leading-none">
            BRACU
          </h1>
          <span className="text-brand-300 text-xs font-medium tracking-widest uppercase">Chaka</span>
        </div>
      </Link>

      {/* Mode Indicator (Non-interactive) */}
      <div className="mb-6 px-4 py-2 rounded-lg bg-black/20 border border-white/5">
        <p className="text-xs text-brand-300 uppercase font-bold tracking-wider mb-1">Current Mode</p>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${activeMode === 'DRIVER' ? 'bg-green-500' : 'bg-brand-400'}`}></div>
          <span className="text-sm font-semibold text-white">
            {activeMode === 'DRIVER' ? 'Driver' : 'Passenger'}
          </span>
        </div>
      </div>



      <nav className="flex-1 space-y-2 z-10 overflow-y-auto">
        <div className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 px-4">Menu</div>

        {/* Profile Link for all roles */}
        <SidebarLink to="/profile">My Profile</SidebarLink>

        {/* Links for PASSENGER Mode */}
        {activeMode === 'PASSENGER' && (
          <>
            <SidebarLink to="/dashboard">
              <span className="flex items-center">
                {/* Icons are optional but nice from Tanisha's code */}
                Search Rides
              </span>
            </SidebarLink>
            <SidebarLink to="/my-rides">My Rides</SidebarLink>

<<<<<<< HEAD

=======
            <SidebarLink to="/chat">Chat</SidebarLink>
>>>>>>> 95c9c18c5c3bc5a1d8b70e1427ea909619b2bfbf

            {!user?.isRider && (
              <SidebarLink to="/become-rider">
                Become a Driver
              </SidebarLink>
            )}
          </>
        )}

        {/* Links for DRIVER Mode */}
        {activeMode === 'DRIVER' && (
          <>
            <SidebarLink to="/driver/dashboard">Driver Requests (Dashboard)</SidebarLink>
            <SidebarLink to="/rider/create-ride">Offer a Ride</SidebarLink>
          </>
        )}


      </nav>

      <div className="mt-auto z-10 pt-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors duration-200 text-sm font-medium"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;