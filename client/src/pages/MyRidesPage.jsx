// client/src/pages/MyRidesPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewModal from '../components/ReviewModal';

import { API_URL } from '../config';

const MyRidesPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for Review Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/bookings/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load your bookings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleOpenReview = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleReviewSuccess = () => {
        setToastMessage('Review submitted successfully!');
        setTimeout(() => setToastMessage(''), 3000); // Clear after 3s
        fetchBookings(); // Refresh list potentially (though not strictly needed unless we shadow the button)
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in pb-12">
            <div className="mb-8 border-b border-gray-100 pb-4">
                <h1 className="text-3xl font-heading font-bold text-gray-900">
                    My Rides
                </h1>
                <p className="text-gray-500 mt-1">View your booking history and rate your rides.</p>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-24 right-5 animate-slide-up z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {toastMessage}
                </div>
            )}

            {loading && (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                </div>
            )}

            {error && (
                <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
                    {error}
                </div>
            )}

            {!loading && bookings.length === 0 && (
                <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-xl font-bold text-gray-900">No rides yet</p>
                    <p className="text-gray-500 mt-2">Book a ride to start your journey!</p>
                </div>
            )}

            <div className="space-y-4">
                {bookings.map((booking) => {
                    const departureDate = new Date(booking.ride.departureTime);
                    // Check if ride is past/completed to allow rating.
                    // Simplified logic: if status is COMPLETED or date is past
                    const isCompleted = booking.ride.status === 'COMPLETED' || departureDate < new Date();

                    return (
                        <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 flex flex-col md:flex-row items-center transition-all hover:shadow-md">

                            {/* Date Block */}
                            <div className="flex flex-col items-center justify-center bg-surface-50 p-4 rounded-lg min-w-[100px] mb-4 md:mb-0 md:mr-6">
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                                    {departureDate.toLocaleDateString(undefined, { month: 'short' })}
                                </span>
                                <span className="text-3xl font-bold text-brand-600">
                                    {departureDate.getDate()}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    {departureDate.toLocaleDateString(undefined, { weekday: 'short' })}
                                </span>
                            </div>

                            {/* Info Block */}
                            <div className="flex-1 text-center md:text-left w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 font-heading">
                                        {booking.ride.destination}
                                    </h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 md:mt-0 w-fit mx-auto md:mx-0 ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="text-gray-500 text-sm space-y-1">
                                    <p className="flex items-center justify-center md:justify-start">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2"></span>
                                        From: {booking.ride.departureLocation}
                                    </p>
                                    <p className="flex items-center justify-center md:justify-start">
                                        <span className="w-1.5 h-1.5 rounded-full bg-surface-400 mr-2"></span>
                                        Driver: <span className="font-semibold text-gray-700 ml-1">{booking.ride.driver.name}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Action Block */}
                            <div className="mt-6 md:mt-0 md:ml-6 flex items-center">
                                {isCompleted && (
                                    <button
                                        onClick={() => handleOpenReview(booking)}
                                        className="btn-outline px-6 py-2 text-sm border-brand-200 hover:bg-brand-50 hover:border-brand-300 text-brand-700"
                                    >
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                            Rate Driver
                                        </div>
                                    </button>
                                )}
                                {!isCompleted && (
                                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-md">
                                        Upcoming
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Reusable Modal */}
            {selectedBooking && (
                <ReviewModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    booking={selectedBooking}
                    onSuccess={handleReviewSuccess}
                />
            )}
        </div>
    );
};

export default MyRidesPage;
