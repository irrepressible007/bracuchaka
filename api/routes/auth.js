// api/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// --- REGISTRATION ROUTE ---
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    // 1. Check for missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // 2. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Validate university email
    const emailRegex = /@(g\.bracu\.ac\.bd|bracu\.ac\.bd)$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Must use a valid BRACU email (@bracu.ac.bd or @g.bracu.ac.bd)' });
    }

    // 4. Create new user instance
    user = new User({
      name,
      email,
      password,
      phone: phone || "" // Save phone if provided
    });

    // 5. Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 6. Save user to database
    await user.save();

    // 7. Create and return a JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Make sure JWT_SECRET is in your .env file
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isRider: user.isRider,
          }
        });
      }
    );

  } catch (err) {
    console.error('REGISTRATION ERROR:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).send('Server error');
  }
});


// --- LOGIN ROUTE ---
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

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isRider: user.isRider,
          }
        });
      }
    );
  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).send('Server error');
  }
});

// --- EMERGENCY SETUP ROUTE (TEMP) ---


module.exports = router;