const express = require('express');
const { addUserDetails,getUserDetails,getAllUserDetails ,getUserProductDetails} = require('../controllers/userDetailsController');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware'); // To protect routes

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/temp/' }); // Temporary storage for uploads

// POST route for adding user details
router.post('/', protect, upload.fields([
    { name: 'logo' }, 
    { name: 'documents' }, 
    { name: 'qrImages' }, 
    { name: 'galleryImages' }, 
    { name: 'productImages[]' }, 
    { name: 'video' }
]), (req, res, next) => {
    // Log the incoming request data
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    // Call the next middleware (controller)
    addUserDetails(req, res, next);
});

router.get('/', protect, getUserDetails);
router.get('/admin/users', getAllUserDetails);
router.get('/admin/users-products', getUserProductDetails);


module.exports = router;
