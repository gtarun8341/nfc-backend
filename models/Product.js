const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productType: { 
        type: String, 
        enum: ['product', 'service'], 
        required: true 
    },
    productImages: [{ type: String }],  // Store paths to product images
    discount: { type: Number, default: null }, // Optional discount field
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
