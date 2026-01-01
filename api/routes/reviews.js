// api/routes/reviews.js

const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Ride = require('../models/Ride'); // Import Ride to check completion status
const { auth, authorize } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Create a new review for a completed ride
// @access  Private (USER only)
router.post('/', [auth, authorize(['USER'])], async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const reviewerId = req.user.id;

        // 1. Verify Booking exists
        const booking = await Booking.findById(bookingId).populate('ride');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // 2. Verify Booking belongs to User
        if (booking.user.toString() !== reviewerId) {
            return res.status(403).json({ message: 'Not authorized to review this booking' });
        }

        // 3. Verify Ride is Completed (Optional: or departure time is in the past)
        // For now, we'll allow reviewing if the ride status is COMPLETED or if departureTime is in the past
        // const isPast = new Date(booking.ride.departureTime) < new Date();
        // if (booking.ride.status !== 'COMPLETED' && !isPast) {
        //   return res.status(400).json({ message: 'Cannot review a ride that hasn\'t happened yet' });
        // }

        // 4. Check if already reviewed (Schema handles this, but good to check)
        const existingReview = await Review.findOne({ booking: bookingId, reviewer: reviewerId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this ride' });
        }

        const driverId = booking.ride.driver;

        const newReview = new Review({
            booking: bookingId,
            reviewer: reviewerId,
            driver: driverId,
            ride: booking.ride._id,
            rating: Number(rating),
            comment
        });

        await newReview.save();

        // 5. Update Driver's Average Rating
        const reviews = await Review.find({ driver: driverId });
        const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const avgRating = totalRating / reviews.length;

        await User.findByIdAndUpdate(driverId, {
            averageRating: avgRating,
            ratingCount: reviews.length
        });

        res.status(201).json({ message: 'Review submitted successfully', review: newReview });

    } catch (err) {
        console.error('CREATE_REVIEW_ERROR:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/reviews/driver/:driverId
// @desc    Get all reviews for a specific driver
// @access  Public
router.get('/driver/:driverId', async (req, res) => {
    try {
        const reviews = await Review.find({ driver: req.params.driverId })
            .populate('reviewer', 'name profilePhotoUrl')
            .populate('ride', 'departureLocation destination departureTime')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (err) {
        console.error('FETCH_REVIEWS_ERROR:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
