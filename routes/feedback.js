// routes/feedback.js
const express = require('express');
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, submitFeedback); // Protect the route for submitting feedback
router.get('/', protect, getAllFeedback); // Protect the route for getting feedback

module.exports = router;
