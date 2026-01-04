
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from "socket.io-client";

import { API_URL } from '../config';
import Chat from './Chat';

const DriverDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [activeRide, setActiveRide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial data fetch
    useEffect(() => {
        fetchInitialData();
        // Poll for status updates if in a ride
        const intervalId = setInterval(() => {
            if (activeRide && activeRide.status !== 'completed') {
                checkRideStatus();
            }
        }, 5000);
        return () => clearInterval(intervalId);
    }, [activeRide?._id]);

    // Real-time Status Updates via Socket
    useEffect(() => {
        const socket = io(API_URL.replace('/api', ''), {
            path: '/socket.io',
            transports: ['websocket', 'polling']
        });

        // Listen for updates to CURRENT ride
        if (activeRide && activeRide._id) {
            socket.emit('join_ride', activeRide._id);
            socket.on('ride_updated', (updatedRide) => {
                console.log('Real-time update received:', updatedRide);

                // If ride is cancelled, clear active ride
                if (updatedRide.status === 'cancelled') {
                    setActiveRide(null);
                    setRequests(prev => prev.filter(r => r._id !== updatedRide._id)); // Remove from list if there
                    alert("This ride has been cancelled by the passenger.");
                } else {
                    setActiveRide(updatedRide);
                }
            });
        }

        // Listen for NEW requests (Global event for now)
        socket.on('new_ride_request', (newRequest) => {
            console.log('New ride request received:', newRequest);
            // Only add if not already in list
            setRequests(prev => {
                if (prev.find(r => r._id === newRequest._id)) return prev;
                return [newRequest, ...prev];
            });
        });

        return () => socket.disconnect();
    }, [activeRide?._id]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // 1. Check for active ride first
            const rideRes = await axios.get(`${API_URL}/rides/requests/current`, {
                headers: { 'x-auth-token': token }
            });

            if (rideRes.data) {
                setActiveRide(rideRes.data);
            } else {
                // 2. If no active ride, fetch pending requests
                const reqRes = await axios.get(`${API_URL}/rides/requests/pending`, {
                    headers: { 'x-auth-token': token }
                });
                setRequests(reqRes.data);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to load dashboard data.');
            setLoading(false);
        }
    };

    const checkRideStatus = async () => {
        if (!activeRide) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/rides/requests/current`, {
                headers: { 'x-auth-token': token }
            });
            if (res.data) {
                // Update state (e.g. if passenger reached)
                setActiveRide(res.data);
            } else {
                // If null, ride is completed/gone
                setActiveRide(null);
                fetchInitialData(); // Refresh requests list
            }
        } catch (err) {
            console.error("Error polling ride status", err);
        }
    }

    const handleAccept = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_URL}/rides/request/${id}/accept`, {}, {
                headers: { 'x-auth-token': token }
            });
            // Switch to active ride view
            setActiveRide(res.data.rideRequest);
            setRequests([]); // Clear requests (or just hide them)
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to accept ride.');
        }
    };

    const handleEndRide = async () => {
        if (!activeRide) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_URL}/rides/request/${activeRide._id}/driver-end`, {}, {
                headers: { 'x-auth-token': token }
            });

            // Update local state with latest from server
            const updatedRide = res.data;
            setActiveRide(updatedRide);

            if (updatedRide.status === 'completed') {
                alert("Ride Completed! Both parties have confirmed.");
                setActiveRide(null);
                fetchInitialData();
            } else {
                // Logic handled by UI rendering "Waiting for passenger..."
            }

        } catch (err) {
            console.error(err);
            alert('Failed to end ride.');
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to reject this request?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/rides/request/${id}/reject`, {}, {
                headers: { 'x-auth-token': token }
            });
            setRequests(requests.filter(req => req._id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to reject ride request.');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    // --- ACTIVE RIDE VIEW ---
    if (activeRide) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden max-w-3xl mx-auto">
                    <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Current Ride Active
                        </h2>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {activeRide.status.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-gray-500 text-sm uppercase tracking-wide font-semibold mb-1">Passenger</h3>
                                <p className="text-2xl font-bold text-gray-800">{activeRide.requester?.name || 'Unknown'}</p>
                                {/* Phone Number Display - ALREADY WAS HERE IN HEAD */}
                                {activeRide.requester?.phone && <p className="text-blue-600 font-medium mt-1">{activeRide.requester.phone}</p>}
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="mb-3">
                                    <span className="text-gray-400 text-xs uppercase font-bold">From</span>
                                    <p className="font-semibold text-gray-800">{activeRide.startLocation}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs uppercase font-bold">To</span>
                                    <p className="font-semibold text-gray-800">{activeRide.destination}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-b border-gray-100 py-6 mb-8">
                            <div>
                                <span className="text-gray-400 text-sm font-medium">Est. Distance</span>
                                <p className="text-xl font-bold text-gray-800">{activeRide.distance || '--'}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-gray-400 text-sm font-medium">Fare</span>
                                <p className="text-3xl font-bold text-green-600">৳{activeRide.fare}</p>
                            </div>
                        </div>

                        {/* Status Messages for Dual Confirmation */}
                        <div className="mb-6">
                            {activeRide.driverEnded ? (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-700">
                                    <p className="font-bold">You have ended the ride.</p>
                                    <p>Waiting for passenger to confirm arrival to complete the transaction.</p>
                                </div>
                            ) : (
                                activeRide.passengerReached && (
                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-blue-700 mb-4">
                                        <p className="font-bold">Passenger has confirmed arrival!</p>
                                        <p>Please end the ride to complete.</p>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Driver PIN Input to Start Ride */}
                        {activeRide.status === 'accepted' ? (
                            <div className="mt-4 p-6 bg-blue-50 rounded-xl border border-blue-100">
                                <h3 className="text-lg font-bold text-blue-900 mb-3 text-center">Enter Ride PIN</h3>
                                <p className="text-sm text-blue-600 text-center mb-4">Ask the passenger for the 4-digit PIN to start the ride.</p>

                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-center">
                                        <input
                                            type="text"
                                            placeholder="0 0 0 0"
                                            maxLength="4"
                                            id="pinInput"
                                            className="w-48 text-center text-3xl font-mono font-bold tracking-[0.5em] py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-0 outline-none uppercase bg-white text-gray-800"
                                        />
                                    </div>
                                    <button
                                        onClick={async () => {
                                            const pin = document.getElementById('pinInput').value;
                                            if (!pin || pin.length !== 4) return alert('Please enter a valid 4-digit PIN');

                                            try {
                                                const token = localStorage.getItem('token');
                                                const res = await axios.put(`${API_URL}/rides/request/${activeRide._id}/start-ride`, { pin }, {
                                                    headers: { 'x-auth-token': token }
                                                });
                                                setActiveRide(res.data.rideRequest);
                                                alert('Ride Started!');
                                            } catch (err) {
                                                console.error(err);
                                                alert(err.response?.data?.message || 'Failed to start ride');
                                            }
                                        }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-md transition-all active:scale-95"
                                    >
                                        VERIFY PIN & START RIDE
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleEndRide}
                                disabled={activeRide.driverEnded}
                                className={`w-full py-4 rounded-lg font-bold text-lg shadow-md transition-all duration-300 ${activeRide.driverEnded
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                                    }`}
                            >
                                {activeRide.driverEnded ? 'Waiting for Passenger...' : 'End Ride'}
                            </button>
                        )}

                        {/* --- Chat Component --- */}
                        <div className="mt-8 h-96">
                            <Chat rideId={activeRide._id} role="driver" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- REQUESTS LIST VIEW ---
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-4">Ride Requests</h1>

            {requests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No ride requests nearby.</p>
                    <p className="text-gray-400 mt-1">We'll update this automatically when new requests come in.</p>
                    <button onClick={fetchInitialData} className="mt-6 text-blue-600 hover:text-blue-800 font-medium">Refresh List</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map(request => (
                        <div key={request._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 group">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3">
                                <h3 className="text-white font-bold flex items-center justify-between">
                                    {request.requester?.name || 'Passenger'}
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white font-normal">New</span>
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <div className="mt-1 min-w-[20px] flex flex-col items-center mr-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                            <div className="w-0.5 h-6 bg-gray-200 my-0.5"></div>
                                            <div className="w-2.5 h-2.5 rounded-sm bg-gray-800"></div>
                                        </div>
                                        <div className="flex-1 w-full">
                                            <div className="mb-3">
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pick Up</p>
                                                <p className="text-gray-800 font-medium leading-tight">{request.startLocation}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Drop Off</p>
                                                <p className="text-gray-800 font-medium leading-tight">{request.destination}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* --- NEW SECTIONS FOR FARE AND DISTANCE --- */}
                                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md mt-2">
                                        <div>
                                            <span className="text-xs text-gray-400 font-bold uppercase">Distance</span>
                                            <p className="font-semibold text-gray-800">{request.distance || '--'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-400 font-bold uppercase">Fare</span>
                                            <p className="font-bold text-green-600">৳{request.fare || '--'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center gap-3 border-t border-gray-50 mt-2">
                                    <button
                                        onClick={() => handleReject(request._id)}
                                        className="flex-1 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-500 hover:border-red-200 font-bold py-2.5 px-4 rounded-lg transition-all duration-200"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => handleAccept(request._id)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DriverDashboard;
