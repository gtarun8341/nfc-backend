// models/review.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserDetails' // Reference to your UserDetails model
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
