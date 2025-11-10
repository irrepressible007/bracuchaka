// api/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'], // We are REMOVING 'RIDER' (my old 'DRIVER') from here
    default: 'USER',
  },
  
  // --- NEW PERMISSION FIELD ---
  // This is the key. If true, this user has the *ability* to be a RIDER.
  isRider: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);