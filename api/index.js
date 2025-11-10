// api/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middleware ---
app.use(cors({
  origin: '*' // For development. We'll restrict this later.
}));
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// --- API Routes ---
app.get('/api', (req, res) => {
  res.send('Hello from BRACU-CHAKA API!');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users')); 
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/rides', require('./routes/rides')); // <-- ADD THIS LINE

// --- Vercel Export ---
module.exports = app;