const express = require('express');
const router = express.Router();
const { addAdminProduct,getAllProducts } = require('../controllers/adminProductController');

// Admin routes
router.post('/add-product', addAdminProduct); // Route to add product by admin
router.get('/all-products', getAllProducts); // Route to fetch all products for both admin and users

module.exports = router;
