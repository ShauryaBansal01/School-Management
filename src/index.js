require('dotenv').config();
const express = require('express');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Main API Routes
app.use('/', schoolRoutes);

// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'School Management API is running' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
