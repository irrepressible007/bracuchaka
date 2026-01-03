// api/models/Review.js

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
<<<<<<< HEAD
        required: false, // Changed from true
    },
    rideRequest: { // Added new field
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RideRequest',
        required: false
=======
        required: true,
        unique: true
>>>>>>> 95c9c18c5c3bc5a1d8b70e1427ea909619b2bfbf
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
<<<<<<< HEAD
        required: false // Changed from true
=======
        required: true
>>>>>>> 95c9c18c5c3bc5a1d8b70e1427ea909619b2bfbf
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, { timestamps: true });

<<<<<<< HEAD
// Prevent user from reviewing the same booking/request multiple times
ReviewSchema.index({ booking: 1, reviewer: 1 }, { unique: true, partialFilterExpression: { booking: { $exists: true } } });
ReviewSchema.index({ rideRequest: 1, reviewer: 1 }, { unique: true, partialFilterExpression: { rideRequest: { $exists: true } } });
=======
// Prevent user from reviewing the same booking multiple times (handled by unique index on booking, but adding compound index for safety)
ReviewSchema.index({ booking: 1, reviewer: 1 }, { unique: true });
>>>>>>> 95c9c18c5c3bc5a1d8b70e1427ea909619b2bfbf

module.exports = mongoose.model('Review', ReviewSchema);
