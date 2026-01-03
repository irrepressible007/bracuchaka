// api/models/Vehicle.js

const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // --- New Fields ---
  bikeName: { // e.g., "Honda", "Bajaj"
    type: String,
    required: true,
  },
  bikeModel: { // e.g., "Hornet 160R", "Pulsar 150"
    type: String,
    required: true,
  },
  modelYear: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  registrationNumber: { // Replaces 'plateNumber'
    type: String,
    required: true,
    unique: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  // --- This is the new part ---
  // We will find a matching image and store its URL here
  systemImageUrl: { 
    type: String,
    default: '/images/default-bike.png', // A default placeholder
  },
  
  // --- Old field we are removing ---
  // photoUrl: { type: String, required: true },
  
  isVerified: {
    type: Boolean,
    default: false, // Admin must approve this
  },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);