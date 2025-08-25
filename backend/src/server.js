/**
 * Email Analysis System - Main Server File
 * 
 * This file sets up the Express.js server with all necessary middleware,
 * database connections, and route handlers for the email analysis system.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import configurations and utilities
const connectDB = require('../config/database');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { runStartupTasks, setupGracefulShutdown } = require('./utils/startup');

// Import routes
const emailRoutes = require('./routes/emailRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.use('/health', healthRoutes);

// API routes
app.use('/api/emails', emailRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Email Analysis System API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📧 Email Analysis System API is ready!`);

  // Run startup tasks
  await runStartupTasks();
});

// Setup graceful shutdown
setupGracefulShutdown();

module.exports = app;
