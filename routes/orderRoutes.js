// routes/orderRoutes.js

const express = require('express');
const { getSalesData,getUserSalesData,updateOrderStatus ,updateSaleField,getUserSalesgraphData} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/sales-data', getSalesData);
router.get('/user-sales-data', protect, getUserSalesData);
router.get('/user-sales-graph-data', protect, getUserSalesgraphData);
router.put('/update-status/:id', updateOrderStatus); // New route for updating status
router.put('/update-field/:id', updateSaleField);


module.exports = router;
