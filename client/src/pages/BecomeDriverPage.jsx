// client/src/pages/BecomeDriverPage.jsx

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = '/api';

function BecomeDriverPage() {
  const [formData, setFormData] = useState({
    bikeName: '',
    bikeModel: '',
    modelYear: '',
    color: '',
    registrationNumber: '',
    licenseNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { 
    bikeName, 
    bikeModel, 
    modelYear, 
    color, 
    registrationNumber, 
    licenseNumber 
  } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const apiRes = await axios.post(`${API_URL}/vehicles/register`, formData);
      setSuccess(apiRes.data.message);
      setLoading(false);
      setFormData({
        bikeName: '', bikeModel: '', modelYear: '', color: '',
        registrationNumber: '', licenseNumber: '',
      });

    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Submission failed. Please try again.');
      }
      console.error(err);
    }
  };

  // Helper component for form inputs
  const InputField = ({ label, name, value, onChange, ...props }) => (
    <div>
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Become a Driver
      </h1>
      <p className="mb-6 text-gray-600">
        Submit your vehicle and license details for approval.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Messages */}
        {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}
        {success && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">{success}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Bike Name (e.g., Honda)" name="bikeName" value={bikeName} onChange={handleChange} required />
          <InputField label="Bike Model (e.g., Hornet 160R)" name="bikeModel" value={bikeModel} onChange={handleChange} required />
          <InputField label="Model Year" name="modelYear" value={modelYear} onChange={handleChange} type="number" placeholder="e.g., 2023" required />
          <InputField label="Color" name="color" value={color} onChange={handleChange} required />
          <InputField label="Registration Number" name="registrationNumber" value={registrationNumber} onChange={handleChange} required />
          <InputField label="Driver's License Number" name="licenseNumber" value={licenseNumber} onChange={handleChange} required />
        </div>
        
        <div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BecomeDriverPage;