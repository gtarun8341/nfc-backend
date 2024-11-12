const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{ title: String, quantity: Number, price: Number }], 
    productTemplateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
      },
  totalAmount: Number,
    paymentId: String,
    orderId: String,
    trackingNumber: String,
    invoiceNumber: {
        type: String,
        unique: true, // To ensure each invoice number is unique
        default: function () { // Generate a unique invoice number automatically
            return `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 900000)}`;
        },
    },
    paymentSettledToTemplateOwner: {
        type: Boolean,
        default: false // Initially set to false as requested
    },
    gstOnPurchase: {
        type: Number,
        default: null // Set to null initially; admin can update later
    },
    status: { type: String,         enum: [
        'Pending',         // Initial stage after placing an order
        'Paid',            // After payment is confirmed
        'Processing',      // Order is being prepared
        'Shipped',         // Order has been shipped
        'Out for Delivery', // Order is with delivery partner
        'Delivered',       // Order delivered to customer
        'Cancelled',       // Order cancelled
        'Returned'         // Order returned by customer
    ],  default: 'Pending' },
    userDetails: {  // New field to store user details
        name: String,
        email: String,
        phone: String,
        address: String,
    },
});

module.exports = mongoose.model('Order', orderSchema);
