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

function Sidebar({ isOpen, onClose, isDesktopOpen = true }) {
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

  // responsive classes
  // Base: common styles
  // Desktop: Controlled by isDesktopOpen (w-72 vs w-0)
  // Mobile: Controlled by isOpen (translate)

  const baseClasses = "bg-brand-900 text-white flex flex-col shadow-xl relative overflow-hidden transition-all duration-300 z-50 h-full fixed lg:static";

  // Width & Padding logic
  const desktopStateClasses = isDesktopOpen
    ? "lg:w-72 lg:p-6 lg:opacity-100"
    : "lg:w-0 lg:p-0 lg:opacity-0 lg:border-none";

  const mobileStateClasses = `inset-y-0 left-0 w-72 p-6 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}

      <div className={`${baseClasses} ${mobileStateClasses} ${desktopStateClasses}`}>
        {/* Decorative gradient blob */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-800 to-brand-950 -z-10"></div>
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl"></div>

        <div className="flex justify-between items-center mb-10 z-10">
          <Link to="/" className="flex items-center space-x-3">
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
          {/* Close button for mobile */}
          <button onClick={onClose} className="lg:hidden text-brand-200 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mode Indicator (Non-interactive) */}
        <div className="mb-6 px-4 py-2 rounded-lg bg-black/20 border border-white/5 data-[closed=true]:hidden">
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

              <SidebarLink to="/chat">Chat</SidebarLink>

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

          {user?.role === 'ADMIN' && (
            <>
              <SidebarLink to="/admin/dashboard">Pending Approvals</SidebarLink>
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
    </>
  );
}

export default Sidebar;