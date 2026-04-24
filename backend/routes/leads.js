const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Ebook = require('../models/Ebook');
const authMiddleware = require('../middleware/auth');

// POST /api/leads — Lead save করো
router.post('/', async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'সব তথ্য পূরণ করুন' });
        }

        const ebook = await Ebook.findOne().select('-pdfData');
        if (!ebook) {
            return res.status(404).json({ message: 'E-book এখনো আপলোড হয়নি।' });
        }

        // ✅ duplicate হলে error না দিয়ে update করো — user আবার download করতে পারবে
        await Lead.findOneAndUpdate(
            { email: email.toLowerCase().trim() },
            { name, email, phone, ipAddress: req.ip, downloadedAt: new Date() },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'ধন্যবাদ! আপনার download প্রস্তুত।'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// GET /api/leads/download — PDF serve
router.get('/download', async (req, res) => {
    try {
        const ebook = await Ebook.findOne().sort({ createdAt: -1 }).lean(); // ✅ .lean()

        if (!ebook || !ebook.pdfData) {
            return res.status(404).json({ message: 'E-book পাওয়া যায়নি' });
        }

        // ✅ MongoDB Binary থেকে সঠিক Buffer
        const buffer = Buffer.from(ebook.pdfData.buffer);

        console.log('Download buffer size:', buffer.length); // 4351803 আসা উচিত

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

// GET /api/leads — Admin: all leads
router.get('/', authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ]
        } : {};

        const total = await Lead.countDocuments(query);
        const leads = await Lead.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({ leads, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/leads/:id — Admin
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lead deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;