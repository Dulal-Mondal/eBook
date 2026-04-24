require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('✅ Connected to MongoDB');

    await Admin.deleteMany({});
    console.log('Old admin deleted');

    const admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
    });
    await admin.save();

    console.log('✅ Admin created:', process.env.ADMIN_EMAIL);
    console.log('Password:', process.env.ADMIN_PASSWORD);
    process.exit();
}).catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});