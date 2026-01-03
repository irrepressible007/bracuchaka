const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: '../.env' }); // Adjust path if needed depending on where you run it

const createAdmin = async () => {
    try {
        // 1. Connect to DB
        // Note: We need the URI. Assuming it's in .env or hardcoded for dev default
        // If running from api folder, path might be just .env
        const db = process.env.MONGO_URI || 'mongodb://localhost:27017/bracu-chaka';

        await mongoose.connect(db);
        console.log('MongoDB Connected...');

        const email = 'admin@bracu-chaka';
        const password = 'admin1234@';
        const name = 'Super Admin';

        // 2. Check if admin exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('Admin user already exists');
            process.exit();
        }

        // 3. Create Admin
        user = new User({
            name,
            email,
            password, // User model pre-save hook should hash this
            role: 'ADMIN',
            isRider: false // or true if you want admin to ride, but admin usually just manages
        });

        // Hash password manually just in case the model hook isn't triggered or to be safe
        // But usually User model has hooks. Let's check User model first. 
        // Assuming User model has pre-save hashing. If not, we do it here.
        // Checking User.js... Most likely it has bcrypt.

        // Actually, safer to rely on the model logic or do it explicitly if we aren't sure.
        // Let's hash it explicitly to be sure.
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        console.log(`Admin user created successfully!`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
