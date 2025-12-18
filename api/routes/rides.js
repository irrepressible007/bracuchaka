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

// --- NEW ROUTES ---

// GET all pending ride requests (For Drivers)
// Protected: Only logged-in users (ideally drivers) can see this
router.get('/requests/pending', auth, async (req, res) => {
  try {
    // optional: check if req.user is a driver?
    // const requests = await RideRequest.find({ status: 'pending' }).populate('requester', 'name email');
    const requests = await RideRequest.find({ status: 'pending' }).populate('requester', 'name');
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET my ride requests (For Passengers)
router.get('/requests/my', auth, async (req, res) => {
  try {
    const requests = await RideRequest.find({ requester: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT accept a ride request
router.put('/request/:id/accept', auth, async (req, res) => {
  try {
    const rideRequest = await RideRequest.findById(req.params.id);

    if (!rideRequest) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    if (rideRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Ride request is already processed' });
    }

    // Update the request
    rideRequest.status = 'accepted';
    rideRequest.driver = req.user.id; // Assign the logged-in user as the driver

    await rideRequest.save();

    res.json({ message: 'Ride request accepted', rideRequest });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT cancel a ride request
router.put('/request/:id/cancel', auth, async (req, res) => {
  console.log('--- CANCEL REQUEST HIT ---');
  console.log('Request ID:', req.params.id);
  console.log('User ID:', req.user.id);

  try {
    const rideRequest = await RideRequest.findById(req.params.id);

    if (!rideRequest) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    // Check if the logged-in user is the one who made the request
    if (rideRequest.requester.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to cancel this request' });
    }

    if (rideRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled' });
    }

    rideRequest.status = 'cancelled';
    await rideRequest.save();

    res.json({ message: 'Ride request cancelled successfully', rideRequest });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;