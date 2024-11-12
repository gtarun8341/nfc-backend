const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserDetails' // Reference to your UserDetails model
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
