// controllers/userDetailsController.js
const UserDetails = require('../models/UserDetails');
const fs = require('fs');
const path = require('path');


const getUserDetails = async (req, res) => {
    try {
        console.log(req.user._id)
        const userId = req.user._id;
        const userDetails = await UserDetails.findOne({ userId });

        if (!userDetails) {
            return res.status(404).json({ message: "User details not found" });
        }

        res.status(200).json(userDetails);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUserProductDetails = async (req, res) => {
    try {
        console.log('Fetching user products');

        // Fetch all user details from the database
        const userDetails = await UserDetails.find({}); // Get all users' details

        if (!userDetails || userDetails.length === 0) {
            return res.status(404).json({ message: "No user details found" });
        }

        // Map over each user and attach their products as a nested array
        const result = userDetails.map(user => ({
            userName: user.name,
            userEmail: user.email,
            userPhone: user.contact1,
            products: user.products,  // Attach the products as an array
        }));

        if (result.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        // Respond with the aggregated user details along with their products
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching user products:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const getAllUserDetails = async (req, res) => {
    try {
        const userDetails = await UserDetails.find() // Fetch all user details from the database
            .populate('socialMediaLinks')  // Populate social media links
            .populate('aboutCompany')      // Populate about company information
            .populate('bankDetails')       // Populate bank details
            .populate('products')          // Populate products information
            .populate('galleryImages');    // Populate gallery images

        if (!userDetails || userDetails.length === 0) {
            return res.status(404).json({ message: "No user details found" });
        }

        res.status(200).json(userDetails); // Send all user details to the admin
    } catch (error) {
        console.error("Error fetching all user details:", error);
        res.status(500).json({ message: "Server error" });
    }
};



const addUserDetails = async (req, res) => {
    console.log(req.body)
    try {
        const user = req.user; // Get the user data from the middleware

        // Create the user-specific directory
        const userDir = path.join(__dirname, '../uploads/userDetails', user._id.toString());
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true }); // Create directory recursively
        }

        // Prepare to save file paths
        const documents = [];
        const qrImages = [];
        const galleryImages = [];
        let logoPath = '';
        let videoPath = '';

        // Handle file uploads and move files to user-specific directory
        if (req.files.documents) {
            req.files.documents.forEach((file, index) => {
                const fileName = `documents_${index + 1}_${file.originalname}`; // Prefix and index
                const filePath = path.join(userDir, fileName);
                fs.renameSync(file.path, filePath); // Move file to the user's directory
                documents.push(fileName); // Save the new filename
            });
        }

        if (req.files.qrImages) {
            req.files.qrImages.forEach((file, index) => {
                const fileName = `qrImages_${index + 1}_${file.originalname}`;
                const filePath = path.join(userDir, fileName);
                fs.renameSync(file.path, filePath);
                qrImages.push(fileName); // Save the new filename
            });
        }

        if (req.files.galleryImages) {
            req.files.galleryImages.forEach((file, index) => {
                const fileName = `galleryImages_${index + 1}_${file.originalname}`;
                const filePath = path.join(userDir, fileName);
                fs.renameSync(file.path, filePath);
                galleryImages.push(fileName); // Save the new filename
            });
        }

        // Handle logo upload
        if (req.files.logo && req.files.logo.length > 0) {
            const fileName = `logo_${req.files.logo[0].originalname}`;
            logoPath = path.join(userDir, fileName);
            fs.renameSync(req.files.logo[0].path, logoPath);
        }

        // Handle video upload
        if (req.files.video && req.files.video.length > 0) {
            const fileName = `video_${req.files.video[0].originalname}`;
            videoPath = path.join(userDir, fileName);
            fs.renameSync(req.files.video[0].path, videoPath);
        }

        const productEntries = req.body.products;
        const productImageEntries = req.files['productImages[]'];
        
        if (!Array.isArray(productEntries)) {
            console.log(productEntries,productImageEntries)
            return res.status(400).json({ message: 'Invalid products format' });
        }
        
        // Log incoming data for debugging
        console.log('Product Entries:', productEntries);
        console.log('Product Image Entries:', productImageEntries);
        
        const processedProducts = [];

        for (let i = 0; i < productEntries.length; i++) {
            let product;
            try {
                product = JSON.parse(productEntries[i]);
            } catch (error) {
                console.error('JSON parse error:', error);
                return res.status(400).json({ message: 'Invalid product data' });
            }

            const productImages = [];

            // Check if product images are uploaded
            if (Array.isArray(productImageEntries) && productImageEntries.length > i) {
                const productImage = productImageEntries[i];
                const fileName = `product_${i + 1}_${productImage.originalname}`;
                const filePath = path.join(userDir, fileName);

                // Move the file to the user directory
                try {
                    fs.renameSync(productImage.path, filePath);
                    productImages.push(fileName); // Save the new filename
                } catch (error) {
                    console.error('File rename error:', error);
                    return res.status(500).json({ message: 'Error processing product images' });
                }
            }

            // Validate product fields
            if (!product.productName || !product.productPrice || !product.productType) {
                return res.status(400).json({ message: 'Missing product fields' });
            }

            // Add processed product data to the array
            processedProducts.push({
                productName: product.productName,
                productPrice: product.productPrice,
                productType: product.productType,
                productImages: productImages, // Store the paths of product images
            });
        }


        // Create a new UserDetails instance with the user ID and file names
        const userDetails = new UserDetails({
            userId: user._id,  // Store user ID
            companyName: req.body.companyName,
            name: req.body.name,
            designation: req.body.designation,
            contact1: req.body.contact1,
            contact2: req.body.contact2,
            whatsapp1: req.body.whatsapp1,
            whatsapp2: req.body.whatsapp2,
            email: req.body.email,
            website: req.body.website,
            googleMap: req.body.googleMap,
            address: req.body.address,
            socialMediaLinks: {
                facebook: req.body.facebook,
                instagram: req.body.instagram,
                linkedin: req.body.linkedin,
                twitter: req.body.twitter,
                youtubeChannel: req.body.youtubeChannel,
                googleBusiness: req.body.googleBusiness,
                otherProfile: req.body.otherProfile,
                youtubeVideo:req.body.youtubeVideos,
                // video : videoPath ? path.basename(videoPath) : '', 
            },
            aboutCompany: {
                establishedYear: req.body.establishedYear,
                natureOfBusiness: req.body.natureOfBusiness,
                gstNumber: req.body.gstNumber,
                documents: documents, // Save document filenames
                description:req.body.aboutCompany,
            },
            bankDetails: {
                bankName: req.body.bankName,
                accountNumber: req.body.accountNumber,
                branchName: req.body.branchName,
                ifscCode: req.body.ifscCode,
                accountHolderName: req.body.accountHolderName,
                gPayNumber: req.body.gPayNumber,
                paytmNumber: req.body.paytmNumber,
                phonePeNumber: req.body.phonePeNumber,
                upiId: req.body.upiId,
                accountType: req.body.accountType,
                qrImages: qrImages, // Save QR image filenames
            },
            logo: logoPath ? path.basename(logoPath) : '', // Save the logo filename
            // video: videoPath ? path.basename(videoPath) : '',
            // qrImages: qrImages, 
            galleryImages: galleryImages, // Save gallery image filenames
            products: processedProducts, // Save processed products array
        });

        // Save the user details to the database
        const savedDetails = await userDetails.save();

        res.status(201).json(savedDetails);
    } catch (error) {
        console.error('Error saving user details:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Export the addUserDetails function
module.exports = { addUserDetails, getUserDetails, getAllUserDetails,getUserProductDetails };
