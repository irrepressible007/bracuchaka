// client/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
<<<<<<< HEAD
import setAuthToken from '../utils/setAuthToken'; 

const API_URL = 'http://localhost:5000/api'; 
=======
import setAuthToken from '../utils/setAuthToken';

import { API_URL } from '../config';
>>>>>>> origin/Sanzid

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
<<<<<<< HEAD
  
  const [wantsToDrive, setWantsToDrive] = useState(false);
  
=======

  const [wantsToDrive, setWantsToDrive] = useState(false);

>>>>>>> origin/Sanzid
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /@(g\.bracu\.ac\.bd|bracu\.ac\.bd)$/;
    if (!emailRegex.test(email)) {
<<<<<<< HEAD
        setError('Must use a valid BRACU email (@bracu.ac.bd or @g.bracu.ac.bd)');
        return;
=======
      setError('Must use a valid BRACU email (@bracu.ac.bd or @g.bracu.ac.bd)');
      return;
>>>>>>> origin/Sanzid
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
<<<<<<< HEAD
      setAuthToken(token); 
      localStorage.setItem('activeMode', 'USER');
=======
      setAuthToken(token);
      localStorage.setItem('activeMode', 'PASSENGER');
>>>>>>> origin/Sanzid

      if (wantsToDrive) {
        navigate('/become-rider');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      if (err.response && err.response.data) {
<<<<<<< HEAD
        setError(err.response.data.message); 
=======
        setError(err.response.data.message);
>>>>>>> origin/Sanzid
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error(err);
    }
  };

  return (
<<<<<<< HEAD
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        // --- THIS IS THE FIX ---
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        <div className="absolute inset-0 w-full h-full bg-black opacity-40"></div>
      </div>

      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          BRACU-CHAKA
        </h2>
        <h3 className="text-xl font-semibold text-center text-gray-600 mb-6">
          Create Your Account
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
=======
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-surface-50">
      {/* Background with Overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm"></div>
      </div>

      {/* Ambient Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-400/30 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-400/30 rounded-full blur-[100px]"></div>

      <div className="relative z-10 glass-panel p-8 md:p-10 rounded-2xl w-full max-w-md animate-slide-up shadow-2xl border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-gray-900">
            Join <span className="text-brand-600">BRACU-CHAKA</span>
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Create your account today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center shadow-sm">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
>>>>>>> origin/Sanzid
              {error}
            </div>
          )}

          <div>
<<<<<<< HEAD
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700"
            >
=======
            <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
>>>>>>> origin/Sanzid
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
<<<<<<< HEAD
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Bob Marley"
=======
              className="input-field"
              placeholder="e.g. Bob Marley"
>>>>>>> origin/Sanzid
            />
          </div>

          <div>
<<<<<<< HEAD
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
=======
            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
>>>>>>> origin/Sanzid
              BRACU Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
<<<<<<< HEAD
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
=======
              className="input-field"
>>>>>>> origin/Sanzid
              placeholder="name@g.bracu.ac.bd"
            />
          </div>

          <div>
<<<<<<< HEAD
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
=======
            <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
>>>>>>> origin/Sanzid
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
<<<<<<< HEAD
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
=======
              className="input-field"
>>>>>>> origin/Sanzid
              placeholder="••••••••"
            />
          </div>

<<<<<<< HEAD
          <div className="flex items-center">
=======
          <div className="flex items-center pt-2 px-1">
>>>>>>> origin/Sanzid
            <input
              id="wantsToDrive"
              name="wantsToDrive"
              type="checkbox"
              checked={wantsToDrive}
              onChange={(e) => setWantsToDrive(e.target.checked)}
<<<<<<< HEAD
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="wantsToDrive" className="ml-2 block text-sm text-gray-900">
              I also want to register as a Rider (to give rides)
            </label>
          </div>

          <div>
            <button 
              type="submit" 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register
=======
              className="h-5 w-5 text-brand-600 focus:ring-brand-500 border-gray-300 rounded cursor-pointer transition-colors"
            />
            <label htmlFor="wantsToDrive" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer select-none">
              Register as a <span className="text-brand-600 font-bold">Rider</span> (Driver)
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full btn-primary justify-center text-lg shadow-brand-500/25"
            >
              Start Journey
>>>>>>> origin/Sanzid
            </button>
          </div>
        </form>

<<<<<<< HEAD
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
=======
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 transition-colors underline decoration-2 underline-offset-2">
>>>>>>> origin/Sanzid
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;