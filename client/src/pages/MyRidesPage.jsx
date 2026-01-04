
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewModal from '../components/ReviewModal';
import ReportModal from '../components/ReportModal';
import { API_URL } from '../config';

const MyRidesPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for Review Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // State for Report Modal
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportBooking, setReportBooking] = useState(null);

    const [toastMessage, setToastMessage] = useState('');

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Fetch Shared Ride Bookings
            const bookingsRes = await axios.get(`${API_URL}/bookings/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch Instant Ride Requests
            const requestsRes = await axios.get(`${API_URL}/rides/requests/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Normalize Data
            const normalizedBookings = bookingsRes.data.map(b => ({
                ...b,
                type: 'booking',
                date: new Date(b.ride.departureTime),
                displayDestination: b.ride.destination,
                displayStart: b.ride.departureLocation,
                driverName: b.ride.driver.name,
                driverId: b.ride.driver._id,
                status: b.status,
                canReview: b.ride.status === 'COMPLETED' || new Date(b.ride.departureTime) < new Date()
            }));

            const normalizedRequests = requestsRes.data.map(r => ({
                _id: r._id,
                type: 'request',
                date: new Date(r.createdAt), // Use creation time effectively as ride time
                displayDestination: r.destination,
                displayStart: r.startLocation,
                driverName: r.driver ? r.driver.name : 'Waiting for Driver',
                driverId: r.driver ? r.driver._id : null,
                status: r.status,
                canReview: r.status === 'completed',
                ride: { // Mimic structure for existing components if needed, or handle in render
                    driver: r.driver,
                    _id: r._id // Use request ID as pseudo ride ID
                }
            }));

            // Merge and Sort by Date (Newest first)
            const allRides = [...normalizedBookings, ...normalizedRequests].sort((a, b) => b.date - a.date);

            setBookings(allRides);
        } catch (err) {
            console.error(err);
            setError('Failed to load your rides.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    // Review Handlers
    const handleOpenReview = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleReviewSuccess = () => {
        showToast('Review submitted successfully!');
        fetchBookings();
    };

    // Report Handlers
    const handleOpenReport = (booking) => {
        setReportBooking(booking);
        setIsReportModalOpen(true);
    };

    const handleReportSuccess = () => {
        showToast('Report submitted successfully. We will investigate.');
    };

    // Block Handler
    const handleBlock = async (driverId, driverName) => {
        if (!window.confirm(`Are you sure you want to block ${driverName}? You won't be able to book rides with them again.`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_URL}/support/block`,
                { userIdToBlock: driverId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showToast(`Blocked ${driverName} successfully.`);
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || 'Failed to block user');
        }
    };

    // Tab State
    const [activeTab, setActiveTab] = useState('upcoming');

    // Filter Logic
    const filteredBookings = bookings.filter(ride => {
        const isPast = new Date(ride.date) < new Date();
        const isCompletedOrCancelled = ['completed', 'cancelled', 'rejected', 'COMPLETED', 'CANCELLED'].includes(ride.status);

        if (activeTab === 'upcoming') {
            return !isPast && !isCompletedOrCancelled;
        } else {
            return isPast || isCompletedOrCancelled;
        }
    });

    return (
        <div className="max-w-7xl mx-auto animate-fade-in pb-12">
            <div className="mb-8 border-b border-gray-100 pb-4">
                <h1 className="text-3xl font-heading font-bold text-gray-900">
                    My Rides
                </h1>
                <p className="text-gray-500 mt-1">View your booking history and rate your rides.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-surface-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming'
                            ? 'bg-white text-brand-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                        }`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'history'
                            ? 'bg-white text-brand-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                        }`}
                >
                    History
                </button>
            </div>


            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-24 right-5 animate-slide-up z-50 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg font-medium flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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

            {!loading && filteredBookings.length === 0 && (
                <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-xl font-bold text-gray-900">No {activeTab} rides found</p>
                    <p className="text-gray-500 mt-2">
                        {activeTab === 'upcoming' ? "Book a ride to see it here!" : "Your completion history will appear here."}
                    </p>
                </div>
            )}

            <div className="space-y-4">
                {filteredBookings.map((item) => {
                    const departureDate = item.date;
                    const isCompleted = item.canReview;

                    return (
                        <div key={item._id} className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 flex flex-col md:flex-row items-center transition-all hover:shadow-md">

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
                                        {item.displayDestination}
                                    </h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 md:mt-0 w-fit mx-auto md:mx-0 ${item.status === 'CONFIRMED' || item.status === 'completed' || item.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                        item.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="text-gray-500 text-sm space-y-1">
                                    <p className="flex items-center justify-center md:justify-start">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2"></span>
                                        From: {item.displayStart}
                                    </p>
                                    <p className="flex items-center justify-center md:justify-start">
                                        <span className="w-1.5 h-1.5 rounded-full bg-surface-400 mr-2"></span>
                                        Driver: <span className="font-semibold text-gray-700 ml-1">{item.driverName}</span>
                                    </p>
                                    {/* Action Links */}
                                    {item.driverId && (
                                        <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                                            <button
                                                onClick={() => handleOpenReport(item)}
                                                className="flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                                            >
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5 mr-1.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                Report Issue
                                            </button>
                                            <button
                                                onClick={() => handleBlock(item.driverId, item.driverName)}
                                                className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-900 transition-colors"
                                            >
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5 mr-1.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                </svg>
                                                Block Driver
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Block */}
                            <div className="mt-6 md:mt-0 md:ml-6 flex items-center">
                                {isCompleted && (
                                    <button
                                        onClick={() => handleOpenReview(item)}
                                        className="btn-outline px-6 py-2 text-sm border-brand-200 hover:bg-brand-50 hover:border-brand-300 text-brand-700"
                                    >
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                            Rate Driver
                                        </div>
                                    </button>
                                )}
                                {!isCompleted && item.status !== 'cancelled' && item.status !== 'rejected' && (
                                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-md">
                                        Upcoming / Active
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Reusable Modal for Reviews */}
            {selectedBooking && (
                <ReviewModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    booking={selectedBooking}
                    onSuccess={handleReviewSuccess}
                />
            )}

            {/* Reusable Modal for Reporting */}
            {reportBooking && (
                <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    reportedUser={reportBooking.ride.driver}
                    rideId={reportBooking.ride._id}
                    onSuccess={handleReportSuccess}
                />
            )}
        </div>
    );
};

export default MyRidesPage;
