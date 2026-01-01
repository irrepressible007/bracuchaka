// api/routes/rides.js

const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const Vehicle = require('../models/Vehicle');
// --- I'VE ADDED THE NEW MODEL ---
const RideRequest = require('../models/RideRequest');
const { auth, authorize } = require('../middleware/auth');

// --- UPDATED: SEARCH RIDES ENDPOINT ---
// @route   GET /api/rides/search
// @desc    Get all available (scheduled) rides, with optional filters
// @access  Private (USER only)
router.get('/search', [auth, authorize(['USER'])], async (req, res) => {
  try {
    const { start, destination } = req.query;

    // --- NEW: Build the search filter ---
    let filter = {
      status: 'SCHEDULED',
      departureTime: { $gt: new Date() }
    };

    // 'i' makes the search case-insensitive
    if (start) {
      filter.departureLocation = { $regex: start, $options: 'i' };
    }
    if (destination) {
      filter.destination = { $regex: destination, $options: 'i' };
    }
    // --- End of new filter ---

    // Find rides using the built filter
    const rides = await Ride.find(filter)
      .populate('driver', 'name averageRating ratingCount')
      .populate('vehicle', 'bikeName bikeModel systemImageUrl')
      .sort({ departureTime: 1 });

    res.json(rides);

  } catch (err) {
    console.error('SEARCH_RIDES_ERROR:', err.message);
    res.status(500).send('Server Error');
  }
});

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
    console.error('CREATE_RIDE_ERROR:', err.message);
    res.status(500).send('Server Error');
  }
});

// --- I HAVE UPDATED THIS ROUTE ---
// POST a new ride request
// I've added 'auth' to protect this route and get the user's ID
router.post('/request', auth, async (req, res) => {
  const { startLocation, destination, fare, distance } = req.body;

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
      fare: fare || 0,        // Save fare
      distance: distance || "" // Save distance
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

// --- NEW: Get Current Active Ride (For Dashboard Sync) ---
router.get('/requests/current', auth, async (req, res) => {
  try {
    // Find a request where the user is either the requester OR the driver
    // AND the status is NOT completed or cancelled or rejected
    // i.e., status is 'accepted' or 'in_progress' (or 'pending' for requester wait view)

    // We want "Active" rides: 'accepted', 'in_progress'
    // If a driver calls this, we look for rides where they are the driver
    // If a passenger calls this, we look for rides where they are the requester

    const activeRide = await RideRequest.findOne({
      $or: [{ requester: req.user.id }, { driver: req.user.id }],
      status: { $in: ['accepted', 'in_progress'] }
    })
      .populate('requester', 'name phone') // Add phone if available in User model
      .populate('driver', 'name phone averageRating ratingCount')
      .populate('vehicle');

    res.json(activeRide); // Returns null if no active ride
  } catch (err) {
    console.error('GET_CURRENT_RIDE_ERROR:', err.message);
    res.status(500).send('Server Error');
  }
});

// PUT accept a ride request
router.put('/request/:id/accept', auth, async (req, res) => {
  try {
    // 1. Check if driver is already in an active ride
    const existingRide = await RideRequest.findOne({
      driver: req.user.id,
      status: { $in: ['accepted', 'in_progress'] }
    });

    if (existingRide) {
      return res.status(400).json({ message: 'You already have an active ride.' });
    }

    const rideRequest = await RideRequest.findById(req.params.id);

    if (!rideRequest) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    if (rideRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Ride request is already processed' });
    }

    // 2. Fetch Driver's Vehicle info to attach
    const vehicle = await Vehicle.findOne({ owner: req.user.id, isVerified: true });
    if (!vehicle) {
      return res.status(400).json({ message: 'You need a verified vehicle to accept rides.' });
    }

    // 3. Update the request
    rideRequest.status = 'accepted'; // Update status to 'accepted' instead of 'in_progress'
    rideRequest.driver = req.user.id;
    rideRequest.vehicle = vehicle._id;

    // Generate 4-digit PIN
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    rideRequest.verificationPin = pin;

    // Mock fare/distance calculation if needed, or use what was passed? 
    // For now, let's assume a fixed base fare + simplistic distance or generate random for demo
    rideRequest.distance = "5 km"; // You might want to calculate this real-time
    rideRequest.fare = 150; // Mock fare

    await rideRequest.save();

    res.json({ message: 'Ride accepted! Please enter PIN from passenger to start.', rideRequest });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT start a ride (Driver enters PIN)
router.put('/request/:id/start-ride', auth, async (req, res) => {
  const { pin } = req.body;
  try {
    const rideRequest = await RideRequest.findById(req.params.id);

    if (!rideRequest) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    if (rideRequest.driver.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (rideRequest.status !== 'accepted') {
      return res.status(400).json({ message: 'Ride is not in accepted state.' });
    }

    if (rideRequest.verificationPin !== pin) {
      return res.status(400).json({ message: 'Invalid PIN. Please ask passenger for the correct code.' });
    }

    // PIN is correct
    rideRequest.status = 'in_progress';
    await rideRequest.save();

    res.json({ message: 'Ride started successfully!', rideRequest });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT reject a ride request (Driver only)
router.put('/request/:id/reject', auth, async (req, res) => {
  try {
    const rideRequest = await RideRequest.findById(req.params.id);

    if (!rideRequest) {
      return res.status(404).json({ message: 'Ride request not found' });
    }

    if (rideRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Ride request is already processed' });
    }

    // Update the request
    rideRequest.status = 'rejected';
    // We don't assign a driver because it's rejected

    await rideRequest.save();

    res.json({ message: 'Ride request rejected', rideRequest });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// (Removed orphaned lines)

// --- NEW: Driver Ends Ride ---
router.put('/request/:id/driver-end', auth, async (req, res) => {
  try {
    const rideRequest = await RideRequest.findById(req.params.id);
    if (!rideRequest) return res.status(404).json({ message: 'Ride not found' });

    // Verify user is driver
    if (rideRequest.driver.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    rideRequest.driverEnded = true;

    // Check completion condition
    if (rideRequest.driverEnded && rideRequest.passengerReached) {
      rideRequest.status = 'completed';
    }

    await rideRequest.save();
    res.json(rideRequest);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --- NEW: Passenger Reaches Destination ---
router.put('/request/:id/passenger-reach', auth, async (req, res) => {
  try {
    const rideRequest = await RideRequest.findById(req.params.id);
    if (!rideRequest) return res.status(404).json({ message: 'Ride not found' });

    // Verify user is requester
    if (rideRequest.requester.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    rideRequest.passengerReached = true;

    // Check completion condition
    if (rideRequest.driverEnded && rideRequest.passengerReached) {
      rideRequest.status = 'completed';
    }

    await rideRequest.save();
    res.json(rideRequest);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;