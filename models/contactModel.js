const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // New field for user ID
  name: { type: String, required: true },
  reference: { type: String },
  profession: { type: String },
  industry: { type: String },
  category: { type: String },
  designation: { type: String },
  companyName: { type: String },
  mobileNumber: { type: String, required: true },
  email: { type: String },
  website: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pinCode: { type: String },
});

module.exports = mongoose.model('Contact', contactSchema);
