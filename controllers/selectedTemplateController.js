const SelectedTemplate = require('../models/SelectedTemplate');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const UserDetails = require('../models/UserDetails');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const {
    NfcCardTemplate,
    PdfCardTemplate,
    MiniWebsiteTemplate,
    OnePageBusinessProfile,
    PhysicalVisitingCard,
    BusinessEssentials,
} = require('../models/Template');
require('dotenv').config();

// Mapping template types to models
const templateModelMapping = {
    'nfc': NfcCardTemplate,
    'pdf': PdfCardTemplate,
    'mini-website': MiniWebsiteTemplate,
    'one-page-business-profile': OnePageBusinessProfile,
    'physical-visiting-card': PhysicalVisitingCard,
    'business-essentials':BusinessEssentials,
};
const selectTemplate = async (req, res) => {
    const { templateId } = req.body; // Extract templateId from request body
    const userId = req.user._id; // Get userId from req.user populated by protect middleware
    const type =req.query.type;
    try {
        // Generate a unique URL using a UUID
        const uniqueUrl = `${process.env.SERVER_URL}/api/selectedtemplates/render?uid=${uuidv4()}`;

        // Create a new SelectedTemplate document
        const newSelectedTemplate = new SelectedTemplate({
            userId,
            templateId,
            type,
            uniqueUrl,
        });

        await newSelectedTemplate.save();

        // Return the generated link to the frontend
        res.status(201).json({ link: uniqueUrl });
    } catch (error) {
        console.error('Error selecting template:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const renderTemplateWithUserData = async (req, res) => {
    try {
        const { uid } = req.query; // Get the unique ID from query parameters
        console.log(uid,"entered")

        // Find the selected template by unique URL (UUID)
        const selectedTemplate = await SelectedTemplate.findOne({ uniqueUrl: `${process.env.SERVER_URL}/api/selectedtemplates/render?uid=${uid}` });
        if (!selectedTemplate) {
            return res.status(404).json({ message: 'Selected template not found' });
        }

        const userId = selectedTemplate.userId; // Extract userId from selectedTemplate
        const templateId = selectedTemplate.templateId; // Extract templateId from selectedTemplate
        const templateType = selectedTemplate.type; // Extract template type from selectedTemplate

        // Find user details using userId
        const userDetails = await UserDetails.findOne({ userId: userId.toString() });
        if (!userDetails) {
            return res.status(404).json({ message: 'User details not found' });
        }

        // Validate template type
        if (!templateModelMapping[templateType]) {
            return res.status(400).json({ message: 'Invalid template type provided.' });
        }

        const TemplateModel = templateModelMapping[templateType]; // Get the corresponding template model
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
            url: `${apiUrl}`,
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
            videoUrl: userDetails.socialMediaLinks.youtubeVideo,
            googleBusiness: userDetails.socialMediaLinks.googleBusiness,
            baseurl: `${baseUrl}`
        });

        res.send(renderedTemplate);
    } catch (error) {
        console.error('Error rendering template:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getUserGeneratedLink = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all selected templates by userId
        const selectedTemplates = await SelectedTemplate.find({ userId });

        // Extract template IDs and corresponding generated links
        const selectedTemplateData = await Promise.all(
            selectedTemplates.map(async (template) => {
                // Assuming each selected template has a generated link associated with it
                const generatedLink = template.uniqueUrl; // Add logic to retrieve the link
                console.log(generatedLink)
                return {
                    templateId: template.templateId.toString(),
                    generatedLink,
                };
            })
        );

        // Send the data back as a response
        res.status(200).json({ selectedTemplateData });
    } catch (error) {
        console.error('Error fetching selected templates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getqrforUserGeneratedLink = async (req, res) => {
    try {
        // Find all selected templates for all users
        const selectedTemplates = await SelectedTemplate.find().populate('userId', 'name phone email'); // Populating user details

        // Extract template IDs, corresponding generated links, and user details
        const selectedTemplateData = selectedTemplates.map((template) => {
            // Get the user details from the populated userId field
            const { name, phone, email } = template.userId;

            // Assuming each selected template has a generated link associated with it
            const generatedLink = template.uniqueUrl; // Add logic to retrieve the link

            return {
                templateId: template.templateId.toString(),
                generatedLink,
                userDetails: {
                    name,
                    phone,
                    email
                }
            };
        });

        // Send the data back as a response
        res.status(200).json({ selectedTemplateData });
    } catch (error) {
        console.error('Error fetching selected templates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { selectTemplate, renderTemplateWithUserData, getUserGeneratedLink ,getqrforUserGeneratedLink};
