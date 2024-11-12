const mongoose = require('mongoose');

// UserPlan Schema to track purchased plans
const userPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    }
});

// Define the UserPlan model
const UserPlan = mongoose.model('UserPlan', userPlanSchema);

module.exports = UserPlan;
