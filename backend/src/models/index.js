// src/models/index.js - MongoDB Models for FileSolved
const mongoose = require('mongoose');
const { Schema } = mongoose;

// ==================== USER MODEL ====================
const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'support'], default: 'user' },
  credits: { type: Number, default: 0 },
  settings: {
    notifications: { type: Boolean, default: true },
    defaultService: String
  },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 });
userSchema.index({ userId: 1 });

// ==================== ORDER MODEL ====================
const orderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  userId: String, // null for guest orders
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  serviceType: String,
  fileId: String,
  fileName: String,
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unit: String,
  basePriceCents: Number,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paypalOrderId: String,
  paypalCaptureId: String,
  outputFile: String,
  processingTimeMs: Number,
  errorMessage: String,
  extraFields: Schema.Types.Mixed, // For grievance, fax, etc.
  includedServices: [String], // For bundles
  // Profitability tracking
  costEstimate: Number,
  margin: Number,
  sourcePage: String,
  utmSource: String,
  utmCampaign: String,
  couponCode: String,
  discountAmount: Number,
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  paidAt: Date,
  processedAt: Date,
  completedAt: Date
});

orderSchema.index({ orderId: 1 });
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ serviceId: 1 });

// ==================== PAYMENT MODEL ====================
const paymentSchema = new Schema({
  paymentId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  userId: String,
  provider: { type: String, enum: ['paypal', 'credits'], default: 'paypal' },
  providerPaymentId: String,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'refunded', 'failed'],
    default: 'pending'
  },
  refundAmount: Number,
  refundReason: String,
  rawResponse: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
});

paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ orderId: 1 });

// ==================== FILE MODEL ====================
const fileSchema = new Schema({
  fileId: { type: String, required: true, unique: true },
  orderId: String,
  type: { type: String, enum: ['input', 'output'], default: 'input' },
  originalName: String,
  storagePath: String,
  mimeType: String,
  sizeBytes: Number,
  checksum: String,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  deletedAt: Date
});

fileSchema.index({ fileId: 1 });
fileSchema.index({ orderId: 1 });
fileSchema.index({ expiresAt: 1 });

// ==================== JOB MODEL ====================
const jobSchema = new Schema({
  jobId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  type: { type: String, enum: ['file_processing', 'email', 'ai', 'fax'], default: 'file_processing' },
  status: { 
    type: String, 
    enum: ['queued', 'processing', 'completed', 'failed'],
    default: 'queued'
  },
  priority: { type: Number, default: 1 },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 },
  errorMessage: String,
  result: Schema.Types.Mixed,
  startedAt: Date,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
  metadata: Schema.Types.Mixed
});

jobSchema.index({ jobId: 1 });
jobSchema.index({ orderId: 1 });
jobSchema.index({ status: 1 });

// ==================== AI SESSION MODEL ====================
const aiSessionSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  fileId: String,
  userId: String,
  messages: [{
    role: { type: String, enum: ['user', 'assistant', 'system'] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  tokensUsed: { type: Number, default: 0 },
  model: String,
  costEstimate: Number,
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now }
});

aiSessionSchema.index({ sessionId: 1 });
aiSessionSchema.index({ fileId: 1 });

// ==================== ANALYTICS MODEL ====================
const analyticsSchema = new Schema({
  event: { type: String, required: true },
  orderId: String,
  userId: String,
  serviceId: String,
  amount: Number,
  sourcePage: String,
  utmSource: String,
  utmCampaign: String,
  deviceType: String,
  browser: String,
  country: String,
  timestamp: { type: Date, default: Date.now }
});

analyticsSchema.index({ event: 1 });
analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ serviceId: 1 });

// ==================== WEBHOOK MODEL ====================
const webhookSchema = new Schema({
  webhookId: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  eventTypes: [String],
  secret: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastTriggered: Date
});

// ==================== AUDIT LOG MODEL ====================
const auditLogSchema = new Schema({
  logId: { type: String, required: true, unique: true },
  actorId: String,
  actorType: { type: String, enum: ['user', 'admin', 'system'] },
  action: String,
  resourceType: String,
  resourceId: String,
  details: Schema.Types.Mixed,
  ipAddress: String,
  timestamp: { type: Date, default: Date.now }
});

auditLogSchema.index({ actorId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ timestamp: -1 });

// ==================== SUBSCRIPTION MODEL ====================
const subscriptionSchema = new Schema({
  subscriptionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  email: { type: String, required: true },
  name: String,
  planId: { type: String, default: 'all_tools_access' },
  planName: { type: String, default: 'All Tools Access' },
  priceMonthly: { type: Number, default: 599 }, // in cents
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['active', 'cancelled', 'expired', 'past_due', 'pending'],
    default: 'pending'
  },
  paypalSubscriptionId: String,
  paypalPlanId: String,
  // Billing info
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  nextBillingDate: Date,
  // Usage tracking
  toolsUsedThisPeriod: { type: Number, default: 0 },
  lastToolUsed: Date,
  // Timestamps
  startedAt: Date,
  cancelledAt: Date,
  cancelReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

subscriptionSchema.index({ subscriptionId: 1 });
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ email: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ paypalSubscriptionId: 1 });

// ==================== SUBSCRIPTION PAYMENT MODEL ====================
const subscriptionPaymentSchema = new Schema({
  paymentId: { type: String, required: true, unique: true },
  subscriptionId: { type: String, required: true },
  userId: String,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['completed', 'pending', 'failed', 'refunded'],
    default: 'completed'
  },
  paypalTransactionId: String,
  billingPeriodStart: Date,
  billingPeriodEnd: Date,
  createdAt: { type: Date, default: Date.now }
});

subscriptionPaymentSchema.index({ paymentId: 1 });
subscriptionPaymentSchema.index({ subscriptionId: 1 });

// Export models
module.exports = {
  User: mongoose.model('User', userSchema),
  Order: mongoose.model('Order', orderSchema),
  Payment: mongoose.model('Payment', paymentSchema),
  File: mongoose.model('File', fileSchema),
  Job: mongoose.model('Job', jobSchema),
  AISession: mongoose.model('AISession', aiSessionSchema),
  Analytics: mongoose.model('Analytics', analyticsSchema),
  Webhook: mongoose.model('Webhook', webhookSchema),
  AuditLog: mongoose.model('AuditLog', auditLogSchema),
  Subscription: mongoose.model('Subscription', subscriptionSchema),
  SubscriptionPayment: mongoose.model('SubscriptionPayment', subscriptionPaymentSchema)
};
