const express = require('express');
const { getUsersWithPlans,getUserPlans } = require('../controllers/userPlanController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Route to get users with their active plans
router.get('/active-plans', getUsersWithPlans);
router.get('/user-plans', protect, getUserPlans);

module.exports = router;
