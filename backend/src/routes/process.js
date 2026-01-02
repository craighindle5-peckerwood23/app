// src/routes/process.js - Processing Routes
const express = require('express');
const router = express.Router();
const { Order, Job } = require('../models');
const { processOrder, getJobStatus } = require('../services/processor');
const { v4: uuidv4 } = require('uuid');

// POST /api/process/:orderId - Manually trigger processing
router.post('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'paid') {
      return res.status(400).json({ error: 'Order must be paid before processing' });
    }

    // Create job
    const job = new Job({
      jobId: uuidv4(),
      orderId: order.orderId,
      type: 'file_processing',
      status: 'queued',
      priority: 1
    });
    await job.save();

    // Start processing
    processOrder(order.orderId).catch(err => {
      console.error('Processing error:', err);
    });

    res.json({ 
      message: 'Processing started',
      jobId: job.jobId,
      orderId: order.orderId
    });
  } catch (error) {
    console.error('Process trigger error:', error);
    res.status(500).json({ error: 'Failed to start processing' });
  }
});

// GET /api/process/:orderId/status - Get processing status
router.get('/:orderId/status', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).lean();
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const job = await Job.findOne({ orderId: req.params.orderId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      orderId: order.orderId,
      orderStatus: order.status,
      job: job ? {
        jobId: job.jobId,
        status: job.status,
        attempts: job.attempts,
        errorMessage: job.errorMessage,
        startedAt: job.startedAt,
        completedAt: job.completedAt
      } : null,
      outputFile: order.outputFile,
      processingTimeMs: order.processingTimeMs
    });
  } catch (error) {
    console.error('Status fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

// POST /api/process/batch - Batch processing
router.post('/batch', async (req, res) => {
  try {
    const { orderIds } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ error: 'Order IDs required' });
    }

    if (orderIds.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 orders per batch' });
    }

    const results = [];

    for (const orderId of orderIds) {
      const order = await Order.findOne({ orderId });
      
      if (!order) {
        results.push({ orderId, status: 'error', message: 'Order not found' });
        continue;
      }

      if (order.status !== 'paid') {
        results.push({ orderId, status: 'error', message: 'Order not paid' });
        continue;
      }

      const job = new Job({
        jobId: uuidv4(),
        orderId,
        type: 'file_processing',
        status: 'queued',
        priority: 2
      });
      await job.save();

      processOrder(orderId).catch(err => {
        console.error(`Batch processing error for ${orderId}:`, err);
      });

      results.push({ orderId, status: 'queued', jobId: job.jobId });
    }

    res.json({ results });
  } catch (error) {
    console.error('Batch processing error:', error);
    res.status(500).json({ error: 'Batch processing failed' });
  }
});

// GET /api/process/jobs - List recent jobs
router.get('/jobs', async (req, res) => {
  try {
    const { status, limit = 20 } = req.query;
    
    const query = status ? { status } : {};
    
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json(jobs.map(j => { delete j._id; delete j.__v; return j; }));
  } catch (error) {
    console.error('Jobs fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

module.exports = router;
