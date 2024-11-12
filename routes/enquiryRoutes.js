const express = require('express');
const router = express.Router();
const { submitEnquiry ,getEnquiriesByUserId} = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware'); // Ensure user is authenticated

// Route to handle enquiry submission
router.post('/submit-enquiry', submitEnquiry);
router.get('/user',  protect,getEnquiriesByUserId); // Adjusted to not require userId in the path

module.exports = router;
