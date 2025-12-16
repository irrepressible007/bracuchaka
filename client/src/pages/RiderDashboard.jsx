
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const RiderDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/rides/requests/pending`, {
                headers: { 'x-auth-token': token }
            });
            setRequests(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to load ride requests.');
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/rides/request/${id}/accept`, {}, {
                headers: { 'x-auth-token': token }
            });
            // Update UI by removing the accepted request
            setRequests(requests.filter(req => req._id !== id));
            alert('Ride request accepted successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to accept ride request.');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading requests...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Ride Requests</h1>

            {requests.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-600 text-lg">No pending ride requests at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map(request => (
                        <div key={request._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                            <div className="bg-blue-600 px-4 py-2">
                                <h3 className="text-white font-semibold">
                                    {request.requester?.name || 'Passenger'}
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">From</span>
                                    <p className="text-gray-800 font-medium">{request.startLocation}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">To</span>
                                    <p className="text-gray-800 font-medium">{request.destination}</p>
                                </div>
                                <div className="pt-4">
                                    <button
                                        onClick={() => handleAccept(request._id)}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span>Accept Ride</span>
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

export default RiderDashboard;
