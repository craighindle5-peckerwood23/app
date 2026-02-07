# FileSolved - Product Requirements Document

## Original Problem Statement
Build FileSolved - A document services platform with 50+ services for document processing, legal forms, and grievance letters.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Backend**: Node.js/Express.js (pure Node.js, no Python proxy)
- **Database**: MongoDB (Atlas in production)
- **Payments**: PayPal REST API v2 (Live mode)
- **Email**: Resend
- **AI**: Emergent LLM Key (GPT-4o)

## Deployment Configuration
- **App Type**: Node.js (Express.js)
- **Entry Point**: `node src/server.js` (via package.json start script)
- **Health Endpoint**: `/health` (root level for deployment checks)
- **API Endpoints**: All under `/api/*` prefix
- **Port**: 8001 (from PORT env var)

## Key Changes Made for Deployment
1. **Removed server.py** - Was causing Python detection, now pure Node.js
2. **Added /health endpoint** - Root level for deployment health checks
3. **Fixed React Hook warnings** - useCallback for all async functions in useEffect
4. **Optimized DB queries** - Added projections and limits
5. **Removed hardcoded URLs** - All from environment variables

## What's Implemented
- 53+ document services
- PayPal subscription billing ($5.99/month)
- Single payment checkout
- AI Assistant (GPT-4o)
- Admin Dashboard with charts
- File upload and processing
- Email notifications

## Environment Variables Required
- MONGO_URL, DB_NAME
- PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_MODE
- JWT_SECRET
- RESEND_API_KEY
- FRONTEND_URL
- EMERGENT_LLM_KEY

## Pending Items
- Service-specific FAQs
- Customer testimonials  
- Crawl indexing optimization

## Last Updated
January 2025 - Deployment fixes (removed Python proxy, pure Node.js)
