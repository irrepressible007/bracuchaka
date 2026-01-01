// client/src/components/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SOSButton from './SOSButton';

function MainLayout() {
  return (
    <div className="h-screen flex bg-surface-50 overflow-hidden">
      {/* The Sidebar on the left */}
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto relative scroll-smooth">
        <Outlet />
        <SOSButton />
      </main>
    </div>
  );
}

export default MainLayout;