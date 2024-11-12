// routes/contactDeveloper.js
const express = require('express');
const { submitComplaint, getComplaints, deleteComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, submitComplaint); // Protect the route for submitting complaints
router.get('/', protect, getComplaints); // Route to fetch complaints
router.delete('/:id', protect, deleteComplaint); // New route to delete a complaint

module.exports = router;
