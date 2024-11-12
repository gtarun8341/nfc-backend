const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    uploadTemplate,
    getTemplates,
    renderTemplateWithUserData,
    deleteTemplate
} = require('../controllers/templateController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads/template');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}_${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage });

// Route for uploading templates
router.post('/upload', upload.single('file'), (req, res, next) => {
    // Log the request body and uploaded file
    console.log('Upload Request Body:', req.body);
    console.log('Uploaded File:', req.file); // req.file should contain the uploaded file info

    next(); // Call the next middleware (uploadTemplate)
}, uploadTemplate);
// Route for listing all templates of a specific type
router.get('/templates', getTemplates);

// Route for rendering a template with user data (EJS rendering)
router.get('/render/:templateId', protect, renderTemplateWithUserData);

router.delete('/:templateId', protect, deleteTemplate);

module.exports = router;
