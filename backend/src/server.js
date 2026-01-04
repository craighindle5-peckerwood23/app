// src/server.js - FileSolved Express.js Main Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Import routes
const servicesRoutes = require('./routes/services');
const ordersRoutes = require('./routes/orders');
const paypalRoutes = require('./routes/paypal');
const uploadRoutes = require('./routes/upload');
const processRoutes = require('./routes/process');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const aiRoutes = require('./routes/ai');
const webhookRoutes = require('./routes/webhooks');
const subscriptionRoutes = require('./routes/subscription');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 8001;

// Create upload directories
const uploadDir = process.env.UPLOAD_DIR || './uploads';
const outputDir = process.env.OUTPUT_DIR || './outputs';
[uploadDir, outputDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGINS === '*' ? '*' : process.env.CORS_ORIGINS?.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
app.use('/api/', rateLimiter.general);

// Static files for downloads
app.use('/api/files', express.static(path.join(__dirname, '../uploads')));
app.use('/api/outputs', express.static(path.join(__dirname, '../outputs')));

// Health check
app.get('/api/', (req, res) => {
  res.json({ 
    message: 'FileSolved API - One Upload. Problem Solved.',
    version: '2.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes - All prefixed with /api
app.use('/api/services', servicesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/process', processRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/webhooks', webhookRoutes);

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use(errorHandler);

// MongoDB connection
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'filesolved';

mongoose.connect(`${mongoUrl}/${dbName}`)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 FileSolved API running on http://0.0.0.0:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💳 PayPal Mode: ${process.env.PAYPAL_MODE || 'live'}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});

module.exports = app;
