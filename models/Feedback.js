// models/Feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
