// controllers/reviewController.js

const Review = require('../models/review');

exports.submitReview = async (req, res) => {
    const { userId,name, email, title, rating, message } = req.body;

    try {
        const newReview = new Review({ userId,name, email, title, rating, message });
        await newReview.save();
        
        res.status(201).json({ message: 'Review submitted successfully!' });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Failed to submit review. Please try again.' });
    }
};
