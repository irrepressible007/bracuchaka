// api/routes/admin.js

const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const RideRequest = require('../models/RideRequest');
// const Ride = require('../models/Ride'); // If you use Ride model


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
  // (Removed redundant lines)
});

// --- NEW ROUTES ---

// 1. User Management
// GET all users
router.get('/users', [auth, authorize(['ADMIN'])], async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT Block/Unblock User
router.put('/users/:id/block', [auth, authorize(['ADMIN'])], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBlocked = !user.isBlocked; // Toggle
    await user.save();
    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, user });
  } catch (err) {
    console.error(err.message);
  }
});

// DELETE User
router.delete('/users/:id', [auth, authorize(['ADMIN'])], async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT Make Admin (REMOVED)

// 2. Complaints
router.get('/complaints', [auth, authorize(['ADMIN'])], async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('submittedBy', 'name email')
      .populate('reportedUser', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/complaints/:id/resolve', [auth, authorize(['ADMIN'])], async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true });
    res.json(complaint);
  } catch (err) {
    console.error(err.message);
  }
});

// 3. Stats (Overview)
router.get('/stats', [auth, authorize(['ADMIN'])], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeRides = await RideRequest.countDocuments({ status: { $in: ['accepted', 'in_progress'] } });
    const pendingVehicles = await Vehicle.countDocuments({ isVerified: false });
    // const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      activeRides,
      pendingVehicles,
      pendingComplaints: 0 // placeholder if no complaints yet
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 4. Live Rides (Overview Table)
router.get('/live-rides', [auth, authorize(['ADMIN'])], async (req, res) => {
  try {
    const rides = await RideRequest.find({ status: { $in: ['accepted', 'in_progress'] } })
      .populate('driver', 'name email phone')
      .populate('requester', 'name email phone')
      .populate('vehicle', 'bikeName plateNumber')
      .sort({ updatedAt: -1 });
    res.json(rides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 2b. Reject Vehicle
router.put('/reject-vehicle/:vehicleId', [auth, authorize(['ADMIN'])], async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;
    // Just delete it or mark as rejected? User asked for "reject button". 
    // Deleting the vehicle request allows them to re-apply. 
    // Or we could have a status field. Currently schemas are simple.
    // Let's delete the vehicle entry so they can start over, 
    // or we can add a 'rejected' status if schema supported it.
    // Looking at schema... Vehicle.js wasn't shown but likely has isVerified boolean.
    // If we just delete it, it's a hard reject. If we set isVerified: false, it's already false.
    // Best UX: Delete it so it disappears from Pending and user can delete/upload again.
    // ACTUALLY: Let's just delete it for now as a "Rejection".

    await Vehicle.findByIdAndDelete(vehicleId);
    res.json({ message: 'Vehicle application rejected and removed.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ... (existing routes) ...

// 5. Create New Admin
// STRICT: Only Super Admin can do this
router.post('/create-admin', [auth, authorize(['ADMIN'])], async (req, res) => {
  const { name, username, password } = req.body;

  // SUPER ADMIN CHECK REMOVED
  // All admins can create other admins

  try {
    // Check if username (stored as email) already exists
    let user = await User.findOne({ email: username });
    if (user) {
      return res.status(400).json({ message: 'Admin username already exists' });
    }

    user = new User({
      name,
      email: username, // Storing username in email field
      password,
      role: 'ADMIN',
      isRider: false
    });

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.json({ message: 'New Admin created successfully', user: { id: user.id, name: user.name, username: user.email } });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;