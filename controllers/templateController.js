const {
    NfcCardTemplate,
    PdfCardTemplate,
    MiniWebsiteTemplate,
    OnePageBusinessProfile,
    PhysicalVisitingCard,
    BusinessEssentials,
} = require('../models/Template');
const UserDetails = require('../models/UserDetails');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

// Mapping template types to models
const templateModelMapping = {
    'nfc': NfcCardTemplate,
    'pdf': PdfCardTemplate,
    'mini-website': MiniWebsiteTemplate,
    'one-page-business-profile': OnePageBusinessProfile,
    'physical-visiting-card': PhysicalVisitingCard,
    'business-essentials':BusinessEssentials,

};
require('dotenv').config();

// Controller to handle template upload
exports.uploadTemplate = async (req, res) => {
    try {
        const { name, type } = req.body;
        const filename = req.file.filename;

        // Check if the provided type is valid
        if (!templateModelMapping[type]) {
            return res.status(400).json({ message: 'Invalid template type provided.' });
        }

        // Dynamically choose the model based on the template type
        const TemplateModel = templateModelMapping[type];

        // Create new template entry in the appropriate model
        const newTemplate = new TemplateModel({
            name,
            filename,
        });

        await newTemplate.save();

        res.status(200).json({ message: 'Template uploaded successfully!', template: newTemplate });
    } catch (error) {
        console.error('Error uploading template:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to list all uploaded templates of a specific type
exports.getTemplates = async (req, res) => {
    try {
        const { type } = req.query;

        // Check if the provided type is valid
        if (!templateModelMapping[type]) {
            return res.status(400).json({ message: 'Invalid template type provided.' });
        }

        // Dynamically choose the model based on the template type
        const TemplateModel = templateModelMapping[type];

        // Fetch templates of the specified type
        const templates = await TemplateModel.find();
        res.status(200).json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller to render a template with user data
exports.renderTemplateWithUserData = async (req, res) => {
    try {
        const { templateId } = req.params;
        const user = req.user;
        console.log(req.params,user)

        const userDetails = await UserDetails.findOne({ userId: user._id.toString() });
        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        const templateType = req.query.type;
        if (!templateModelMapping[templateType]) {
            return res.status(400).json({ message: 'Invalid template type provided.' });
        }

        const TemplateModel = templateModelMapping[templateType];
        const template = await TemplateModel.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        const templatePath = path.join(__dirname, '../uploads/template', template.filename);
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        const apiUrl = `${process.env.SERVER_URL}/`;

        const baseUrl = `${process.env.SERVER_URL}/uploads/userDetails/${userDetails.userId}/`;

        const updatedProducts = userDetails.products.map(product => {
            const plainProduct = product.toObject();
            return {
                ...plainProduct,
                productImages: plainProduct.productImages.map(image => `${baseUrl}${image}`)
            };
        });

        const renderedTemplate = ejs.render(templateContent, {
            url:`${apiUrl}`,
            userid: userDetails.userId,
            userName: userDetails.name,
            email: userDetails.email,
            companyName: userDetails.companyName,
            designation: userDetails.designation,
            contact1: userDetails.contact1,
            contact2: userDetails.contact2,
            contacts: [userDetails.contact1, userDetails.contact2].filter(Boolean),
            whatsapp1: userDetails.whatsapp1,
            whatsapp2: userDetails.whatsapp2,
            Watsapps: [userDetails.whatsapp1, userDetails.whatsapp2].filter(Boolean),
            website: userDetails.website,
            googleMap: userDetails.googleMap,
            location: userDetails.address,
            logoUrl: `${baseUrl}${userDetails.logo}`,
            establishmentYear: userDetails.aboutCompany.establishedYear,
            businessNature: userDetails.aboutCompany.natureOfBusiness,
            gstNo: userDetails.aboutCompany.gstNumber,
            documents: userDetails.aboutCompany.documents.map(doc => `${baseUrl}${doc}`),
            bankName: userDetails.bankDetails.bankName,
            accountNo: userDetails.bankDetails.accountNumber,
            branchName: userDetails.bankDetails.branchName,
            ifscCode: userDetails.bankDetails.ifscCode,
            accountHolderName: userDetails.bankDetails.accountHolderName,
            gpayNo: userDetails.bankDetails.gPayNumber,
            paytmNo: userDetails.bankDetails.paytmNumber,
            phonePayNo: userDetails.bankDetails.phonePeNumber,
            upiId: userDetails.bankDetails.upiId,
            accountType: userDetails.bankDetails.accountType,
            qrImages: userDetails.bankDetails.qrImages,
            products: updatedProducts,
            galleryImages: userDetails.galleryImages.map(imageName => `${baseUrl}${imageName}`),
            socialMediaLinks: userDetails.socialMediaLinks,
            videoUrl:userDetails.socialMediaLinks.youtubeVideo,
            googleBusiness:userDetails.socialMediaLinks.googleBusiness,
        });

        res.send(renderedTemplate);
    } catch (error) {
        console.error('Error rendering template:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteTemplate = async (req, res) => {
    try {
        const { templateId } = req.params;
        const type = req.query.type;

        // Check if the provided type is valid
        if (!templateModelMapping[type]) {
            return res.status(400).json({ message: 'Invalid template type provided.' });
        }

        // Dynamically choose the model based on the template type
        const TemplateModel = templateModelMapping[type];

        // Find the template by ID
        const template = await TemplateModel.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        // Delete the file from the file system
        const templatePath = path.join(__dirname, '../uploads/template', template.filename);
        if (fs.existsSync(templatePath)) {
            fs.unlinkSync(templatePath);
        }

        // Delete the template record from the database
        await TemplateModel.findByIdAndDelete(templateId);

        res.status(200).json({ message: 'Template deleted successfully!' });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
