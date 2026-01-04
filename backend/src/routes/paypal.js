// src/routes/paypal.js - PayPal Integration Routes
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Order, Payment, Analytics } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { processOrder } = require('../services/processor');
const { sendPaymentReceipt } = require('../services/emailService');

const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

// Get PayPal access token
const getPayPalAccessToken = async () => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  
  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return response.data.access_token;
};

// POST /api/paypal/create-order - Create PayPal order
router.post('/create-order', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID required' });
    }

    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const accessToken = await getPayPalAccessToken();

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderId,
        description: `FileSolved - ${order.serviceName}`,
        amount: {
          currency_code: 'USD',
          value: order.amount.toFixed(2)
        }
      }],
      application_context: {
        brand_name: 'FileSolved',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/confirmation/${orderId}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/${orderId}?cancelled=true`
      }
    };

    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update order with PayPal order ID
    await Order.updateOne(
      { orderId },
      { $set: { paypalOrderId: response.data.id } }
    );

    res.json({ paypalOrderId: response.data.id });
  } catch (error) {
    console.error('PayPal create order error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// POST /api/paypal/capture-order - Capture PayPal payment
router.post('/capture-order', async (req, res) => {
  try {
    const { paypalOrderId, orderId } = req.body;

    if (!paypalOrderId || !orderId) {
      return res.status(400).json({ error: 'PayPal order ID and order ID required' });
    }

    const accessToken = await getPayPalAccessToken();

    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const captureData = response.data;

    if (captureData.status === 'COMPLETED') {
      const capture = captureData.purchase_units[0].payments.captures[0];
      
      // Create payment record
      const payment = new Payment({
        paymentId: uuidv4(),
        orderId,
        provider: 'paypal',
        providerPaymentId: paypalOrderId,
        amount: parseFloat(capture.amount.value),
        currency: capture.amount.currency_code,
        status: 'completed',
        rawResponse: captureData,
        completedAt: new Date()
      });
      await payment.save();

      // Update order status
      await Order.updateOne(
        { orderId },
        {
          $set: {
            status: 'paid',
            paypalCaptureId: capture.id,
            paidAt: new Date()
          }
        }
      );

      // Track analytics
      const order = await Order.findOne({ orderId });
      await Analytics.create({
        event: 'payment_completed',
        orderId,
        serviceId: order.serviceId,
        amount: payment.amount
      });

      // Start processing in background
      processOrder(orderId).catch(err => {
        console.error('Background processing error:', err);
      });

      res.json({ status: 'success', message: 'Payment captured successfully' });
    } else {
      res.status(400).json({ error: 'Payment not completed', status: captureData.status });
    }
  } catch (error) {
    console.error('PayPal capture error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
});

// POST /api/paypal/webhook - PayPal IPN Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const eventType = body.event_type;

    console.log('PayPal Webhook:', eventType);

    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED':
        // Order approved, waiting for capture
        break;
      
      case 'PAYMENT.CAPTURE.COMPLETED':
        // Payment captured successfully
        const captureId = body.resource.id;
        const customId = body.resource.custom_id;
        
        if (customId) {
          await Order.updateOne(
            { orderId: customId },
            { $set: { status: 'paid', paypalCaptureId: captureId, paidAt: new Date() } }
          );
        }
        break;
      
      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.DECLINED':
        // Payment failed
        const failedCustomId = body.resource.custom_id;
        if (failedCustomId) {
          await Order.updateOne(
            { orderId: failedCustomId },
            { $set: { status: 'failed', errorMessage: 'Payment declined' } }
          );
        }
        break;
      
      case 'PAYMENT.CAPTURE.REFUNDED':
        // Payment refunded
        const refundCustomId = body.resource.custom_id;
        if (refundCustomId) {
          await Order.updateOne(
            { orderId: refundCustomId },
            { $set: { status: 'refunded' } }
          );
        }
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// GET /api/paypal/config - Get PayPal client config
router.get('/config', (req, res) => {
  res.json({
    clientId: PAYPAL_CLIENT_ID,
    currency: 'USD'
  });
});

module.exports = router;
