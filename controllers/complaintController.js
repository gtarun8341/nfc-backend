// controllers/complaintController.js
const Complaint = require('../models/Complaint');

// Submit a complaint
exports.submitComplaint = async (req, res) => {
  const { complaint, about } = req.body;
  const userId = req.user._id; // Assuming you attach user ID to the request in your middleware

  try {
    const newComplaint = new Complaint({ userId, complaint, about });
    const savedComplaint = await newComplaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully', complaint: savedComplaint });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all complaints
exports.getComplaints = async (req, res) => {
    try {
      const complaints = await Complaint.find().populate('userId', 'name email'); // Populate user details
      res.status(200).json(complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Delete a complaint
exports.deleteComplaint = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
