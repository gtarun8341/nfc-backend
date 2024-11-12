const CRM = require('../models/CRM');

// Create a new CRM entry
const createCRMEntry = async (req, res) => {
  try {
    const crmEntry = new CRM({
      ...req.body,
      userId: req.user._id // Store user ID
    });
    await crmEntry.save();
    res.status(201).json({ message: 'CRM entry created successfully', crmEntry });
  } catch (error) {
    console.error('Error creating CRM entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all CRM entries for the authenticated user
const getCRMEntries = async (req, res) => {
  try {
    const crmEntries = await CRM.find({ userId: req.user._id }); // Filter by user ID
    res.status(200).json(crmEntries);
  } catch (error) {
    console.error('Error fetching CRM entries:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createCRMEntry,
  getCRMEntries,
};
