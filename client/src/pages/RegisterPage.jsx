// client/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import setAuthToken from '../utils/setAuthToken';

import { API_URL } from '../config';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [wantsToDrive, setWantsToDrive] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /@(g\.bracu\.ac\.bd|bracu\.ac\.bd)$/;
    if (!emailRegex.test(email)) {
      setError('Must use a valid BRACU email (@bracu.ac.bd or @g.bracu.ac.bd)');
      return;
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
      setAuthToken(token);
      localStorage.setItem('activeMode', 'PASSENGER');

      if (wantsToDrive) {
        navigate('/become-rider');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error(err);
    }
  };

  return (
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
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
              placeholder="e.g. Bob Marley"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
              BRACU Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="name@g.bracu.ac.bd"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center pt-2 px-1">
            <input
              id="wantsToDrive"
              name="wantsToDrive"
              type="checkbox"
              checked={wantsToDrive}
              onChange={(e) => setWantsToDrive(e.target.checked)}
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
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 transition-colors underline decoration-2 underline-offset-2">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;