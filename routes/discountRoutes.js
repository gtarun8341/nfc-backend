// routes/discountRoutes.js
const express = require('express');
const {
    addOrUpdateDiscount,
    deleteDiscount,
    fetchDiscounts,
} = require('../controllers/discountController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to add or update discount
router.put('/:productId', protect, addOrUpdateDiscount); // Use PUT for updating

// Route to delete discount
router.delete('/:productId', protect, deleteDiscount);

// Route to fetch all discounts for a user
router.get('/', protect, fetchDiscounts);

module.exports = router;
