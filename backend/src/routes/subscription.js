// src/routes/subscription.js - Subscription Management Routes
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Subscription, SubscriptionPayment, User, Analytics } = require('../models');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const fetch = require('node-fetch');

// PayPal configuration
const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

// Plan configuration
const PLAN_CONFIG = {
  all_tools_access: {
    id: 'all_tools_access',
    name: 'All Tools Access',
    description: 'Unlimited access to all 50+ FileSolved tools',
    priceMonthly: 599, // $5.99
    currency: 'USD',
    features: [
      'Unlimited usage of all 50+ tools',
      'Priority processing',
      'Access to premium tools (OCR, faxing, AI document tools)',
      'No ads',
      'Full access to all future tools',
      'Email support'
    ],
    premiumTools: [
      'pdf_ocr', 'image_ocr', 'handwriting_ocr', 'bulk_document_scanner',
      'fax_sending', 'fax_receiving', 'fax_to_email',
      'secure_shredding', 'bulk_shredding',
      'document_translation', 'document_summarizer', 'document_classifier',
      'audio_transcription', 'video_transcription',
      'legal_form_generator', 'grievance_letter_generator'
    ]
  }
};

// Get PayPal access token
const getPayPalAccessToken = async () => {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
};

// GET /api/subscription/plans - Get available subscription plans
router.get('/plans', (req, res) => {
  const plans = Object.values(PLAN_CONFIG).map(plan => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    priceMonthly: plan.priceMonthly,
    priceFormatted: `$${(plan.priceMonthly / 100).toFixed(2)}/month`,
    currency: plan.currency,
    features: plan.features
  }));
  
  res.json({ plans });
});

// GET /api/subscription/status - Check user's subscription status
router.get('/status', optionalAuth, async (req, res) => {
  try {
    // Check by user ID if logged in
    let subscription = null;
    
    if (req.user?.userId) {
      subscription = await Subscription.findOne({ 
        userId: req.user.userId,
        status: { $in: ['active', 'pending'] }
      }).lean();
    }
    
    // Also check by email from query
    if (!subscription && req.query.email) {
      subscription = await Subscription.findOne({ 
        email: req.query.email.toLowerCase(),
        status: { $in: ['active', 'pending'] }
      }).lean();
    }
    
    if (!subscription) {
      return res.json({ 
        hasSubscription: false,
        plan: null
      });
    }
    
    const plan = PLAN_CONFIG[subscription.planId] || PLAN_CONFIG.all_tools_access;
    
    res.json({
      hasSubscription: subscription.status === 'active',
      status: subscription.status,
      plan: {
        id: plan.id,
        name: plan.name,
        priceFormatted: `$${(plan.priceMonthly / 100).toFixed(2)}/month`
      },
      currentPeriodEnd: subscription.currentPeriodEnd,
      nextBillingDate: subscription.nextBillingDate,
      toolsUsedThisPeriod: subscription.toolsUsedThisPeriod
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ error: 'Failed to check subscription status' });
  }
});

// POST /api/subscription/create - Create PayPal subscription
router.post('/create', async (req, res) => {
  try {
    const { email, name, planId = 'all_tools_access', returnUrl, cancelUrl } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const plan = PLAN_CONFIG[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    // Check for existing active subscription
    const existing = await Subscription.findOne({ 
      email: email.toLowerCase(),
      status: 'active'
    });
    
    if (existing) {
      return res.status(400).json({ 
        error: 'You already have an active subscription',
        subscriptionId: existing.subscriptionId
      });
    }
    
    const accessToken = await getPayPalAccessToken();
    
    // Create subscription with PayPal
    const subscriptionData = {
      plan_id: process.env.PAYPAL_SUBSCRIPTION_PLAN_ID || 'P-PLACEHOLDER', // Will need to create this in PayPal
      subscriber: {
        name: { given_name: name || 'Subscriber' },
        email_address: email
      },
      application_context: {
        brand_name: 'FileSolved',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: returnUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription/success`,
        cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pricing`
      }
    };
    
    // For now, create a pending subscription and redirect to PayPal
    // In production, you'd use the PayPal Subscriptions API
    const subscriptionId = `sub_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
    
    const subscription = new Subscription({
      subscriptionId,
      userId: req.user?.userId || `guest_${uuidv4().substring(0, 8)}`,
      email: email.toLowerCase(),
      name: name || '',
      planId,
      planName: plan.name,
      priceMonthly: plan.priceMonthly,
      status: 'pending'
    });
    
    await subscription.save();
    
    // Track analytics
    await Analytics.create({
      event: 'subscription_initiated',
      userId: subscription.userId,
      details: { planId, email }
    }).catch(() => {});
    
    // For demo/development, we'll simulate activation
    // In production, this would return a PayPal approval URL
    res.json({
      subscriptionId,
      status: 'pending',
      // In production: approvalUrl: paypalResponse.links.find(l => l.rel === 'approve').href
      message: 'Subscription created. Complete payment to activate.',
      plan: {
        name: plan.name,
        price: `$${(plan.priceMonthly / 100).toFixed(2)}/month`
      }
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// POST /api/subscription/activate - Activate subscription (for demo/testing)
router.post('/activate', async (req, res) => {
  try {
    const { subscriptionId, email, paypalSubscriptionId } = req.body;
    
    let subscription;
    
    if (subscriptionId) {
      subscription = await Subscription.findOne({ subscriptionId });
    } else if (email) {
      subscription = await Subscription.findOne({ 
        email: email.toLowerCase(),
        status: 'pending'
      });
    }
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    // Calculate billing period (1 month)
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    
    subscription.status = 'active';
    subscription.paypalSubscriptionId = paypalSubscriptionId || `pp_${uuidv4().substring(0, 12)}`;
    subscription.startedAt = now;
    subscription.currentPeriodStart = now;
    subscription.currentPeriodEnd = periodEnd;
    subscription.nextBillingDate = periodEnd;
    subscription.updatedAt = now;
    
    await subscription.save();
    
    // Create payment record
    const payment = new SubscriptionPayment({
      paymentId: `spay_${uuidv4().replace(/-/g, '').substring(0, 16)}`,
      subscriptionId: subscription.subscriptionId,
      userId: subscription.userId,
      amount: subscription.priceMonthly,
      status: 'completed',
      billingPeriodStart: now,
      billingPeriodEnd: periodEnd
    });
    
    await payment.save();
    
    // Track analytics
    await Analytics.create({
      event: 'subscription_activated',
      userId: subscription.userId,
      amount: subscription.priceMonthly / 100,
      details: { planId: subscription.planId }
    }).catch(() => {});
    
    res.json({
      success: true,
      subscription: {
        id: subscription.subscriptionId,
        status: subscription.status,
        planName: subscription.planName,
        currentPeriodEnd: subscription.currentPeriodEnd
      }
    });
  } catch (error) {
    console.error('Activate subscription error:', error);
    res.status(500).json({ error: 'Failed to activate subscription' });
  }
});

// POST /api/subscription/cancel - Cancel subscription
router.post('/cancel', async (req, res) => {
  try {
    const { subscriptionId, email, reason } = req.body;
    
    let subscription;
    
    if (subscriptionId) {
      subscription = await Subscription.findOne({ subscriptionId, status: 'active' });
    } else if (email) {
      subscription = await Subscription.findOne({ 
        email: email.toLowerCase(),
        status: 'active'
      });
    }
    
    if (!subscription) {
      return res.status(404).json({ error: 'Active subscription not found' });
    }
    
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancelReason = reason || '';
    subscription.updatedAt = new Date();
    
    await subscription.save();
    
    // Track analytics
    await Analytics.create({
      event: 'subscription_cancelled',
      userId: subscription.userId,
      details: { reason, planId: subscription.planId }
    }).catch(() => {});
    
    res.json({
      success: true,
      message: 'Subscription cancelled. You have access until the end of your billing period.',
      accessUntil: subscription.currentPeriodEnd
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// POST /api/subscription/check-access - Check if user has access to a tool
router.post('/check-access', async (req, res) => {
  try {
    const { email, serviceId } = req.body;
    
    if (!email) {
      return res.json({ hasAccess: false, reason: 'no_email' });
    }
    
    const subscription = await Subscription.findOne({ 
      email: email.toLowerCase(),
      status: 'active'
    });
    
    if (!subscription) {
      return res.json({ hasAccess: false, reason: 'no_subscription' });
    }
    
    // Check if subscription is still valid
    if (subscription.currentPeriodEnd && new Date() > subscription.currentPeriodEnd) {
      subscription.status = 'expired';
      await subscription.save();
      return res.json({ hasAccess: false, reason: 'expired' });
    }
    
    // All tools access - grant access to everything
    res.json({ 
      hasAccess: true,
      subscription: {
        planName: subscription.planName,
        currentPeriodEnd: subscription.currentPeriodEnd
      }
    });
  } catch (error) {
    console.error('Check access error:', error);
    res.status(500).json({ error: 'Failed to check access' });
  }
});

// POST /api/subscription/record-usage - Record tool usage for subscribers
router.post('/record-usage', async (req, res) => {
  try {
    const { email, serviceId } = req.body;
    
    if (!email) {
      return res.json({ recorded: false });
    }
    
    const subscription = await Subscription.findOne({ 
      email: email.toLowerCase(),
      status: 'active'
    });
    
    if (!subscription) {
      return res.json({ recorded: false });
    }
    
    subscription.toolsUsedThisPeriod = (subscription.toolsUsedThisPeriod || 0) + 1;
    subscription.lastToolUsed = new Date();
    subscription.updatedAt = new Date();
    
    await subscription.save();
    
    res.json({ recorded: true, totalUsage: subscription.toolsUsedThisPeriod });
  } catch (error) {
    console.error('Record usage error:', error);
    res.status(500).json({ error: 'Failed to record usage' });
  }
});

// GET /api/subscription/history - Get subscription payment history
router.get('/history', async (req, res) => {
  try {
    const { email, subscriptionId } = req.query;
    
    let query = {};
    
    if (subscriptionId) {
      query.subscriptionId = subscriptionId;
    } else if (email) {
      const subscription = await Subscription.findOne({ email: email.toLowerCase() });
      if (subscription) {
        query.subscriptionId = subscription.subscriptionId;
      }
    }
    
    const payments = await SubscriptionPayment.find(query)
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();
    
    res.json({
      payments: payments.map(p => ({
        paymentId: p.paymentId,
        amount: `$${(p.amount / 100).toFixed(2)}`,
        status: p.status,
        date: p.createdAt,
        billingPeriod: {
          start: p.billingPeriodStart,
          end: p.billingPeriodEnd
        }
      }))
    });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

module.exports = router;
