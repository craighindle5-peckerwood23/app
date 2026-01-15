# FileSolved - Product Requirements Document

## Original Problem Statement
Build FileSolved - "One Upload. Problem Solved." A fully automated document-services platform with 50+ services, bundles, and grievance/legal document support. Rebranded as a "public empowerment platform" for documenting disputes and generating reports.

## Architecture
- **Frontend**: React + React Router + Tailwind CSS + Shadcn UI
- **Backend**: Node.js/Express.js (proxied via FastAPI for deployment compatibility)
- **Database**: MongoDB (Atlas in production)
- **Payments**: PayPal REST API v2 (Live mode) - Single payments + Recurring subscriptions
- **Email**: Resend (configured)
- **AI**: Emergent LLM Key (GPT-4o) via Python microservice

## Live URLs
- **Preview**: https://empowerhelp.preview.emergentagent.com
- **Production**: https://empowerhelp.emergent.host (after deployment)

## Deployment Architecture
The deployment uses a FastAPI proxy (`server.py`) that:
1. Exposes a `/health` endpoint for uvicorn health checks
2. Starts the Node.js Express server on port 3001 in background
3. Proxies all requests from port 8001 to the Node.js server

This bridges the Emergent deployment system (which expects Python/FastAPI) with the Node.js backend.

## What's Been Implemented (January 2025)

### Deployment Fixes ✅
- Created FastAPI proxy wrapper for uvicorn compatibility
- Added httpx for async HTTP proxying
- Optimized all database queries with projections and limits
- Fixed React Hook dependency warnings

### PayPal Recurring Subscriptions ✅
- Full PayPal Subscriptions API integration
- $5.99/month "All Tools Access" plan
- Auto-creates PayPal product and billing plan
- Redirects user to PayPal for approval
- Activates subscription on return
- Webhook handlers for billing events

### Core Features ✅
- 53+ document services with dynamic pricing
- File upload and order processing
- Single-payment checkout via PayPal
- AI Assistant (GPT-4o powered)
- Admin Dashboard with analytics (Recharts)

## Database Query Optimizations Applied
- `/api/admin/analytics` - Added projection for recent orders
- `/api/admin/orders` - Added projection for order listing
- `/api/admin/errors` - Added projection for failed orders/jobs
- `/api/admin/export` - Added 10,000 record limit
- `/api/admin/users` - Changed to positive projection
- `/api/user/orders` - Added projection for user orders

## Credentials (in /app/backend/.env)
- PayPal: Live mode credentials configured
- Resend: API key configured
- Emergent LLM Key: Configured for GPT-4o
- JWT: Secret configured

## Pending Items (P1)
- [ ] Add service-specific FAQs
- [ ] Add customer testimonials
- [ ] Implement crawl indexing optimization

## Future/Backlog (P2)
- Internal linking strategy
- Dynamic bundle/category pages
- Extended Admin Dashboard features
- Profitability Engine

## Last Updated
January 2025 - Deployment fixes applied for production readiness
