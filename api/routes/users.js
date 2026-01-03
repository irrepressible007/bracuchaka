// api/routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth'); // 1. Import our new middleware

// @route   GET /api/users/me
// @desc    Get current user's profile (excludes password)
// @access  Private (requires 'auth' middleware)

// 2. Add the 'auth' middleware here
router.get('/me', auth, async (req, res) => {
  try {
    // req.user was added by the 'auth' middleware
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/users/admin-only
// @desc    A test route only for admins
// @access  Private (requires 'auth' AND 'authorize' middleware)

// 3. We can chain middleware!
router.get(
  '/admin-only', 
  [auth, authorize(['ADMIN'])], // Checks for login, THEN checks for 'ADMIN' role
  (req, res) => {
    res.json({ message: 'Welcome, Admin! You found the secret route.' });
  }
);

module.exports = router;