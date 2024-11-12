// controllers/discountController.js
const UserDetails = require('../models/UserDetails');

// Add or update discount for a product
const addOrUpdateDiscount = async (req, res) => {
    const { discount } = req.body;
    const user = req.user; // Get the user from request
    const { productId } = req.params;

console.log(req.body,req.params)
    try {
        const userDetails = await UserDetails.findOne({ userId: user._id });
        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        const product = userDetails.products.id(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.discount = discount; // Update the discount
        await userDetails.save();
        res.status(200).json({ message: 'Discount updated successfully', product });
    } catch (error) {
        console.error('Error adding/updating discount:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete discount for a product
const deleteDiscount = async (req, res) => {
    const { productId } = req.params;
    const user = req.user;

    try {
        const userDetails = await UserDetails.findOne({ userId: user._id });
        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        const product = userDetails.products.id(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.discount = null; // Remove the discount
        await userDetails.save();
        res.status(200).json({ message: 'Discount removed successfully', product });
    } catch (error) {
        console.error('Error deleting discount:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Fetch all discounts for a user
const fetchDiscounts = async (req, res) => {
    const user = req.user;

    try {
        const userDetails = await UserDetails.findOne({ userId: user._id });
        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        res.status(200).json({ discounts: userDetails.products.map(product => ({
            productId: product._id,
            productName: product.productName,
            discount: product.discount,
        })) });
    } catch (error) {
        console.error('Error fetching discounts:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    addOrUpdateDiscount,
    deleteDiscount,
    fetchDiscounts,
};
