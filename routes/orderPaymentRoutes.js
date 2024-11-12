const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, trackOrder,downloadInvoice } = require('../controllers/orderPaymentController');

router.post('/create-order', createOrder); // Creates a new Razorpay order
router.post('/verify', verifyPayment); // Verifies payment
router.get('/track-order/:trackingNumber', trackOrder); // Tracks order by tracking number
router.get('/download-invoice/:trackingNumber', downloadInvoice); // Endpoint to download invoice

module.exports = router;
