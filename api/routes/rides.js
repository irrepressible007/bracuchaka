const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const Vehicle = require('../models/Vehicle');
const { auth, authorize } = require('../middleware/auth');

// @route   POST /api/rides/create
// @desc    Create a new ride offer
// @access  Private (DRIVER only)
router.post('/create', [auth, authorize(['DRIVER'])], async (req, res) => {
  const { 
    departureLocation, 
    destination, 
    departureTime, 
    availableSeats,
    fuelCostContribution 
  } = req.body;

  try {
    const vehicle = await Vehicle.findOne({ owner: req.user.id, isVerified: true });
    if (!vehicle) {
      return res.status(400).json({ message: 'You do not have a verified vehicle.' });
    }

    if (!departureLocation || !destination || !departureTime || !availableSeats || !fuelCostContribution) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    const newRide = new Ride({
      driver: req.user.id,
      vehicle: vehicle._id,
      departureLocation,
      destination,
      departureTime,
      availableSeats,
      fuelCostContribution,
    });

    await newRide.save();
    res.status(201).json({ message: 'Ride created successfully!', ride: newRide });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- THIS IS THE ROUTE WE NEED ---
// POST a new ride request
router.post('/request', (req, res) => {
  const { startLocation, destination } = req.body;

  if (!startLocation || !destination) {
    return res.status(400).json({ message: 'Missing startLocation or destination.' });
  }

  console.log('✅ New Ride Request Received by the API server!');
  console.log(`   From: ${startLocation}`);
  console.log(`   To:   ${destination}`);

  res.status(200).json({ 
    message: 'Ride request received successfully!',
    data: { startLocation, destination }
  });
});

module.exports = router;