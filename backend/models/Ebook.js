const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Fluently Speaking English'
    },
    pdfData: {
        type: Buffer,     // PDF binary data
        required: true
    },
    pdfName: {
        type: String,
        default: 'ebook.pdf'
    },
    pdfSize: {
        type: Number,
        default: 0
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Ebook', ebookSchema);