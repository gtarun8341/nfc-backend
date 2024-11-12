const UserDetails = require('../models/UserDetails');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Use UUID for unique file names

// Add a product
const addProduct = async (req, res) => {
    try {
        console.log(req.file);
        const user = req.user; // Assuming req.user contains authenticated user data
        const { name, price, type } = req.body;
        const userDir = path.join(__dirname, '../uploads/userDetails', user._id.toString());

        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        // Handle product image uploads
        const productImages = [];
        if (req.files) {
            req.files.forEach((file, index) => {
                const uniqueName = `product_${index + 1}_${uuidv4()}_${file.originalname}`;
                const filePath = path.join(userDir, uniqueName);
                fs.renameSync(file.path, filePath); // Move to user's folder
                productImages.push(uniqueName); // Save file name
            });
        }

        // Find the user's details and add the product
        const userDetails = await UserDetails.findOne({ userId: user._id });
        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        userDetails.products.push({
            productName: name,
            productPrice: price,
            productType: type,
            productImages
        });

        await userDetails.save();
        res.status(201).json({ message: 'Product added successfully', products: userDetails.products });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Update a product
const updateProduct = async (req, res) => {
    console.log(req.body)
    try {
        const user = req.user;
        const { productId } = req.params;
        const { productName, productPrice, productType } = req.body;
        const userDir = path.join(__dirname, '../uploads/userDetails', user._id.toString());

        // Handle new product images
        const newProductImages = [];
        if (req.files) {
            req.files.forEach((file, index) => {
                const fileName = `product_${index + 1}_${uuidv4()}_${file.originalname}`;
                const filePath = path.join(userDir, fileName);
                fs.renameSync(file.path, filePath);
                newProductImages.push(fileName);
            });
        }

        // Find the product
        const userDetails = await UserDetails.findOne({ userId: user._id });
        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        const product = userDetails.products.id(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update product details
        product.productName = productName || product.productName;
        product.productPrice = productPrice || product.productPrice;
        product.productType = productType || product.productType;
        if (newProductImages.length > 0) {
            product.productImages = newProductImages;
        }

        await userDetails.save();
        res.status(200).json({ message: 'Product updated successfully', products: userDetails.products });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const user = req.user;
        const { productId } = req.params;

        const userDetails = await UserDetails.findOne({ userId: user._id });
        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        // Find the index of the product in the user's products array
        const productIndex = userDetails.products.findIndex(product => product._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Remove the product from the user's products array using splice
        userDetails.products.splice(productIndex, 1);
        await userDetails.save();

        res.status(200).json({ message: 'Product deleted successfully', products: userDetails.products });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Get all products for a user
const getUserProducts = async (req, res) => {
    try {
        const user = req.user;

        const userDetails = await UserDetails.findOne({ userId: user._id });
        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        res.status(200).json({ products: userDetails.products,id:userDetails._id });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getUserProducts,
};
