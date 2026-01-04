// api/routes/profile.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

// @route   GET /api/profile/me
// @desc    Get the current logged-in user's profile
// @access  Private (USER and ADMIN)
router.get('/me', [auth, authorize(['USER', 'ADMIN'])], async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('GET_PROFILE_ERROR:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/profile/update
// @desc    Update the current logged-in user's profile
// @access  Private (USER and ADMIN)
// @route   PUT /api/profile/update
// @desc    Update the current logged-in user's profile
// @access  Private (USER and ADMIN)
const upload = require('../middleware/upload');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

router.put('/update', [auth, authorize(['USER', 'ADMIN']), upload.single('profilePhoto')], async (req, res) => {
  // Get all fields from the request body
  const { name, department, year, bio, phone } = req.body;

  // Build the profile object with only the fields that were sent
  const profileFields = {};
  if (name) profileFields.name = name;
  if (department) profileFields.department = department;
  if (year) profileFields.year = year;
  if (bio) profileFields.bio = bio;
  if (phone) profileFields.phone = phone;

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle File Upload
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "bracu-chaka/profiles",
          width: 300,
          crop: "scale"
        });
        profileFields.profilePhotoUrl = result.secure_url;

        // Delete local file
        fs.unlinkSync(req.file.path);
      } catch (uploadErr) {
        console.error("Cloudinary Upload Error:", uploadErr);
        // Don't fail the whole request, but maybe warn?
        // return res.status(500).json({ message: 'Image upload failed' });
      }
    }

    // Update the user
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });

  } catch (err) {
    console.error('UPDATE_PROFILE_ERROR:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;