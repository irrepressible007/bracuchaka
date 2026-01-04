// client/src/components/MainLayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SOSButton from './SOSButton';
import SupportButton from './SupportButton';

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-surface-50 overflow-hidden">
      {/* Mobile Header for hamburger menu */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="font-heading font-bold text-gray-800">BRACU Chaka</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* The Sidebar on the left */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isDesktopOpen={isDesktopSidebarOpen}
      />

      <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto relative scroll-smooth bg-surface-50">

        {/* Desktop Sidebar Toggle */}
        <button
          onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          className="hidden lg:flex absolute top-4 left-4 z-40 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm border border-gray-200 text-gray-500 hover:text-brand-600 hover:bg-white transition-all items-center justify-center group"
          title={isDesktopSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ${isDesktopSidebarOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
        </button>

        <Outlet />
        <SOSButton />
        <SupportButton />
      </main>
    </div>
  );
}

export default MainLayout;