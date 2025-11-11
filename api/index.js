// api/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // Define the port

// --- Middleware ---
app.use(cors({
  origin: '*' 
}));
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB Connection Error:', err.stack));

// --- API Routes ---
app.get('/api', (req, res) => {
  res.send('Hello from BRACU-CHAKA API!');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users')); 
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/rides', require('./routes/rides')); 

// --- START THE SERVER (This is the critical part) ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// --- Vercel Export (for deployment) ---
module.exports = app;