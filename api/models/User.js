// api/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  // --- NEW: Phone Number ---
  phone: {
    type: String,
    trim: true,
    default: ""
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },
  isRider: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false
  },

  // --- NEW PROFILE FIELDS ---
  profilePhotoUrl: {
    type: String,
    default: '/default-avatar.png'
  },
  department: {
    type: String,
    trim: true,
  },
  year: {
    type: Number,
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 250,
  },
  // --- END OF NEW FIELDS ---

  // --- RATING SYSTEM FIELDS ---
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  // --- END OF RATING SYSTEM FIELDS ---

  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);