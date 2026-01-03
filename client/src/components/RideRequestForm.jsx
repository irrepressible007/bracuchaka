<<<<<<< HEAD
import React, { useState } from 'react';

const getAuthToken = () => {
  return localStorage.getItem('token');
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
      const token = getAuthToken();
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      const response = await fetch('http://localhost:5000/api/rides/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
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
=======
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPlaces } from '../utils/nominatim';
import { getDrivingRoute } from '../utils/osrm';

export default function RideRequestForm() {
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const [startQuery, setStartQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');

  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const [startSelected, setStartSelected] = useState(null); // { label, lat, lon }
  const [destSelected, setDestSelected] = useState(null);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        if (!startQuery) {
          setStartSuggestions([]);
          return;
        }
        const results = await searchPlaces(startQuery);
        setStartSuggestions(results.map(r => ({
          label: r.display_name,
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
        })));
      } catch (e) {
        // silent fail
      }
    }, 300);
    return () => clearTimeout(t);
  }, [startQuery]);

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        if (!destQuery) {
          setDestSuggestions([]);
          return;
        }
        const results = await searchPlaces(destQuery);
        setDestSuggestions(results.map(r => ({
          label: r.display_name,
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
        })));
      } catch (e) {
        // silent fail
      }
    }, 300);
    return () => clearTimeout(t);
  }, [destQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!startSelected || !destSelected) {
      setError('Please select both locations from the suggestions.');
      return;
    }

    try {
      const route = await getDrivingRoute(
        { lat: startSelected.lat, lon: startSelected.lon },
        { lat: destSelected.lat, lon: destSelected.lon }
      );

      const distanceKm = Math.round((route.distanceMeters / 1000) * 10) / 10;
      const fareTk = Math.round(distanceKm * 25);

      navigate('/fare', {
        state: {
          startLocation: startSelected.label,
          destination: destSelected.label,
          distanceKm,
          fareTk,
          routeGeoJson: route.geometry, // GeoJSON LineString
        },
      });
    } catch (err) {
      setError(err.message || 'Failed to compute route. Please refine locations.');
>>>>>>> origin/Sanzid
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Start input */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Start Location</label>
        <input
          type="text"
          value={startQuery}
          onChange={(e) => { setStartQuery(e.target.value); setStartSelected(null); }}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
          placeholder="Search a starting point"
          required
        />
        {startSuggestions.length > 0 && !startSelected && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow max-h-56 overflow-auto">
            {startSuggestions.map((s, idx) => (
              <li
                key={idx}
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                onClick={() => { setStartSelected(s); setStartQuery(s.label); setStartSuggestions([]); }}
              >
                {s.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Destination input */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Destination</label>
        <input
          type="text"
          value={destQuery}
          onChange={(e) => { setDestQuery(e.target.value); setDestSelected(null); }}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500"
          placeholder="Search a destination"
          required
        />
        {destSuggestions.length > 0 && !destSelected && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow max-h-56 overflow-auto">
            {destSuggestions.map((s, idx) => (
              <li
                key={idx}
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                onClick={() => { setDestSelected(s); setDestQuery(s.label); setDestSuggestions([]); }}
              >
                {s.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          Find Rides
        </button>
      </div>
    </form>
  );
}
>>>>>>> origin/Sanzid
