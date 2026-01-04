const mongoose = require('mongoose');
require('dotenv').config({ path: './api/.env' });

const connectDB = async () => {
    try {
        console.log('Testing connection to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully!');
        process.exit(0);
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

connectDB();
