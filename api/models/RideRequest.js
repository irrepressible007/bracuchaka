const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RideRequestSchema = new Schema({

  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startLocation: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending',
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  // --- New Fields for Ride Flow ---
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null
  },
  fare: {
    type: Number,
    default: 0
  },
  distance: {
    type: String, // e.g., "5.2 km"
    default: ""
  },
  driverEnded: {
    type: Boolean,
    default: false
  },
  verificationPin: {
    type: String,
    default: null
  },
  passengerReached: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('RideRequest', RideRequestSchema);