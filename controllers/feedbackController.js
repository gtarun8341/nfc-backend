// controllers/feedbackController.js
const Feedback = require('../models/Feedback');
const User = require('../models/userModel'); // Import User model

exports.getAllFeedback = async (req, res) => {
  try {
    // Fetch feedback along with user details
    const feedbackList = await Feedback.find()
      .populate('userId', 'name email') // Populate userId with name and email
      .exec();

    res.status(200).json(feedbackList);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assuming this function already exists for submitting feedback
exports.submitFeedback = async (req, res) => {
  const { feedback, about } = req.body; // Include about field
  const userId = req.user._id; // Assuming you attach user ID to the request in your middleware

  try {
    const newFeedback = new Feedback({
      userId,
      feedback,
      about, // Save the about field
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback: savedFeedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
