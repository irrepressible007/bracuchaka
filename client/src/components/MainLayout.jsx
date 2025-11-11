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
      </main>
    </div>
  );
}

export default MainLayout;