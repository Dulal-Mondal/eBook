const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        unique: true   // একই email দিয়ে দুইবার হবে না
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    downloadedAt: {
        type: Date,
        default: Date.now
    },
    ipAddress: String,
    source: {
        type: String,
        default: 'Landing Page'
    }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);