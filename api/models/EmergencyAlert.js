const mongoose = require('mongoose');

const EmergencyAlertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    location: { // Optional: We can add GPS coords later
        type: String,
        default: 'Unknown Location',
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'RESOLVED'],
        default: 'ACTIVE',
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Admin who resolves it
    },
}, { timestamps: true });

module.exports = mongoose.model('EmergencyAlert', EmergencyAlertSchema);