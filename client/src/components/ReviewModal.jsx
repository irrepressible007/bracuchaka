// client/src/components/ReviewModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

import { API_URL } from '../config';

const StarRating = ({ rating, setRating, hoverRating, setHoverRating }) => {
    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                >
                    <svg
                        className={`w-8 h-8 ${star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 fill-current'
                            }`}
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                </button>
            ))}
        </div>
    );
};

const ReviewModal = ({ isOpen, onClose, booking, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const payload = {
                rating,
                comment
            };

            if (booking.type === 'booking' || booking.booking) {
                payload.bookingId = booking._id; // Existing booking logic might pass object with _id being bookingId
            } else if (booking.type === 'request') {
                payload.rideRequestId = booking._id;
            } else if (booking.ride) {
                // Fallback for old structure if necessary, though MyRidesPage now normalizes
                payload.bookingId = booking._id;
            }

            await axios.post(
                `${API_URL}/reviews`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                {/* Background Overlay */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div>

                {/* Modal Panel */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2" id="modal-title">
                                    Rate your ride
                                </h3>
                                <div className="mt-2 text-sm text-gray-500 mb-6">
                                    How was your experience with <span className="font-semibold">{booking.ride.driver.name}</span>?
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="flex justify-center py-4">
                                        <StarRating
                                            rating={rating}
                                            setRating={setRating}
                                            hoverRating={hoverRating}
                                            setHoverRating={setHoverRating}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment (Optional)</label>
                                        <textarea
                                            rows="3"
                                            className="input-field w-full"
                                            placeholder="Share your experience..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        ></textarea>
                                    </div>

                                    {error && (
                                        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                            {error}
                                        </div>
                                    )}

                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-600 text-base font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
                                        >
                                            {loading ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
