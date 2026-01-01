// api/routes/bookings.js

const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const { auth, authorize } = require('../middleware/auth');

// @route   GET /api/bookings/my
// @desc    Get current user's bookings
// @access  Private (USER only)
router.get('/my', [auth, authorize(['USER'])], async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'ride',
        populate: {
          path: 'driver',
          select: 'name email profilePhotoUrl', // Include driver details for display
        },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error('FETCH_BOOKINGS_ERROR:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/bookings/create/:rideId
// @desc    Book a seat on a ride
// @access  Private (USER only)
router.post('/create/:rideId', [auth, authorize(['USER'])], async (req, res) => {
  try {
    const rideId = req.params.rideId;
    const userId = req.user.id;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    if (ride.availableSeats <= 0) {
      return res.status(400).json({ message: 'This ride is already full' });
    }
    if (ride.driver.toString() === userId) {
      return res.status(400).json({ message: 'You cannot book your own ride' });
    }
    const existingBooking = await Booking.findOne({ ride: rideId, user: userId });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this ride' });
    }

    const newBooking = new Booking({
      ride: rideId,
      user: userId,
      status: 'CONFIRMED',
    });
    await newBooking.save();

    ride.availableSeats -= 1;
    ride.passengers.push(userId);
    await ride.save();

    res.status(201).json({ message: 'Ride booked successfully!', booking: newBooking });

  } catch (err) {
    console.error('BOOKING_ERROR:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;