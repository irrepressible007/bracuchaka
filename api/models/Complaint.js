const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComplaintSchema = new Schema({
    submittedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedUser: { // The driver or passenger being reported (optional)
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ride: { // Related ride (optional)
        type: Schema.Types.ObjectId,
        ref: 'RideRequest' // or 'Ride' depending on which object holds the history
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'dismissed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
