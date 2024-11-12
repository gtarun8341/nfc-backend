const express = require('express');
const router = express.Router();
const { addContact, getContacts } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// POST request to add a new contact
router.post('/',protect, addContact);

// GET request to fetch all contacts for the logged-in user
router.get('/',protect, getContacts);

module.exports = router;
