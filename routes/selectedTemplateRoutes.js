const express = require('express');
const { selectTemplate,renderTemplateWithUserData,getUserGeneratedLink,getqrforUserGeneratedLink } = require('../controllers/selectedTemplateController');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

const router = express.Router();

// Route for selecting a template with middleware protection
router.post('/select', protect, selectTemplate);
router.get('/render', renderTemplateWithUserData);
router.get('/link', protect, getUserGeneratedLink); // New endpoint to get the user's generated link
router.get('/qr', getqrforUserGeneratedLink); // New endpoint to get the user's generated link


module.exports = router;
