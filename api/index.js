// api/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; 


app.use(cors({
  origin: '*' 
}));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB Connection Error:', err.stack));


app.get('/api', (req, res) => {
  res.send('Hello from BRACU-CHAKA API!');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users')); 
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/rides', require('./routes/rides')); 


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;