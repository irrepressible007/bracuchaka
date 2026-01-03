import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

export default function RideFarePage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { startLocation, destination, distanceKm, fareTk, routeGeoJson } = state || {};
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!routeGeoJson) return;
    try {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current, { zoomControl: true });

      // OSM tiles (free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapInstanceRef.current);

      // Draw route
      const coords = routeGeoJson.coordinates.map(([lon, lat]) => [lat, lon]);
      const routeLine = L.polyline(coords, { color: '#4f46e5', weight: 5 }).addTo(mapInstanceRef.current);

      // Fit map to route
      mapInstanceRef.current.fitBounds(routeLine.getBounds());
    } catch (e) {
      setError('Failed to render map.');
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [routeGeoJson]);

  const handleRequestRide = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to request a ride.');
        setLoading(false);
        return;
      }

      await axios.post(
        'http://localhost:5000/api/rides/request',
        {
          startLocation,
          destination,
          fare: fareTk,
          distance: distanceKm ? `${distanceKm} km` : ''
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Ride request sent successfully! A driver will accept shortly.');

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send ride request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Ride Fare</h2>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md mb-4">
            {success}
          </div>
        )}

        <div className="space-y-2 mb-6">
          <div className="text-gray-700">
            <span className="font-medium">From:</span> {startLocation || '—'}
          </div>
          <div className="text-gray-700">
            <span className="font-medium">To:</span> {destination || '—'}
          </div>
          <div className="text-gray-700">
            <span className="font-medium">Distance:</span> {distanceKm != null ? `${distanceKm} km` : '—'}
          </div>
          <div className="text-gray-800 text-xl font-semibold">
            Fare: {fareTk != null ? `${fareTk} tk` : '—'}
          </div>
          <p className="text-xs text-gray-500">Rate: 25 tk per km</p>
        </div>

        {/* Map container */}
        <div className="mb-6">
          <div
            ref={mapRef}
            className="w-full"
            style={{ height: 300, borderRadius: 8, border: '1px solid #e5e7eb' }}
          />
        </div>

        <div className="space-y-3">
          {!success && (
            <button
              onClick={handleRequestRide}
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? 'Sending Request...' : 'Send Ride Request'}
            </button>
          )}

          <button
            onClick={() => navigate(-1)}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}