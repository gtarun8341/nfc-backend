const express = require('express');
const { registerUser, loginUser, getUserProfile ,updateUserProfile,changePassword,getAllUsers,updateUser,deleteUser} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // To protect routes

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route (requires a valid JWT)
router.get('/profile', protect, getUserProfile);
router.put('/profileUpdate',protect, updateUserProfile); // Update user profile
router.put('/changePassword', protect, changePassword); // Change user password
router.get('/users', getAllUsers); // Get all users (for demo purposes, consider securing this in a real app)
router.put('/users/:id', updateUser); // For updating user
router.delete('/users/:id', deleteUser); // For deleting user


module.exports = router;
