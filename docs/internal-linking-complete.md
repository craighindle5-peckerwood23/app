# FileSolved Internal Linking Architecture

## Link Structure Overview

### Primary Navigation Flow
```
Homepage
├── Services Index (/services)
│   ├── Category: PDF Tools (/categories/pdf-tools)
│   │   ├── PDF to Word (/services/pdf-to-word)
│   │   ├── PDF to Excel (/services/pdf-to-excel)
│   │   └── ... (all PDF services)
│   ├── Category: Scanning & OCR (/categories/scanning-ocr)
│   ├── Category: Fax Tools (/categories/fax-tools)
│   ├── Category: File Management (/categories/file-management)
│   ├── Category: AI Document Tools (/categories/ai-document-tools)
│   ├── Category: Audio & Video (/categories/audio-video)
│   ├── Category: Legal & Compliance (/categories/legal-compliance)
│   ├── Category: Business Tools (/categories/business-tools)
│   └── Category: Life Admin (/categories/life-admin)
├── Bundles (/bundles)
│   ├── Landlord Protection (/bundles/landlord-protection)
│   ├── Officer Misconduct (/bundles/officer-misconduct)
│   └── ... (all bundles)
└── Static Pages
    ├── FAQ (/faq)
    ├── Contact (/contact)
    ├── About (/about)
    ├── Privacy (/privacy)
    └── Terms (/terms)
```

---

## Service Page Internal Links

Each service page MUST include these links:

### Navigation Links
1. **Back to Services** - Link to /services
2. **Category Link** - Link to parent category
3. **3 Related Tools** - Links to complementary services

### Related Tool Mappings

| Service | Related Tool 1 | Related Tool 2 | Related Tool 3 |
|---------|---------------|----------------|----------------|
| PDF to Word | PDF OCR | Word to PDF | PDF Merger |
| PDF to Excel | PDF to Word | Excel to PDF | Document Summarizer |
| PDF to PowerPoint | PowerPoint to PDF | PDF Merger | Image to PDF |
| PDF to Text | PDF OCR | Document Summarizer | PDF to Word |
| Word to PDF | PDF to Word | PDF Merger | PDF eSign |
| Excel to PDF | PDF to Excel | PDF Compressor | Invoice Generator |
| PowerPoint to PDF | PDF to PowerPoint | PDF Merger | Image to PDF |
| Image to PDF | Image OCR | PDF Merger | Document Scanner |
| PDF Merger | PDF Splitter | PDF Page Reorder | PDF Compressor |
| PDF Splitter | PDF Merger | PDF Page Extractor | PDF Compressor |
| PDF Compressor | PDF Merger | Image to PDF | PDF Splitter |
| PDF Password Protection | PDF Unlocker | PDF Redaction | Secure Shredding |
| PDF Unlocker | PDF Password Protection | PDF to Word | PDF Form Filler |
| PDF Page Reorder | PDF Merger | PDF Splitter | PDF Page Extractor |
| PDF Page Extractor | PDF Splitter | PDF Merger | PDF Page Reorder |
| PDF Watermark | PDF eSign | PDF Password Protection | Image to PDF |
| PDF eSign | PDF Form Filler | Word to PDF | Grievance Letter Generator |
| PDF Form Filler | PDF eSign | PDF to Word | Legal Form Generator |
| PDF Redaction | PDF Password Protection | PDF to Word | Secure Shredding |
| PDF OCR | Image OCR | PDF to Word | Document Scanner |
| Document Scanner | Bulk Document Scanner | Image to PDF | PDF OCR |
| Bulk Document Scanner | Document Scanner | PDF Merger | Image OCR |
| Image OCR | PDF OCR | Handwriting OCR | Document Scanner |
| Handwriting OCR | Image OCR | PDF OCR | Document Scanner |
| Fax Sending | Fax Receiving | Fax to Email | Word to PDF |
| Fax Receiving | Fax Sending | Fax to Email | PDF to Word |
| Fax to Email | Fax Receiving | Fax Sending | PDF Merger |
| Secure Shredding | Bulk Shredding | PDF Password Protection | PDF Redaction |
| Bulk Shredding | Secure Shredding | ZIP Creator | File Converter |
| Document Translation | Document Summarizer | PDF to Word | PDF OCR |
| Document Summarizer | Document Translation | PDF to Text | Audio Transcription |
| Document Classifier | Document Tagging | Document Summarizer | PDF OCR |
| Document Tagging | Document Classifier | Document Summarizer | PDF Merger |
| Document Comparison | Document Summarizer | PDF to Word | PDF Merger |
| Image Enhancer | Image Upscaler | Image Background Remover | Image to PDF |
| Image Background Remover | Image Enhancer | Image to PDF | Image Upscaler |
| Image Upscaler | Image Enhancer | Image Background Remover | Image to PDF |
| File Converter | ZIP Extractor | ZIP Creator | PDF Merger |
| ZIP Extractor | ZIP Creator | File Converter | PDF Splitter |
| ZIP Creator | ZIP Extractor | File Converter | PDF Merger |
| Audio Transcription | Video Transcription | Voice Recorder | Document Summarizer |
| Video Transcription | Audio Transcription | Voice Recorder | Document Summarizer |
| Voice Recorder | Audio Transcription | Document Scanner | PDF Merger |
| Notarization Prep | PDF eSign | Legal Form Generator | PDF Form Filler |
| Legal Form Generator | Grievance Letter Generator | Contract Template Builder | PDF eSign |
| Grievance Letter Generator | Legal Form Generator | Business Letter Generator | PDF Merger |
| Emergency Document Bundle | PDF Merger | Document Scanner | PDF eSign |
| Resume Builder | Cover Letter Generator | PDF to Word | Word to PDF |
| Cover Letter Generator | Resume Builder | Business Letter Generator | Word to PDF |
| Invoice Generator | Receipt Maker | Business Letter Generator | PDF eSign |
| Receipt Maker | Invoice Generator | Word to PDF | PDF Merger |
| Business Letter Generator | Grievance Letter Generator | Cover Letter Generator | Word to PDF |
| Contract Template Builder | Legal Form Generator | PDF eSign | PDF Form Filler |

---

## Category Page Links

Each category page includes:

### Header Navigation
- Link to Services Index
- Links to Previous/Next categories

### Content Links
- All services in that category (as list)
- Featured/popular services (highlighted)

### Footer Cross-Links
- Related categories
- Popular bundles that use these tools

---

## Bundle Page Links

Each bundle page includes:

### Tool Links
- All individual tools included in the bundle
- Link to each tool's service page

### Related Bundle Links
- 2-3 related bundles for different situations

### Category Links
- Links to relevant tool categories

---

## Footer Link Structure

### Services
- PDF Tools
- OCR & Scanning
- AI Document Tools
- Legal Documents
- Fax Services
- All Services →

### Bundles
- Landlord Protection
- Officer Misconduct
- Workplace Rights
- All Bundles →

### Company
- About Us
- Contact
- FAQ
- Blog

### Legal
- Privacy Policy
- Terms of Service
- Cookie Policy

---

## Contextual Link Placements

### Within Service Descriptions
- Link to complementary tools when mentioned
- Link to bundles for complex situations
- Link to categories for browsing

### In FAQ Answers
- Link to related tools that answer the question
- Link to support/contact for complex issues

### In How-It-Works Sections
- Link to prerequisite tools (e.g., "First use PDF Unlocker...")
- Link to next-step tools (e.g., "Then merge with PDF Merger...")

---

## SEO Link Anchor Text Guidelines

### DO Use
- Descriptive anchor text: "PDF to Word converter"
- Action-oriented: "convert your PDF to Word"
- Tool names: "PDF Merger"

### DON'T Use
- Generic: "click here", "learn more"
- URLs as anchor text
- Overly long anchor text

---

## Link Implementation Checklist

For each service page:
- [ ] Back to Services Index link
- [ ] Category breadcrumb/link
- [ ] 3 related tool links
- [ ] At least 1 contextual link in description
- [ ] FAQ links to related tools
- [ ] Bundle mention/link if applicable

For each category page:
- [ ] All services in category listed with links
- [ ] Previous/Next category navigation
- [ ] Back to Services Index
- [ ] 2+ related categories in sidebar/footer

For homepage:
- [ ] Featured services with links
- [ ] Featured bundles with links
- [ ] Category quick links
- [ ] "View All Services" CTA
