// src/routes/user.js - User Authentication Routes
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { User, Order } = require('../models');
const { authenticate } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const { body, validationResult } = require('express-validator');

// POST /api/user/register - Register new user
router.post('/register', rateLimiter.auth, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      userId: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role: 'user'
    });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user.userId, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/user/login - User login
router.post('/login', rateLimiter.auth, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email, role: 'user' });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await User.updateOne({ userId: user.userId }, { $set: { lastLogin: new Date() } });

    // Generate token
    const token = jwt.sign(
      { userId: user.userId, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        credits: user.credits
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/user/me - Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select('-password').lean();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    delete user._id;
    delete user.__v;

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// PUT /api/user/me - Update user profile
router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, settings } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (settings) updateData.settings = settings;
    updateData.updatedAt = new Date();

    await User.updateOne({ userId: req.user.userId }, { $set: updateData });

    const user = await User.findOne({ userId: req.user.userId }).select('-password').lean();
    delete user._id;
    delete user.__v;

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// POST /api/user/change-password - Change password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const user = await User.findOne({ userId: req.user.userId });
    
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { userId: req.user.userId },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// GET /api/user/orders - Get user's order history
router.get('/orders', authenticate, async (req, res) => {
  try {
    const { skip = 0, limit = 20 } = req.query;

    const orders = await Order.find({ userId: req.user.userId })
      .select('orderId serviceName amount status createdAt fileName serviceType')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    const total = await Order.countDocuments({ userId: req.user.userId });

    res.json({
      orders: orders.map(o => { delete o._id; delete o.__v; return o; }),
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// POST /api/user/refresh - Refresh token
router.post('/refresh', authenticate, async (req, res) => {
  try {
    const token = jwt.sign(
      { userId: req.user.userId, email: req.user.email, name: req.user.name, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

module.exports = router;
