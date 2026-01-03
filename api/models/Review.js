// api/models/Review.js

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: false, // Changed from true
    },
    rideRequest: { // Added new field
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RideRequest',
        required: false
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
        required: false // Changed from true
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

// Prevent user from reviewing the same booking/request multiple times
ReviewSchema.index({ booking: 1, reviewer: 1 }, { unique: true, partialFilterExpression: { booking: { $exists: true } } });
ReviewSchema.index({ rideRequest: 1, reviewer: 1 }, { unique: true, partialFilterExpression: { rideRequest: { $exists: true } } });

module.exports = mongoose.model('Review', ReviewSchema);
