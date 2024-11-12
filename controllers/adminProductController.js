const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid'); // Import uuid

// Set storage options for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/adminproducts');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir); // Save files to the adminproducts directory
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${Date.now()}-${uuidv4()}${fileExtension}`; // Unique file name with UUID
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage }).array('productImages', 5); // Limit to 5 images

// Controller for adding a new product (Admin)
const addAdminProduct = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "Error uploading files" });
        }

        const { productName, productPrice, productType, discount } = req.body;
        const productImages = req.files.map(file => file.filename); // Get filenames from multer

        if (!productName || !productPrice || !productType) {
            return res.status(400).json({ message: "Product name, price, and type are required" });
        }

        const newProduct = new Product({
            productName,
            productPrice,
            productType,
            productImages,
            discount
        });

        try {
            await newProduct.save();
            res.status(201).json({
                message: "Product added successfully",
                product: newProduct
            });
        } catch (error) {
            console.error("Error adding product:", error);
            res.status(500).json({ message: "Server error" });
        }
    });
};
const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find(); // Fetch all products from the database
      res.status(200).json({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

module.exports = { addAdminProduct,getAllProducts };
