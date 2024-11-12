const mongoose = require('mongoose');

// NFC Card Template Model
const nfcCardTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    }
});

const NfcCardTemplate = mongoose.model('NfcCardTemplate', nfcCardTemplateSchema);

// PDF Card Template Model
const pdfCardTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    }
});

const PdfCardTemplate = mongoose.model('PdfCardTemplate', pdfCardTemplateSchema);

// Mini Website Template Model
const miniWebsiteTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    }
});

const MiniWebsiteTemplate = mongoose.model('MiniWebsiteTemplate', miniWebsiteTemplateSchema);

// One Page Business Profile Model
const onePageBusinessProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    }
});

const OnePageBusinessProfile = mongoose.model('OnePageBusinessProfile', onePageBusinessProfileSchema);

// Physical Visiting Card Model
const physicalVisitingCardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    }
});

const PhysicalVisitingCard = mongoose.model('PhysicalVisitingCard', physicalVisitingCardSchema);

const businessEssentialsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    }
});

const BusinessEssentials = mongoose.model('BusinessEssentials', businessEssentialsSchema);

module.exports = {
    NfcCardTemplate,
    PdfCardTemplate,
    MiniWebsiteTemplate,
    OnePageBusinessProfile,
    PhysicalVisitingCard,
    BusinessEssentials,
};
