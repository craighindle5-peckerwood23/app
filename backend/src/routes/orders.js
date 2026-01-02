// src/routes/orders.js - Orders Routes
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Order, Analytics } = require('../models');
const { getServiceById, calculatePrice, validateExtraFields } = require('../config/servicesCatalog');
const { optionalAuth, authenticate } = require('../middleware/auth');

// POST /api/orders - Create a new order
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      serviceId,
      fileId,
      fileName,
      customerEmail,
      customerName,
      quantity = 1,
      extraFields,
      sourcePage,
      utmSource,
      utmCampaign
    } = req.body;

    // Validate required fields
    if (!serviceId || !fileId || !fileName || !customerEmail || !customerName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Look up service in catalog
    const service = getServiceById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (!service.enabled) {
      return res.status(400).json({ error: 'Service is not available' });
    }

    // Validate extra fields for special services
    const validationErrors = validateExtraFields(service, extraFields);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    // Calculate price
    const amount = calculatePrice(service, quantity);

    // Create order
    const order = new Order({
      orderId: uuidv4(),
      userId: req.user?.userId || null,
      serviceId,
      serviceName: service.name,
      serviceType: service.type,
      fileId,
      fileName,
      customerEmail,
      customerName,
      quantity,
      unit: service.unit,
      basePriceCents: service.basePrice,
      amount,
      extraFields: extraFields || {},
      includedServices: service.includes || [],
      sourcePage,
      utmSource,
      utmCampaign
    });

    await order.save();

    // Track analytics
    await Analytics.create({
      event: 'order_created',
      orderId: order.orderId,
      userId: req.user?.userId,
      serviceId,
      amount,
      sourcePage,
      utmSource,
      utmCampaign
    });

    res.status(201).json({
      orderId: order.orderId,
      amount: order.amount,
      serviceName: service.name,
      serviceType: service.type,
      quantity
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id }).lean();
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Remove MongoDB _id
    delete order._id;
    delete order.__v;

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// GET /api/orders/:id/download - Download processed file
router.get('/:id/download', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'completed') {
      return res.status(400).json({ error: 'Order not yet completed' });
    }

    if (!order.outputFile) {
      return res.status(404).json({ error: 'Output file not found' });
    }

    const path = require('path');
    const fs = require('fs');
    const filePath = path.resolve(order.outputFile);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    res.download(filePath);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// GET /api/orders/user/history - Get user's order history (authenticated)
router.get('/user/history', authenticate, async (req, res) => {
  try {
    const { skip = 0, limit = 20 } = req.query;
    
    const orders = await Order.find({ userId: req.user.userId })
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
    console.error('Error fetching order history:', error);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

module.exports = router;
