const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Complaint = require('../models/Complaint');

// @route   POST api/support
// @desc    Submit a support ticket or report a user
// @access  Private
router.post('/', auth, async (req, res) => {
    const { description, reportedUserId, rideId } = req.body;

    if (!description) {
        return res.status(400).json({ message: 'Description is required' });
    }

    try {
        const newTicket = new Complaint({
            submittedBy: req.user.id,
            description: description,
            status: 'pending',
        });

        if (reportedUserId) newTicket.reportedUser = reportedUserId;
        if (rideId) newTicket.ride = rideId;

        const ticket = await newTicket.save();

        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/support/block
// @desc    Block a user
// @access  Private
router.post('/block', auth, async (req, res) => {
    const { userIdToBlock } = req.body;

    if (!userIdToBlock) {
        return res.status(400).json({ message: 'User ID to block is required' });
    }

    if (userIdToBlock === req.user.id) {
        return res.status(400).json({ message: 'You cannot block yourself' });
    }

    try {
        const user = await require('../models/User').findById(req.user.id);

        if (!user.blockedUsers.includes(userIdToBlock)) {
            user.blockedUsers.push(userIdToBlock);
            await user.save();
        }

        res.json({ message: 'User blocked successfully', blockedUsers: user.blockedUsers });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/support/unblock
// @desc    Unblock a user
// @access  Private
router.post('/unblock', auth, async (req, res) => {
    const { userIdToUnblock } = req.body;

    if (!userIdToUnblock) {
        return res.status(400).json({ message: 'User ID to unblock is required' });
    }

    try {
        const user = await require('../models/User').findById(req.user.id);

        user.blockedUsers = user.blockedUsers.filter(
            (id) => id.toString() !== userIdToUnblock
        );

        await user.save();

        res.json({ message: 'User unblocked successfully', blockedUsers: user.blockedUsers });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
