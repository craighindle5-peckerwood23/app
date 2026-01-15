// src/routes/subscription.js - PayPal Subscription Billing Integration
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

const FRONTEND_URL = process.env.FRONTEND_URL;

// Plan configuration
const PLAN_CONFIG = {
  all_tools_access: {
    id: 'all_tools_access',
    name: 'All Tools Access',
    description: 'Unlimited access to all 50+ FileSolved document tools',
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
  if (!data.access_token) {
    console.error('PayPal token error:', data);
    throw new Error('Failed to get PayPal access token');
  }
  return data.access_token;
};

// Create or get PayPal product
const getOrCreateProduct = async (accessToken) => {
  // First, try to find existing product
  const listResponse = await fetch(`${PAYPAL_API}/v1/catalogs/products?page_size=20`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const products = await listResponse.json();
  const existingProduct = products.products?.find(p => p.name === 'FileSolved All Tools Access');
  
  if (existingProduct) {
    return existingProduct.id;
  }
  
  // Create new product
  const createResponse = await fetch(`${PAYPAL_API}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `product-${uuidv4()}`
    },
    body: JSON.stringify({
      name: 'FileSolved All Tools Access',
      description: 'Unlimited access to all FileSolved document tools',
      type: 'SERVICE',
      category: 'SOFTWARE'
    })
  });
  
  const product = await createResponse.json();
  console.log('Created PayPal product:', product.id);
  return product.id;
};

// Create or get PayPal billing plan
const getOrCreatePlan = async (accessToken, productId) => {
  // Try to find existing plan
  const listResponse = await fetch(`${PAYPAL_API}/v1/billing/plans?product_id=${productId}&page_size=20`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const plans = await listResponse.json();
  const activePlan = plans.plans?.find(p => p.status === 'ACTIVE' && p.name === 'All Tools Access Monthly');
  
  if (activePlan) {
    return activePlan.id;
  }
  
  // Create new plan
  const createResponse = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `plan-${uuidv4()}`
    },
    body: JSON.stringify({
      product_id: productId,
      name: 'All Tools Access Monthly',
      description: 'Monthly subscription for unlimited access to all FileSolved tools',
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // Infinite
          pricing_scheme: {
            fixed_price: {
              value: '5.99',
              currency_code: 'USD'
            }
          }
        }
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: 'USD'
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3
      }
    })
  });
  
  const plan = await createResponse.json();
  console.log('Created PayPal plan:', plan.id);
  return plan.id;
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
    let subscription = null;
    
    if (req.user?.userId) {
      subscription = await Subscription.findOne({ 
        userId: req.user.userId,
        status: { $in: ['active', 'pending'] }
      }).lean();
    }
    
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
    
    // Check if subscription is still valid
    if (subscription.status === 'active' && subscription.currentPeriodEnd) {
      if (new Date() > new Date(subscription.currentPeriodEnd)) {
        // Subscription expired, update status
        await Subscription.updateOne(
          { subscriptionId: subscription.subscriptionId },
          { status: 'expired' }
        );
        return res.json({ hasSubscription: false, plan: null, expired: true });
      }
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
      toolsUsedThisPeriod: subscription.toolsUsedThisPeriod,
      paypalSubscriptionId: subscription.paypalSubscriptionId
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ error: 'Failed to check subscription status' });
  }
});

// POST /api/subscription/create - Create PayPal subscription
router.post('/create', async (req, res) => {
  try {
    const { email, name, planId = 'all_tools_access' } = req.body;
    
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
    
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();
    
    // Get or create product and plan
    const productId = await getOrCreateProduct(accessToken);
    const paypalPlanId = await getOrCreatePlan(accessToken, productId);
    
    // Create PayPal subscription
    const subscriptionResponse = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `sub-${uuidv4()}`
      },
      body: JSON.stringify({
        plan_id: paypalPlanId,
        subscriber: {
          name: {
            given_name: name?.split(' ')[0] || 'Subscriber',
            surname: name?.split(' ').slice(1).join(' ') || ''
          },
          email_address: email
        },
        application_context: {
          brand_name: 'FileSolved',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
          },
          return_url: `${FRONTEND_URL}/subscription/success`,
          cancel_url: `${FRONTEND_URL}/pricing`
        }
      })
    });
    
    const paypalSubscription = await subscriptionResponse.json();
    
    if (paypalSubscription.error) {
      console.error('PayPal subscription error:', paypalSubscription);
      throw new Error(paypalSubscription.error_description || 'Failed to create PayPal subscription');
    }
    
    // Create local subscription record
    const subscriptionId = `sub_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
    
    const subscription = new Subscription({
      subscriptionId,
      userId: req.user?.userId || `guest_${uuidv4().substring(0, 8)}`,
      email: email.toLowerCase(),
      name: name || '',
      planId,
      planName: plan.name,
      priceMonthly: plan.priceMonthly,
      status: 'pending',
      paypalSubscriptionId: paypalSubscription.id,
      paypalPlanId
    });
    
    await subscription.save();
    
    // Track analytics
    await Analytics.create({
      event: 'subscription_initiated',
      userId: subscription.userId,
      details: { planId, email, paypalSubscriptionId: paypalSubscription.id }
    }).catch(() => {});
    
    // Find approval URL
    const approvalUrl = paypalSubscription.links?.find(l => l.rel === 'approve')?.href;
    
    res.json({
      subscriptionId,
      paypalSubscriptionId: paypalSubscription.id,
      status: 'pending',
      approvalUrl,
      plan: {
        name: plan.name,
        price: `$${(plan.priceMonthly / 100).toFixed(2)}/month`
      }
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: error.message || 'Failed to create subscription' });
  }
});

// POST /api/subscription/activate - Activate subscription after PayPal approval
router.post('/activate', async (req, res) => {
  try {
    const { subscriptionId, paypalSubscriptionId, email } = req.body;
    
    let subscription;
    
    if (paypalSubscriptionId) {
      subscription = await Subscription.findOne({ paypalSubscriptionId });
    } else if (subscriptionId) {
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
    
    // Verify subscription with PayPal
    if (subscription.paypalSubscriptionId) {
      const accessToken = await getPayPalAccessToken();
      
      const verifyResponse = await fetch(
        `${PAYPAL_API}/v1/billing/subscriptions/${subscription.paypalSubscriptionId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const paypalSub = await verifyResponse.json();
      
      if (paypalSub.status === 'ACTIVE' || paypalSub.status === 'APPROVED') {
        // Calculate billing period
        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        
        subscription.status = 'active';
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
          paypalTransactionId: paypalSub.id,
          billingPeriodStart: now,
          billingPeriodEnd: periodEnd
        });
        
        await payment.save();
        
        // Track analytics
        await Analytics.create({
          event: 'subscription_activated',
          userId: subscription.userId,
          amount: subscription.priceMonthly / 100,
          details: { planId: subscription.planId, paypalStatus: paypalSub.status }
        }).catch(() => {});
        
        return res.json({
          success: true,
          subscription: {
            id: subscription.subscriptionId,
            status: 'active',
            planName: subscription.planName,
            currentPeriodEnd: subscription.currentPeriodEnd
          }
        });
      } else {
        return res.status(400).json({ 
          error: 'Subscription not yet approved',
          paypalStatus: paypalSub.status
        });
      }
    }
    
    res.status(400).json({ error: 'No PayPal subscription to verify' });
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
    
    // Cancel with PayPal
    if (subscription.paypalSubscriptionId) {
      try {
        const accessToken = await getPayPalAccessToken();
        
        await fetch(
          `${PAYPAL_API}/v1/billing/subscriptions/${subscription.paypalSubscriptionId}/cancel`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              reason: reason || 'Customer requested cancellation'
            })
          }
        );
      } catch (paypalError) {
        console.error('PayPal cancel error:', paypalError);
        // Continue with local cancellation even if PayPal fails
      }
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

// POST /api/subscription/webhook - PayPal webhook handler
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;
    console.log('PayPal webhook event:', event.event_type);
    
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        // Subscription activated
        const activatedSubId = event.resource?.id;
        if (activatedSubId) {
          const sub = await Subscription.findOne({ paypalSubscriptionId: activatedSubId });
          if (sub && sub.status !== 'active') {
            const now = new Date();
            const periodEnd = new Date(now);
            periodEnd.setMonth(periodEnd.getMonth() + 1);
            
            sub.status = 'active';
            sub.startedAt = now;
            sub.currentPeriodStart = now;
            sub.currentPeriodEnd = periodEnd;
            sub.nextBillingDate = periodEnd;
            await sub.save();
          }
        }
        break;
        
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        const cancelledSubId = event.resource?.id;
        if (cancelledSubId) {
          await Subscription.updateOne(
            { paypalSubscriptionId: cancelledSubId },
            { status: 'cancelled', cancelledAt: new Date() }
          );
        }
        break;
        
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        const expiredSubId = event.resource?.id;
        if (expiredSubId) {
          await Subscription.updateOne(
            { paypalSubscriptionId: expiredSubId },
            { status: 'expired' }
          );
        }
        break;
        
      case 'PAYMENT.SALE.COMPLETED':
        // Recurring payment completed
        const billingAgreementId = event.resource?.billing_agreement_id;
        if (billingAgreementId) {
          const sub = await Subscription.findOne({ paypalSubscriptionId: billingAgreementId });
          if (sub) {
            const now = new Date();
            const periodEnd = new Date(now);
            periodEnd.setMonth(periodEnd.getMonth() + 1);
            
            sub.currentPeriodStart = now;
            sub.currentPeriodEnd = periodEnd;
            sub.nextBillingDate = periodEnd;
            sub.updatedAt = now;
            await sub.save();
            
            // Create payment record
            await SubscriptionPayment.create({
              paymentId: `spay_${uuidv4().replace(/-/g, '').substring(0, 16)}`,
              subscriptionId: sub.subscriptionId,
              userId: sub.userId,
              amount: sub.priceMonthly,
              status: 'completed',
              paypalTransactionId: event.resource?.id,
              billingPeriodStart: now,
              billingPeriodEnd: periodEnd
            });
          }
        }
        break;
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
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
