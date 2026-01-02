# FileSolved - Product Requirements Document

## Original Problem Statement
Build FileSolved - "One Upload. Problem Solved." A fully automated document-services platform with 50+ services, bundles, and grievance/legal document support.

## Architecture
- **Frontend**: React 19 + React Router + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI (Python) with catalog-driven services
- **Database**: MongoDB
- **Payments**: PayPal REST API v2 (Live mode)
- **Email**: Resend (configured, awaiting API key)

## Services Catalog (58 Services)
**Types:**
- Document Conversion (15 services)
- OCR & Text Extraction (7 services)
- Fax Services (4 services)
- Secure Shredding (3 services)
- Service Bundles (5 bundles)
- Grievance & Complaints (3 services)
- Notary Services (3 services)
- Legal Documents (5 services)
- Medical Documents (3 services)
- Financial Documents (3 services)

## Catalog-Driven Architecture
- Single source of truth: `/app/backend/services_catalog.py` + `/app/frontend/src/data/servicesCatalog.ts`
- API Endpoints:
  - `GET /api/services` - List all services (with filtering by type, tag, search)
  - `GET /api/services/types` - Get service type labels
  - `GET /api/services/{id}` - Get single service (with included_services for bundles)
  - `POST /api/orders/create` - Create order with serviceId, quantity, extraFields

## Special Service Handling
1. **Bundles**: Show included services, flat pricing
2. **Grievance/Legal**: Collect extra fields (incident_date, authority_to_submit, summary)
3. **Fax**: Collect fax_number, country_code
4. **Medical/Notary**: Collect required fields per service type

## What's Been Implemented (January 2025)

### Backend ✅
- 58 services in catalog with pricing, types, tags
- Dynamic service loading and filtering
- Price calculation based on unit (per_file, per_page, flat)
- Extra field validation for special services
- Bundle service resolution (included_services populated)

### Frontend ✅
- Dynamic services page with category tabs
- Search functionality
- Service detail pages with:
  - Bundle includes display
  - Extra fields form for grievance/legal
  - Quantity input for per-page/per-file services
- Responsive design with professional styling

## Prioritized Backlog

### P0 - Critical
- [ ] Add PAYPAL_SECRET to .env
- [ ] Add RESEND_API_KEY to .env

### P1 - High Priority
- [ ] User authentication system
- [ ] File processors for new service types

### P2 - Medium Priority
- [ ] AI-powered services (summarization, classification)
- [ ] 50+ SEO how-to pages

## Next Tasks
1. Provide credentials (PAYPAL_SECRET, RESEND_API_KEY)
2. Test end-to-end payment flow
3. Implement file processors for additional service types
