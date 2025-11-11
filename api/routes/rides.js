const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const Vehicle = require('../models/Vehicle');
// --- I'VE ADDED THE NEW MODEL ---
const RideRequest = require('../models/RideRequest'); 
const { auth, authorize } = require('../middleware/auth');

// This is your existing route for creating a ride
router.post('/create', [auth, authorize(['DRIVER'])], async (req, res) => {
  // (Your existing code for creating rides is here, no changes needed)
  const { departureLocation, destination, departureTime, availableSeats, fuelCostContribution } = req.body;
  try {
    const vehicle = await Vehicle.findOne({ owner: req.user.id, isVerified: true });
    if (!vehicle) return res.status(400).json({ message: 'You do not have a verified vehicle.' });
    if (!departureLocation || !destination || !departureTime || !availableSeats || !fuelCostContribution) return res.status(400).json({ message: 'Please fill in all fields.' });
    const newRide = new Ride({ driver: req.user.id, vehicle: vehicle._id, departureLocation, destination, departureTime, availableSeats, fuelCostContribution });
    await newRide.save();
    res.status(201).json({ message: 'Ride created successfully!', ride: newRide });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- I HAVE UPDATED THIS ROUTE ---
// POST a new ride request
// I've added 'auth' to protect this route and get the user's ID
router.post('/request', auth, async (req, res) => {
  const { startLocation, destination } = req.body;

  try {
    // 1. Check for missing data
    if (!startLocation || !destination) {
      return res.status(400).json({ message: 'Missing startLocation or destination.' });
    }

    // 2. Create a new RideRequest document
    const newRideRequest = new RideRequest({
      requester: req.user.id, // The logged-in user's ID from the 'auth' middleware
      startLocation,
      destination,
    });

    // 3. Save it to the database
    await newRideRequest.save();

    // 4. Send a success response
    res.status(201).json({
      message: 'Ride request submitted successfully!',
      data: newRideRequest,
    });

  } catch (err) {
    console.error('Error creating ride request:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;