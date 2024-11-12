const express = require('express');
const router = express.Router();
const { createCRMEntry, getCRMEntries } = require('../controllers/crmController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',protect, createCRMEntry); // Create new CRM entry
router.get('/',protect, getCRMEntries); // Get all CRM entries

module.exports = router;
