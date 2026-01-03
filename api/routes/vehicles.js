// api/routes/vehicles.js

const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// @route   POST /api/vehicles/register
// @desc    Register a new vehicle (Updated Logic)
// @access  Private

router.post('/register', auth, async (req, res) => {
<<<<<<< HEAD
  const { 
    bikeName, 
    bikeModel, 
    modelYear, 
    color, 
    registrationNumber, 
    licenseNumber 
=======
  const {
    bikeName,
    bikeModel,
    modelYear,
    color,
    registrationNumber,
    licenseNumber
>>>>>>> origin/Sanzid
  } = req.body;

  // Basic validation
  if (!bikeName || !bikeModel || !modelYear || !color || !registrationNumber || !licenseNumber) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  try {
    // Check if user already has a vehicle pending or approved
    let vehicle = await Vehicle.findOne({ owner: req.user.id });
    if (vehicle) {
      return res.status(400).json({ message: 'You already have a vehicle registered or pending.' });
    }

    // Check if registration number is already taken
    vehicle = await Vehicle.findOne({ registrationNumber });
    if (vehicle) {
      return res.status(400).json({ message: 'This registration number is already registered.' });
    }
<<<<<<< HEAD
    
=======

>>>>>>> origin/Sanzid
    // Check if license number is already taken
    vehicle = await Vehicle.findOne({ licenseNumber });
    if (vehicle) {
      return res.status(400).json({ message: 'This license number is already registered.' });
    }

    // --- New Logic ---
    // (Future) We would search our `BikeModels` collection here.
    // For now, we'll just save the data and use a default image.
    const systemImageUrl = findBikeImage(bikeName, bikeModel, modelYear, color);

    // Create and save new vehicle
    vehicle = new Vehicle({
      owner: req.user.id,
      bikeName,
      bikeModel,
      modelYear,
      color,
      registrationNumber,
      licenseNumber,
      systemImageUrl, // Save the matched image URL
    });

    await vehicle.save();

<<<<<<< HEAD
=======
    // Automatically promote user to rider for now (or pending approval if desired)
    // We DO NOT auto-promote to rider anymore. Admin must approve.
    // await User.findByIdAndUpdate(req.user.id, { isRider: true });

>>>>>>> origin/Sanzid
    res.status(201).json({ message: 'Vehicle submitted for approval.', vehicle });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Helper Function (Mockup) ---
// We will build this out later, possibly by querying a new 'BikeModels' collection.
function findBikeImage(name, model, year, color) {
  console.log(`Searching for image: ${name} ${model} ${year} ${color}`);
  // In a real app, this would query a database.
  // For now, it just returns a default placeholder.
<<<<<<< HEAD
  return '/images/default-bike-placeholder.png'; 
=======
  return '/images/default-bike-placeholder.png';
>>>>>>> origin/Sanzid
}

module.exports = router;