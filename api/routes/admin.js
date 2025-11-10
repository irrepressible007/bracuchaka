// api/routes/admin.js

const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

// ... (your existing get '/pending-vehicles' route is fine) ...
router.get('/pending-vehicles', [auth, authorize(['ADMIN'])], async (req, res) => {
    try {
      const vehicles = await Vehicle.find({ isVerified: false })
        .populate('owner', 'name email');
      res.json(vehicles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


// --- UPDATED LOGIC ---
// @route   PUT /api/admin/approve-vehicle/:vehicleId
// @desc    Approve a vehicle and update user's RIDER permission
// @access  Private (Admin only)
router.put('/approve-vehicle/:vehicleId', [auth, authorize(['ADMIN'])], async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;

    // 1. Find the vehicle and update it
    const vehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      { isVerified: true },
      { new: true } 
    );
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // 2. Find the owner and set isRider to true
    //    We are NOT changing their role anymore.
    const user = await User.findByIdAndUpdate(
      vehicle.owner,
      { isRider: true }, // This is the new logic
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Vehicle approved. User is now a verified RIDER.', vehicle });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;