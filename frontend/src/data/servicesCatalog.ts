// servicesCatalog.ts - FileSolved Services Catalog (Synced with Backend)
// This file is synced with /app/backend/src/config/servicesCatalog.js

export type ServiceType = 
  | 'conversion' 
  | 'pdf_tools' 
  | 'ocr' 
  | 'fax' 
  | 'security' 
  | 'ai' 
  | 'image' 
  | 'utility' 
  | 'transcription' 
  | 'legal' 
  | 'career' 
  | 'business' 
  | 'bundle';

export interface FileSolvedService {
  id: string;
  name: string;
  description: string;
  type: ServiceType;
  basePrice: number; // in cents
  unit: string;
  maxFileSize: number | null;
  supportedFormats: string[] | null;
  outputFormat: string | null;
  enabled: boolean;
  popular: boolean;
  processingTime: string;
}

export const servicesCatalog: FileSolvedService[] = [
  // ===== PDF CONVERSION SERVICES =====
  {
    id: "pdf_to_word",
    name: "PDF to Word Converter",
    description: "Convert any PDF into an editable Word document with high-accuracy OCR and formatting preservation.",
    type: "conversion",
    basePrice: 299,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf"],
    outputFormat: ".docx",
    enabled: true,
    popular: true,
    processingTime: "1-3 minutes"
  },
  {
    id: "pdf_to_excel",
    name: "PDF to Excel Converter",
    description: "Extract tables and data from PDFs into clean, structured Excel spreadsheets instantly.",
    type: "conversion",
    basePrice: 349,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf"],
    outputFormat: ".xlsx",
    enabled: true,
    popular: true,
    processingTime: "1-3 minutes"
  },
  {
    id: "pdf_to_powerpoint",
    name: "PDF to PowerPoint Converter",
    description: "Transform PDFs into fully editable PowerPoint slides with layout retention.",
    type: "conversion",
    basePrice: 349,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf"],
    outputFormat: ".pptx",
    enabled: true,
    popular: false,
    processingTime: "2-4 minutes"
  },
  {
    id: "pdf_to_text",
    name: "PDF to Text Converter",
    description: "Pull clean, selectable text from any PDF using advanced OCR.",
    type: "conversion",
    basePrice: 199,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf"],
    outputFormat: ".txt",
    enabled: true,
    popular: false,
    processingTime: "1-2 minutes"
  },
  {
    id: "word_to_pdf",
    name: "Word to PDF Converter",
    description: "Convert Word documents into secure, shareable PDFs with perfect formatting.",
    type: "conversion",
    basePrice: 199,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".doc", ".docx"],
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "1-2 minutes"
  },
  {
    id: "excel_to_pdf",
    name: "Excel to PDF Converter",
    description: "Export spreadsheets into polished, print-ready PDF files.",
    type: "conversion",
    basePrice: 249,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".xls", ".xlsx"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "1-2 minutes"
  },
  {
    id: "powerpoint_to_pdf",
    name: "PowerPoint to PDF Converter",
    description: "Turn presentations into high-quality PDFs for easy sharing.",
    type: "conversion",
    basePrice: 249,
    unit: "file",
    maxFileSize: 100,
    supportedFormats: [".ppt", ".pptx"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "1-3 minutes"
  },
  {
    id: "image_to_pdf",
    name: "Image to PDF Converter",
    description: "Combine images into a single, clean PDF with auto-alignment.",
    type: "conversion",
    basePrice: 199,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"],
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "1-2 minutes"
  },

  // ===== PDF TOOLS =====
  {
    id: "pdf_merger",
    name: "PDF Merger",
    description: "Merge multiple PDFs into one organized document.",
    type: "pdf_tools",
    basePrice: 299,
    unit: "batch",
    maxFileSize: 100,
    supportedFormats: [".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "1-3 minutes"
  },
  {
    id: "pdf_splitter",
    name: "PDF Splitter",
    description: "Split large PDFs into smaller, more manageable files.",
    type: "pdf_tools",
    basePrice: 249,
    unit: "file",
    maxFileSize: 100,
    supportedFormats: [".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "1-2 minutes"
  },
  {
    id: "pdf_compressor",
    name: "PDF Compressor",
    description: "Reduce PDF file size while maintaining clarity.",
    type: "pdf_tools",
    basePrice: 199,
    unit: "file",
    maxFileSize: 100,
    supportedFormats: [".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "1-2 minutes"
  },
  {
    id: "pdf_password_protection",
    name: "PDF Password Protection",
    description: "Add encryption and password security to sensitive PDFs.",
    type: "pdf_tools",
    basePrice: 299,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "1 minute"
  },
  {
    id: "pdf_unlocker",
    name: "PDF Unlocker",
    description: "Remove passwords from PDFs you own or have permission to modify.",
    type: "pdf_tools",
    basePrice: 349,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "1 minute"
  },
  {
    id: "pdf_page_reorder",
    name: "PDF Page Reorder",
    description: "Rearrange, rotate, or delete PDF pages with precision.",
    type: "pdf_tools",
    basePrice: 249,
    unit: "file",
    maxFileSize: 100,
    supportedFormats: [".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "1-2 minutes"
  },
  {
    id: "pdf_page_extractor",
    name: "PDF Page Extractor",
    description: "Extract specific pages from a PDF into a new file.",
    type: "pdf_tools",
    basePrice: 199,
    unit: "file",
    maxFileSize: 100,
    supportedFormats: [".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "1 minute"
  },
  {
    id: "pdf_watermark",
    name: "PDF Watermark Tool",
    description: "Add text or image watermarks to PDFs for branding or security.",
    type: "pdf_tools",
    basePrice: 299,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "1-2 minutes"
  },
  {
    id: "pdf_esign",
    name: "PDF eSign Tool",
    description: "Sign PDFs digitally with legally compliant signatures.",
    type: "pdf_tools",
    basePrice: 399,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "1 minute"
  },
  {
    id: "pdf_form_filler",
    name: "PDF Form Filler",
    description: "Fill out interactive PDF forms online with ease.",
    type: "pdf_tools",
    basePrice: 299,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "1-2 minutes"
  },
  {
    id: "pdf_redaction",
    name: "PDF Redaction Tool",
    description: "Permanently remove sensitive text or data from PDFs.",
    type: "pdf_tools",
    basePrice: 399,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "2-3 minutes"
  },

  // ===== OCR SERVICES =====
  {
    id: "pdf_ocr",
    name: "PDF OCR Tool",
    description: "Convert scanned PDFs into searchable, editable text.",
    type: "ocr",
    basePrice: 349,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "2-5 minutes"
  },
  {
    id: "document_scanner",
    name: "Document Scanner",
    description: "Scan documents using your device camera with auto-crop and cleanup.",
    type: "ocr",
    basePrice: 199,
    unit: "scan",
    maxFileSize: 25,
    supportedFormats: [".jpg", ".jpeg", ".png"],
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "1 minute"
  },
  {
    id: "bulk_document_scanner",
    name: "Bulk Document Scanner",
    description: "Scan and process large batches of documents at once.",
    type: "ocr",
    basePrice: 999,
    unit: "batch",
    maxFileSize: 100,
    supportedFormats: [".jpg", ".jpeg", ".png", ".pdf"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "5-10 minutes"
  },
  {
    id: "image_ocr",
    name: "Image OCR",
    description: "Extract text from images using advanced optical character recognition.",
    type: "ocr",
    basePrice: 249,
    unit: "file",
    maxFileSize: 25,
    supportedFormats: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"],
    outputFormat: ".txt",
    enabled: true,
    popular: true,
    processingTime: "1-2 minutes"
  },
  {
    id: "handwriting_ocr",
    name: "Handwriting OCR",
    description: "Convert handwritten notes into digital, editable text.",
    type: "ocr",
    basePrice: 449,
    unit: "file",
    maxFileSize: 25,
    supportedFormats: [".jpg", ".jpeg", ".png", ".pdf"],
    outputFormat: ".txt",
    enabled: true,
    popular: false,
    processingTime: "2-4 minutes"
  },

  // ===== FAX SERVICES =====
  {
    id: "fax_sending",
    name: "Fax Sending Tool",
    description: "Send secure, encrypted faxes directly from your browser.",
    type: "fax",
    basePrice: 299,
    unit: "page",
    maxFileSize: 25,
    supportedFormats: [".pdf", ".doc", ".docx", ".jpg", ".png"],
    outputFormat: "fax",
    enabled: true,
    popular: true,
    processingTime: "2-5 minutes"
  },
  {
    id: "fax_receiving",
    name: "Fax Receiving Tool",
    description: "Receive faxes online with instant notifications.",
    type: "fax",
    basePrice: 499,
    unit: "month",
    maxFileSize: 50,
    supportedFormats: ["fax"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "Instant"
  },
  {
    id: "fax_to_email",
    name: "Fax to Email",
    description: "Automatically forward incoming faxes to your email inbox.",
    type: "fax",
    basePrice: 599,
    unit: "month",
    maxFileSize: 50,
    supportedFormats: ["fax"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "Instant"
  },

  // ===== SECURITY & SHREDDING =====
  {
    id: "secure_shredding",
    name: "Secure Document Shredding",
    description: "Permanently destroy digital files with military-grade wiping.",
    type: "security",
    basePrice: 199,
    unit: "file",
    maxFileSize: 100,
    supportedFormats: ["*"],
    outputFormat: null,
    enabled: true,
    popular: false,
    processingTime: "1 minute"
  },
  {
    id: "bulk_shredding",
    name: "Bulk File Shredding",
    description: "Securely delete large batches of files in one action.",
    type: "security",
    basePrice: 499,
    unit: "batch",
    maxFileSize: 500,
    supportedFormats: ["*"],
    outputFormat: null,
    enabled: true,
    popular: false,
    processingTime: "2-5 minutes"
  },

  // ===== AI DOCUMENT SERVICES =====
  {
    id: "document_translation",
    name: "Document Translation",
    description: "Translate documents into 100+ languages with formatting retention.",
    type: "ai",
    basePrice: 499,
    unit: "page",
    maxFileSize: 50,
    supportedFormats: [".pdf", ".doc", ".docx", ".txt"],
    outputFormat: "same",
    enabled: true,
    popular: true,
    processingTime: "2-5 minutes"
  },
  {
    id: "document_summarizer",
    name: "Document Summarizer",
    description: "Generate concise summaries of long documents using AI.",
    type: "ai",
    basePrice: 349,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf", ".doc", ".docx", ".txt"],
    outputFormat: ".txt",
    enabled: true,
    popular: true,
    processingTime: "1-3 minutes"
  },
  {
    id: "document_classifier",
    name: "Document Classifier",
    description: "Automatically categorize documents into predefined types.",
    type: "ai",
    basePrice: 299,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf", ".doc", ".docx", ".txt", ".jpg", ".png"],
    outputFormat: "json",
    enabled: true,
    popular: false,
    processingTime: "1-2 minutes"
  },
  {
    id: "document_tagging",
    name: "Document Tagging",
    description: "Add smart metadata tags to documents for easy organization.",
    type: "ai",
    basePrice: 249,
    unit: "file",
    maxFileSize: 50,
    supportedFormats: [".pdf", ".doc", ".docx", ".txt"],
    outputFormat: "json",
    enabled: true,
    popular: false,
    processingTime: "1-2 minutes"
  },
  {
    id: "document_comparison",
    name: "Document Comparison Tool",
    description: "Compare two documents and highlight differences.",
    type: "ai",
    basePrice: 399,
    unit: "comparison",
    maxFileSize: 50,
    supportedFormats: [".pdf", ".doc", ".docx", ".txt"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "2-4 minutes"
  },

  // ===== IMAGE TOOLS =====
  {
    id: "image_enhancer",
    name: "Image Enhancer",
    description: "Improve clarity, brightness, and readability of scanned images.",
    type: "image",
    basePrice: 199,
    unit: "file",
    maxFileSize: 25,
    supportedFormats: [".jpg", ".jpeg", ".png", ".bmp", ".tiff"],
    outputFormat: "same",
    enabled: true,
    popular: true,
    processingTime: "1-2 minutes"
  },
  {
    id: "image_background_remover",
    name: "Image Background Remover",
    description: "Remove backgrounds from images automatically.",
    type: "image",
    basePrice: 249,
    unit: "file",
    maxFileSize: 25,
    supportedFormats: [".jpg", ".jpeg", ".png"],
    outputFormat: ".png",
    enabled: true,
    popular: true,
    processingTime: "1-2 minutes"
  },
  {
    id: "image_upscaler",
    name: "Image Upscaler",
    description: "Increase image resolution using AI super-resolution.",
    type: "image",
    basePrice: 349,
    unit: "file",
    maxFileSize: 25,
    supportedFormats: [".jpg", ".jpeg", ".png"],
    outputFormat: "same",
    enabled: true,
    popular: false,
    processingTime: "2-4 minutes"
  },

  // ===== FILE UTILITIES =====
  {
    id: "file_converter",
    name: "File Converter (Universal)",
    description: "Convert between dozens of file formats instantly.",
    type: "utility",
    basePrice: 249,
    unit: "file",
    maxFileSize: 100,
    supportedFormats: ["*"],
    outputFormat: "variable",
    enabled: true,
    popular: true,
    processingTime: "1-3 minutes"
  },
  {
    id: "zip_extractor",
    name: "ZIP Extractor",
    description: "Extract ZIP, RAR, and 7z archives online.",
    type: "utility",
    basePrice: 149,
    unit: "file",
    maxFileSize: 200,
    supportedFormats: [".zip", ".rar", ".7z"],
    outputFormat: "folder",
    enabled: true,
    popular: false,
    processingTime: "1-2 minutes"
  },
  {
    id: "zip_creator",
    name: "ZIP Creator",
    description: "Compress files into ZIP archives for easy sharing.",
    type: "utility",
    basePrice: 149,
    unit: "batch",
    maxFileSize: 200,
    supportedFormats: ["*"],
    outputFormat: ".zip",
    enabled: true,
    popular: false,
    processingTime: "1-2 minutes"
  },

  // ===== AUDIO & VIDEO =====
  {
    id: "audio_transcription",
    name: "Audio to Text Transcription",
    description: "Convert audio recordings into accurate text transcripts.",
    type: "transcription",
    basePrice: 499,
    unit: "minute",
    maxFileSize: 500,
    supportedFormats: [".mp3", ".wav", ".m4a", ".ogg", ".flac"],
    outputFormat: ".txt",
    enabled: true,
    popular: true,
    processingTime: "5-15 minutes"
  },
  {
    id: "video_transcription",
    name: "Video to Text Transcription",
    description: "Extract spoken content from videos into text.",
    type: "transcription",
    basePrice: 599,
    unit: "minute",
    maxFileSize: 1000,
    supportedFormats: [".mp4", ".mov", ".avi", ".mkv", ".webm"],
    outputFormat: ".txt",
    enabled: true,
    popular: false,
    processingTime: "10-30 minutes"
  },
  {
    id: "voice_recorder",
    name: "Voice Recorder",
    description: "Record audio directly in your browser and save it securely.",
    type: "transcription",
    basePrice: 99,
    unit: "recording",
    maxFileSize: 100,
    supportedFormats: ["audio"],
    outputFormat: ".mp3",
    enabled: true,
    popular: false,
    processingTime: "Instant"
  },

  // ===== LEGAL & BUSINESS DOCUMENTS =====
  {
    id: "notarization_prep",
    name: "Notarization Prep Tool",
    description: "Prepare documents for online notarization with guided steps.",
    type: "legal",
    basePrice: 599,
    unit: "document",
    maxFileSize: 50,
    supportedFormats: [".pdf", ".doc", ".docx"],
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "5-10 minutes"
  },
  {
    id: "legal_form_generator",
    name: "Legal Form Generator",
    description: "Generate common legal forms with AI assistance.",
    type: "legal",
    basePrice: 799,
    unit: "form",
    maxFileSize: null,
    supportedFormats: null,
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "2-5 minutes"
  },
  {
    id: "grievance_letter_generator",
    name: "Grievance Letter Generator",
    description: "Create structured, professional grievance letters automatically.",
    type: "legal",
    basePrice: 499,
    unit: "letter",
    maxFileSize: null,
    supportedFormats: null,
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "2-3 minutes"
  },
  {
    id: "emergency_document_bundle",
    name: "Emergency Document Bundle",
    description: "Generate a complete emergency-ready document pack (ID, medical, legal).",
    type: "bundle",
    basePrice: 1999,
    unit: "bundle",
    maxFileSize: null,
    supportedFormats: null,
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "10-15 minutes"
  },

  // ===== CAREER DOCUMENTS =====
  {
    id: "resume_builder",
    name: "Resume Builder",
    description: "Create polished, ATS-optimized resumes with AI.",
    type: "career",
    basePrice: 699,
    unit: "resume",
    maxFileSize: null,
    supportedFormats: null,
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "5-10 minutes"
  },
  {
    id: "cover_letter_generator",
    name: "Cover Letter Generator",
    description: "Produce tailored cover letters for any job application.",
    type: "career",
    basePrice: 399,
    unit: "letter",
    maxFileSize: null,
    supportedFormats: null,
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "2-5 minutes"
  },

  // ===== BUSINESS DOCUMENTS =====
  {
    id: "invoice_generator",
    name: "Invoice Generator",
    description: "Create professional invoices with automatic calculations.",
    type: "business",
    basePrice: 299,
    unit: "invoice",
    maxFileSize: null,
    supportedFormats: null,
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "1-2 minutes"
  },
  {
    id: "receipt_maker",
    name: "Receipt Maker",
    description: "Generate clean, printable receipts for business or personal use.",
    type: "business",
    basePrice: 199,
    unit: "receipt",
    maxFileSize: null,
    supportedFormats: null,
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "1 minute"
  },
  {
    id: "business_letter_generator",
    name: "Business Letter Generator",
    description: "Produce formal business letters with correct formatting.",
    type: "business",
    basePrice: 299,
    unit: "letter",
    maxFileSize: null,
    supportedFormats: null,
    outputFormat: ".pdf",
    enabled: true,
    popular: false,
    processingTime: "2-3 minutes"
  },
  {
    id: "contract_template_builder",
    name: "Contract Template Builder",
    description: "Generate customizable contract templates for common agreements.",
    type: "legal",
    basePrice: 899,
    unit: "contract",
    maxFileSize: null,
    supportedFormats: null,
    outputFormat: ".pdf",
    enabled: true,
    popular: true,
    processingTime: "5-10 minutes"
  }
];

// Service type labels
export const serviceTypes: Record<ServiceType, string> = {
  conversion: "Document Conversion",
  pdf_tools: "PDF Tools",
  ocr: "OCR & Scanning",
  fax: "Fax Services",
  security: "Security & Privacy",
  ai: "AI Document Services",
  image: "Image Tools",
  utility: "File Utilities",
  transcription: "Audio & Video",
  legal: "Legal Documents",
  career: "Career Documents",
  business: "Business Documents",
  bundle: "Document Bundles"
};

// Helper functions
export const getServiceById = (id: string): FileSolvedService | undefined => {
  return servicesCatalog.find(s => s.id === id);
};

export const getServicesByType = (type: ServiceType): FileSolvedService[] => {
  return servicesCatalog.filter(s => s.type === type && s.enabled);
};

export const getPopularServices = (): FileSolvedService[] => {
  return servicesCatalog.filter(s => s.popular && s.enabled);
};

export const getEnabledServices = (): FileSolvedService[] => {
  return servicesCatalog.filter(s => s.enabled);
};

export const formatPrice = (priceInCents: number): string => {
  return `$${(priceInCents / 100).toFixed(2)}`;
};

export const searchServices = (query: string): FileSolvedService[] => {
  const lowerQuery = query.toLowerCase();
  return servicesCatalog.filter(s =>
    s.enabled && (
      s.name.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery) ||
      s.type.toLowerCase().includes(lowerQuery)
    )
  );
};

export default servicesCatalog;
