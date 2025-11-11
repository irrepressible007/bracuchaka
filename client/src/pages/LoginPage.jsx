// client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import setAuthToken from '../utils/setAuthToken';

const API_URL = 'http://localhost:5000/api'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [loginStep, setLoginStep] = useState(1);
  const [tempData, setTempData] = useState(null); 
  
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      
      const { token, user } = response.data;
      setAuthToken(token); 
      setTempData({ token, user });

      if (user.role === 'ADMIN') {
        completeLogin('USER', token, user);
        navigate('/admin/dashboard');
      } else if (user.isRider) {
        setLoginStep(2);
      } else {
        completeLogin('USER', token, user);
        navigate('/dashboard'); 
      }

    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    }
  };

  const completeLogin = (mode, token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('activeMode', mode);
  };

  const handleRoleChoice = (mode) => {
    const { token, user } = tempData;
    completeLogin(mode, token, user);
    
    if (mode === 'RIDER') {
      navigate('/rider/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
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

        {loginStep === 1 && (
          <>
            <h3 className="text-xl font-semibold text-center text-gray-600 mb-6">
              Login to Your Account
            </h3>
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.name@bracu.ac.bd"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <button 
                  type="submit" 
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login
                </button>
              </div>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register here
              </Link>
            </p>
          </>
        )}
        
        {loginStep === 2 && (
          <div>
            <h3 className="text-xl font-semibold text-center text-gray-600 mb-6">
              Welcome back, {tempData.user.name}!
            </h3>
            <p className="text-center text-gray-600 mb-6">How would you like to log in?</p>
            <div className="space-y-4">
              <button 
                onClick={() => handleRoleChoice('USER')}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login as User (Find Rides)
              </button>
              <button 
                onClick={() => handleRoleChoice('RIDER')}
                className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login as Rider (Offer Rides)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default LoginPage;