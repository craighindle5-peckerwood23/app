// src/routes/admin.js - Admin Routes
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { User, Order, Payment, Analytics, Job, AuditLog } = require('../models');
const { authenticateAdmin } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

// POST /api/admin/login - Admin login
router.post('/login', rateLimiter.auth, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find admin user
    let admin = await User.findOne({ email, role: { $in: ['admin', 'support'] } });

    // Create default admin if none exists (uses environment variables)
    const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin@filesolved.com';
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    
    if (!admin && email === defaultAdminEmail && password === defaultAdminPassword) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = new User({
        userId: uuidv4(),
        email: defaultAdminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin'
      });
      await admin.save();
    }

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await User.updateOne({ userId: admin.userId }, { $set: { lastLogin: new Date() } });

    // Generate token
    const token = jwt.sign(
      { userId: admin.userId, email: admin.email, name: admin.name, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Audit log
    await AuditLog.create({
      logId: uuidv4(),
      actorId: admin.userId,
      actorType: 'admin',
      action: 'admin_login',
      resourceType: 'user',
      resourceId: admin.userId,
      ipAddress: req.ip
    });

    res.json({ token, email: admin.email, name: admin.name, role: admin.role });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/admin/analytics - Dashboard analytics
router.get('/analytics', authenticateAdmin, async (req, res) => {
  try {
    // Total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Orders by service
    const serviceStats = await Order.aggregate([
      { $group: { _id: '$serviceId', count: { $sum: 1 }, revenue: { $sum: '$amount' } } }
    ]);
    const ordersByService = {};
    const revenueByService = {};
    serviceStats.forEach(s => {
      ordersByService[s._id] = s.count;
      revenueByService[s._id] = s.revenue;
    });

    // Conversion rate
    const paidOrders = await Order.countDocuments({ status: { $in: ['paid', 'completed'] } });
    const conversionRate = totalOrders > 0 ? (paidOrders / totalOrders * 100) : 0;

    // Recent orders - with projection for performance
    const recentOrders = await Order.find()
      .select('orderId serviceName amount status createdAt customerName customerEmail')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      ordersByService,
      revenueByService,
      conversionRate: Math.round(conversionRate * 100) / 100,
      recentOrders: recentOrders.map(o => { delete o._id; delete o.__v; return o; })
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/admin/orders - List all orders
router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const { skip = 0, limit = 50, status, serviceId, startDate, endDate } = req.query;

    const query = {};
    if (status) query.status = status;
    if (serviceId) query.serviceId = serviceId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .select('orderId serviceName customerName customerEmail amount status createdAt fileName')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    const total = await Order.countDocuments(query);

    res.json({
      orders: orders.map(o => { delete o._id; delete o.__v; return o; }),
      total
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/admin/orders/:id - Get order details
router.get('/orders/:id', authenticateAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id }).lean();
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const payment = await Payment.findOne({ orderId: req.params.id }).lean();
    const jobs = await Job.find({ orderId: req.params.id }).lean();

    delete order._id;
    delete order.__v;

    res.json({
      order,
      payment: payment ? { ...payment, _id: undefined, __v: undefined } : null,
      jobs: jobs.map(j => { delete j._id; delete j.__v; return j; })
    });
  } catch (error) {
    console.error('Order detail error:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// POST /api/admin/orders/:id/reprocess - Reprocess an order
router.post('/orders/:id/reprocess', authenticateAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Reset order status
    await Order.updateOne(
      { orderId: req.params.id },
      { $set: { status: 'paid', outputFile: null, errorMessage: null, processedAt: null } }
    );

    // Create new job
    const job = new Job({
      jobId: uuidv4(),
      orderId: req.params.id,
      type: 'file_processing',
      status: 'queued',
      priority: 0 // High priority for reprocess
    });
    await job.save();

    // Audit log
    await AuditLog.create({
      logId: uuidv4(),
      actorId: req.user.userId,
      actorType: 'admin',
      action: 'order_reprocess',
      resourceType: 'order',
      resourceId: req.params.id,
      ipAddress: req.ip
    });

    // Start processing
    const { processOrder } = require('../services/processor');
    processOrder(req.params.id).catch(err => console.error('Reprocess error:', err));

    res.json({ message: 'Reprocessing started', jobId: job.jobId });
  } catch (error) {
    console.error('Reprocess error:', error);
    res.status(500).json({ error: 'Failed to reprocess order' });
  }
});

// POST /api/admin/orders/:id/refund - Refund an order
router.post('/orders/:id/refund', authenticateAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order
    await Order.updateOne(
      { orderId: req.params.id },
      { $set: { status: 'refunded' } }
    );

    // Update payment
    await Payment.updateOne(
      { orderId: req.params.id },
      { $set: { status: 'refunded', refundAmount: order.amount, refundReason: reason } }
    );

    // Audit log
    await AuditLog.create({
      logId: uuidv4(),
      actorId: req.user.userId,
      actorType: 'admin',
      action: 'order_refund',
      resourceType: 'order',
      resourceId: req.params.id,
      details: { reason, amount: order.amount },
      ipAddress: req.ip
    });

    res.json({ message: 'Order refunded', amount: order.amount });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: 'Failed to refund order' });
  }
});

// GET /api/admin/revenue-summary - Revenue summary by day
router.get('/revenue-summary', authenticateAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const summary = await Order.aggregate([
      { $match: { 
        status: { $in: ['paid', 'completed'] },
        createdAt: { $gte: startDate }
      }},
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$amount' },
        orders: { $sum: 1 }
      }},
      { $sort: { _id: -1 } }
    ]);

    res.json({ dailyRevenue: summary });
  } catch (error) {
    console.error('Revenue summary error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue summary' });
  }
});

// GET /api/admin/users - List users
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { skip = 0, limit = 50 } = req.query;

    const users = await User.find({ role: 'user' })
      .select('userId email name role createdAt lastLogin')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments({ role: 'user' });

    res.json({
      users: users.map(u => { delete u._id; delete u.__v; return u; }),
      total
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/admin/errors - Error logs
router.get('/errors', authenticateAdmin, async (req, res) => {
  try {
    const failedOrders = await Order.find({ status: 'failed' })
      .select('orderId serviceName errorMessage createdAt customerEmail')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const failedJobs = await Job.find({ status: 'failed' })
      .select('jobId orderId type errorMessage createdAt')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      failedOrders: failedOrders.map(o => { delete o._id; return o; }),
      failedJobs: failedJobs.map(j => { delete j._id; return j; })
    });
  } catch (error) {
    console.error('Errors fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch errors' });
  }
});

// GET /api/admin/export - Export data as CSV
router.get('/export', authenticateAdmin, async (req, res) => {
  try {
    const { type = 'orders', startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    let data = [];
    let headers = [];

    if (type === 'orders') {
      headers = ['orderId', 'serviceName', 'customerEmail', 'customerName', 'amount', 'status', 'createdAt'];
      data = await Order.find(query).select(headers.join(' ')).limit(10000).lean();
    } else if (type === 'payments') {
      headers = ['paymentId', 'orderId', 'amount', 'status', 'provider', 'createdAt'];
      data = await Payment.find(query).select(headers.join(' ')).limit(10000).lean();
    }

    // Generate CSV
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_export.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

module.exports = router;
