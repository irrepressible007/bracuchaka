// api/models/Booking.js

const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true,
  },
  user: { // The user who booked the ride
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    default: 'CONFIRMED',
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);