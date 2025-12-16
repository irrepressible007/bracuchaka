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
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending',
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('RideRequest', RideRequestSchema);