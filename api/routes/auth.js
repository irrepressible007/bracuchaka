// api/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ... (your '/register' route is fine) ...
router.post('/register', async (req, res) => {
    // ... same code as before
    // All users register as role: 'USER' by default
    // ...
});


// --- UPDATED LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // The payload still needs the user's *base* role (USER or ADMIN)
    const payload = {
      user: {
        id: user.id,
        role: user.role, // This will be 'USER' or 'ADMIN'
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        
        // Send back the full user info, including the new 'isRider' permission
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // 'USER' or 'ADMIN'
            isRider: user.isRider, // true or false
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;