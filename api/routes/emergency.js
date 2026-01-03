const express = require('express');
const router = express.Router();
const EmergencyAlert = require('../models/EmergencyAlert');
const { auth } = require('../middleware/auth');

// @route   POST /api/emergency/sos
// @desc    Trigger an SOS alert
// @access  Private
router.post('/sos', auth, async (req, res) => {
    try {
        const newAlert = new EmergencyAlert({
            user: req.user.id,
            location: req.body.location || 'Unknown Location',
        });

        await newAlert.save();

        // In a real app, you would send an SMS/Email here using Twilio/SendGrid
        console.log('🚨 SOS ALERT TRIGGERED BY USER:', req.user.id);

        res.status(201).json({ message: 'Emergency alert sent to campus security!', alert: newAlert });
    } catch (err) {
        console.error('SOS_ERROR:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;