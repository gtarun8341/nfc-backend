const mongoose = require('mongoose');

const crmSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // New field for user ID
  date: { type: Date, required: true },
  direction: { type: String, enum: ['Incoming', 'Outgoing'], required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  name: { type: String, required: true },
  companyName: { type: String },
  phoneNumber: { type: String },
  subject: { type: String, required: true },
  notes: { type: String },
  actionItems: { type: String },
  followUpNeeded: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('CRM', crmSchema);
