const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto"); // Import the crypto module
require('dotenv').config();
const User = require('../models/userModel'); // adjust path as needed
const UserPlan = require('../models/UserPlan');

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
router.post("/create-order", async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const options = {
            amount: amount * 100, // Convert amount to smallest currency unit (e.g., paise for INR)
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1, // Auto capture payment
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ key: process.env.RAZORPAY_KEY_ID, orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Order creation failed" });
    }
});

// Verify payment
router.post("/verify-payment",async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, plan } = req.body;

    // Use the Razorpay key secret from environment variables
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Generate a new signature
    const generated_signature = crypto
        .createHmac("sha256", key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

        if (generated_signature === razorpay_signature) {
            try {
                const startDate = new Date();
                const expiryDate = new Date(startDate);
                expiryDate.setMonth(expiryDate.getMonth() + plan.expiryMonths);
    
                await UserPlan.create({
                    userId,
                    planId: plan.id,
                    title: plan.title,
                    price: plan.price,
                    currency: plan.currency,
                    startDate,
                    expiryDate,
                });
    
                await User.findByIdAndUpdate(userId, { hasActivePlan: true });
    
                res.json({ status: "success", message: "Payment verified and plan activated successfully" });
            } catch (error) {
                console.error("Error saving plan details:", error);
                res.status(500).json({ status: "failed", message: "Payment verified but failed to activate plan" });
            }
        } else {
        res.status(400).json({ status: "failed", message: "Invalid signature" });
    }
});

module.exports = router;
