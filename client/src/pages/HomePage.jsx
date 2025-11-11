// client/src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            BRACU-CHAKA
          </div>
          <div>
            <Link 
              to="/login" 
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center bg-blue-50">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
          
          {/* Left Side: Illustration */}
          <div className="md:w-1/2 w-full mb-10 md:mb-0">
            {/* --- THIS IS THE FIX --- */}
            {/* Changed w-full to w-3/4 and added mx-auto */}
            <img 
              src="/land.png" 
              alt="Connecting Campus Illustration" 
              className="w-3/4 mx-auto h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Right Side: Text Content */}
          <div className="md:w-1/2 md:pl-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Connecting Campus, One Ride at a Time.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Easily find and offer rides within the BRACU community. Safe, convenient, and campus-driven.
            </p>
            <Link 
              to="/register" 
              className="px-8 py-4 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 transition-colors"
            >
              Start Your Journey Now
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

export default HomePage;