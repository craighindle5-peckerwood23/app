// src/config/servicesCatalog.js - FileSolved Complete Services Catalog
// This is the SINGLE SOURCE OF TRUTH for all services

const ServiceType = {
  CONVERSION: 'conversion',
  OCR: 'ocr',
  FAX: 'fax',
  SHREDDING: 'shredding',
  BUNDLE: 'bundle',
  GRIEVANCE: 'grievance',
  NOTARY: 'notary',
  LEGAL: 'legal',
  MEDICAL: 'medical',
  FINANCIAL: 'financial'
};

const PricingUnit = {
  PER_FILE: 'per_file',
  PER_PAGE: 'per_page',
  FLAT: 'flat',
  PER_MB: 'per_mb'
};

const servicesCatalog = [
  // ==================== CONVERSION SERVICES ====================
  {
    id: 'pdf_to_word',
    name: 'PDF to Word Conversion',
    type: ServiceType.CONVERSION,
    description: 'Convert PDF documents into editable Word files with formatting preserved.',
    basePrice: 299,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['pdf', 'word', 'conversion', 'docx'],
    icon: 'FileText',
    estimatedTime: '30 seconds',
    maxFileSize: 50,
    supportedFormats: ['.pdf']
  },
  {
    id: 'word_to_pdf',
    name: 'Word to PDF Conversion',
    type: ServiceType.CONVERSION,
    description: 'Convert Word documents to professional PDF format.',
    basePrice: 199,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['word', 'pdf', 'conversion', 'docx'],
    icon: 'FileOutput',
    estimatedTime: '20 seconds',
    maxFileSize: 50,
    supportedFormats: ['.doc', '.docx']
  },
  {
    id: 'jpg_to_pdf',
    name: 'Image to PDF Conversion',
    type: ServiceType.CONVERSION,
    description: 'Convert JPG, PNG, and other images to PDF documents.',
    basePrice: 149,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['image', 'jpg', 'png', 'pdf', 'conversion'],
    icon: 'Image',
    estimatedTime: '15 seconds',
    maxFileSize: 25,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  },
  {
    id: 'pdf_to_jpg',
    name: 'PDF to Image Extraction',
    type: ServiceType.CONVERSION,
    description: 'Extract pages from PDF files as high-quality images.',
    basePrice: 199,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['pdf', 'image', 'jpg', 'extraction'],
    icon: 'Images',
    estimatedTime: '30 seconds',
    maxFileSize: 50,
    supportedFormats: ['.pdf']
  },
  {
    id: 'excel_to_pdf',
    name: 'Excel to PDF Conversion',
    type: ServiceType.CONVERSION,
    description: 'Convert Excel spreadsheets to PDF format with formatting intact.',
    basePrice: 249,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['excel', 'pdf', 'spreadsheet', 'conversion'],
    icon: 'Table',
    estimatedTime: '25 seconds',
    maxFileSize: 25,
    supportedFormats: ['.xls', '.xlsx']
  },
  {
    id: 'pdf_to_excel',
    name: 'PDF to Excel Conversion',
    type: ServiceType.CONVERSION,
    description: 'Extract tables from PDF documents into editable Excel files.',
    basePrice: 399,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['pdf', 'excel', 'table', 'extraction'],
    icon: 'TableProperties',
    estimatedTime: '45 seconds',
    maxFileSize: 25,
    supportedFormats: ['.pdf']
  },
  {
    id: 'ppt_to_pdf',
    name: 'PowerPoint to PDF',
    type: ServiceType.CONVERSION,
    description: 'Convert PowerPoint presentations to PDF format.',
    basePrice: 249,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['powerpoint', 'pdf', 'presentation', 'conversion'],
    icon: 'Presentation',
    estimatedTime: '30 seconds',
    maxFileSize: 100,
    supportedFormats: ['.ppt', '.pptx']
  },
  {
    id: 'pdf_to_ppt',
    name: 'PDF to PowerPoint',
    type: ServiceType.CONVERSION,
    description: 'Convert PDF documents to editable PowerPoint slides.',
    basePrice: 449,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['pdf', 'powerpoint', 'presentation', 'conversion'],
    icon: 'PresentationChart',
    estimatedTime: '60 seconds',
    maxFileSize: 50,
    supportedFormats: ['.pdf']
  },
  {
    id: 'html_to_pdf',
    name: 'HTML to PDF Conversion',
    type: ServiceType.CONVERSION,
    description: 'Convert web pages and HTML files to PDF documents.',
    basePrice: 199,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['html', 'web', 'pdf', 'conversion'],
    icon: 'Globe',
    estimatedTime: '20 seconds',
    maxFileSize: 10,
    supportedFormats: ['.html', '.htm']
  },
  {
    id: 'pdf_merge',
    name: 'PDF Merge',
    type: ServiceType.CONVERSION,
    description: 'Combine multiple PDF files into a single document.',
    basePrice: 299,
    unit: PricingUnit.FLAT,
    enabled: true,
    tags: ['pdf', 'merge', 'combine'],
    icon: 'Layers',
    estimatedTime: '15 seconds',
    maxFileSize: 100,
    supportedFormats: ['.pdf']
  },
  {
    id: 'pdf_split',
    name: 'PDF Split',
    type: ServiceType.CONVERSION,
    description: 'Split a PDF into multiple separate documents.',
    basePrice: 249,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['pdf', 'split', 'separate'],
    icon: 'Scissors',
    estimatedTime: '20 seconds',
    maxFileSize: 100,
    supportedFormats: ['.pdf']
  },
  {
    id: 'pdf_compress',
    name: 'PDF Compression',
    type: ServiceType.CONVERSION,
    description: 'Reduce PDF file size while maintaining quality.',
    basePrice: 149,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['pdf', 'compress', 'reduce', 'optimize'],
    icon: 'Minimize2',
    estimatedTime: '30 seconds',
    maxFileSize: 100,
    supportedFormats: ['.pdf']
  },
  {
    id: 'pdf_rotate',
    name: 'PDF Page Rotation',
    type: ServiceType.CONVERSION,
    description: 'Rotate pages in your PDF documents.',
    basePrice: 99,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['pdf', 'rotate', 'orientation'],
    icon: 'RotateCw',
    estimatedTime: '10 seconds',
    maxFileSize: 50,
    supportedFormats: ['.pdf']
  },
  {
    id: 'image_resize',
    name: 'Image Resize',
    type: ServiceType.CONVERSION,
    description: 'Resize images to specific dimensions.',
    basePrice: 99,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['image', 'resize', 'dimensions'],
    icon: 'Expand',
    estimatedTime: '10 seconds',
    maxFileSize: 25,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  },
  {
    id: 'image_compress',
    name: 'Image Compression',
    type: ServiceType.CONVERSION,
    description: 'Compress images to reduce file size.',
    basePrice: 99,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['image', 'compress', 'optimize'],
    icon: 'Minimize',
    estimatedTime: '10 seconds',
    maxFileSize: 25,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp']
  },
  {
    id: 'watermark_add',
    name: 'Add Watermark',
    type: ServiceType.CONVERSION,
    description: 'Add text or image watermarks to documents.',
    basePrice: 199,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['watermark', 'branding', 'security'],
    icon: 'Droplet',
    estimatedTime: '20 seconds'
  },
  {
    id: 'watermark_remove',
    name: 'Remove Watermark',
    type: ServiceType.CONVERSION,
    description: 'Remove watermarks from documents.',
    basePrice: 499,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['watermark', 'remove', 'clean'],
    icon: 'Eraser',
    estimatedTime: '45 seconds'
  },
  {
    id: 'pdf_password_protect',
    name: 'PDF Password Protection',
    type: ServiceType.CONVERSION,
    description: 'Add password protection to PDF documents.',
    basePrice: 199,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['security', 'password', 'encrypt', 'pdf'],
    icon: 'Lock',
    estimatedTime: '15 seconds'
  },
  {
    id: 'pdf_password_remove',
    name: 'PDF Password Removal',
    type: ServiceType.CONVERSION,
    description: 'Remove password from PDFs (requires current password).',
    basePrice: 299,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['security', 'password', 'unlock', 'pdf'],
    icon: 'Unlock',
    estimatedTime: '15 seconds'
  },
  {
    id: 'form_fillable',
    name: 'Create Fillable PDF',
    type: ServiceType.CONVERSION,
    description: 'Convert static PDFs to fillable forms.',
    basePrice: 799,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['form', 'fillable', 'interactive', 'pdf'],
    icon: 'FormInput',
    estimatedTime: '5 minutes'
  },
  {
    id: 'translation_prep',
    name: 'Translation Prep',
    type: ServiceType.CONVERSION,
    description: 'Prepare documents for professional translation.',
    basePrice: 399,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['translation', 'language', 'preparation'],
    icon: 'Languages',
    estimatedTime: '5 minutes'
  },

  // ==================== OCR SERVICES ====================
  {
    id: 'ocr_pdf',
    name: 'OCR for Scanned PDFs',
    type: ServiceType.OCR,
    description: 'Extract searchable text from scanned PDF documents.',
    basePrice: 399,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['ocr', 'pdf', 'searchable', 'text'],
    icon: 'ScanText',
    estimatedTime: '60 seconds',
    maxFileSize: 50,
    supportedFormats: ['.pdf']
  },
  {
    id: 'ocr_image',
    name: 'OCR for Images',
    type: ServiceType.OCR,
    description: 'Extract text from images (JPG, PNG, etc.).',
    basePrice: 349,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['ocr', 'image', 'text', 'extraction'],
    icon: 'ScanLine',
    estimatedTime: '45 seconds',
    maxFileSize: 25,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']
  },
  {
    id: 'ocr_handwriting',
    name: 'Handwriting Recognition',
    type: ServiceType.OCR,
    description: 'Convert handwritten documents to digital text.',
    basePrice: 599,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['ocr', 'handwriting', 'manuscript'],
    icon: 'PenTool',
    estimatedTime: '90 seconds',
    maxFileSize: 25,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
  },
  {
    id: 'ocr_receipt',
    name: 'Receipt OCR',
    type: ServiceType.OCR,
    description: 'Extract itemized data from receipts.',
    basePrice: 249,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['ocr', 'receipt', 'expense'],
    icon: 'Receipt',
    estimatedTime: '30 seconds',
    maxFileSize: 10,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
  },
  {
    id: 'ocr_invoice',
    name: 'Invoice Data Extraction',
    type: ServiceType.OCR,
    description: 'Extract structured data from invoices.',
    basePrice: 399,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['ocr', 'invoice', 'billing', 'extraction'],
    icon: 'FileSpreadsheet',
    estimatedTime: '45 seconds',
    maxFileSize: 25,
    supportedFormats: ['.pdf', '.jpg', '.png']
  },
  {
    id: 'ocr_business_card',
    name: 'Business Card Scanner',
    type: ServiceType.OCR,
    description: 'Extract contact information from business cards.',
    basePrice: 149,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['ocr', 'business card', 'contact'],
    icon: 'Contact',
    estimatedTime: '15 seconds',
    maxFileSize: 5,
    supportedFormats: ['.jpg', '.jpeg', '.png']
  },
  {
    id: 'document_scan_cleanup',
    name: 'Document Scan Cleanup',
    type: ServiceType.OCR,
    description: 'Clean, straighten, and enhance scanned documents.',
    basePrice: 249,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['scan', 'cleanup', 'enhance', 'straighten'],
    icon: 'Scan',
    estimatedTime: '30 seconds',
    maxFileSize: 25,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.pdf']
  },

  // ==================== FAX SERVICES ====================
  {
    id: 'fax_domestic',
    name: 'Domestic Fax',
    type: ServiceType.FAX,
    description: 'Send documents via fax within the United States.',
    basePrice: 499,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['fax', 'domestic', 'us'],
    icon: 'Printer',
    estimatedTime: '2 minutes',
    maxFileSize: 25,
    supportedFormats: ['.pdf'],
    requiresExtraFields: ['fax_number']
  },
  {
    id: 'fax_international',
    name: 'International Fax',
    type: ServiceType.FAX,
    description: 'Send documents via fax internationally.',
    basePrice: 999,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['fax', 'international', 'global'],
    icon: 'Globe2',
    estimatedTime: '3 minutes',
    maxFileSize: 25,
    supportedFormats: ['.pdf'],
    requiresExtraFields: ['fax_number', 'country_code']
  },
  {
    id: 'fax_hipaa',
    name: 'HIPAA-Compliant Fax',
    type: ServiceType.FAX,
    description: 'Secure fax transmission for healthcare documents.',
    basePrice: 799,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['fax', 'hipaa', 'healthcare', 'secure'],
    icon: 'ShieldCheck',
    estimatedTime: '2 minutes',
    maxFileSize: 25,
    supportedFormats: ['.pdf'],
    requiresExtraFields: ['fax_number', 'recipient_name']
  },
  {
    id: 'fax_legal',
    name: 'Legal Document Fax',
    type: ServiceType.FAX,
    description: 'Priority fax service for legal documents with confirmation.',
    basePrice: 699,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['fax', 'legal', 'court', 'priority'],
    icon: 'Scale',
    estimatedTime: '2 minutes',
    maxFileSize: 50,
    supportedFormats: ['.pdf'],
    requiresExtraFields: ['fax_number', 'case_number']
  },

  // ==================== SHREDDING SERVICES ====================
  {
    id: 'secure_shred_basic',
    name: 'Secure Document Shredding',
    type: ServiceType.SHREDDING,
    description: 'Permanently delete documents with destruction certificate.',
    basePrice: 199,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['shred', 'delete', 'secure', 'certificate'],
    icon: 'Trash2',
    estimatedTime: '10 seconds',
    maxFileSize: 100
  },
  {
    id: 'secure_shred_gdpr',
    name: 'GDPR-Compliant Deletion',
    type: ServiceType.SHREDDING,
    description: 'Secure deletion meeting GDPR requirements with audit trail.',
    basePrice: 399,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['shred', 'gdpr', 'compliance', 'audit'],
    icon: 'ShieldAlert',
    estimatedTime: '15 seconds',
    maxFileSize: 100
  },
  {
    id: 'secure_shred_hipaa',
    name: 'HIPAA-Compliant Deletion',
    type: ServiceType.SHREDDING,
    description: 'Healthcare document destruction with compliance certificate.',
    basePrice: 499,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['shred', 'hipaa', 'healthcare', 'compliance'],
    icon: 'HeartPulse',
    estimatedTime: '15 seconds',
    maxFileSize: 100
  },

  // ==================== BUNDLE SERVICES ====================
  {
    id: 'emergency_bundle_basic',
    name: 'Emergency Bundle – Basic',
    type: ServiceType.BUNDLE,
    description: 'Fast-track processing: OCR + Conversion with priority queue.',
    basePrice: 1499,
    unit: PricingUnit.FLAT,
    enabled: true,
    tags: ['bundle', 'emergency', 'priority', 'fast'],
    icon: 'Zap',
    includes: ['pdf_to_word', 'ocr_pdf'],
    estimatedTime: '2 minutes'
  },
  {
    id: 'emergency_bundle_pro',
    name: 'Emergency Bundle – Pro',
    type: ServiceType.BUNDLE,
    description: 'Complete document processing with OCR, conversion, and cleanup.',
    basePrice: 2999,
    unit: PricingUnit.FLAT,
    enabled: true,
    tags: ['bundle', 'emergency', 'premium', 'complete'],
    icon: 'Rocket',
    includes: ['pdf_to_word', 'word_to_pdf', 'ocr_pdf', 'document_scan_cleanup'],
    estimatedTime: '3 minutes'
  },
  {
    id: 'legal_bundle',
    name: 'Legal Document Bundle',
    type: ServiceType.BUNDLE,
    description: 'Complete legal document preparation: OCR, conversion, secure storage.',
    basePrice: 3999,
    unit: PricingUnit.FLAT,
    enabled: true,
    tags: ['bundle', 'legal', 'court', 'complete'],
    icon: 'Gavel',
    includes: ['ocr_pdf', 'pdf_to_word', 'pdf_merge', 'fax_legal'],
    estimatedTime: '5 minutes'
  },
  {
    id: 'medical_bundle',
    name: 'Medical Records Bundle',
    type: ServiceType.BUNDLE,
    description: 'HIPAA-compliant processing for medical documents.',
    basePrice: 4499,
    unit: PricingUnit.FLAT,
    enabled: true,
    tags: ['bundle', 'medical', 'hipaa', 'healthcare'],
    icon: 'Stethoscope',
    includes: ['ocr_pdf', 'pdf_to_word', 'fax_hipaa', 'secure_shred_hipaa'],
    estimatedTime: '5 minutes'
  },
  {
    id: 'business_bundle',
    name: 'Business Document Bundle',
    type: ServiceType.BUNDLE,
    description: 'Complete business document processing package.',
    basePrice: 2499,
    unit: PricingUnit.FLAT,
    enabled: true,
    tags: ['bundle', 'business', 'corporate'],
    icon: 'Briefcase',
    includes: ['pdf_to_word', 'word_to_pdf', 'excel_to_pdf', 'pdf_merge'],
    estimatedTime: '3 minutes'
  },

  // ==================== GRIEVANCE & LEGAL SERVICES ====================
  {
    id: 'grievance_report',
    name: 'Grievance Report Package',
    type: ServiceType.GRIEVANCE,
    description: 'Structured grievance report preparation and document packaging.',
    basePrice: 1999,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['legal', 'grievance', 'report', 'complaint'],
    icon: 'FileWarning',
    estimatedTime: '10 minutes',
    requiresExtraFields: ['incident_date', 'authority_to_submit', 'summary']
  },
  {
    id: 'grievance_union',
    name: 'Union Grievance Filing',
    type: ServiceType.GRIEVANCE,
    description: 'Prepare and format union grievance documents.',
    basePrice: 2499,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['legal', 'grievance', 'union', 'labor'],
    icon: 'Users',
    estimatedTime: '15 minutes',
    requiresExtraFields: ['union_local', 'incident_date', 'contract_article', 'summary']
  },
  {
    id: 'eeoc_complaint',
    name: 'EEOC Complaint Prep',
    type: ServiceType.GRIEVANCE,
    description: 'Prepare documents for EEOC discrimination complaints.',
    basePrice: 2999,
    unit: PricingUnit.FLAT,
    enabled: true,
    tags: ['legal', 'eeoc', 'discrimination', 'complaint'],
    icon: 'Scale',
    estimatedTime: '20 minutes',
    requiresExtraFields: ['incident_date', 'discrimination_type', 'employer_name', 'summary']
  },

  // ==================== LEGAL SERVICES ====================
  {
    id: 'foia_request',
    name: 'FOIA Request Prep',
    type: ServiceType.LEGAL,
    description: 'Prepare Freedom of Information Act request documents.',
    basePrice: 1499,
    unit: PricingUnit.FLAT,
    enabled: true,
    tags: ['legal', 'foia', 'government', 'request'],
    icon: 'FileSearch',
    estimatedTime: '10 minutes',
    requiresExtraFields: ['agency_name', 'records_description']
  },
  {
    id: 'redaction_basic',
    name: 'Document Redaction',
    type: ServiceType.LEGAL,
    description: 'Redact sensitive information from documents.',
    basePrice: 599,
    unit: PricingUnit.PER_PAGE,
    enabled: true,
    tags: ['redaction', 'privacy', 'sensitive', 'legal'],
    icon: 'EyeOff',
    estimatedTime: '1 minute per page'
  },
  {
    id: 'redaction_ai',
    name: 'AI-Powered Redaction',
    type: ServiceType.LEGAL,
    description: 'Automatic detection and redaction of PII and sensitive data.',
    basePrice: 999,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['redaction', 'ai', 'pii', 'automatic'],
    icon: 'BrainCircuit',
    estimatedTime: '2 minutes'
  },
  {
    id: 'bates_numbering',
    name: 'Bates Numbering',
    type: ServiceType.LEGAL,
    description: 'Apply Bates numbering to legal documents.',
    basePrice: 499,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['legal', 'bates', 'numbering', 'discovery'],
    icon: 'Hash',
    estimatedTime: '30 seconds'
  },
  {
    id: 'digital_signature',
    name: 'Digital Signature Prep',
    type: ServiceType.LEGAL,
    description: 'Prepare documents for digital signature.',
    basePrice: 299,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['signature', 'digital', 'esign'],
    icon: 'PenLine',
    estimatedTime: '15 seconds'
  },
  {
    id: 'contract_review_prep',
    name: 'Contract Review Prep',
    type: ServiceType.LEGAL,
    description: 'Prepare contracts for legal review with OCR and formatting.',
    basePrice: 1299,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['legal', 'contract', 'review', 'preparation'],
    icon: 'FileSignature',
    estimatedTime: '10 minutes'
  },

  // ==================== NOTARY SERVICES ====================
  {
    id: 'notary_acknowledgment',
    name: 'Notary Acknowledgment',
    type: ServiceType.NOTARY,
    description: 'Remote online notarization for acknowledgments.',
    basePrice: 2499,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['notary', 'acknowledgment', 'remote', 'ron'],
    icon: 'Stamp',
    estimatedTime: '15 minutes',
    requiresExtraFields: ['signer_name', 'document_type']
  },
  {
    id: 'notary_affidavit',
    name: 'Notarized Affidavit',
    type: ServiceType.NOTARY,
    description: 'Remote notarization for sworn affidavits.',
    basePrice: 2999,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['notary', 'affidavit', 'sworn', 'legal'],
    icon: 'FileCheck',
    estimatedTime: '20 minutes',
    requiresExtraFields: ['affiant_name', 'subject_matter']
  },
  {
    id: 'notary_apostille_prep',
    name: 'Apostille Preparation',
    type: ServiceType.NOTARY,
    description: 'Prepare documents for apostille certification.',
    basePrice: 1999,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['notary', 'apostille', 'international', 'certification'],
    icon: 'Globe',
    estimatedTime: '10 minutes',
    requiresExtraFields: ['destination_country', 'document_type']
  },

  // ==================== MEDICAL DOCUMENT SERVICES ====================
  {
    id: 'medical_records_request',
    name: 'Medical Records Request',
    type: ServiceType.MEDICAL,
    description: 'Prepare HIPAA-compliant medical records request forms.',
    basePrice: 999,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['medical', 'hipaa', 'records', 'request'],
    icon: 'ClipboardList',
    estimatedTime: '10 minutes',
    requiresExtraFields: ['patient_name', 'provider_name', 'date_range']
  },
  {
    id: 'medical_authorization',
    name: 'Medical Authorization Form',
    type: ServiceType.MEDICAL,
    description: 'Generate HIPAA authorization forms for records release.',
    basePrice: 799,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['medical', 'hipaa', 'authorization', 'release'],
    icon: 'FileKey',
    estimatedTime: '5 minutes',
    requiresExtraFields: ['patient_name', 'recipient_name']
  },
  {
    id: 'medical_billing_review',
    name: 'Medical Bill Review',
    type: ServiceType.MEDICAL,
    description: 'OCR and organize medical billing statements.',
    basePrice: 599,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['medical', 'billing', 'insurance', 'review'],
    icon: 'DollarSign',
    estimatedTime: '5 minutes'
  },

  // ==================== FINANCIAL DOCUMENT SERVICES ====================
  {
    id: 'tax_document_prep',
    name: 'Tax Document Organization',
    type: ServiceType.FINANCIAL,
    description: 'Organize and prepare tax documents for filing.',
    basePrice: 1499,
    unit: PricingUnit.FLAT,
    enabled: true,
    tags: ['financial', 'tax', 'irs', 'preparation'],
    icon: 'Calculator',
    estimatedTime: '15 minutes'
  },
  {
    id: 'bank_statement_ocr',
    name: 'Bank Statement OCR',
    type: ServiceType.FINANCIAL,
    description: 'Extract transaction data from bank statements.',
    basePrice: 499,
    unit: PricingUnit.PER_FILE,
    enabled: true,
    tags: ['financial', 'bank', 'statement', 'extraction'],
    icon: 'Building',
    estimatedTime: '30 seconds'
  },
  {
    id: 'loan_document_prep',
    name: 'Loan Application Prep',
    type: ServiceType.FINANCIAL,
    description: 'Organize documents for loan applications.',
    basePrice: 1999,
    unit: PricingUnit.FLAT,
    enabled: true,
    tags: ['financial', 'loan', 'mortgage', 'application'],
    icon: 'Home',
    estimatedTime: '20 minutes'
  }
];

// Service type labels for UI
const serviceTypeLabels = {
  [ServiceType.CONVERSION]: 'Document Conversion',
  [ServiceType.OCR]: 'OCR & Text Extraction',
  [ServiceType.FAX]: 'Fax Services',
  [ServiceType.SHREDDING]: 'Secure Shredding',
  [ServiceType.BUNDLE]: 'Service Bundles',
  [ServiceType.GRIEVANCE]: 'Grievance & Complaints',
  [ServiceType.NOTARY]: 'Notary Services',
  [ServiceType.LEGAL]: 'Legal Documents',
  [ServiceType.MEDICAL]: 'Medical Documents',
  [ServiceType.FINANCIAL]: 'Financial Documents'
};

// Helper functions
const getServiceById = (id) => {
  return servicesCatalog.find(s => s.id === id);
};

const getServicesByType = (type) => {
  return servicesCatalog.filter(s => s.type === type && s.enabled);
};

const getServicesByTag = (tag) => {
  return servicesCatalog.filter(s => s.tags.includes(tag) && s.enabled);
};

const searchServices = (query) => {
  const lowerQuery = query.toLowerCase();
  return servicesCatalog.filter(s => 
    s.enabled && (
      s.name.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery) ||
      s.tags.some(t => t.toLowerCase().includes(lowerQuery))
    )
  );
};

const getEnabledServices = () => {
  return servicesCatalog.filter(s => s.enabled);
};

const calculatePrice = (service, quantity = 1) => {
  const basePrice = service.basePrice / 100; // Convert cents to dollars
  
  if (service.type === ServiceType.BUNDLE || service.unit === PricingUnit.FLAT) {
    return basePrice;
  }
  
  return basePrice * quantity;
};

const validateExtraFields = (service, extraFields) => {
  const errors = [];
  const required = service.requiresExtraFields || [];
  
  if (required.length === 0) return errors;
  
  if (!extraFields) {
    return [`Missing required fields: ${required.join(', ')}`];
  }
  
  for (const field of required) {
    if (!extraFields[field] || String(extraFields[field]).trim() === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  return errors;
};

module.exports = {
  servicesCatalog,
  ServiceType,
  PricingUnit,
  serviceTypeLabels,
  getServiceById,
  getServicesByType,
  getServicesByTag,
  searchServices,
  getEnabledServices,
  calculatePrice,
  validateExtraFields
};
