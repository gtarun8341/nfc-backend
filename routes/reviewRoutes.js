// routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/submit-review', reviewController.submitReview);

module.exports = router;
