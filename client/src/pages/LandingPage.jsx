// client/src/pages/LandingPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col"> {/* Adjust bg-blue-100 to your desired base color */}
      {/* Header/Navigation */}
      <header className="bg-white shadow-md py-4">
        <nav className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center">
            {/* Replace with your actual logo component or img tag */}
            <img src="/logo.png" alt="BRACU-CHAKA Logo" className="h-8 mr-2" /> 
            BRACU-CHAKA
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {/* These links currently lead nowhere specific, you can define routes for them later */}
            <Link to="/home" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/news" className="text-gray-600 hover:text-blue-600 transition-colors">News</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
            <Link to="/info" className="text-gray-600 hover:text-blue-600 transition-colors">Info</Link>
          </div>
          <div className="md:hidden">
            {/* Mobile menu button - you'll need to implement actual mobile menu functionality */}
            <button className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          <Link 
            to="/login" 
            className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            SIGN IN
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between">
        {/* Left Section: Image/Illustration */}
        <div className="lg:w-1/2 mb-10 lg:mb-0 relative">
          {/* Background for the illustration, removed the blur-3xl for clarity */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-200 to-green-200 rounded-lg opacity-70"></div>
          
          {/* Your main illustration (students on bikes) */}
          <div className="relative z-10 p-4">
            <img 
              src="https://lh3.googleusercontent.com/image_generation_content/0<image-tokens-bardstorage://RESPONSE_DATA:e8093ae67e76d542000035092a668e350ad545:7721893519423922670a04549352d20eff4:0>" 
              alt="Connecting Campus Illustration" 
              className="max-w-full h-auto mx-auto"
            />
          </div>
        </div>

        {/* Right Section: Text and Call to Action */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-5xl font-extrabold text-gray-800 leading-tight mb-6">
            Connecting Campus, One Ride at a Time.
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
            Easily find and offer rides within BRACU campus. Safe, convenient, and community-driven.
          </p>
          <Link 
            to="/register" 
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-colors text-lg"
          >
            Start Your Journey Now 
          </Link>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;