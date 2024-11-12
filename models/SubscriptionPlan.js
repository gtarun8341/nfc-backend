const mongoose = require('mongoose');

const SubscriptionPlanSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String, // e.g., 'Monthly', 'Yearly'
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);

module.exports = SubscriptionPlan;
