const mongoose = require('mongoose');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
require('dotenv').config();

const verify = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Create 2 test users
        const reporter = await User.create({
            name: 'Test Reporter Sanzid',
            email: 'reportersanzid@test.com',
            password: 'password123',
            role: 'USER'
        });

        const badActor = await User.create({
            name: 'Bad Actor Sanzid',
            email: 'badactorsanzid@test.com',
            password: 'password123',
            role: 'USER'
        });

        console.log('Users created:', reporter._id, badActor._id);

        // 1. Test Reporting
        const complaint = await Complaint.create({
            submittedBy: reporter._id,
            reportedUser: badActor._id,
            description: 'Test reporting functionality in Sanzid branch',
            status: 'pending'
        });

        console.log('Complaint created:', complaint._id);

        const foundComplaint = await Complaint.findById(complaint._id);
        if (foundComplaint && foundComplaint.reportedUser.toString() === badActor._id.toString()) {
            console.log('PASS: Reporting verification successful');
        } else {
            console.error('FAIL: Reporting verification failed');
        }

        // 2. Test Blocking
        reporter.blockedUsers.push(badActor._id);
        await reporter.save();

        const updatedReporter = await User.findById(reporter._id);
        if (updatedReporter.blockedUsers.includes(badActor._id)) {
            console.log('PASS: Blocking verification successful');
        } else {
            console.error('FAIL: Blocking verification failed');
        }

        // Cleanup
        await User.deleteMany({ email: { $in: ['reportersanzid@test.com', 'badactorsanzid@test.com'] } });
        await Complaint.deleteMany({ _id: complaint._id });
        console.log('Cleanup successful');

    } catch (err) {
        console.error('Verification Error:', err);
    } finally {
        await mongoose.disconnect();
    }
};

verify();
