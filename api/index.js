// api/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // MUST be at the top

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// --- Database Connection (Serverless Caching) ---
let isConnected = false; // Track connection state

const connectDB = async () => {
  mongoose.set('strictQuery', true);
  if (isConnected) {
    console.log('MongoDB using existing connection');
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.stack);
  }
};

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// --- API Routes ---
// This now includes all the routes you were missing
app.get('/api', (req, res) => {
  res.send('Hello from BRACU-CHAKA API!');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/support', require('./routes/support'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/reviews', require('./routes/reviews')); // Register Reviews Route
app.use('/api/emergency', require('./routes/emergency')); // <-- NEW LINE

// --- START THE SERVER ---
// Only run the server if this file is run directly (not imported)
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = app;