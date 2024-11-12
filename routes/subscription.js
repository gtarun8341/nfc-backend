const express = require('express');
const router = express.Router();
const {
  addSubscriptionPlan,
  getAllSubscriptionPlans,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} = require('../controllers/subscriptionController');

// Routes for managing subscription plans
router.post('/add', addSubscriptionPlan);
router.get('/all', getAllSubscriptionPlans);
router.put('/update/:id', updateSubscriptionPlan);
router.delete('/delete/:id', deleteSubscriptionPlan);

module.exports = router;
