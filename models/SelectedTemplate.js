const mongoose = require('mongoose');

const selectedTemplateSchema = new mongoose.Schema({
    type:{ type: String, required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    uniqueUrl: { type: String, required: true, unique: true },
}, { timestamps: true });

const SelectedTemplate = mongoose.model('SelectedTemplate', selectedTemplateSchema);

module.exports = SelectedTemplate;
