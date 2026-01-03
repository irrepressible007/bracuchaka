// client/src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
// We no longer import the Logo component

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* --- THIS IS THE FIX --- */}
          <Link to="/" className="flex items-center space-x-2">
            {/* Use the logo.png from the /public folder */}
            <img 
              src="/logo.png" 
              alt="BRACU-CHAKA Logo" 
              className="h-8 w-auto" // You can adjust h-8 (height) as needed
            />
            <span className="text-2xl font-bold text-blue-600">
              BRACU-CHAKA
            </span>
          </Link>
          {/* --- END OF FIX --- */}

          <div>
            <Link 
              to="/login" 
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
=======

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      {/* Header */}
      <header className="fixed w-full z-50 transition-all duration-300">
        <nav className="container mx-auto px-6 py-4">
          <div className="glass-panel rounded-2xl px-6 py-3 flex justify-between items-center shadow-lg/5">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-brand-600 p-2 rounded-lg text-white transform group-hover:scale-110 transition-transform">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-6 w-6 object-contain brightness-0 invert"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-heading font-bold text-gray-900 leading-none">
                  BRACU
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-brand-600 uppercase leading-none">
                  Chaka
                </span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="hidden md:block text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm shadow-brand-500/20"
              >
                Get Started
              </Link>
            </div>
>>>>>>> origin/Sanzid
          </div>
        </nav>
      </header>

      {/* Hero Section */}
<<<<<<< HEAD
      <main className="flex-1 flex items-center bg-blue-50">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
          
          <div className="md:w-1/2 w-full mb-10 md:mb-0">
            <img 
              src="/land.png" 
              alt="Connecting Campus Illustration" 
              className="w-3/4 mx-auto h-auto rounded-lg shadow-lg"
            />
          </div>

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
=======
      <main className="flex-1 flex items-center pt-24 pb-12 overflow-hidden relative">
        {/* Background blobs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-200/40 rounded-full blur-[100px] -z-10 animate-fade-in"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-200/30 rounded-full blur-[80px] -z-10 animate-fade-in"></div>

        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">

          <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10 animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-white border border-brand-100 rounded-full px-4 py-1.5 mb-8 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              <span className="text-xs font-semibold text-brand-700 tracking-wide uppercase">
                Official Transport App for BRACU
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading font-bold text-gray-900 leading-tight mb-6">
              Share the <br />
              <span className="text-transparent bg-clip-text bg-gradient-brand">Journey</span>
            </h1>

            <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
              Connect with fellow students and faculty for safe, convenient, and eco-friendly rides within the BRAC University community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/register"
                className="btn-primary text-center justify-center text-lg px-8 py-4 shadow-brand-500/25 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="btn-outline text-center justify-center text-lg px-8 py-4 bg-white hover:bg-gray-50"
              >
                Login Account
              </Link>
            </div>

            <div className="mt-12 flex items-center space-x-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for "Trusted by" or stats if needed later */}
            </div>
          </div>

          <div className="md:w-1/2 relative animate-fade-in delay-100">
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500 duration-500">
              <div className="absolute inset-0 bg-brand-600 rounded-2xl rotate-3 opacity-20 blur-lg"></div>
              <img
                src="/land.png"
                alt="Connecting Campus"
                className="relative rounded-2xl shadow-2xl border-4 border-white"
              />
            </div>
>>>>>>> origin/Sanzid
          </div>

        </div>
      </main>
    </div>
  );
}

export default HomePage;