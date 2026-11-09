const dns = require('dns');
dns.setServers(['8.8.8.8']);

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use('/api/auth', authRoutes);
// Transaction Routes
app.use('/api/transactions', transactionRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Expense Tracker Backend is Running!');
});

// Connect Database
connectDB();

// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
