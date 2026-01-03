<<<<<<< HEAD
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
// 1. I have added the import for your new form
import RideRequestForm from './RideRequestForm';

function MainLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      {/* The 'relative' class is needed for positioning the form */}
      <main className="flex-1 p-8 overflow-auto relative">
        
        {/* 2. I have added your form component here */}
        <RideRequestForm />

        <Outlet />
=======
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
>>>>>>> origin/Sanzid
      </main>
    </div>
  );
}

export default MainLayout;