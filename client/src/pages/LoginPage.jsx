// client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import setAuthToken from '../utils/setAuthToken';

import { API_URL } from '../config';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      console.log('Login response user:', user); // DEBUG

      if (user.role === 'ADMIN') {
        completeLogin('PASSENGER', token, user);
        navigate('/admin/dashboard');
      } else if (user.isRider) {
        setLoginStep(2);
      } else {
        completeLogin('PASSENGER', token, user);
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

  const handleRoleChoice = async (mode) => {
    const { token, user } = tempData;

    if (mode === 'DRIVER') {
      if (user.isRider) {
        // Approved Driver
        completeLogin(mode, token, user);
        navigate('/driver/dashboard');
      } else {
        // Not a driver yet. Check if they have applied.
        try {
          // We need a route to check my vehicle status.
          // Current `api/vehicles` logic might need a "get my vehicle" route for users.
          // For now, let's just handle it as "Pending or Not Applied"
          // This logic assumes if they clicked "Offer a Ride" they WANT to be a driver.

          // Fast check: If not isRider, show alert or redirect to status check
          // A better UX:
          // We will let them "login" as PASSENGER but redirect to 'become-rider' page 
          // which can show "Pending" if they already applied.

          // However, user specifically asked for "login on hold".
          // So let's show an error message HERE.
          setError("Your driver account is pending approval or not registered.");
          return;
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      // Passenger
      completeLogin(mode, token, user);
      navigate('/dashboard');
    }
  };

  // Wait, I need to fetch status to differentiate "Not Applied" vs "Pending".
  // Let's add a quick axios call inside handleRoleChoice if mode is DRIVER and !isRider

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background with Overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 glass-panel p-8 md:p-10 rounded-2xl w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-2">Login to continue your journey</p>
        </div>

        {loginStep === 1 && (
          <>
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                  placeholder="your.name@bracu.ac.bd"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full btn-primary justify-center"
                >
                  Sign In
                </button>
              </div>
            </form>
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                Register here
              </Link>
            </p>
          </>
        )}

        {loginStep === 2 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
              Hello, {tempData.user.name}!
            </h3>
            <p className="text-center text-gray-600 mb-8">How would you like to continue today?</p>
            <div className="space-y-4">
              <button
                onClick={() => handleRoleChoice('PASSENGER')}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <span>Find a Ride</span>
              </button>
              <button
                onClick={() => handleRoleChoice('DRIVER')}
                className="w-full btn-outline flex items-center justify-center space-x-2 bg-white"
              >
                <span>Offer a Ride</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default LoginPage;