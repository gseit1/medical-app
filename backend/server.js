const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const instructionRoutes = require('./routes/instructions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set UTF-8 charset for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Test database connection
testConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/instructions', instructionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Medical Application API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      patients: '/api/patients',
      instructions: '/api/instructions'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📱 Network: http://192.168.1.2:${PORT}`);
  console.log(`📚 API documentation available at http://localhost:${PORT}`);
});

module.exports = app;
