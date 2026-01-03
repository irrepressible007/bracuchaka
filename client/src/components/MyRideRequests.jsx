
import React, { useState, useEffect } from 'react';
import axios from 'axios';
<<<<<<< HEAD
=======
import { API_URL } from '../config';
>>>>>>> origin/Sanzid

const MyRideRequests = () => {
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            const token = localStorage.getItem('token');
<<<<<<< HEAD
            const response = await axios.get('http://localhost:5000/api/rides/requests/my', {
=======
            const response = await axios.get(`${API_URL}/rides/requests/my`, {
>>>>>>> origin/Sanzid
                headers: { 'x-auth-token': token }
            });
            setMyRequests(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching my requests:', err);
            setError('Failed to load your ride requests.');
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        console.log('Attempting to cancel request:', id);
        if (!window.confirm('Are you sure you want to cancel this request?')) {
            console.log('Cancellation aborted by user');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            console.log('Token found:', !!token);

<<<<<<< HEAD
            const url = `http://localhost:5000/api/rides/request/${id}/cancel`;
=======
            const url = `${API_URL}/rides/request/${id}/cancel`;
>>>>>>> origin/Sanzid
            console.log('Sending PUT to:', url);

            const response = await axios.put(url, {}, {
                headers: { 'x-auth-token': token }
            });

            console.log('Cancel response:', response.data);

            // Update UI locally
            setMyRequests(prev => prev.map(req =>
                req._id === id ? { ...req, status: 'cancelled' } : req
            ));

            alert('Ride request cancelled successfully.');
        } catch (err) {
            console.error('Error cancelling request:', err);
            if (err.response) {
                console.error('Server Error Data:', err.response.data);
                console.error('Server Error Status:', err.response.status);
                alert(`Failed: ${err.response.data.message || 'Server Error'}`);
            } else if (err.request) {
                console.error('No response received:', err.request);
                alert('Network error: No response from server.');
            } else {
                alert(`Error: ${err.message}`);
            }
        }
    };

    if (loading) return <div className="text-gray-500">Loading your requests...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    if (myRequests.length === 0) {
        return <p className="text-gray-500">You haven't made any ride requests yet.</p>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">My Ride Requests</h2>
            <div className="space-y-4">
                {myRequests.map(request => (
                    <div key={request._id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center space-x-2 mb-1">
                                <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${request.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                    request.status === 'accepted' ? 'bg-green-200 text-green-800' :
                                        request.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                                            'bg-gray-200 text-gray-800'
                                    }`}>
                                    {request.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(request.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-800 font-medium">
                                <span className="text-gray-500 text-sm">From:</span> {request.startLocation}
                                <span className="mx-2">→</span>
                                <span className="text-gray-500 text-sm">To:</span> {request.destination}
                            </p>
                        </div>

                        {request.status === 'pending' && (
                            <button
                                onClick={() => handleCancel(request._id)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded transition-colors"
                            >
                                Cancel Request
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyRideRequests;
