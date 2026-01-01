const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

// Force path to .env in generic root or api root
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });
// If that fails, it tries default

const resetAdmin = async () => {
    try {
        const db = process.env.MONGO_URI || 'mongodb://localhost:27017/bracu-chaka';
        await mongoose.connect(db);
        console.log('MongoDB Connected...');

        const email = 'admin@bracu-chaka';
        const password = 'admin1234@';

        // 1. Find User
        let user = await User.findOne({ email });

        if (!user) {
            console.log('Admin user not found. Creating new one...');
            user = new User({
                name: 'Super Admin',
                email: email,
                role: 'ADMIN',
                isRider: false
            });
        } else {
            console.log('Admin user found. Resetting password...');
            // Ensure role is admin
            user.role = 'ADMIN';
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        console.log('-----------------------------------');
        console.log('SUCCESS: Admin credentials updated.');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');

        process.exit();
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
};

resetAdmin();
