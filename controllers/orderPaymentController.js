const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
exports.createOrder = async (req, res) => {
    try {
        console.log("Received request to create an order:", req.body); // Log incoming request data

        const { amount, currency } = req.body;
        console.log(`Creating order with amount: ${amount}, currency: ${currency}`); // Log order details

        // Create an order in Razorpay
        const options = {
            amount: amount* 100,
            currency: currency || "INR", // Default to INR if currency not provided
            receipt: `order_rcptid_${Date.now()}`,
            payment_capture: 1,
        };

        console.log("Options for Razorpay order:", options); // Log options before creating order

        const order = await razorpay.orders.create(options);
        console.log("Order created successfully:", order); // Log successful order creation

        res.status(200).json({
            key: process.env.RAZORPAY_KEY_ID,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error("Error creating order:", error); // Log error details
        res.status(500).json({ error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products, totalAmount,productItemUserId,userDetails } = req.body;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
console.log(userDetails)
    // Generate a new signature
    const generated_signature = crypto
        .createHmac('sha256', key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        try {
            const trackingNumber = `TRK-${uuidv4().slice(0, 8).toUpperCase()}`;

            // Create a new user plan record
            const newOrder = await Order.create({
                products, // Assuming products array is passed from the frontend
                productTemplateId:productItemUserId,
                totalAmount,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                trackingNumber,
                status: 'Paid', // Setting the initial status as 'Paid'
                userDetails, // Store user details

            });



            res.json({ status: "success", message: "Payment verified and order created successfully", order: newOrder });
        } catch (error) {
            console.error("Error saving order details:", error);
            res.status(500).json({ status: "failed", message: "Payment verified but failed to save order" });
        }
    } else {
        res.status(400).json({ status: "failed", message: "Invalid signature" });
    }
};


// Backend: trackOrder function in order controller
exports.trackOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ trackingNumber: req.params.trackingNumber });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        res.json({
            status: order.status,
            products: order.products,
            totalAmount: order.totalAmount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.downloadInvoice = async (req, res) => {
    try {
        const order = await Order.findOne({ trackingNumber: req.params.trackingNumber });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Create a new PDF document
        const doc = new PDFDocument();

        // Set the response headers to initiate download
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.invoiceNumber}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');

        // Pipe the PDF document to the response directly
        doc.pipe(res);

        // Logo and Invoice Title
        // doc.image('path/to/logo.png', 40, 40, { width: 100 });  // Add your logo path here
        doc.fontSize(20).text('INVOICE', 450, 40, { align: 'right' });
        
        // Company Details Section
        doc.fontSize(12).text('COMPANY NAME', 40, 80);
        doc.text('Address:', 450, 80);
        doc.text('GSTIN:', 450, 100);
        doc.text('Mob. No.:', 450, 120);

        // Bill To and Shipping To Section
        doc.rect(40, 140, 250, 100).fill('#e0f7fa').stroke();  // Bill To box background
        doc.rect(310, 140, 250, 100).fill('#e0f7fa').stroke();  // Shipping To box background

        doc.fillColor('black').text('Bill To:', 50, 150);
        doc.text(`Name: ${order.userDetails.name}`, 50, 170);
        doc.text(`Address: ${order.userDetails.address}`, 50, 190);
        doc.text(`Contact No.: ${order.userDetails.phone}`, 50, 210);
        
        doc.text('Shipping To:', 320, 150);
        doc.text(`Invoice No.: ${order.invoiceNumber}`, 320, 170);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 320, 190);

        // Item Table Headers
        doc.moveDown(2).text(' #    Item Name             Quantity   Unit      HSN Code   Price/Unit    Discount   GST   Amount', 40, 260, {
            align: 'left',
            underline: true,
        });

        // Product Table Content
        order.products.forEach((product, index) => {
            doc.text(`${index + 1}   ${product.title}       ${product.quantity}        ${product.unit}      ${product.hsnCode}       $${product.price}    ${product.discount}%    ${product.gst}%    $${product.amount}`, 40, doc.y + 20);
        });

        // Total Summary
        doc.rect(40, doc.y + 20, 530, 20).fill('#e0f7fa').stroke();
        doc.fillColor('black').text(`Total`, 40, doc.y + 30);
        doc.text(`$${order.totalAmount.toFixed(2)}`, 500, doc.y + 30, { align: 'right' });

        // Amount in Words, Subtotals, Taxes
        doc.rect(40, doc.y + 40, 250, 100).fill('#f1f8e9').stroke();  // Amount in words box
        doc.rect(310, doc.y + 40, 250, 100).fill('#f1f8e9').stroke();  // Totals box

        doc.text(`Amount in words:`, 50, doc.y + 50);
        doc.text(`Sub Total: $${order.subTotal}`, 320, doc.y + 50);
        doc.text(`Discount: $${order.discount}`, 320, doc.y + 70);
        doc.text(`SGST: $${order.sgst}`, 320, doc.y + 90);
        doc.text(`CGST: $${order.cgst}`, 320, doc.y + 110);
        doc.text(`IGST: $${order.igst}`, 320, doc.y + 130);
        doc.text(`Total Invoice Amount: $${order.totalInvoiceAmount}`, 320, doc.y + 150);

        // Footer with Terms, Message, and Company Branding
        doc.rect(40, doc.y + 180, 250, 80).fill('#f1f8e9').stroke();  // Terms & Conditions box
        doc.rect(310, doc.y + 180, 250, 80).fill('#f1f8e9').stroke();  // Message box

        doc.text('Terms & Conditions', 50, doc.y + 190);
        doc.text(order.terms || 'All sales are final.', 50, doc.y + 210);
        doc.text('Message', 320, doc.y + 190);
        doc.text(order.message || 'Thank you for your business!', 320, doc.y + 210);

        // Final Branding
        doc.rect(40, doc.y + 260, 530, 20).fill('#e0f7fa').stroke();
        doc.fontSize(10).text('Shiven Card Branding', { align: 'center' });

        // End the document
        doc.end();
    } catch (error) {
        console.error("Error generating invoice:", error);
        res.status(500).json({ error: "Error generating invoice" });
    }
};