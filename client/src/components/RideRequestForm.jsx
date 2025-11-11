import React, { useState } from 'react';

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const RideRequestForm = () => {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestRide = async () => {
    if (!startLocation || !destination) {
      alert('Please provide both a starting location and a destination.');
      return;
    }

    setIsLoading(true);

    try {
      // --- THIS IS THE FIX ---
      // I have replaced the relative URL with the full, absolute URL of your backend.
      const response = await fetch('http://localhost:5000/api/rides/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ startLocation, destination })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      alert(`Success: ${result.message}`);
      console.log('Server responded with:', result.data);

    } catch (error) {
      console.error('Failed to request ride:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      width: '300px'
    }}>
      <h3 style={{ marginTop: 0 }}>Request a Ride</h3>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="start" style={{ display: 'block', marginBottom: '5px' }}>Start Location</label>
        <input
          id="start"
          type="text"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          placeholder="Enter starting point"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="destination" style={{ display: 'block', marginBottom: '5px' }}>Destination</label>
        <input
          id="destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      <button
        onClick={handleRequestRide}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Requesting...' : 'Find a Ride'}
      </button>
    </div>
  );
};

export default RideRequestForm;