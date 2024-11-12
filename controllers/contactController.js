const Contact = require('../models/contactModel');
const jwt = require('jsonwebtoken');

// Add new contact
exports.addContact = async (req, res) => {
  const { name, reference, profession, industry, category, designation, companyName, mobileNumber, email, website, address, city, state, pinCode } = req.body;
  
  try {
    // Get userId from token
    const userId = req.user._id; // Get the user from request

    // Create a new contact
    const newContact = new Contact({
      userId,
      name,
      reference,
      profession,
      industry,
      category,
      designation,
      companyName,
      mobileNumber,
      email,
      website,
      address,
      city,
      state,
      pinCode
    });

    // Save the contact to the database
    await newContact.save();
    res.status(201).json({ message: 'Contact added successfully', contact: newContact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get contacts for the logged-in user
exports.getContacts = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user from request


    // Fetch contacts for the logged-in user
    const contacts = await Contact.find({ userId });
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
