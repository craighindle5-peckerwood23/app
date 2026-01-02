# FileSolved.com - Complete System Specification

> **"One Upload. Problem Solved."**

A production-ready document services platform with AI integration, payments, automation, and analytics.

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [User Flows](#2-user-flows)
3. [Frontend Specification](#3-frontend-specification)
4. [Backend API Design](#4-backend-api-design)
5. [Database Schema](#5-database-schema)
6. [File Processing Pipeline](#6-file-processing-pipeline)
7. [AI Integration Layer](#7-ai-integration-layer)
8. [Payment & Checkout Logic](#8-payment--checkout-logic)
9. [Automation & Webhooks](#9-automation--webhooks)
10. [Admin Dashboard Design](#10-admin-dashboard-design)
11. [Security & Compliance](#11-security--compliance)
12. [SEO & Content Integration](#12-seo--content-integration)
13. [Implementation Roadmap](#13-implementation-roadmap)

---

## 1. System Architecture

### 1.1 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19 + React Router | SPA with SEO-friendly structure |
| **Backend** | FastAPI (Python 3.11+) | High-performance async API |
| **Database** | MongoDB | Document storage, flexible schema |
| **File Storage** | Local → S3 (production) | Secure file handling |
| **Queue/Jobs** | Background Tasks + Celery (future) | Async processing |
| **AI Layer** | OpenAI API / Anthropic | Document intelligence |
| **Payments** | PayPal Orders API v2 | Secure checkout |
| **Email** | Resend API | Transactional emails |
| **Hosting** | Docker + Kubernetes | Scalable deployment |

### 1.2 Architecture Diagram (Textual)

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ HomePage │ │ Services │ │  Upload  │ │ Checkout │ │  Admin   │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
└───────┼────────────┼────────────┼────────────┼────────────┼────────┘
        │            │            │            │            │
        ▼            ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (FastAPI)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ /api/    │ │ /api/    │ │ /api/    │ │ /api/    │ │ /api/    │  │
│  │ services │ │ upload   │ │ orders   │ │ paypal   │ │ admin    │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
└───────┼────────────┼────────────┼────────────┼────────────┼────────┘
        │            │            │            │            │
        ▼            ▼            ▼            ▼            ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   MongoDB     │ │  File Store   │ │ PayPal API    │ │  AI Services  │
│   (Orders,    │ │  (Uploads,    │ │ (Payments)    │ │  (OpenAI,     │
│   Users)      │ │   Outputs)    │ │               │ │   Anthropic)  │
└───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
```

### 1.3 Service Communication

| Source | Destination | Protocol | Purpose |
|--------|-------------|----------|---------|
| Frontend | Backend | HTTPS REST | API calls |
| Backend | MongoDB | MongoDB Protocol | Data persistence |
| Backend | PayPal | HTTPS REST | Payment processing |
| Backend | Resend | HTTPS REST | Email delivery |
| Backend | AI Provider | HTTPS REST | Document intelligence |
| Backend | S3/Storage | HTTPS | File storage |

---

## 2. User Flows

### 2.1 Guest User Flow

```
1. VISIT → Homepage (/)
   ├── View services overview
   ├── Click "Get Started" or select service
   │
2. SELECT SERVICE → Services Page (/services) or Direct (/services/{id})
   ├── Browse 8+ document services
   ├── View pricing per service
   ├── Click "Select Service"
   │
3. UPLOAD FILE → Upload Page (/upload or /services/{id})
   ├── Drag & drop file OR click to browse
   ├── Select service from dropdown
   ├── Enter name & email
   ├── Click "Proceed to Checkout"
   │
4. CREATE ORDER → Backend creates order record
   ├── POST /api/orders/create
   ├── Receive order_id
   ├── Redirect to /checkout/{order_id}
   │
5. PAYMENT → Checkout Page (/checkout/{order_id})
   ├── Review order summary
   ├── Click PayPal button
   ├── Complete PayPal flow (popup)
   ├── Backend captures payment
   │
6. PROCESSING → Background task starts
   ├── File is processed (conversion, OCR, etc.)
   ├── Output file generated
   ├── Email sent with download link
   │
7. CONFIRMATION → Confirmation Page (/confirmation/{order_id})
   ├── View success message
   ├── Download processed file
   ├── Option to process another document
```

### 2.2 Registered User Flow

```
1. LOGIN → Auth Page (/login)
   ├── Enter email/password
   ├── Receive JWT token
   ├── Redirect to dashboard
   │
2. DASHBOARD → User Dashboard (/dashboard)
   ├── View order history
   ├── View credits balance (future)
   ├── Quick upload shortcut
   │
3. UPLOAD → Same as guest flow
   ├── User ID attached to order
   ├── Order appears in dashboard
   │
4. TRACK → Order appears in history
   ├── View status (pending, processing, completed)
   ├── Re-download processed files
   ├── Request support
```

### 2.3 Admin Flow

```
1. LOGIN → Admin Login (/admin)
   ├── Enter admin credentials
   ├── JWT with admin role
   │
2. DASHBOARD → Admin Dashboard (/admin/dashboard)
   ├── View KPI cards (revenue, orders, conversion)
   ├── View orders table with filters
   ├── View revenue by service chart
   │
3. MANAGE ORDERS
   ├── Filter by status, date, service
   ├── View order details
   ├── Reprocess failed orders
   ├── Issue refunds
   ├── Resend emails
   │
4. ANALYTICS
   ├── Daily/weekly revenue reports
   ├── Top services
   ├── Customer activity
   ├── Error logs
   │
5. EXPORT
   ├── Download CSV reports
   ├── Generate invoices
```

---

## 3. Frontend Specification

### 3.1 Page Structure

| Route | Page | Purpose | Auth Required |
|-------|------|---------|---------------|
| `/` | HomePage | Landing, services overview | No |
| `/services` | ServicesPage | All services listing | No |
| `/services/:id` | UploadPage | Service-specific upload | No |
| `/upload` | UploadPage | General upload | No |
| `/checkout/:orderId` | CheckoutPage | PayPal payment | No |
| `/confirmation/:orderId` | ConfirmationPage | Success + download | No |
| `/faq` | FAQPage | Common questions | No |
| `/contact` | ContactPage | Support form | No |
| `/login` | LoginPage | User authentication | No |
| `/register` | RegisterPage | User signup | No |
| `/dashboard` | UserDashboard | Order history | User |
| `/admin` | AdminLogin | Admin authentication | No |
| `/admin/dashboard` | AdminDashboard | Admin panel | Admin |

### 3.2 Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── CTAButton
│   ├── Main (children)
│   └── Footer
│       ├── ServiceLinks
│       ├── CompanyLinks
│       └── ContactInfo
│
├── Pages
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── FeaturesGrid
│   │   ├── ServicesGrid
│   │   ├── HowItWorks
│   │   └── CTASection
│   │
│   ├── ServicesPage
│   │   ├── ServiceCard (x8)
│   │   └── FAQTeaser
│   │
│   ├── UploadPage
│   │   ├── ServiceSelector
│   │   ├── FileDropzone
│   │   ├── CustomerForm
│   │   └── PriceSummary
│   │
│   ├── CheckoutPage
│   │   ├── OrderSummary
│   │   ├── PayPalButtons
│   │   └── SecurityBadges
│   │
│   ├── ConfirmationPage
│   │   ├── SuccessMessage
│   │   ├── OrderDetails
│   │   ├── DownloadButton
│   │   └── ProcessAnotherCTA
│   │
│   └── AdminDashboard
│       ├── StatsGrid
│       ├── RevenueChart
│       ├── OrdersTable
│       └── Pagination
```

### 3.3 AI Integration Points (Frontend)

| Location | AI Feature | Implementation |
|----------|------------|----------------|
| Upload Page | File Analysis | Auto-detect file type, suggest service |
| Checkout Page | Smart Preview | Show AI-generated summary before payment |
| Confirmation | Document Chat | "Ask about this document" widget |
| Services Page | Recommendation | "Based on your file, we recommend..." |
| Dashboard | Insights | Usage patterns, suggested actions |

### 3.4 SEO Components

```jsx
// Each page includes:
<Helmet>
  <title>{pageTitle} | FileSolved</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />
  <script type="application/ld+json">{JSON.stringify(schema)}</script>
</Helmet>
```

---

## 4. Backend API Design

### 4.1 Public Endpoints

#### Health & Services

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/` | None | API root message |
| GET | `/api/health` | None | Health check |
| GET | `/api/services` | None | List all services |
| GET | `/api/services/{id}` | None | Get service details |
| GET | `/api/sitemap` | None | SEO sitemap data |

#### File Upload

| Method | Path | Auth | Request | Response |
|--------|------|------|---------|----------|
| POST | `/api/upload` | None | `multipart/form-data` with file | `{file_id, file_name, size}` |

**Request:**
```
Content-Type: multipart/form-data
file: <binary>
```

**Response:**
```json
{
  "file_id": "uuid",
  "file_name": "document.pdf",
  "file_path": "/uploads/uuid.pdf",
  "size": 102400
}
```

#### Orders

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/orders/create` | None | Create new order |
| GET | `/api/orders/{id}` | None | Get order details |
| GET | `/api/orders/{id}/download` | None | Download processed file |

**Create Order Request:**
```
Content-Type: application/x-www-form-urlencoded
service_id=pdf-to-word
file_id=uuid
file_name=document.pdf
customer_email=user@example.com
customer_name=John Doe
```

**Create Order Response:**
```json
{
  "order_id": "uuid",
  "amount": 2.99,
  "service_name": "PDF to Word"
}
```

#### PayPal Integration

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/paypal/create-order` | None | Create PayPal order |
| POST | `/api/paypal/capture-order` | None | Capture payment |
| POST | `/api/paypal/webhook` | Webhook | PayPal IPN |

**Create PayPal Order:**
```
POST /api/paypal/create-order
Content-Type: application/x-www-form-urlencoded
order_id=uuid
```

**Response:**
```json
{
  "paypal_order_id": "PAYPAL-ORDER-ID"
}
```

### 4.2 AI Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/ai/summarize` | User/API Key | Summarize document |
| POST | `/api/ai/ocr-clean` | User/API Key | Clean OCR output |
| POST | `/api/ai/classify` | User/API Key | Classify document type |
| POST | `/api/ai/chat` | User/API Key | Chat about document |
| POST | `/api/ai/suggest` | User/API Key | Suggest service for file |

**Summarize Request:**
```json
{
  "file_id": "uuid",
  "max_length": 500,
  "style": "bullet_points"
}
```

**Summarize Response:**
```json
{
  "summary": "• Key point 1\n• Key point 2\n• Key point 3",
  "tokens_used": 450,
  "model": "gpt-4o-mini"
}
```

**Chat Request:**
```json
{
  "file_id": "uuid",
  "session_id": "uuid",
  "message": "What is the total amount on this invoice?"
}
```

**Chat Response:**
```json
{
  "response": "The total amount on this invoice is $1,234.56",
  "confidence": 0.95,
  "source_page": 1
}
```

### 4.3 User Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | None | Create user account |
| POST | `/api/auth/login` | None | Login, get JWT |
| POST | `/api/auth/logout` | User | Invalidate token |
| POST | `/api/auth/refresh` | User | Refresh JWT |
| GET | `/api/auth/me` | User | Get current user |

**Register Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### 4.4 Admin Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/admin/login` | None | Admin login |
| GET | `/api/admin/analytics` | Admin | Dashboard stats |
| GET | `/api/admin/orders` | Admin | List all orders |
| GET | `/api/admin/orders/{id}` | Admin | Order details |
| POST | `/api/admin/orders/{id}/reprocess` | Admin | Reprocess order |
| POST | `/api/admin/orders/{id}/refund` | Admin | Issue refund |
| GET | `/api/admin/revenue-summary` | Admin | Revenue reports |
| GET | `/api/admin/users` | Admin | List users |
| GET | `/api/admin/errors` | Admin | Error logs |
| GET | `/api/admin/export` | Admin | Export CSV |

---

## 5. Database Schema

### 5.1 MongoDB Collections

#### users
```javascript
{
  _id: ObjectId,
  user_id: String (UUID),          // Public ID
  email: String,                    // Unique, indexed
  password_hash: String,
  name: String,
  role: String,                     // "user" | "admin"
  credits: Number,                  // Future: prepaid credits
  created_at: ISODate,
  last_login: ISODate,
  settings: {
    notifications: Boolean,
    default_service: String
  }
}
// Indexes: email (unique), user_id (unique)
```

#### orders
```javascript
{
  _id: ObjectId,
  order_id: String (UUID),          // Public ID
  user_id: String,                  // Optional: null for guests
  service_id: String,
  service_name: String,
  file_id: String,
  file_name: String,
  customer_email: String,
  customer_name: String,
  amount: Number,
  currency: String,                 // "USD"
  status: String,                   // "pending" | "paid" | "processing" | "completed" | "failed"
  paypal_order_id: String,
  paypal_capture_id: String,
  output_file: String,
  processing_time_ms: Number,
  error_message: String,
  created_at: ISODate,
  paid_at: ISODate,
  processed_at: ISODate,
  // Profitability fields
  cost_estimate: Number,            // Processing cost
  margin: Number,                   // amount - cost_estimate
  source_page: String,              // SEO tracking
  utm_source: String,
  utm_campaign: String,
  coupon_code: String,
  discount_amount: Number
}
// Indexes: order_id (unique), customer_email, status, created_at, service_id
```

#### payments
```javascript
{
  _id: ObjectId,
  payment_id: String (UUID),
  order_id: String,
  user_id: String,
  provider: String,                 // "paypal"
  provider_payment_id: String,
  amount: Number,
  currency: String,
  status: String,                   // "pending" | "completed" | "refunded" | "failed"
  refund_amount: Number,
  refund_reason: String,
  raw_response: Object,             // PayPal response
  created_at: ISODate,
  completed_at: ISODate
}
// Indexes: payment_id (unique), order_id, provider_payment_id
```

#### files
```javascript
{
  _id: ObjectId,
  file_id: String (UUID),
  order_id: String,
  type: String,                     // "input" | "output"
  original_name: String,
  storage_path: String,
  mime_type: String,
  size_bytes: Number,
  checksum: String,                 // SHA-256
  expires_at: ISODate,              // Auto-deletion time
  created_at: ISODate,
  deleted_at: ISODate
}
// Indexes: file_id (unique), order_id, expires_at
```

#### services
```javascript
{
  _id: ObjectId,
  service_id: String,               // "pdf-to-word"
  name: String,
  description: String,
  price: Number,
  price_per_page: Number,           // Optional tiered pricing
  category: String,
  icon: String,
  features: [String],
  supported_formats: [String],
  output_format: String,
  processing_time_estimate: String,
  is_active: Boolean,
  created_at: ISODate,
  updated_at: ISODate
}
// Indexes: service_id (unique), is_active
```

#### jobs
```javascript
{
  _id: ObjectId,
  job_id: String (UUID),
  order_id: String,
  type: String,                     // "file_processing" | "email" | "ai"
  status: String,                   // "queued" | "processing" | "completed" | "failed"
  priority: Number,
  attempts: Number,
  max_attempts: Number,
  error_message: String,
  started_at: ISODate,
  completed_at: ISODate,
  created_at: ISODate,
  metadata: Object
}
// Indexes: job_id (unique), order_id, status, created_at
```

#### ai_sessions
```javascript
{
  _id: ObjectId,
  session_id: String (UUID),
  file_id: String,
  user_id: String,
  messages: [{
    role: String,                   // "user" | "assistant"
    content: String,
    timestamp: ISODate
  }],
  tokens_used: Number,
  model: String,
  cost_estimate: Number,
  created_at: ISODate,
  last_activity: ISODate
}
// Indexes: session_id (unique), file_id, user_id
```

#### analytics
```javascript
{
  _id: ObjectId,
  event: String,                    // "page_view" | "upload" | "payment_completed"
  order_id: String,
  user_id: String,
  service_id: String,
  amount: Number,
  source_page: String,
  utm_source: String,
  utm_campaign: String,
  device_type: String,
  browser: String,
  country: String,
  timestamp: ISODate
}
// Indexes: event, timestamp, service_id
```

#### audit_logs
```javascript
{
  _id: ObjectId,
  log_id: String (UUID),
  actor_id: String,                 // User or system
  actor_type: String,               // "user" | "admin" | "system"
  action: String,                   // "order_created" | "payment_captured" | "file_deleted"
  resource_type: String,            // "order" | "file" | "user"
  resource_id: String,
  details: Object,
  ip_address: String,
  timestamp: ISODate
}
// Indexes: actor_id, action, resource_id, timestamp
```

---

## 6. File Processing Pipeline

### 6.1 Pipeline Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   UPLOAD    │ ──▶ │   VALIDATE  │ ──▶ │    STORE    │
│   (Input)   │     │  (Security) │     │   (S3/FS)   │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   DELIVER   │ ◀── │  GENERATE   │ ◀── │   PROCESS   │
│   (Email)   │     │  (Output)   │     │   (Queue)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 6.2 Stage Definitions

#### Stage 1: Upload
```python
def upload_file(file: UploadFile):
    # 1. Generate unique file_id
    file_id = str(uuid.uuid4())
    
    # 2. Validate file size (max 50MB)
    if file.size > 50 * 1024 * 1024:
        raise HTTPException(413, "File too large")
    
    # 3. Validate file type
    allowed_types = ['application/pdf', 'image/jpeg', 'image/png', ...]
    if file.content_type not in allowed_types:
        raise HTTPException(415, "Unsupported file type")
    
    # 4. Scan for malware (in production)
    # scan_result = antivirus.scan(file)
    
    # 5. Save to storage
    file_path = UPLOAD_DIR / f"{file_id}{Path(file.filename).suffix}"
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(await file.read())
    
    return {"file_id": file_id, "file_name": file.filename}
```

#### Stage 2: Validation
```python
def validate_file_for_service(file_path: Path, service_id: str):
    service = get_service(service_id)
    
    # Check supported formats
    suffix = file_path.suffix.lower()
    if suffix not in service.supported_formats:
        raise ValidationError(f"Service {service_id} does not support {suffix}")
    
    # Service-specific validation
    if service_id == "pdf-to-word":
        reader = PdfReader(str(file_path))
        if len(reader.pages) > 100:
            raise ValidationError("PDF exceeds 100 page limit")
    
    return True
```

#### Stage 3: Queue Processing
```python
async def queue_job(order_id: str):
    order = await db.orders.find_one({"order_id": order_id})
    
    job = {
        "job_id": str(uuid.uuid4()),
        "order_id": order_id,
        "type": "file_processing",
        "status": "queued",
        "priority": 1,
        "attempts": 0,
        "max_attempts": 3,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.jobs.insert_one(job)
    
    # In production: publish to queue (RabbitMQ, Redis, etc.)
    # For now: process in background task
    background_tasks.add_task(process_job, job["job_id"])
```

#### Stage 4: Processing
```python
async def process_job(job_id: str):
    job = await db.jobs.find_one({"job_id": job_id})
    order = await db.orders.find_one({"order_id": job["order_id"]})
    
    try:
        # Update job status
        await db.jobs.update_one(
            {"job_id": job_id},
            {"$set": {"status": "processing", "started_at": datetime.now(timezone.utc)}}
        )
        
        # Get input file
        input_path = UPLOAD_DIR / f"{order['file_id']}{get_file_extension(order['file_name'])}"
        
        # Process based on service
        output_path = await PROCESSORS[order["service_id"]](input_path, order)
        
        # Update order
        await db.orders.update_one(
            {"order_id": order["order_id"]},
            {"$set": {
                "status": "completed",
                "output_file": str(output_path),
                "processed_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        # Update job
        await db.jobs.update_one(
            {"job_id": job_id},
            {"$set": {"status": "completed", "completed_at": datetime.now(timezone.utc)}}
        )
        
        # Send email
        await send_result_email(order, output_path)
        
    except Exception as e:
        # Handle retry
        attempts = job["attempts"] + 1
        if attempts < job["max_attempts"]:
            await db.jobs.update_one(
                {"job_id": job_id},
                {"$set": {"status": "queued", "attempts": attempts, "error_message": str(e)}}
            )
            # Re-queue with delay
        else:
            await db.jobs.update_one(
                {"job_id": job_id},
                {"$set": {"status": "failed", "error_message": str(e)}}
            )
            await db.orders.update_one(
                {"order_id": order["order_id"]},
                {"$set": {"status": "failed", "error_message": str(e)}}
            )
```

### 6.3 Service-Specific Processors

| Service | Input | Output | Library |
|---------|-------|--------|---------|
| pdf-to-word | PDF | DOCX | PyPDF2 + python-docx |
| word-to-pdf | DOCX | PDF | python-docx + reportlab |
| jpg-to-pdf | JPG/PNG | PDF | Pillow |
| pdf-to-jpg | PDF | JPG | pdf2image (requires poppler) |
| ocr | Image/PDF | TXT | pytesseract |
| document-scan | Image | PNG | Pillow (contrast/clean) |
| pdf-fax | PDF | TXT (confirmation) | Fax API integration |
| secure-shred | Any | TXT (certificate) | Secure delete |

### 6.4 File Retention Policy

| File Type | Retention | Action |
|-----------|-----------|--------|
| Input files | 24 hours | Auto-delete |
| Output files | 7 days | Auto-delete |
| Shredded files | Immediate | Secure delete |
| Failed job files | 48 hours | Auto-delete |

---

## 7. AI Integration Layer

### 7.1 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   AI SERVICE LAYER                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Summarizer  │  │ Classifier  │  │ Chat Agent  │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│         ▼                ▼                ▼             │
│  ┌─────────────────────────────────────────────────┐   │
│  │            PROVIDER ABSTRACTION LAYER           │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────┐  │   │
│  │  │ OpenAI  │  │Anthropic│  │ Local LLM       │  │   │
│  │  │  API    │  │   API   │  │ (future)        │  │   │
│  │  └─────────┘  └─────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Provider Interface

```python
from abc import ABC, abstractmethod
from typing import List, Dict, Any

class AIProvider(ABC):
    @abstractmethod
    async def complete(self, prompt: str, max_tokens: int = 500) -> str:
        pass
    
    @abstractmethod
    async def embed(self, text: str) -> List[float]:
        pass
    
    @abstractmethod
    def estimate_cost(self, input_tokens: int, output_tokens: int) -> float:
        pass

class OpenAIProvider(AIProvider):
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])
        self.model = "gpt-4o-mini"
    
    async def complete(self, prompt: str, max_tokens: int = 500) -> str:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    
    def estimate_cost(self, input_tokens: int, output_tokens: int) -> float:
        # gpt-4o-mini pricing
        return (input_tokens * 0.00015 + output_tokens * 0.0006) / 1000

class AnthropicProvider(AIProvider):
    def __init__(self):
        self.client = anthropic.AsyncAnthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
        self.model = "claude-3-haiku-20240307"
    
    # Similar implementation...

# Factory
def get_ai_provider() -> AIProvider:
    provider = os.environ.get("AI_PROVIDER", "openai")
    if provider == "openai":
        return OpenAIProvider()
    elif provider == "anthropic":
        return AnthropicProvider()
    else:
        raise ValueError(f"Unknown AI provider: {provider}")
```

### 7.3 Document Processing with AI

#### Summarization
```python
async def summarize_document(file_id: str, options: dict) -> dict:
    # 1. Get document text
    text = await extract_text_from_file(file_id)
    
    # 2. Chunk if necessary (context window limits)
    chunks = chunk_text(text, max_tokens=8000)
    
    # 3. Generate summary
    provider = get_ai_provider()
    
    if len(chunks) == 1:
        prompt = f"""Summarize the following document in {options.get('style', 'paragraph')} format.
        Maximum length: {options.get('max_length', 500)} words.
        
        Document:
        {chunks[0]}"""
        summary = await provider.complete(prompt, max_tokens=options.get('max_length', 500))
    else:
        # Multi-chunk: summarize each, then combine
        chunk_summaries = []
        for chunk in chunks:
            prompt = f"Summarize this section:\n{chunk}"
            chunk_summaries.append(await provider.complete(prompt, max_tokens=200))
        
        combined_prompt = f"""Combine these section summaries into one coherent summary:
        {chr(10).join(chunk_summaries)}"""
        summary = await provider.complete(combined_prompt, max_tokens=options.get('max_length', 500))
    
    # 4. Log usage
    await log_ai_usage(file_id, "summarize", len(text), len(summary))
    
    return {"summary": summary, "tokens_used": len(text.split())}
```

#### Classification
```python
DOCUMENT_CATEGORIES = [
    "invoice", "receipt", "contract", "legal_document",
    "letter", "report", "form", "certificate", "resume", "other"
]

async def classify_document(file_id: str) -> dict:
    text = await extract_text_from_file(file_id)
    provider = get_ai_provider()
    
    prompt = f"""Classify this document into one of these categories:
    {', '.join(DOCUMENT_CATEGORIES)}
    
    Document preview (first 2000 chars):
    {text[:2000]}
    
    Respond with JSON: {{"category": "...", "confidence": 0.0-1.0, "reasoning": "..."}}"""
    
    response = await provider.complete(prompt, max_tokens=150)
    result = json.loads(response)
    
    return result
```

#### Document Chat
```python
async def chat_about_document(file_id: str, session_id: str, message: str) -> dict:
    # 1. Get or create session
    session = await db.ai_sessions.find_one({"session_id": session_id})
    if not session:
        session = {
            "session_id": session_id,
            "file_id": file_id,
            "messages": [],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.ai_sessions.insert_one(session)
    
    # 2. Get document context
    text = await extract_text_from_file(file_id)
    
    # 3. Build conversation prompt
    conversation = "\n".join([
        f"{m['role']}: {m['content']}" 
        for m in session["messages"][-10:]  # Last 10 messages
    ])
    
    prompt = f"""You are a helpful assistant answering questions about a document.
    
    Document content:
    {text[:8000]}
    
    Previous conversation:
    {conversation}
    
    User question: {message}
    
    Provide a helpful, accurate answer based on the document content."""
    
    # 4. Generate response
    provider = get_ai_provider()
    response = await provider.complete(prompt, max_tokens=500)
    
    # 5. Update session
    await db.ai_sessions.update_one(
        {"session_id": session_id},
        {
            "$push": {
                "messages": {
                    "$each": [
                        {"role": "user", "content": message, "timestamp": datetime.now(timezone.utc)},
                        {"role": "assistant", "content": response, "timestamp": datetime.now(timezone.utc)}
                    ]
                }
            },
            "$set": {"last_activity": datetime.now(timezone.utc)}
        }
    )
    
    return {"response": response, "session_id": session_id}
```

### 7.4 AI Cost Tracking

```python
async def log_ai_usage(
    file_id: str,
    operation: str,
    input_tokens: int,
    output_tokens: int,
    model: str,
    cost: float
):
    await db.ai_usage.insert_one({
        "file_id": file_id,
        "operation": operation,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "model": model,
        "cost_usd": cost,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
```

---

## 8. Payment & Checkout Logic

### 8.1 Pricing Structure

```python
PRICING_TABLE = {
    "pdf-to-word": {"base": 2.99, "per_page": 0.10, "max_pages": 100},
    "word-to-pdf": {"base": 1.99, "per_page": 0.05, "max_pages": 100},
    "jpg-to-pdf": {"base": 1.49, "per_image": 0.25, "max_images": 50},
    "pdf-to-jpg": {"base": 1.99, "per_page": 0.10, "max_pages": 50},
    "ocr": {"base": 3.99, "per_page": 0.15, "max_pages": 50},
    "document-scan": {"base": 2.49, "per_image": 0.20, "max_images": 20},
    "pdf-fax": {"base": 4.99, "per_page": 0.50, "max_pages": 20},
    "secure-shred": {"base": 1.99, "per_file": 0.00, "max_files": 10}
}

def calculate_price(service_id: str, file_info: dict) -> float:
    pricing = PRICING_TABLE[service_id]
    base = pricing["base"]
    
    # For MVP: use base price only
    # For production: calculate based on pages/size
    # pages = file_info.get("pages", 1)
    # additional = max(0, pages - 1) * pricing.get("per_page", 0)
    
    return base
```

### 8.2 Order Creation Flow

```python
@api_router.post("/orders/create")
async def create_order(
    service_id: str = Form(...),
    file_id: str = Form(...),
    file_name: str = Form(...),
    customer_email: str = Form(...),
    customer_name: str = Form(...)
):
    # 1. Validate service
    service = get_service_by_id(service_id)
    if not service:
        raise HTTPException(404, "Service not found")
    
    # 2. Validate file exists
    file_path = find_uploaded_file(file_id)
    if not file_path:
        raise HTTPException(404, "File not found")
    
    # 3. Calculate price
    file_info = get_file_info(file_path)
    amount = calculate_price(service_id, file_info)
    
    # 4. Create order
    order = {
        "order_id": str(uuid.uuid4()),
        "service_id": service_id,
        "service_name": service.name,
        "file_id": file_id,
        "file_name": file_name,
        "customer_email": customer_email,
        "customer_name": customer_name,
        "amount": amount,
        "currency": "USD",
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "source_page": request.headers.get("Referer", ""),
        # Profitability tracking
        "cost_estimate": estimate_processing_cost(service_id, file_info),
        "margin": amount - estimate_processing_cost(service_id, file_info)
    }
    
    await db.orders.insert_one(order)
    
    return {"order_id": order["order_id"], "amount": amount, "service_name": service.name}
```

### 8.3 PayPal Integration

```python
@api_router.post("/paypal/create-order")
async def create_paypal_order(order_id: str = Form(...)):
    order = await db.orders.find_one({"order_id": order_id})
    if not order:
        raise HTTPException(404, "Order not found")
    
    access_token = await get_paypal_access_token()
    
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "reference_id": order_id,
            "description": f"FileSolved - {order['service_name']}",
            "amount": {
                "currency_code": "USD",
                "value": f"{order['amount']:.2f}"
            }
        }],
        "application_context": {
            "return_url": f"{FRONTEND_URL}/confirmation/{order_id}",
            "cancel_url": f"{FRONTEND_URL}/checkout/{order_id}?cancelled=true"
        }
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{PAYPAL_BASE_URL}/v2/checkout/orders",
            headers={"Authorization": f"Bearer {access_token}"},
            json=payload
        )
    
    paypal_order = response.json()
    
    await db.orders.update_one(
        {"order_id": order_id},
        {"$set": {"paypal_order_id": paypal_order["id"]}}
    )
    
    return {"paypal_order_id": paypal_order["id"]}

@api_router.post("/paypal/capture-order")
async def capture_paypal_order(
    paypal_order_id: str = Form(...),
    order_id: str = Form(...),
    background_tasks: BackgroundTasks = None
):
    access_token = await get_paypal_access_token()
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{PAYPAL_BASE_URL}/v2/checkout/orders/{paypal_order_id}/capture",
            headers={"Authorization": f"Bearer {access_token}"}
        )
    
    capture_data = response.json()
    
    if capture_data.get("status") == "COMPLETED":
        # Record payment
        payment = {
            "payment_id": str(uuid.uuid4()),
            "order_id": order_id,
            "provider": "paypal",
            "provider_payment_id": paypal_order_id,
            "amount": float(capture_data["purchase_units"][0]["payments"]["captures"][0]["amount"]["value"]),
            "currency": "USD",
            "status": "completed",
            "raw_response": capture_data,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.payments.insert_one(payment)
        
        # Update order
        await db.orders.update_one(
            {"order_id": order_id},
            {"$set": {
                "status": "paid",
                "paid_at": datetime.now(timezone.utc).isoformat(),
                "paypal_capture_id": capture_data["purchase_units"][0]["payments"]["captures"][0]["id"]
            }}
        )
        
        # Emit event
        await emit_event("ORDER_PAID", {"order_id": order_id, "amount": payment["amount"]})
        
        # Start processing
        if background_tasks:
            background_tasks.add_task(process_order_background, order_id)
        
        return {"status": "success"}
    else:
        raise HTTPException(400, "Payment not completed")
```

### 8.4 Future: Credits System

```python
# User credits schema addition
# users.credits: Number (USD equivalent)

async def pay_with_credits(order_id: str, user_id: str):
    order = await db.orders.find_one({"order_id": order_id})
    user = await db.users.find_one({"user_id": user_id})
    
    if user["credits"] < order["amount"]:
        raise HTTPException(402, "Insufficient credits")
    
    # Deduct credits
    await db.users.update_one(
        {"user_id": user_id},
        {"$inc": {"credits": -order["amount"]}}
    )
    
    # Record payment
    payment = {
        "payment_id": str(uuid.uuid4()),
        "order_id": order_id,
        "user_id": user_id,
        "provider": "credits",
        "amount": order["amount"],
        "status": "completed",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.payments.insert_one(payment)
    
    # Update order and process
    await db.orders.update_one(
        {"order_id": order_id},
        {"$set": {"status": "paid", "user_id": user_id}}
    )
    
    await process_order_background(order_id)
    
    return {"status": "success", "remaining_credits": user["credits"] - order["amount"]}
```

---

## 9. Automation & Webhooks

### 9.1 Event System

```python
# Event format
EVENT_SCHEMA = {
    "event_id": "uuid",
    "event_type": "ORDER_CREATED | ORDER_PAID | ORDER_COMPLETED | ORDER_FAILED",
    "timestamp": "ISO8601",
    "data": {
        "order_id": "uuid",
        "user_id": "uuid | null",
        "service_id": "string",
        "amount": "number",
        "currency": "string",
        "customer_email": "string",
        "source_page": "string"
    }
}

async def emit_event(event_type: str, data: dict):
    event = {
        "event_id": str(uuid.uuid4()),
        "event_type": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data": data
    }
    
    # 1. Store event
    await db.events.insert_one(event)
    
    # 2. Trigger internal handlers
    await handle_internal_event(event)
    
    # 3. Send to external webhooks
    webhooks = await db.webhooks.find({"event_types": event_type, "active": True}).to_list(100)
    for webhook in webhooks:
        await send_webhook(webhook["url"], event)
```

### 9.2 Internal Event Handlers

```python
EVENT_HANDLERS = {
    "ORDER_PAID": [
        trigger_file_processing,
        send_payment_confirmation_email,
        update_analytics
    ],
    "ORDER_COMPLETED": [
        send_result_email,
        schedule_file_cleanup,
        update_analytics
    ],
    "ORDER_FAILED": [
        send_failure_notification,
        alert_admin,
        update_analytics
    ]
}

async def handle_internal_event(event: dict):
    handlers = EVENT_HANDLERS.get(event["event_type"], [])
    for handler in handlers:
        try:
            await handler(event)
        except Exception as e:
            logger.error(f"Event handler failed: {handler.__name__} - {e}")
```

### 9.3 External Webhook Endpoints

```python
@api_router.post("/webhooks/register")
async def register_webhook(
    url: str = Form(...),
    event_types: List[str] = Form(...),
    secret: str = Form(...),
    admin: dict = Depends(get_current_admin)
):
    webhook = {
        "webhook_id": str(uuid.uuid4()),
        "url": url,
        "event_types": event_types,
        "secret": secret,
        "active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.webhooks.insert_one(webhook)
    return {"webhook_id": webhook["webhook_id"]}

async def send_webhook(url: str, event: dict, secret: str):
    payload = json.dumps(event)
    signature = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                url,
                json=event,
                headers={
                    "X-FileSolved-Signature": signature,
                    "Content-Type": "application/json"
                },
                timeout=10.0
            )
            
            await db.webhook_logs.insert_one({
                "url": url,
                "event_id": event["event_id"],
                "status_code": response.status_code,
                "timestamp": datetime.now(timezone.utc).isoformat()
            })
        except Exception as e:
            logger.error(f"Webhook failed: {url} - {e}")
```

### 9.4 Zapier/Make Integration

```python
# Webhook format compatible with Zapier
ZAPIER_PAYLOAD_EXAMPLE = {
    "id": "order_uuid",
    "event": "order.completed",
    "created": "2024-01-01T12:00:00Z",
    "data": {
        "order": {
            "id": "order_uuid",
            "service": "pdf-to-word",
            "amount": 2.99,
            "currency": "USD",
            "customer": {
                "name": "John Doe",
                "email": "john@example.com"
            },
            "files": {
                "input": "document.pdf",
                "output": "document.docx",
                "download_url": "https://filesolved.com/api/orders/{id}/download"
            }
        }
    }
}
```

---

## 10. Admin Dashboard Design

### 10.1 Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: Logo | Search | Notifications | Profile                    │
├──────────────┬──────────────────────────────────────────────────────┤
│              │                                                       │
│  SIDEBAR     │  MAIN CONTENT                                        │
│              │                                                       │
│  Dashboard   │  ┌─────────┬─────────┬─────────┬─────────┐           │
│  Orders      │  │ Revenue │ Orders  │ Conv.   │ Active  │           │
│  Users       │  │ $1,234  │ 156     │ Rate    │ Jobs    │           │
│  Analytics   │  │         │         │ 45%     │ 3       │           │
│  Services    │  └─────────┴─────────┴─────────┴─────────┘           │
│  AI Usage    │                                                       │
│  Errors      │  ┌─────────────────────────────────────────┐         │
│  Settings    │  │  REVENUE CHART (7 days)                 │         │
│              │  │  ████████████████                        │         │
│              │  └─────────────────────────────────────────┘         │
│              │                                                       │
│              │  ┌─────────────────────────────────────────┐         │
│              │  │  ORDERS TABLE                           │         │
│              │  │  ID | Service | Customer | Amount |     │         │
│              │  │  Status | Date | Actions                │         │
│              │  └─────────────────────────────────────────┘         │
│              │                                                       │
└──────────────┴──────────────────────────────────────────────────────┘
```

### 10.2 Admin Views

#### Dashboard Overview
- **KPI Cards**: Total Revenue, Total Orders, Conversion Rate, Active Services
- **Revenue Chart**: Line chart, last 7/30 days
- **Recent Orders**: Last 10 orders with quick actions
- **Service Distribution**: Pie chart of orders by service

#### Orders View
- **Filters**: Date range, Status, Service, Amount range
- **Columns**: Order ID, Service, Customer, Amount, Status, Date, Actions
- **Actions**: View details, Reprocess, Refund, Resend email, Export

#### Users View
- **Columns**: User ID, Email, Name, Orders count, Total spent, Last active
- **Actions**: View orders, Disable account, Add credits

#### Analytics View
- **Revenue by Service**: Bar chart
- **Daily/Weekly/Monthly trends**: Line charts
- **Conversion funnel**: Upload → Order → Payment → Completion
- **Geographic distribution**: If tracking IP/country

#### AI Usage View
- **Total tokens used**: By day/week/month
- **Cost breakdown**: By operation type
- **Popular operations**: Summarize, Classify, Chat

#### Errors View
- **Failed jobs**: With retry option
- **API errors**: 4xx, 5xx responses
- **Payment failures**: With PayPal error codes

### 10.3 Role-Based Access

```python
ADMIN_ROLES = {
    "super_admin": {
        "permissions": ["*"],
        "description": "Full access"
    },
    "admin": {
        "permissions": [
            "orders:read", "orders:update", "orders:refund",
            "users:read",
            "analytics:read",
            "errors:read"
        ],
        "description": "Manage orders and view analytics"
    },
    "support": {
        "permissions": [
            "orders:read", "orders:resend_email",
            "users:read"
        ],
        "description": "Customer support access"
    }
}

def check_permission(admin: dict, permission: str) -> bool:
    role = ADMIN_ROLES.get(admin["role"], {})
    if "*" in role.get("permissions", []):
        return True
    return permission in role.get("permissions", [])
```

### 10.4 Export Functions

```python
@api_router.get("/admin/export/orders")
async def export_orders(
    start_date: str,
    end_date: str,
    format: str = "csv",
    admin: dict = Depends(get_current_admin)
):
    orders = await db.orders.find({
        "created_at": {"$gte": start_date, "$lte": end_date}
    }).to_list(10000)
    
    if format == "csv":
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=[
            "order_id", "service_name", "customer_email", "amount", 
            "status", "created_at", "processed_at"
        ])
        writer.writeheader()
        for order in orders:
            writer.writerow({k: order.get(k, "") for k in writer.fieldnames})
        
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=orders_{start_date}_{end_date}.csv"}
        )
```

---

## 11. Security & Compliance

### 11.1 Authentication

```python
# JWT Configuration
JWT_SECRET = os.environ["JWT_SECRET"]  # 256-bit random
JWT_ALGORITHM = "HS256"
JWT_EXPIRY = 86400  # 24 hours

def create_token(user: dict, role: str = "user") -> str:
    payload = {
        "sub": user["user_id"],
        "email": user["email"],
        "role": role,
        "exp": datetime.now(timezone.utc).timestamp() + JWT_EXPIRY,
        "iat": datetime.now(timezone.utc).timestamp()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
```

### 11.2 API Security

```python
# Rate limiting (per IP)
RATE_LIMITS = {
    "/api/upload": {"requests": 10, "window": 60},      # 10 per minute
    "/api/orders/create": {"requests": 5, "window": 60},
    "/api/ai/*": {"requests": 20, "window": 60},
    "default": {"requests": 100, "window": 60}
}

# CORS Configuration
CORS_ORIGINS = [
    "https://filesolved.com",
    "https://www.filesolved.com",
    os.environ.get("DEV_ORIGIN", "http://localhost:3000")
]

# Security Headers
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data: https:; script-src 'self' https://www.paypal.com"
}
```

### 11.3 File Security

```python
# File validation
ALLOWED_MIME_TYPES = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"]
}

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

async def validate_file(file: UploadFile):
    # 1. Check size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(413, "File too large")
    await file.seek(0)
    
    # 2. Check MIME type
    mime_type = magic.from_buffer(content, mime=True)
    if mime_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(415, "Unsupported file type")
    
    # 3. Check extension matches MIME
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_MIME_TYPES.get(mime_type, []):
        raise HTTPException(400, "File extension does not match content")
    
    # 4. Virus scan (production)
    # if not antivirus.is_clean(content):
    #     raise HTTPException(400, "File failed security scan")
    
    return True
```

### 11.4 Data Retention

```python
# Scheduled cleanup job (run daily)
async def cleanup_expired_files():
    now = datetime.now(timezone.utc)
    
    # Find expired files
    expired_files = await db.files.find({
        "expires_at": {"$lt": now.isoformat()},
        "deleted_at": None
    }).to_list(1000)
    
    for file_doc in expired_files:
        # Delete from storage
        file_path = Path(file_doc["storage_path"])
        if file_path.exists():
            file_path.unlink()
        
        # Mark as deleted
        await db.files.update_one(
            {"file_id": file_doc["file_id"]},
            {"$set": {"deleted_at": now.isoformat()}}
        )
        
        # Audit log
        await log_audit("system", "file_deleted", "file", file_doc["file_id"], {
            "reason": "expired",
            "original_name": file_doc["original_name"]
        })
```

### 11.5 Logging Policy

```python
# What we LOG:
# - API requests (method, path, status, response time, IP)
# - Authentication events (login, logout, failed attempts)
# - Payment events (created, captured, refunded)
# - File events (uploaded, processed, deleted)
# - Admin actions (all)
# - Errors (stack traces, but NO document content)

# What we DO NOT LOG:
# - Document content
# - Full file contents
# - Passwords (even hashed in logs)
# - Payment card details (handled by PayPal)

SENSITIVE_FIELDS = ["password", "token", "secret", "content", "file_data"]

def sanitize_log(data: dict) -> dict:
    sanitized = {}
    for key, value in data.items():
        if any(sensitive in key.lower() for sensitive in SENSITIVE_FIELDS):
            sanitized[key] = "[REDACTED]"
        elif isinstance(value, dict):
            sanitized[key] = sanitize_log(value)
        else:
            sanitized[key] = value
    return sanitized
```

---

## 12. SEO & Content Integration

### 12.1 Page Hierarchy

```
/                           # Homepage (PR: 1.0)
├── /services               # Services overview (PR: 0.9)
│   ├── /services/pdf-to-word
│   ├── /services/word-to-pdf
│   ├── /services/jpg-to-pdf
│   ├── /services/pdf-to-jpg
│   ├── /services/ocr
│   ├── /services/document-scan
│   ├── /services/pdf-fax
│   └── /services/secure-shred
│
├── /how-to                 # How-to guides (PR: 0.7)
│   ├── /how-to/convert-pdf-to-word
│   ├── /how-to/extract-text-from-image
│   ├── /how-to/scan-document-to-pdf
│   └── ... (50+ pages)
│
├── /pricing                # Pricing page (PR: 0.8)
├── /faq                    # FAQ (PR: 0.6)
├── /contact                # Contact (PR: 0.5)
├── /about                  # About us (PR: 0.5)
├── /privacy                # Privacy policy (PR: 0.3)
└── /terms                  # Terms of service (PR: 0.3)
```

### 12.2 Internal Linking Strategy

```jsx
// Every service page includes:
const ServicePage = ({ service }) => (
  <>
    {/* Main content */}
    <ServiceContent service={service} />
    
    {/* Related services */}
    <RelatedServices services={getRelatedServices(service.id)} />
    
    {/* How-to links */}
    <HowToGuides guides={getGuidesForService(service.id)} />
    
    {/* CTA */}
    <UploadCTA service={service} />
  </>
);

// Related services component
const RelatedServices = ({ services }) => (
  <section>
    <h2>Related Services</h2>
    <ul>
      {services.map(s => (
        <li key={s.id}>
          <Link to={`/services/${s.id}`}>
            {s.name} - {s.shortDescription}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

// How-to guides component
const HowToGuides = ({ guides }) => (
  <section>
    <h2>Learn More</h2>
    <ul>
      {guides.map(g => (
        <li key={g.slug}>
          <Link to={`/how-to/${g.slug}`}>{g.title}</Link>
        </li>
      ))}
    </ul>
  </section>
);
```

### 12.3 Schema Markup

```jsx
// Service page schema
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "PDF to Word Conversion",
  "description": "Convert PDF documents to editable Word files",
  "provider": {
    "@type": "Organization",
    "name": "FileSolved"
  },
  "offers": {
    "@type": "Offer",
    "price": "2.99",
    "priceCurrency": "USD"
  },
  "areaServed": "Worldwide"
};

// FAQ schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

// Breadcrumb schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://filesolved.com" },
    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://filesolved.com/services" },
    { "@type": "ListItem", "position": 3, "name": "PDF to Word" }
  ]
};
```

### 12.4 Content Templates

```markdown
# How-To Page Template

## Title: How to [Action] with FileSolved

### Introduction (100-150 words)
Brief overview of the problem and solution.

### What You'll Need
- Your [file type] file
- A few minutes

### Step-by-Step Guide
1. **Step 1: Upload Your File**
   - Go to [FileSolved Upload Page](/upload)
   - Drag and drop your file

2. **Step 2: Select Service**
   - Choose "[Service Name]" from the dropdown
   - Review the price

3. **Step 3: Enter Details**
   - Add your email address
   - Click "Proceed to Checkout"

4. **Step 4: Complete Payment**
   - Use PayPal to pay securely
   - Wait for processing

5. **Step 5: Download Result**
   - Check your email
   - Download your converted file

### Tips for Best Results
- Tip 1
- Tip 2
- Tip 3

### Related Services
- [Related Service 1](/services/service-1)
- [Related Service 2](/services/service-2)

### FAQ
**Q: How long does it take?**
A: Most files are processed in under 30 seconds.

**Q: Is my file secure?**
A: Yes, files are encrypted and auto-deleted after 24 hours.

### Ready to Start?
[Upload Your File Now](/services/[service-id]) →
```

### 12.5 Sitemap Generation

```python
@api_router.get("/sitemap.xml")
async def sitemap():
    pages = [
        {"loc": "/", "priority": 1.0, "changefreq": "weekly"},
        {"loc": "/services", "priority": 0.9, "changefreq": "weekly"},
        {"loc": "/pricing", "priority": 0.8, "changefreq": "monthly"},
        {"loc": "/faq", "priority": 0.6, "changefreq": "monthly"},
        {"loc": "/contact", "priority": 0.5, "changefreq": "monthly"},
    ]
    
    # Add service pages
    services = await db.services.find({"is_active": True}).to_list(100)
    for service in services:
        pages.append({
            "loc": f"/services/{service['service_id']}",
            "priority": 0.8,
            "changefreq": "monthly"
        })
    
    # Add how-to pages
    how_tos = await db.content.find({"type": "how-to"}).to_list(100)
    for how_to in how_tos:
        pages.append({
            "loc": f"/how-to/{how_to['slug']}",
            "priority": 0.7,
            "changefreq": "monthly"
        })
    
    # Generate XML
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for page in pages:
        xml += f'  <url>\n'
        xml += f'    <loc>https://filesolved.com{page["loc"]}</loc>\n'
        xml += f'    <priority>{page["priority"]}</priority>\n'
        xml += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
        xml += f'  </url>\n'
    
    xml += '</urlset>'
    
    return Response(content=xml, media_type="application/xml")
```

---

## 13. Implementation Roadmap

### Phase 1: Core Backend + Payments (Week 1-2)

**Tasks:**
- [x] FastAPI project setup
- [x] MongoDB connection
- [x] Services data model
- [x] File upload endpoint
- [x] Order creation endpoint
- [x] PayPal integration (create, capture)
- [x] Basic file processing (PDF→Word, Word→PDF)
- [ ] PayPal webhook handler
- [ ] Email delivery (Resend)

**Success Criteria:**
- Can upload file, create order, pay with PayPal
- File is processed and stored
- Email sent with download link

### Phase 2: Frontend + Checkout (Week 2-3)

**Tasks:**
- [x] React app setup with routing
- [x] Homepage with services
- [x] Services listing page
- [x] Upload page with dropzone
- [x] Checkout page with PayPal buttons
- [x] Confirmation page
- [x] FAQ and Contact pages
- [ ] User authentication (register/login)
- [ ] User dashboard

**Success Criteria:**
- Full checkout flow works end-to-end
- Responsive design
- All pages have proper SEO tags

### Phase 3: Admin Dashboard (Week 3-4)

**Tasks:**
- [x] Admin authentication
- [x] Dashboard with KPIs
- [x] Orders table with filters
- [ ] Revenue charts
- [ ] User management
- [ ] Error logs view
- [ ] CSV export
- [ ] Reprocess/refund actions

**Success Criteria:**
- Admin can view all orders
- Admin can filter and export data
- Admin can reprocess failed orders

### Phase 4: AI Features (Week 4-5)

**Tasks:**
- [ ] AI provider abstraction layer
- [ ] Document summarization
- [ ] Document classification
- [ ] OCR cleanup with AI
- [ ] "Chat about document" feature
- [ ] Service recommendation based on file
- [ ] AI usage tracking and cost logging

**Success Criteria:**
- AI summarization works
- AI classification identifies document types
- Chat provides relevant answers about document

### Phase 5: SEO & Content (Week 5-6)

**Tasks:**
- [ ] Create 50+ how-to pages
- [ ] Implement internal linking
- [ ] Add schema markup to all pages
- [ ] Generate sitemap.xml
- [ ] Create robots.txt
- [ ] Optimize meta tags
- [ ] Add breadcrumbs

**Success Criteria:**
- All pages indexed by Google
- Internal links connect content
- Schema markup validates

### Phase 6: Advanced Features (Week 6-8)

**Tasks:**
- [ ] Credits/prepaid system
- [ ] Batch processing
- [ ] API keys for developers
- [ ] Webhook integrations
- [ ] Advanced analytics
- [ ] A/B testing infrastructure
- [ ] Performance optimization

**Success Criteria:**
- Users can buy credits
- Batch processing handles multiple files
- Developer API documented

---

## Appendix A: Environment Variables

```env
# Server
PORT=8001
HOST=0.0.0.0
ENVIRONMENT=production

# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=filesolved

# Authentication
JWT_SECRET=your-256-bit-secret-here
JWT_EXPIRY=86400

# PayPal
PAYPAL_CLIENT_ID=ARECEuPyGHfh7jklkm8rCChO5Zeevw8bN1Sc4Il3wM9t4KnAcD89Ll504jlf3l7-kmCyrJMkU75Bat8n
PAYPAL_SECRET={{PAYPAL_SECRET}}
PAYPAL_MODE=live

# Email
RESEND_API_KEY={{RESEND_API_KEY}}
SENDER_EMAIL=noreply@filesolved.com

# AI
AI_PROVIDER=openai
OPENAI_API_KEY={{OPENAI_API_KEY}}
# OR
ANTHROPIC_API_KEY={{ANTHROPIC_API_KEY}}

# Storage
STORAGE_TYPE=local
STORAGE_PATH=/app/storage
# For S3:
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_S3_BUCKET=

# Frontend
REACT_APP_BACKEND_URL=https://api.filesolved.com
REACT_APP_PAYPAL_CLIENT_ID=ARECEuPyGHfh7jklkm8rCChO5Zeevw8bN1Sc4Il3wM9t4KnAcD89Ll504jlf3l7-kmCyrJMkU75Bat8n
```

---

## Appendix B: API Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 402 | Payment Required | Insufficient credits |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 413 | Payload Too Large | File exceeds size limit |
| 415 | Unsupported Media Type | Invalid file type |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Processing queue full |

---

*Document Version: 1.0*
*Last Updated: January 2025*
*Author: FileSolved Engineering*
