// client/src/pages/CreateRidePage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

<<<<<<< HEAD
const API_URL = '/api';
=======
import { API_URL } from '../config';
>>>>>>> origin/Sanzid

function CreateRidePage() {
  const [formData, setFormData] = useState({
    departureLocation: '',
    destination: '',
    departureTime: '',
    availableSeats: '1',
    fuelCostContribution: '0',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

<<<<<<< HEAD
  const { 
    departureLocation, 
    destination, 
    departureTime, 
=======
  const {
    departureLocation,
    destination,
    departureTime,
>>>>>>> origin/Sanzid
    availableSeats,
    fuelCostContribution
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
      const apiRes = await axios.post(`${API_URL}/rides/create`, formData);
      setSuccess(apiRes.data.message);
      setLoading(false);
<<<<<<< HEAD
      
      // Clear form
=======

>>>>>>> origin/Sanzid
      setFormData({
        departureLocation: '', destination: '', departureTime: '',
        availableSeats: '1', fuelCostContribution: '0',
      });
<<<<<<< HEAD
      
      // Redirect to the driver dashboard after 2 seconds
=======

>>>>>>> origin/Sanzid
      setTimeout(() => {
        navigate('/driver/dashboard');
      }, 2000);

    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create ride. Please try again.');
      }
      console.error(err);
    }
  };

<<<<<<< HEAD
  // Helper component for form inputs
  const InputField = ({ label, name, value, onChange, ...props }) => (
    <div>
      <label 
        htmlFor={name} 
=======
  const InputField = ({ label, name, value, onChange, ...props }) => (
    <div>
      <label
        htmlFor={name}
>>>>>>> origin/Sanzid
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
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
        Offer a New Ride
      </h1>
      <p className="mb-6 text-gray-600">
        Fill out the details below to post your ride for students.
      </p>
<<<<<<< HEAD
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Messages */}
        {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}
        {success && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">{success}</div>}
        
=======

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}
        {success && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">{success}</div>}

>>>>>>> origin/Sanzid
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Departure Location" name="departureLocation" value={departureLocation} placeholder="e.g., BRACU" required />
          <InputField label="Destination" name="destination" value={destination} placeholder="e.g., Mirpur 10" required />
          <InputField label="Departure Time" name="departureTime" value={departureTime} type="datetime-local" required />
          <InputField label="Available Seats" name="availableSeats" value={availableSeats} type="number" min="1" required />
          <InputField label="Fuel Cost (TK)" name="fuelCostContribution" value={fuelCostContribution} type="number" min="0" required />
        </div>
<<<<<<< HEAD
        
        <div>
          <button 
            type="submit" 
=======

        <div>
          <button
            type="submit"
>>>>>>> origin/Sanzid
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'Creating Ride...' : 'Publish Ride Offer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateRidePage;