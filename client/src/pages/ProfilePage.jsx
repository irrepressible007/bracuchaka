// client/src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API_URL } from '../config';

function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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

  // 2. Handle the form submission (simplified)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // We only send the text data, not a photo URL
    const updatedProfileData = {
      name: formData.name,
      department: formData.department,
      year: formData.year,
      bio: formData.bio,
    };

    try {
      // 3. Send ALL text data to our backend
      const res = await axios.put(`${API_URL}/profile/update`, updatedProfileData);

      setSuccess(res.data.message);
      // Update local storage user 'name' if it changed
      const localUser = JSON.parse(localStorage.getItem('user'));
      localUser.name = res.data.user.name;
      localStorage.setItem('user', JSON.stringify(localUser));

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

          {/* Profile Photo Section (Static) */}
          <div className="flex items-center space-x-6 pb-6 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-600 rounded-full blur opacity-20"></div>
              <img
                src={formData.profilePhotoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md relative z-10"
                onError={(e) => { e.target.onerror = null; e.target.src = "/2.png"; }}
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-800">
                {formData.name || 'User'}
              </label>
              <p className="text-sm text-gray-500">BRACU Student / Faculty</p>
              <p className="text-xs text-brand-500 mt-1 font-medium bg-brand-50 inline-block px-2 py-1 rounded">Profile Photo updates disabled</p>
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