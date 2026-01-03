// api/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
<<<<<<< HEAD
const http = require('http'); // Import HTTP
const { Server } = require("socket.io"); // Import Socket.io
=======
>>>>>>> 95c9c18c5c3bc5a1d8b70e1427ea909619b2bfbf
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

<<<<<<< HEAD
// --- SOCKET.IO SETUP ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (update for production!)
    methods: ["GET", "POST"]
  }
});

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  req.io = io; // Make socket.io available in routes
  next();
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Join a specific ride room
  socket.on("join_ride", (rideId) => {
    socket.join(rideId);
    console.log(`User with ID: ${socket.id} joined ride: ${rideId}`);
  });

  // Handle sending messages
  socket.on("send_message", (data) => {
    // data should contain: { rideId, message, author, time }
    socket.to(data.rideId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});



=======
// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

>>>>>>> 95c9c18c5c3bc5a1d8b70e1427ea909619b2bfbf
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

<<<<<<< HEAD



=======
>>>>>>> 95c9c18c5c3bc5a1d8b70e1427ea909619b2bfbf
// --- START THE SERVER ---
// Only run the server if this file is run directly (not imported)
if (require.main === module) {
  connectDB().then(() => {
<<<<<<< HEAD
    // Use 'server.listen' instead of 'app.listen'
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> 95c9c18c5c3bc5a1d8b70e1427ea909619b2bfbf
  });
}

module.exports = app;