// src/middleware/rateLimiter.js - Rate Limiting
const rateLimit = require('express-rate-limit');

const general = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

const upload = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Upload limit exceeded, please try again later' }
});

const auth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many login attempts, please try again later' }
});

const ai = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'AI request limit exceeded' }
});

module.exports = { general, upload, auth, ai };
