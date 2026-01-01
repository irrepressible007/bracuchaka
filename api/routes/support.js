const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Complaint = require('../models/Complaint');

// @route   POST api/support
// @desc    Submit a support ticket
// @access  Private
router.post('/', auth, async (req, res) => {
    const { description } = req.body;

    if (!description) {
        return res.status(400).json({ message: 'Description is required' });
    }

    try {
        const newTicket = new Complaint({
            submittedBy: req.user.id,
            description: description,
            status: 'pending', // Default status
        });

        const ticket = await newTicket.save();

        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
