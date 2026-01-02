# services_catalog.py - FileSolved Complete Services Catalog (Backend)

from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from enum import Enum


class ServiceType(str, Enum):
    CONVERSION = "conversion"
    OCR = "ocr"
    FAX = "fax"
    SHREDDING = "shredding"
    BUNDLE = "bundle"
    GRIEVANCE = "grievance"
    NOTARY = "notary"
    LEGAL = "legal"
    MEDICAL = "medical"
    FINANCIAL = "financial"


class PricingUnit(str, Enum):
    PER_FILE = "per_file"
    PER_PAGE = "per_page"
    FLAT = "flat"
    PER_MB = "per_mb"


class FileSolvedService(BaseModel):
    id: str
    name: str
    type: ServiceType
    description: str
    base_price: int  # in cents
    unit: PricingUnit
    enabled: bool = True
    tags: List[str] = []
    includes: Optional[List[str]] = None  # for bundles
    requires_extra_fields: Optional[List[str]] = None
    icon: Optional[str] = None
    estimated_time: Optional[str] = None
    max_file_size: Optional[int] = None  # in MB
    supported_formats: Optional[List[str]] = None


# Complete services catalog
SERVICES_CATALOG: List[Dict[str, Any]] = [
    # ==================== CONVERSION SERVICES ====================
    {
        "id": "pdf_to_word",
        "name": "PDF to Word Conversion",
        "type": "conversion",
        "description": "Convert PDF documents into editable Word files with formatting preserved.",
        "base_price": 299,
        "unit": "per_file",
        "enabled": True,
        "tags": ["pdf", "word", "conversion", "docx"],
        "icon": "FileText",
        "estimated_time": "30 seconds",
        "max_file_size": 50,
        "supported_formats": [".pdf"]
    },
    {
        "id": "word_to_pdf",
        "name": "Word to PDF Conversion",
        "type": "conversion",
        "description": "Convert Word documents to professional PDF format.",
        "base_price": 199,
        "unit": "per_file",
        "enabled": True,
        "tags": ["word", "pdf", "conversion", "docx"],
        "icon": "FileOutput",
        "estimated_time": "20 seconds",
        "max_file_size": 50,
        "supported_formats": [".doc", ".docx"]
    },
    {
        "id": "jpg_to_pdf",
        "name": "Image to PDF Conversion",
        "type": "conversion",
        "description": "Convert JPG, PNG, and other images to PDF documents.",
        "base_price": 149,
        "unit": "per_file",
        "enabled": True,
        "tags": ["image", "jpg", "png", "pdf", "conversion"],
        "icon": "Image",
        "estimated_time": "15 seconds",
        "max_file_size": 25,
        "supported_formats": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"]
    },
    {
        "id": "pdf_to_jpg",
        "name": "PDF to Image Extraction",
        "type": "conversion",
        "description": "Extract pages from PDF files as high-quality images.",
        "base_price": 199,
        "unit": "per_file",
        "enabled": True,
        "tags": ["pdf", "image", "jpg", "extraction"],
        "icon": "Images",
        "estimated_time": "30 seconds",
        "max_file_size": 50,
        "supported_formats": [".pdf"]
    },
    {
        "id": "excel_to_pdf",
        "name": "Excel to PDF Conversion",
        "type": "conversion",
        "description": "Convert Excel spreadsheets to PDF format with formatting intact.",
        "base_price": 249,
        "unit": "per_file",
        "enabled": True,
        "tags": ["excel", "pdf", "spreadsheet", "conversion"],
        "icon": "Table",
        "estimated_time": "25 seconds",
        "max_file_size": 25,
        "supported_formats": [".xls", ".xlsx"]
    },
    {
        "id": "pdf_to_excel",
        "name": "PDF to Excel Conversion",
        "type": "conversion",
        "description": "Extract tables from PDF documents into editable Excel files.",
        "base_price": 399,
        "unit": "per_file",
        "enabled": True,
        "tags": ["pdf", "excel", "table", "extraction"],
        "icon": "TableProperties",
        "estimated_time": "45 seconds",
        "max_file_size": 25,
        "supported_formats": [".pdf"]
    },
    {
        "id": "ppt_to_pdf",
        "name": "PowerPoint to PDF",
        "type": "conversion",
        "description": "Convert PowerPoint presentations to PDF format.",
        "base_price": 249,
        "unit": "per_file",
        "enabled": True,
        "tags": ["powerpoint", "pdf", "presentation", "conversion"],
        "icon": "Presentation",
        "estimated_time": "30 seconds",
        "max_file_size": 100,
        "supported_formats": [".ppt", ".pptx"]
    },
    {
        "id": "pdf_to_ppt",
        "name": "PDF to PowerPoint",
        "type": "conversion",
        "description": "Convert PDF documents to editable PowerPoint slides.",
        "base_price": 449,
        "unit": "per_file",
        "enabled": True,
        "tags": ["pdf", "powerpoint", "presentation", "conversion"],
        "icon": "PresentationChart",
        "estimated_time": "60 seconds",
        "max_file_size": 50,
        "supported_formats": [".pdf"]
    },
    {
        "id": "html_to_pdf",
        "name": "HTML to PDF Conversion",
        "type": "conversion",
        "description": "Convert web pages and HTML files to PDF documents.",
        "base_price": 199,
        "unit": "per_file",
        "enabled": True,
        "tags": ["html", "web", "pdf", "conversion"],
        "icon": "Globe",
        "estimated_time": "20 seconds",
        "max_file_size": 10,
        "supported_formats": [".html", ".htm"]
    },
    {
        "id": "pdf_merge",
        "name": "PDF Merge",
        "type": "conversion",
        "description": "Combine multiple PDF files into a single document.",
        "base_price": 299,
        "unit": "flat",
        "enabled": True,
        "tags": ["pdf", "merge", "combine"],
        "icon": "Layers",
        "estimated_time": "15 seconds",
        "max_file_size": 100,
        "supported_formats": [".pdf"]
    },
    {
        "id": "pdf_split",
        "name": "PDF Split",
        "type": "conversion",
        "description": "Split a PDF into multiple separate documents.",
        "base_price": 249,
        "unit": "per_file",
        "enabled": True,
        "tags": ["pdf", "split", "separate"],
        "icon": "Scissors",
        "estimated_time": "20 seconds",
        "max_file_size": 100,
        "supported_formats": [".pdf"]
    },
    {
        "id": "pdf_compress",
        "name": "PDF Compression",
        "type": "conversion",
        "description": "Reduce PDF file size while maintaining quality.",
        "base_price": 149,
        "unit": "per_file",
        "enabled": True,
        "tags": ["pdf", "compress", "reduce", "optimize"],
        "icon": "Minimize2",
        "estimated_time": "30 seconds",
        "max_file_size": 100,
        "supported_formats": [".pdf"]
    },
    {
        "id": "pdf_rotate",
        "name": "PDF Page Rotation",
        "type": "conversion",
        "description": "Rotate pages in your PDF documents.",
        "base_price": 99,
        "unit": "per_file",
        "enabled": True,
        "tags": ["pdf", "rotate", "orientation"],
        "icon": "RotateCw",
        "estimated_time": "10 seconds",
        "max_file_size": 50,
        "supported_formats": [".pdf"]
    },
    {
        "id": "image_resize",
        "name": "Image Resize",
        "type": "conversion",
        "description": "Resize images to specific dimensions.",
        "base_price": 99,
        "unit": "per_file",
        "enabled": True,
        "tags": ["image", "resize", "dimensions"],
        "icon": "Expand",
        "estimated_time": "10 seconds",
        "max_file_size": 25,
        "supported_formats": [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    },
    {
        "id": "image_compress",
        "name": "Image Compression",
        "type": "conversion",
        "description": "Compress images to reduce file size.",
        "base_price": 99,
        "unit": "per_file",
        "enabled": True,
        "tags": ["image", "compress", "optimize"],
        "icon": "Minimize",
        "estimated_time": "10 seconds",
        "max_file_size": 25,
        "supported_formats": [".jpg", ".jpeg", ".png", ".webp"]
    },

    # ==================== OCR SERVICES ====================
    {
        "id": "ocr_pdf",
        "name": "OCR for Scanned PDFs",
        "type": "ocr",
        "description": "Extract searchable text from scanned PDF documents.",
        "base_price": 399,
        "unit": "per_file",
        "enabled": True,
        "tags": ["ocr", "pdf", "searchable", "text"],
        "icon": "ScanText",
        "estimated_time": "60 seconds",
        "max_file_size": 50,
        "supported_formats": [".pdf"]
    },
    {
        "id": "ocr_image",
        "name": "OCR for Images",
        "type": "ocr",
        "description": "Extract text from images (JPG, PNG, etc.).",
        "base_price": 349,
        "unit": "per_file",
        "enabled": True,
        "tags": ["ocr", "image", "text", "extraction"],
        "icon": "ScanLine",
        "estimated_time": "45 seconds",
        "max_file_size": 25,
        "supported_formats": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"]
    },
    {
        "id": "ocr_handwriting",
        "name": "Handwriting Recognition",
        "type": "ocr",
        "description": "Convert handwritten documents to digital text.",
        "base_price": 599,
        "unit": "per_file",
        "enabled": True,
        "tags": ["ocr", "handwriting", "manuscript"],
        "icon": "PenTool",
        "estimated_time": "90 seconds",
        "max_file_size": 25,
        "supported_formats": [".jpg", ".jpeg", ".png", ".pdf"]
    },
    {
        "id": "ocr_receipt",
        "name": "Receipt OCR",
        "type": "ocr",
        "description": "Extract itemized data from receipts.",
        "base_price": 249,
        "unit": "per_file",
        "enabled": True,
        "tags": ["ocr", "receipt", "expense"],
        "icon": "Receipt",
        "estimated_time": "30 seconds",
        "max_file_size": 10,
        "supported_formats": [".jpg", ".jpeg", ".png", ".pdf"]
    },
    {
        "id": "ocr_invoice",
        "name": "Invoice Data Extraction",
        "type": "ocr",
        "description": "Extract structured data from invoices.",
        "base_price": 399,
        "unit": "per_file",
        "enabled": True,
        "tags": ["ocr", "invoice", "billing", "extraction"],
        "icon": "FileSpreadsheet",
        "estimated_time": "45 seconds",
        "max_file_size": 25,
        "supported_formats": [".pdf", ".jpg", ".png"]
    },
    {
        "id": "ocr_business_card",
        "name": "Business Card Scanner",
        "type": "ocr",
        "description": "Extract contact information from business cards.",
        "base_price": 149,
        "unit": "per_file",
        "enabled": True,
        "tags": ["ocr", "business card", "contact"],
        "icon": "Contact",
        "estimated_time": "15 seconds",
        "max_file_size": 5,
        "supported_formats": [".jpg", ".jpeg", ".png"]
    },
    {
        "id": "document_scan_cleanup",
        "name": "Document Scan Cleanup",
        "type": "ocr",
        "description": "Clean, straighten, and enhance scanned documents.",
        "base_price": 249,
        "unit": "per_file",
        "enabled": True,
        "tags": ["scan", "cleanup", "enhance", "straighten"],
        "icon": "Scan",
        "estimated_time": "30 seconds",
        "max_file_size": 25,
        "supported_formats": [".jpg", ".jpeg", ".png", ".pdf"]
    },

    # ==================== FAX SERVICES ====================
    {
        "id": "fax_domestic",
        "name": "Domestic Fax",
        "type": "fax",
        "description": "Send documents via fax within the United States.",
        "base_price": 499,
        "unit": "per_file",
        "enabled": True,
        "tags": ["fax", "domestic", "us"],
        "icon": "Printer",
        "estimated_time": "2 minutes",
        "max_file_size": 25,
        "supported_formats": [".pdf"],
        "requires_extra_fields": ["fax_number"]
    },
    {
        "id": "fax_international",
        "name": "International Fax",
        "type": "fax",
        "description": "Send documents via fax internationally.",
        "base_price": 999,
        "unit": "per_file",
        "enabled": True,
        "tags": ["fax", "international", "global"],
        "icon": "Globe2",
        "estimated_time": "3 minutes",
        "max_file_size": 25,
        "supported_formats": [".pdf"],
        "requires_extra_fields": ["fax_number", "country_code"]
    },
    {
        "id": "fax_hipaa",
        "name": "HIPAA-Compliant Fax",
        "type": "fax",
        "description": "Secure fax transmission for healthcare documents.",
        "base_price": 799,
        "unit": "per_file",
        "enabled": True,
        "tags": ["fax", "hipaa", "healthcare", "secure"],
        "icon": "ShieldCheck",
        "estimated_time": "2 minutes",
        "max_file_size": 25,
        "supported_formats": [".pdf"],
        "requires_extra_fields": ["fax_number", "recipient_name"]
    },
    {
        "id": "fax_legal",
        "name": "Legal Document Fax",
        "type": "fax",
        "description": "Priority fax service for legal documents with confirmation.",
        "base_price": 699,
        "unit": "per_file",
        "enabled": True,
        "tags": ["fax", "legal", "court", "priority"],
        "icon": "Scale",
        "estimated_time": "2 minutes",
        "max_file_size": 50,
        "supported_formats": [".pdf"],
        "requires_extra_fields": ["fax_number", "case_number"]
    },

    # ==================== SHREDDING SERVICES ====================
    {
        "id": "secure_shred_basic",
        "name": "Secure Document Shredding",
        "type": "shredding",
        "description": "Permanently delete documents with destruction certificate.",
        "base_price": 199,
        "unit": "per_file",
        "enabled": True,
        "tags": ["shred", "delete", "secure", "certificate"],
        "icon": "Trash2",
        "estimated_time": "10 seconds",
        "max_file_size": 100
    },
    {
        "id": "secure_shred_gdpr",
        "name": "GDPR-Compliant Deletion",
        "type": "shredding",
        "description": "Secure deletion meeting GDPR requirements with audit trail.",
        "base_price": 399,
        "unit": "per_file",
        "enabled": True,
        "tags": ["shred", "gdpr", "compliance", "audit"],
        "icon": "ShieldAlert",
        "estimated_time": "15 seconds",
        "max_file_size": 100
    },
    {
        "id": "secure_shred_hipaa",
        "name": "HIPAA-Compliant Deletion",
        "type": "shredding",
        "description": "Healthcare document destruction with compliance certificate.",
        "base_price": 499,
        "unit": "per_file",
        "enabled": True,
        "tags": ["shred", "hipaa", "healthcare", "compliance"],
        "icon": "HeartPulse",
        "estimated_time": "15 seconds",
        "max_file_size": 100
    },

    # ==================== BUNDLE SERVICES ====================
    {
        "id": "emergency_bundle_basic",
        "name": "Emergency Bundle – Basic",
        "type": "bundle",
        "description": "Fast-track processing: OCR + Conversion with priority queue.",
        "base_price": 1499,
        "unit": "flat",
        "enabled": True,
        "tags": ["bundle", "emergency", "priority", "fast"],
        "icon": "Zap",
        "includes": ["pdf_to_word", "ocr_pdf"],
        "estimated_time": "2 minutes"
    },
    {
        "id": "emergency_bundle_pro",
        "name": "Emergency Bundle – Pro",
        "type": "bundle",
        "description": "Complete document processing with OCR, conversion, and cleanup.",
        "base_price": 2999,
        "unit": "flat",
        "enabled": True,
        "tags": ["bundle", "emergency", "premium", "complete"],
        "icon": "Rocket",
        "includes": ["pdf_to_word", "word_to_pdf", "ocr_pdf", "document_scan_cleanup"],
        "estimated_time": "3 minutes"
    },
    {
        "id": "legal_bundle",
        "name": "Legal Document Bundle",
        "type": "bundle",
        "description": "Complete legal document preparation: OCR, conversion, secure storage.",
        "base_price": 3999,
        "unit": "flat",
        "enabled": True,
        "tags": ["bundle", "legal", "court", "complete"],
        "icon": "Gavel",
        "includes": ["ocr_pdf", "pdf_to_word", "pdf_merge", "fax_legal"],
        "estimated_time": "5 minutes"
    },
    {
        "id": "medical_bundle",
        "name": "Medical Records Bundle",
        "type": "bundle",
        "description": "HIPAA-compliant processing for medical documents.",
        "base_price": 4499,
        "unit": "flat",
        "enabled": True,
        "tags": ["bundle", "medical", "hipaa", "healthcare"],
        "icon": "Stethoscope",
        "includes": ["ocr_pdf", "pdf_to_word", "fax_hipaa", "secure_shred_hipaa"],
        "estimated_time": "5 minutes"
    },
    {
        "id": "business_bundle",
        "name": "Business Document Bundle",
        "type": "bundle",
        "description": "Complete business document processing package.",
        "base_price": 2499,
        "unit": "flat",
        "enabled": True,
        "tags": ["bundle", "business", "corporate"],
        "icon": "Briefcase",
        "includes": ["pdf_to_word", "word_to_pdf", "excel_to_pdf", "pdf_merge"],
        "estimated_time": "3 minutes"
    },

    # ==================== GRIEVANCE & LEGAL SERVICES ====================
    {
        "id": "grievance_report",
        "name": "Grievance Report Package",
        "type": "grievance",
        "description": "Structured grievance report preparation and document packaging.",
        "base_price": 1999,
        "unit": "per_file",
        "enabled": True,
        "tags": ["legal", "grievance", "report", "complaint"],
        "icon": "FileWarning",
        "estimated_time": "10 minutes",
        "requires_extra_fields": ["incident_date", "authority_to_submit", "summary"]
    },
    {
        "id": "grievance_union",
        "name": "Union Grievance Filing",
        "type": "grievance",
        "description": "Prepare and format union grievance documents.",
        "base_price": 2499,
        "unit": "per_file",
        "enabled": True,
        "tags": ["legal", "grievance", "union", "labor"],
        "icon": "Users",
        "estimated_time": "15 minutes",
        "requires_extra_fields": ["union_local", "incident_date", "contract_article", "summary"]
    },
    {
        "id": "eeoc_complaint",
        "name": "EEOC Complaint Prep",
        "type": "grievance",
        "description": "Prepare documents for EEOC discrimination complaints.",
        "base_price": 2999,
        "unit": "flat",
        "enabled": True,
        "tags": ["legal", "eeoc", "discrimination", "complaint"],
        "icon": "Scale",
        "estimated_time": "20 minutes",
        "requires_extra_fields": ["incident_date", "discrimination_type", "employer_name", "summary"]
    },
    {
        "id": "foia_request",
        "name": "FOIA Request Prep",
        "type": "legal",
        "description": "Prepare Freedom of Information Act request documents.",
        "base_price": 1499,
        "unit": "flat",
        "enabled": True,
        "tags": ["legal", "foia", "government", "request"],
        "icon": "FileSearch",
        "estimated_time": "10 minutes",
        "requires_extra_fields": ["agency_name", "records_description"]
    },

    # ==================== NOTARY SERVICES ====================
    {
        "id": "notary_acknowledgment",
        "name": "Notary Acknowledgment",
        "type": "notary",
        "description": "Remote online notarization for acknowledgments.",
        "base_price": 2499,
        "unit": "per_file",
        "enabled": True,
        "tags": ["notary", "acknowledgment", "remote", "ron"],
        "icon": "Stamp",
        "estimated_time": "15 minutes",
        "requires_extra_fields": ["signer_name", "document_type"]
    },
    {
        "id": "notary_affidavit",
        "name": "Notarized Affidavit",
        "type": "notary",
        "description": "Remote notarization for sworn affidavits.",
        "base_price": 2999,
        "unit": "per_file",
        "enabled": True,
        "tags": ["notary", "affidavit", "sworn", "legal"],
        "icon": "FileCheck",
        "estimated_time": "20 minutes",
        "requires_extra_fields": ["affiant_name", "subject_matter"]
    },
    {
        "id": "notary_apostille_prep",
        "name": "Apostille Preparation",
        "type": "notary",
        "description": "Prepare documents for apostille certification.",
        "base_price": 1999,
        "unit": "per_file",
        "enabled": True,
        "tags": ["notary", "apostille", "international", "certification"],
        "icon": "Globe",
        "estimated_time": "10 minutes",
        "requires_extra_fields": ["destination_country", "document_type"]
    },

    # ==================== MEDICAL DOCUMENT SERVICES ====================
    {
        "id": "medical_records_request",
        "name": "Medical Records Request",
        "type": "medical",
        "description": "Prepare HIPAA-compliant medical records request forms.",
        "base_price": 999,
        "unit": "per_file",
        "enabled": True,
        "tags": ["medical", "hipaa", "records", "request"],
        "icon": "ClipboardList",
        "estimated_time": "10 minutes",
        "requires_extra_fields": ["patient_name", "provider_name", "date_range"]
    },
    {
        "id": "medical_authorization",
        "name": "Medical Authorization Form",
        "type": "medical",
        "description": "Generate HIPAA authorization forms for records release.",
        "base_price": 799,
        "unit": "per_file",
        "enabled": True,
        "tags": ["medical", "hipaa", "authorization", "release"],
        "icon": "FileKey",
        "estimated_time": "5 minutes",
        "requires_extra_fields": ["patient_name", "recipient_name"]
    },
    {
        "id": "medical_billing_review",
        "name": "Medical Bill Review",
        "type": "medical",
        "description": "OCR and organize medical billing statements.",
        "base_price": 599,
        "unit": "per_file",
        "enabled": True,
        "tags": ["medical", "billing", "insurance", "review"],
        "icon": "DollarSign",
        "estimated_time": "5 minutes"
    },

    # ==================== FINANCIAL DOCUMENT SERVICES ====================
    {
        "id": "tax_document_prep",
        "name": "Tax Document Organization",
        "type": "financial",
        "description": "Organize and prepare tax documents for filing.",
        "base_price": 1499,
        "unit": "flat",
        "enabled": True,
        "tags": ["financial", "tax", "irs", "preparation"],
        "icon": "Calculator",
        "estimated_time": "15 minutes"
    },
    {
        "id": "bank_statement_ocr",
        "name": "Bank Statement OCR",
        "type": "financial",
        "description": "Extract transaction data from bank statements.",
        "base_price": 499,
        "unit": "per_file",
        "enabled": True,
        "tags": ["financial", "bank", "statement", "extraction"],
        "icon": "Building",
        "estimated_time": "30 seconds"
    },
    {
        "id": "loan_document_prep",
        "name": "Loan Application Prep",
        "type": "financial",
        "description": "Organize documents for loan applications.",
        "base_price": 1999,
        "unit": "flat",
        "enabled": True,
        "tags": ["financial", "loan", "mortgage", "application"],
        "icon": "Home",
        "estimated_time": "20 minutes"
    },
    {
        "id": "contract_review_prep",
        "name": "Contract Review Prep",
        "type": "legal",
        "description": "Prepare contracts for legal review with OCR and formatting.",
        "base_price": 1299,
        "unit": "per_file",
        "enabled": True,
        "tags": ["legal", "contract", "review", "preparation"],
        "icon": "FileSignature",
        "estimated_time": "10 minutes"
    },

    # ==================== SPECIALTY SERVICES ====================
    {
        "id": "redaction_basic",
        "name": "Document Redaction",
        "type": "legal",
        "description": "Redact sensitive information from documents.",
        "base_price": 599,
        "unit": "per_page",
        "enabled": True,
        "tags": ["redaction", "privacy", "sensitive", "legal"],
        "icon": "EyeOff",
        "estimated_time": "1 minute per page"
    },
    {
        "id": "redaction_ai",
        "name": "AI-Powered Redaction",
        "type": "legal",
        "description": "Automatic detection and redaction of PII and sensitive data.",
        "base_price": 999,
        "unit": "per_file",
        "enabled": True,
        "tags": ["redaction", "ai", "pii", "automatic"],
        "icon": "BrainCircuit",
        "estimated_time": "2 minutes"
    },
    {
        "id": "translation_prep",
        "name": "Translation Prep",
        "type": "conversion",
        "description": "Prepare documents for professional translation.",
        "base_price": 399,
        "unit": "per_file",
        "enabled": True,
        "tags": ["translation", "language", "preparation"],
        "icon": "Languages",
        "estimated_time": "5 minutes"
    },
    {
        "id": "bates_numbering",
        "name": "Bates Numbering",
        "type": "legal",
        "description": "Apply Bates numbering to legal documents.",
        "base_price": 499,
        "unit": "per_file",
        "enabled": True,
        "tags": ["legal", "bates", "numbering", "discovery"],
        "icon": "Hash",
        "estimated_time": "30 seconds"
    },
    {
        "id": "watermark_add",
        "name": "Add Watermark",
        "type": "conversion",
        "description": "Add text or image watermarks to documents.",
        "base_price": 199,
        "unit": "per_file",
        "enabled": True,
        "tags": ["watermark", "branding", "security"],
        "icon": "Droplet",
        "estimated_time": "20 seconds"
    },
    {
        "id": "watermark_remove",
        "name": "Remove Watermark",
        "type": "conversion",
        "description": "Remove watermarks from documents.",
        "base_price": 499,
        "unit": "per_file",
        "enabled": True,
        "tags": ["watermark", "remove", "clean"],
        "icon": "Eraser",
        "estimated_time": "45 seconds"
    },
    {
        "id": "digital_signature",
        "name": "Digital Signature Prep",
        "type": "legal",
        "description": "Prepare documents for digital signature.",
        "base_price": 299,
        "unit": "per_file",
        "enabled": True,
        "tags": ["signature", "digital", "esign"],
        "icon": "PenLine",
        "estimated_time": "15 seconds"
    },
    {
        "id": "form_fillable",
        "name": "Create Fillable PDF",
        "type": "conversion",
        "description": "Convert static PDFs to fillable forms.",
        "base_price": 799,
        "unit": "per_file",
        "enabled": True,
        "tags": ["form", "fillable", "interactive", "pdf"],
        "icon": "FormInput",
        "estimated_time": "5 minutes"
    },
    {
        "id": "pdf_password_protect",
        "name": "PDF Password Protection",
        "type": "conversion",
        "description": "Add password protection to PDF documents.",
        "base_price": 199,
        "unit": "per_file",
        "enabled": True,
        "tags": ["security", "password", "encrypt", "pdf"],
        "icon": "Lock",
        "estimated_time": "15 seconds"
    },
    {
        "id": "pdf_password_remove",
        "name": "PDF Password Removal",
        "type": "conversion",
        "description": "Remove password from PDFs (requires current password).",
        "base_price": 299,
        "unit": "per_file",
        "enabled": True,
        "tags": ["security", "password", "unlock", "pdf"],
        "icon": "Unlock",
        "estimated_time": "15 seconds"
    }
]


# Helper functions
def get_service_by_id(service_id: str) -> Optional[Dict[str, Any]]:
    """Get a service by its ID"""
    for service in SERVICES_CATALOG:
        if service["id"] == service_id:
            return service
    return None


def get_services_by_type(service_type: str) -> List[Dict[str, Any]]:
    """Get all services of a specific type"""
    return [s for s in SERVICES_CATALOG if s["type"] == service_type and s["enabled"]]


def get_services_by_tag(tag: str) -> List[Dict[str, Any]]:
    """Get all services with a specific tag"""
    return [s for s in SERVICES_CATALOG if tag in s["tags"] and s["enabled"]]


def search_services(query: str) -> List[Dict[str, Any]]:
    """Search services by name, description, or tags"""
    query_lower = query.lower()
    results = []
    for service in SERVICES_CATALOG:
        if not service["enabled"]:
            continue
        if (query_lower in service["name"].lower() or
            query_lower in service["description"].lower() or
            any(query_lower in tag for tag in service["tags"])):
            results.append(service)
    return results


def get_enabled_services() -> List[Dict[str, Any]]:
    """Get all enabled services"""
    return [s for s in SERVICES_CATALOG if s["enabled"]]


def format_price(price_in_cents: int) -> str:
    """Format price from cents to dollars"""
    return f"${price_in_cents / 100:.2f}"


def get_price_in_dollars(service_id: str) -> float:
    """Get service price in dollars"""
    service = get_service_by_id(service_id)
    if service:
        return service["base_price"] / 100
    return 0.0


# Service type labels
SERVICE_TYPE_LABELS = {
    "conversion": "Document Conversion",
    "ocr": "OCR & Text Extraction",
    "fax": "Fax Services",
    "shredding": "Secure Shredding",
    "bundle": "Service Bundles",
    "grievance": "Grievance & Complaints",
    "notary": "Notary Services",
    "legal": "Legal Documents",
    "medical": "Medical Documents",
    "financial": "Financial Documents"
}
