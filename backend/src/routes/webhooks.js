// src/routes/webhooks.js - Webhook Management Routes
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const axios = require('axios');
const { Webhook, AuditLog } = require('../models');
const { authenticateAdmin } = require('../middleware/auth');

// Event types
const EVENT_TYPES = [
  'order.created',
  'order.paid',
  'order.processing',
  'order.completed',
  'order.failed',
  'order.refunded',
  'payment.completed',
  'payment.failed',
  'file.uploaded',
  'file.processed'
];

// POST /api/webhooks - Register a webhook
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { url, eventTypes, secret } = req.body;

    if (!url || !eventTypes || !Array.isArray(eventTypes)) {
      return res.status(400).json({ error: 'URL and event types required' });
    }

    // Validate event types
    const validEvents = eventTypes.filter(e => EVENT_TYPES.includes(e));
    if (validEvents.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid event types', 
        validTypes: EVENT_TYPES 
      });
    }

    const webhook = new Webhook({
      webhookId: uuidv4(),
      url,
      eventTypes: validEvents,
      secret: secret || crypto.randomBytes(32).toString('hex'),
      active: true
    });
    await webhook.save();

    res.status(201).json({
      webhookId: webhook.webhookId,
      url: webhook.url,
      eventTypes: webhook.eventTypes,
      secret: webhook.secret,
      active: webhook.active
    });
  } catch (error) {
    console.error('Webhook registration error:', error);
    res.status(500).json({ error: 'Failed to register webhook' });
  }
});

// GET /api/webhooks - List webhooks
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const webhooks = await Webhook.find().lean();
    
    res.json(webhooks.map(w => ({
      webhookId: w.webhookId,
      url: w.url,
      eventTypes: w.eventTypes,
      active: w.active,
      lastTriggered: w.lastTriggered,
      createdAt: w.createdAt
    })));
  } catch (error) {
    console.error('Webhooks fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch webhooks' });
  }
});

// DELETE /api/webhooks/:id - Delete a webhook
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await Webhook.deleteOne({ webhookId: req.params.id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    res.json({ message: 'Webhook deleted' });
  } catch (error) {
    console.error('Webhook delete error:', error);
    res.status(500).json({ error: 'Failed to delete webhook' });
  }
});

// PUT /api/webhooks/:id - Update webhook
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { url, eventTypes, active } = req.body;
    
    const updateData = {};
    if (url) updateData.url = url;
    if (eventTypes) updateData.eventTypes = eventTypes;
    if (typeof active === 'boolean') updateData.active = active;

    const result = await Webhook.updateOne(
      { webhookId: req.params.id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    res.json({ message: 'Webhook updated' });
  } catch (error) {
    console.error('Webhook update error:', error);
    res.status(500).json({ error: 'Failed to update webhook' });
  }
});

// POST /api/webhooks/test/:id - Test a webhook
router.post('/test/:id', authenticateAdmin, async (req, res) => {
  try {
    const webhook = await Webhook.findOne({ webhookId: req.params.id });
    
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    const testEvent = {
      eventId: uuidv4(),
      eventType: 'test.ping',
      timestamp: new Date().toISOString(),
      data: {
        message: 'This is a test webhook from FileSolved',
        webhookId: webhook.webhookId
      }
    };

    const signature = crypto
      .createHmac('sha256', webhook.secret)
      .update(JSON.stringify(testEvent))
      .digest('hex');

    try {
      const response = await axios.post(webhook.url, testEvent, {
        headers: {
          'Content-Type': 'application/json',
          'X-FileSolved-Signature': signature,
          'X-FileSolved-Event': 'test.ping'
        },
        timeout: 10000
      });

      await Webhook.updateOne(
        { webhookId: webhook.webhookId },
        { $set: { lastTriggered: new Date() } }
      );

      res.json({ 
        success: true, 
        statusCode: response.status,
        message: 'Webhook test successful'
      });
    } catch (axiosError) {
      res.json({ 
        success: false, 
        error: axiosError.message,
        statusCode: axiosError.response?.status
      });
    }
  } catch (error) {
    console.error('Webhook test error:', error);
    res.status(500).json({ error: 'Failed to test webhook' });
  }
});

// GET /api/webhooks/events - List available event types
router.get('/events', (req, res) => {
  res.json({ eventTypes: EVENT_TYPES });
});

// Internal function to emit events (called from other services)
const emitEvent = async (eventType, data) => {
  try {
    const webhooks = await Webhook.find({
      eventTypes: eventType,
      active: true
    });

    const event = {
      eventId: uuidv4(),
      eventType,
      timestamp: new Date().toISOString(),
      data
    };

    const promises = webhooks.map(async (webhook) => {
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(JSON.stringify(event))
        .digest('hex');

      try {
        await axios.post(webhook.url, event, {
          headers: {
            'Content-Type': 'application/json',
            'X-FileSolved-Signature': signature,
            'X-FileSolved-Event': eventType
          },
          timeout: 10000
        });

        await Webhook.updateOne(
          { webhookId: webhook.webhookId },
          { $set: { lastTriggered: new Date() } }
        );
      } catch (error) {
        console.error(`Webhook delivery failed to ${webhook.url}:`, error.message);
      }
    });

    await Promise.allSettled(promises);
  } catch (error) {
    console.error('Event emission error:', error);
  }
};

module.exports = router;
module.exports.emitEvent = emitEvent;
