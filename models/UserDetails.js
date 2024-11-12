// models/UserDetails.js
const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // New field for user ID
    companyName: { type: String, required: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    contact1: { type: String, required: true },
    contact2: { type: String },
    whatsapp1: { type: String, required: true },
    whatsapp2: { type: String },
    email: { type: String, required: true },
    website: { type: String },
    googleMap: { type: String },
    address: { type: String, required: true },
    logo: { type: String, required: true },  // Store the path to the uploaded logo
    socialMediaLinks: {
        facebook: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        twitter: { type: String },
        youtubeChannel: { type: String },
        googleBusiness: { type: String },
        otherProfile: { type: String },
        youtubeVideo: [{ type: String }],  // Change to an array to store multiple YouTube links
        // video: { type: String }, 
    },
    aboutCompany: {
        establishedYear: { type: String, required: true },
        natureOfBusiness: { type: String, required: true },
        gstNumber: { type: String, required: true },
        documents: [{ type: String }],  // Store the paths to the uploaded documents
        description: { type: String, required: true },
    },
    bankDetails: {
        bankName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        branchName: { type: String, required: true },
        ifscCode: { type: String, required: true },
        accountHolderName: { type: String, required: true },
        gPayNumber: { type: String },
        paytmNumber: { type: String },
        phonePeNumber: { type: String },
        upiId: { type: String },
        accountType: { type: String, required: true },
        qrImages: [{ type: String }],  // Store the paths to the uploaded QR images
    },
    products: [
        {
            productName: { type: String, required: true },
            productPrice: { type: Number, required: true },
            productType: { type: String, enum: ['product', 'service'], required: true },
            productImages: [{ type: String }], // This could store paths to product images if necessary
            discount: { type: Number, default: null }, // Add discount field
        },
    ],
    galleryImages: [{ type: String, required: true }],  // Store the paths to the uploaded gallery images
});

module.exports = mongoose.model('UserDetails', userDetailsSchema);
