// client/src/pages/UserDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RideRequestForm from '../components/RideRequestForm';
import MyRideRequests from '../components/MyRideRequests';
import Chat from './Chat';
import io from "socket.io-client";

import { API_URL } from '../config';

// --- RideCard Component ---
const RideCard = ({ ride, onBook }) => {
  const [isBooked, setIsBooked] = useState(false);
  const departure = new Date(ride.departureTime);
  const date = departure.toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  });
  const time = departure.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  });

  const handleBook = () => {
    onBook(ride._id);
    setIsBooked(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-brand-200 hover:-translate-y-1 group">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-brand opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
        <img
          src={ride.vehicle.systemImageUrl.replace('/images/', '/')}
          alt={`${ride.vehicle.bikeName} ${ride.vehicle.bikeModel}`}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.onerror = null; e.target.src = "/land.png"; }}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-700 shadow-sm z-20">
          {ride.vehicle.vehicleType}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-heading font-bold text-gray-900 line-clamp-1">{ride.destination}</h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <span className="w-2 h-2 rounded-full bg-brand-400 mr-2"></span>
            From: {ride.departureLocation}
          </p>
        </div>

        <div className="flex items-center justify-between mb-6 bg-surface-50 p-3 rounded-lg">
          <div>
            <span className="block text-xs text-gray-400 uppercase tracking-wider font-semibold">Date</span>
            <span className="text-sm font-bold text-gray-800">{date}</span>
          </div>
          <div className="text-right">
            <span className="block text-xs text-gray-400 uppercase tracking-wider font-semibold">Time</span>
            <span className="text-sm font-bold text-brand-600">{time}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-200 pt-4 mb-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Rider
            </span>
            <span className="font-medium text-gray-900 flex items-center">
              {ride.driver.name}
              {ride.driver.averageRating > 0 && (
                <span className="ml-2 flex items-center text-xs font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                  <svg className="w-3 h-3 mr-0.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                  {ride.driver.averageRating.toFixed(1)}
                  <span className="text-gray-400 font-normal ml-0.5">({ride.driver.ratingCount})</span>
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Seats Available</span>
            <span className={`font-bold px-2 py-0.5 rounded ${ride.availableSeats > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {ride.availableSeats}
            </span>
          </div>
        </div>

        <div className="mt-auto flex justify-between items-center pt-2">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Fare</span>
            <p className="text-2xl font-bold text-brand-700 leading-none">
              ৳{ride.fuelCostContribution}
            </p>
          </div>
          <button
            onClick={handleBook}
            disabled={isBooked || ride.availableSeats === 0}
            className={`btn-primary px-6 py-2 text-sm ${isBooked || ride.availableSeats === 0
              ? 'bg-gray-300 text-gray-500 shadow-none cursor-not-allowed hover:bg-gray-300'
              : ''
              }`}
          >
            {isBooked ? 'Booked' : (ride.availableSeats === 0 ? 'Full' : 'Book Now')}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main UserDashboard Page ---
function UserDashboard() {
  const [rides, setRides] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchParams, setSearchParams] = useState({ start: '', destination: '' });
  const [showSupportModal, setShowSupportModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
    // Poll for status updates (backup)
    const interval = setInterval(() => {
      checkActiveRide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Real-time Status Updates via Socket
  useEffect(() => {
    if (activeRide && activeRide._id) {
      const socket = io(API_URL.replace('/api', ''), {
        path: '/socket.io',
        transports: ['websocket', 'polling']
      });

      socket.emit('join_ride', activeRide._id);

      socket.on('ride_updated', (updatedRide) => {
        console.log('Real-time update received:', updatedRide);
        setActiveRide(updatedRide);
      });

      return () => socket.disconnect();
    }
  }, [activeRide?._id]);

  const fetchInitialData = async () => {
    await checkActiveRide();
    // If we don't have an active ride, we could fetch available rides (but let's wait for search)
    setLoading(false);
  }

  const checkActiveRide = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/rides/requests/current`, {
        headers: { 'x-auth-token': token }
      });

      if (res.data) {
        setActiveRide(res.data);
        // If we have an active ride, we don't need the list of searchable rides
      } else {
        if (activeRide) setActiveRide(null); // Clear if it was set
      }
    } catch (err) {
      console.error("Error checking active ride:", err);
    }
  };

  // Only fetch available rides if not in active ride
  useEffect(() => {
    if (!activeRide) {
      const fetchRides = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${API_URL}/rides/search`, {
            params: {
              start: searchParams.start,
              destination: searchParams.destination,
            }
          });
          setRides(res.data);
        } catch (err) {
          console.error(err);
          setError('Failed to load available rides.');
        } finally {
          setLoading(false);
        }
      };
      fetchRides();
    }
  }, [searchParams, activeRide]);

  const handleBookRide = async (rideId) => {
    // Existing logic for "Shared Ride" booking
    // ... (Your existing booking logic)
    setError('');
    setSuccess('');
    try {
      const res = await axios.post(`${API_URL}/bookings/create/${rideId}`);
      setSuccess(res.data.message);
      setRides(prevRides =>
        prevRides.map(ride =>
          ride._id === rideId
            ? { ...ride, availableSeats: ride.availableSeats - 1 }
            : ride
        )
      );
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Booking failed. Please try again.');
      }
    }
  };

  const handleReachedDestination = async () => {
    if (!activeRide) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/rides/request/${activeRide._id}/passenger-reach`, {}, {
        headers: { 'x-auth-token': token }
      });

      const updatedRide = res.data;
      setActiveRide(updatedRide);

      if (updatedRide.status === 'completed') {
        alert("You have arrived! Ride completed.");
        setActiveRide(null);
        // Refresh view
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  }

  const handleCancelRequest = async () => {
    if (!activeRide) return;
    if (!window.confirm("Are you sure you want to cancel this ride request?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/rides/request/${activeRide._id}/cancel`, {}, {
        headers: { 'x-auth-token': token }
      });
      // Socket will handle the update, but we can optimistically clear it or wait
      setActiveRide(null); // Clear immediately for better UX
      alert('Ride request cancelled.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to cancel request.');
    }
  };

  // --- RENDER ACTIVE RIDE VIEW ---
  if (activeRide && activeRide.driver) { // Only show full "In Ride" view if we have a driver
    return (
      <div className="w-full max-w-7xl mx-auto animate-fade-in p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">Current Ride</h1>
          <p className="text-gray-500 mt-1">You are currently on a ride.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header / Map Placeholder */}

          <div className="h-48 bg-gray-200 relative">
            {/* Leaflet map could go here */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-lg">
              Map View (Tracking...)
            </div>
            <div className="absolute bottom-4 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-lg text-sm font-bold text-blue-600">
              {activeRide.status === 'in_progress' ? 'En Route' : (activeRide.status === 'accepted' ? 'Driver Arriving' : 'Arriving')}
            </div>
          </div>

          {/* PIN Display for Passenger */}
          {activeRide.status === 'accepted' && (
            <div className="bg-blue-600 text-white p-6 text-center">
              <p className="text-blue-100 uppercase text-xs font-bold tracking-widest mb-1">Ride Start PIN</p>
              <div className="text-5xl font-mono font-bold tracking-[0.2em]">{activeRide.verificationPin}</div>
              <p className="text-blue-200 text-sm mt-2">Give this code to the driver to start the ride.</p>
            </div>
          )}

          <div className="p-8">
            {/* Driver & Vehicle Info */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                  {activeRide.driver?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{activeRide.driver?.name || 'Driver'}</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="font-semibold text-gray-700 mr-2">{activeRide.vehicle?.bikeName}</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{activeRide.vehicle?.plateNumber}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 uppercase font-bold tracking-wide">Fare</p>
                <p className="text-3xl font-bold text-gray-900">৳{activeRide.fare}</p>
              </div>
            </div>

            {/* Ride Path */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">From</p>
                  <p className="font-semibold text-lg text-gray-900">{activeRide.startLocation}</p>
                </div>
                <div className="text-gray-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase">To</p>
                  <p className="font-semibold text-lg text-gray-900">{activeRide.destination}</p>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            <div className="mb-6">
              {activeRide.passengerReached ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-700">
                  <p className="font-bold">You have confirmed arrival.</p>
                  <p>Waiting for driver to end the ride.</p>
                </div>
              ) : (
                activeRide.driverEnded && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-700 mb-4">
                    <p className="font-bold">Driver has ended the ride.</p>
                    <p>Please confirm you have reached your destination.</p>
                  </div>
                )
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleReachedDestination}
              disabled={activeRide.passengerReached}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${activeRide.passengerReached
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:-translate-y-1'
                }`}
            >
              {activeRide.passengerReached ? 'Waiting for Driver...' : 'Reached Destination'}
            </button>

            {/* --- Chat Component --- */}
            <div className="mt-8 h-96">
              <Chat rideId={activeRide._id} role="rider" />
            </div>
          </div>
        </div>
      </div >
    );
  }



  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in relative min-h-screen">
      {/* Support Floating Button */}
      <button
        onClick={() => setShowSupportModal(true)}
        className="fixed bottom-28 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-40 flex items-center justify-center group border-2 border-white/20"
        title="Contact Support"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Help & Support</span>
      </button>

      {showSupportModal && <SupportModal onClose={() => setShowSupportModal(false)} />}

      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900">
          Welcome Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Find and book your next ride easily.</p>
      </div>

      {/* If I have a pending request waiting for acceptance, maybe show a status bar? */}
      {activeRide && activeRide.status === 'pending' && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between animate-pulse">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-lg">Looking for a driver...</h3>
              <p className="text-blue-700">We are connecting you with nearby drivers.</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-blue-800">Going to: {activeRide.destination}</p>
            <button
              onClick={handleCancelRequest}
              className="text-sm text-red-500 hover:text-red-700 font-bold mt-1 underline"
            >
              Cancel Request
            </button>
          </div>
        </div>
      )}

      {/* --- Search Form (Only if not pending?) --- */}
      {/* existing logic... if pending, maybe hide form or keep it? user might want to submit another? usually 1 request at a time */}
      {!activeRide && (
        <div className="card mb-10 border-none shadow-brand-500/10 shadow-lg relative overflow-hidden p-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50/50 rounded-full blur-3xl -z-10 transform translate-x-12 -translate-y-12"></div>
          <h2 className="text-2xl font-bold font-heading text-brand-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Find a Ride
          </h2>
          <RideRequestForm />
        </div>
      )}

      {activeRide && <MyRideRequests />} {/* Show list but maybe minimized? */}
      {!activeRide && <MyRideRequests />}


      {!activeRide && (
        <>
          <h2 className="text-xl font-bold font-heading text-gray-800 mb-6 border-l-4 border-brand-500 pl-3">
            Available Shared Rides
          </h2>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          )}

          {error && (
            <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg shadow-sm">
              <p className="font-bold">Success</p>
              <p className="text-sm">{success}</p>
            </div>
          )}

          {!loading && !error && rides.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p className="text-lg font-medium text-gray-900">No rides found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria or check back later.</p>
            </div>
          )}

          {/* Ride Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.map(ride => (
              <RideCard key={ride._id} ride={ride} onBook={handleBookRide} />
            ))}
          </div>
        </>
      )}

    </div>
  );
}

// --- Support Modal Component ---
const SupportModal = ({ onClose }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/support`, { description }, {
        headers: { 'x-auth-token': token }
      });
      alert('Support ticket submitted successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Contact Support</h3>
          <button onClick={onClose} className="hover:bg-brand-700 p-1 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Describe your issue</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all h-32"
              placeholder="How can we help you?"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-bold text-white transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg'}`}
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;
