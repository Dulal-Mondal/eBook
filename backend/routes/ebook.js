const express = require('express');
const router = express.Router();
const Ebook = require('../models/Ebook');
const Lead = require('../models/Lead');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Helper — MongoDB Binary থেকে সঠিক Buffer বানায়
const toBuffer = (data) => {
    if (!data) return null;
    if (Buffer.isBuffer(data)) return data;
    if (data.buffer) return Buffer.from(data.buffer); // MongoDB Binary object
    return Buffer.from(data);
};

// POST /api/ebook/upload — Admin: PDF upload
router.post('/upload', authMiddleware, upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No PDF file provided' });
        }

        await Ebook.deleteMany({});

        await Ebook.create({
            pdfData: req.file.buffer,
            pdfName: req.file.originalname || 'ebook.pdf',
            pdfSize: req.file.size,
            uploadedAt: new Date()
        });

        res.json({
            success: true,
            message: 'PDF successfully uploaded to database',
            size: req.file.size
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Upload failed: ' + err.message });
    }
});

// GET /api/ebook — Admin: ebook info (binary ছাড়া)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const ebook = await Ebook.findOne().select('-pdfData').sort({ createdAt: -1 });
        if (!ebook) return res.json({ pdfUrl: '', uploadedAt: null });

        res.json({
            pdfUrl: '/api/ebook/preview',
            pdfName: ebook.pdfName,
            pdfSize: ebook.pdfSize,
            uploadedAt: ebook.uploadedAt
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/ebook/preview
router.get('/preview', authMiddleware, async (req, res) => {
    try {
        const ebook = await Ebook.findOne().sort({ createdAt: -1 }).lean(); // ✅ .lean() যোগ

        if (!ebook || !ebook.pdfData) {
            return res.status(404).json({ message: 'No ebook found' });
        }

        const buffer = Buffer.from(ebook.pdfData.buffer); // ✅ .buffer property থেকে নাও

        console.log('Preview size:', buffer.length); // 4351803 আসা উচিত

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': buffer.length,
            'Content-Disposition': `inline; filename="${ebook.pdfName}"`,
            'Cache-Control': 'no-cache'
        });
        res.end(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/ebook/download
router.post('/download', async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'Name, email and phone are required' });
        }

        await Lead.findOneAndUpdate(
            { email },
            {
                name, email, phone,
                downloadedAt: new Date(),
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                source: 'Landing Page'
            },
            { upsert: true, new: true }
        );

        const ebook = await Ebook.findOne().sort({ createdAt: -1 }).lean(); // ✅ .lean() যোগ

        if (!ebook || !ebook.pdfData) {
            return res.status(404).json({ message: 'Ebook not found' });
        }

        const buffer = Buffer.from(ebook.pdfData.buffer); // ✅ .buffer property থেকে নাও

        console.log('Download size:', buffer.length); // 4351803 আসা উচিত

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': buffer.length,
            'Content-Disposition': `attachment; filename="${ebook.pdfName}"`,
            'Cache-Control': 'no-cache'
        });
        res.end(buffer);

    } catch (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'Download failed: ' + err.message });
    }
});
// GET /api/ebook/test — শুধু debug করার জন্য (auth ছাড়া)
router.get('/test', async (req, res) => {
    const ebook = await Ebook.findOne().sort({ createdAt: -1 }).lean();

    const data = ebook.pdfData;

    res.json({
        storedSize: ebook.pdfSize,
        dataType: typeof data,
        isBuffer: Buffer.isBuffer(data),
        hasBufferProp: !!data?.buffer,
        dataLength: data?.length || 0,
        bufferLength: data?.buffer?.length || 0,
    });
});

module.exports = router;