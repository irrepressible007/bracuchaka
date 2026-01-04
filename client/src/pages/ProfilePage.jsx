// client/src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API_URL } from '../config';

function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', // Added Phone
    department: '',
    year: '',
    bio: '',
    profilePhotoUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Fetch current profile data on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/profile/me`);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '', // Fetch Phone
          department: res.data.department || '',
          year: res.data.year || '',
          bio: res.data.bio || '',
          profilePhotoUrl: res.data.profilePhotoUrl || '/2.png',
        });
      } catch (err) {
        setError('Failed to load profile.');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const [photoFile, setPhotoFile] = useState(null);

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  // 2. Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Use FormData for file upload
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    if (formData.phone) formDataObj.append('phone', formData.phone);
    if (formData.department) formDataObj.append('department', formData.department);
    if (formData.year) formDataObj.append('year', formData.year);
    if (formData.bio) formDataObj.append('bio', formData.bio);
    if (photoFile) {
      formDataObj.append('profilePhoto', photoFile);
    }

    try {
      // Content-Type multipart/form-data is set automatically by browser/axios when data is FormData
      const res = await axios.put(`${API_URL}/profile/update`, formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(res.data.message);
      // Update local storage user 'name' if it changed
      const localUser = JSON.parse(localStorage.getItem('user'));
      localUser.name = res.data.user.name;
      // Also update photo in local storage if needed? Usually only name/role are stored.
      localStorage.setItem('user', JSON.stringify(localUser));

      // Update state to reflect new photo immediately
      setFormData(prev => ({ ...prev, profilePhotoUrl: res.data.user.profilePhotoUrl }));
      setPhotoFile(null); // Clear selection

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Profile update failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900">
          My Profile
        </h1>
        <p className="text-gray-500">Manage your personal information</p>
      </div>

      <div className="card shadow-lg border-surface-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">{error}</div>}
          {success && <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg">{success}</div>}

          {/* Profile Photo Section (Interactive) */}
          <div className="flex items-center space-x-6 pb-6 border-b border-gray-100">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-brand-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img
                src={photoFile ? URL.createObjectURL(photoFile) : formData.profilePhotoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md relative z-10"
                onError={(e) => { e.target.onerror = null; e.target.src = "/2.png"; }}
              />
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer z-20 hover:scale-110 transition-transform">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-800">
                {formData.name || 'User'}
              </label>
              <p className="text-sm text-gray-500">BRACU Student / Faculty</p>
              <p className="text-xs text-brand-500 mt-1 font-medium bg-brand-50 inline-block px-2 py-1 rounded">
                {photoFile ? <span className='text-green-600'>New photo selected</span> : 'Click icon to change photo'}
              </p>
            </div>
          </div>

          {/* Text Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} disabled className="input-field bg-gray-100 text-gray-500 cursor-not-allowed" />
            </div>
            {/* New Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01XXXXXXXXX" className="input-field" />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g., CSE" className="input-field" />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-1">Year/Level</label>
              <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="e.g., 3" className="input-field" />
            </div>
          </div>

          {/* Bio Textarea */}
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-1">Bio (Optional)</label>
            <textarea
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a little about yourself..."
              className="input-field resize-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full md:w-auto flex justify-center items-center space-x-2"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <span>{loading ? 'Updating...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;