const express = require('express');
const { addProduct, updateProduct, deleteProduct, getUserProducts } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware'); // Ensure user is authenticated
const multer = require('multer');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/temp/' }); // Temporary storage for uploads

// Route to add a product
router.post('/', protect, upload.array('productImages[]', 5), addProduct); // You can allow up to 5 images per product

// Route to update a product
router.put('/:productId', protect, upload.array('productImages[]', 5), updateProduct); 

// Route to delete a product
router.delete('/:productId', protect, deleteProduct);

// Route to get all products for a user
router.get('/', protect, getUserProducts);

module.exports = router;
