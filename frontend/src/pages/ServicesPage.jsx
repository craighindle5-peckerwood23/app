import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  FileText, FileOutput, Image, Images, ScanText, Scan, Printer, Trash2, 
  ArrowRight, Search, Loader2, Zap, Scale, Users, Shield, Briefcase,
  Calculator, Building, Stamp, ClipboardList, Lock, Hash, PenLine,
  Play, ExternalLink, FileDown
} from "lucide-react";
import { useServices, useServiceTypes, getPriceDisplay, groupServicesByType } from "../hooks/useServices";

// Icon mapping for service icons
const iconMap = {
  FileText, FileOutput, Image, Images, ScanText, Scan, Printer, Trash2,
  Zap, Scale, Users, Shield, Briefcase, Calculator, Building, Stamp,
  ClipboardList, Lock, Hash, PenLine,
  // Add more as needed
};

const getIcon = (iconName) => {
  return iconMap[iconName] || FileText;
};

// "Pairs well with" mapping - complementary tools for each service
const pairsWellWith = {
  // PDF Conversion
  pdf_to_word: ["pdf_merger", "document_summarizer", "pdf_ocr"],
  pdf_to_excel: ["pdf_to_word", "document_summarizer", "invoice_generator"],
  pdf_to_powerpoint: ["pdf_merger", "image_to_pdf", "powerpoint_to_pdf"],
  pdf_to_text: ["document_summarizer", "pdf_ocr", "document_translation"],
  word_to_pdf: ["pdf_merger", "pdf_esign", "grievance_letter_generator"],
  excel_to_pdf: ["pdf_compressor", "invoice_generator", "pdf_merger"],
  powerpoint_to_pdf: ["pdf_merger", "pdf_compressor", "image_to_pdf"],
  image_to_pdf: ["pdf_merger", "image_enhancer", "document_scanner"],
  
  // PDF Tools
  pdf_merger: ["pdf_splitter", "pdf_compressor", "pdf_page_reorder"],
  pdf_splitter: ["pdf_merger", "pdf_page_extractor", "pdf_compressor"],
  pdf_compressor: ["pdf_merger", "image_to_pdf", "email_attachment_prep"],
  pdf_password_protection: ["pdf_redaction", "secure_shredding", "pdf_esign"],
  pdf_unlocker: ["pdf_to_word", "pdf_merger", "pdf_form_filler"],
  pdf_page_reorder: ["pdf_merger", "pdf_splitter", "pdf_page_extractor"],
  pdf_page_extractor: ["pdf_merger", "pdf_splitter", "pdf_compressor"],
  pdf_watermark: ["pdf_esign", "pdf_password_protection", "pdf_merger"],
  pdf_esign: ["pdf_form_filler", "grievance_letter_generator", "contract_template_builder"],
  pdf_form_filler: ["pdf_esign", "legal_form_generator", "pdf_to_word"],
  pdf_redaction: ["pdf_password_protection", "secure_shredding", "pdf_to_word"],
  
  // OCR & Scanning
  pdf_ocr: ["pdf_to_word", "document_summarizer", "document_scanner"],
  document_scanner: ["pdf_merger", "image_to_pdf", "pdf_ocr"],
  bulk_document_scanner: ["pdf_merger", "document_classifier", "document_tagging"],
  image_ocr: ["pdf_ocr", "document_scanner", "handwriting_ocr"],
  handwriting_ocr: ["image_ocr", "document_scanner", "pdf_ocr"],
  
  // Fax
  fax_sending: ["pdf_merger", "word_to_pdf", "grievance_letter_generator"],
  fax_receiving: ["pdf_to_word", "document_scanner", "fax_to_email"],
  fax_to_email: ["fax_receiving", "pdf_merger", "document_scanner"],
  
  // Security
  secure_shredding: ["pdf_redaction", "bulk_shredding", "pdf_password_protection"],
  bulk_shredding: ["secure_shredding", "zip_creator", "pdf_merger"],
  
  // AI Document Tools
  document_translation: ["document_summarizer", "pdf_to_word", "pdf_ocr"],
  document_summarizer: ["document_translation", "pdf_to_text", "audio_transcription"],
  document_classifier: ["document_tagging", "bulk_document_scanner", "pdf_merger"],
  document_tagging: ["document_classifier", "pdf_merger", "document_summarizer"],
  document_comparison: ["pdf_to_word", "document_summarizer", "pdf_redaction"],
  
  // Image Tools
  image_enhancer: ["image_to_pdf", "image_upscaler", "document_scanner"],
  image_background_remover: ["image_enhancer", "image_to_pdf", "image_upscaler"],
  image_upscaler: ["image_enhancer", "image_to_pdf", "image_background_remover"],
  
  // Utilities
  file_converter: ["pdf_merger", "zip_creator", "image_to_pdf"],
  zip_extractor: ["zip_creator", "file_converter", "pdf_merger"],
  zip_creator: ["zip_extractor", "pdf_merger", "bulk_shredding"],
  
  // Transcription
  audio_transcription: ["document_summarizer", "video_transcription", "voice_recorder"],
  video_transcription: ["audio_transcription", "document_summarizer", "voice_recorder"],
  voice_recorder: ["audio_transcription", "pdf_merger", "document_scanner"],
  
  // Legal
  notarization_prep: ["pdf_esign", "legal_form_generator", "pdf_form_filler"],
  legal_form_generator: ["grievance_letter_generator", "contract_template_builder", "pdf_esign"],
  grievance_letter_generator: ["legal_form_generator", "pdf_merger", "fax_sending"],
  emergency_document_bundle: ["pdf_merger", "document_scanner", "pdf_esign"],
  contract_template_builder: ["legal_form_generator", "pdf_esign", "pdf_form_filler"],
  
  // Career
  resume_builder: ["cover_letter_generator", "pdf_to_word", "word_to_pdf"],
  cover_letter_generator: ["resume_builder", "word_to_pdf", "business_letter_generator"],
  
  // Business
  invoice_generator: ["receipt_maker", "pdf_esign", "pdf_merger"],
  receipt_maker: ["invoice_generator", "word_to_pdf", "pdf_merger"],
  business_letter_generator: ["cover_letter_generator", "grievance_letter_generator", "word_to_pdf"]
};

// Short descriptions (10-12 words)
const shortDescriptions = {
  pdf_to_word: "Convert any PDF into an editable Word document with OCR.",
  pdf_to_excel: "Extract tables and data from PDFs into Excel spreadsheets.",
  pdf_to_powerpoint: "Transform PDF files into editable PowerPoint presentations instantly.",
  pdf_to_text: "Pull clean, searchable text from any PDF document.",
  word_to_pdf: "Convert Word documents into secure, shareable PDF files.",
  excel_to_pdf: "Export spreadsheets into polished, print-ready PDF documents.",
  powerpoint_to_pdf: "Turn presentations into high-quality PDFs for easy sharing.",
  image_to_pdf: "Combine multiple images into a single organized PDF file.",
  pdf_merger: "Merge multiple PDFs into one organized, unified document.",
  pdf_splitter: "Split large PDFs into smaller, more manageable files.",
  pdf_compressor: "Reduce PDF file size while maintaining document clarity.",
  pdf_password_protection: "Add encryption and password security to sensitive PDFs.",
  pdf_unlocker: "Remove passwords from PDFs you own or have permission.",
  pdf_page_reorder: "Rearrange, rotate, or delete PDF pages with precision.",
  pdf_page_extractor: "Extract specific pages from a PDF into new file.",
  pdf_watermark: "Add text or image watermarks to protect your PDFs.",
  pdf_esign: "Sign PDFs digitally with legally compliant electronic signatures.",
  pdf_form_filler: "Fill out interactive PDF forms online quickly and easily.",
  pdf_redaction: "Permanently remove sensitive text or data from PDF documents.",
  pdf_ocr: "Convert scanned PDFs into searchable, editable text documents.",
  document_scanner: "Scan documents using your device camera with auto-crop.",
  bulk_document_scanner: "Scan and process large batches of documents at once.",
  image_ocr: "Extract text from images using advanced character recognition.",
  handwriting_ocr: "Convert handwritten notes into digital, editable text files.",
  fax_sending: "Send secure, encrypted faxes directly from your browser.",
  fax_receiving: "Receive faxes online with instant email notifications.",
  fax_to_email: "Automatically forward incoming faxes to your email inbox.",
  secure_shredding: "Permanently destroy digital files with military-grade security.",
  bulk_shredding: "Securely delete large batches of files in one action.",
  document_translation: "Translate documents into 100+ languages with formatting preserved.",
  document_summarizer: "Generate concise AI-powered summaries of long documents.",
  document_classifier: "Automatically categorize documents into predefined types instantly.",
  document_tagging: "Add smart metadata tags for easy document organization.",
  document_comparison: "Compare two documents and highlight all the differences.",
  image_enhancer: "Improve clarity, brightness, and readability of scanned images.",
  image_background_remover: "Remove backgrounds from images automatically using AI.",
  image_upscaler: "Increase image resolution using AI super-resolution technology.",
  file_converter: "Convert between dozens of file formats instantly online.",
  zip_extractor: "Extract ZIP, RAR, and 7z archives online instantly.",
  zip_creator: "Compress files into ZIP archives for easy sharing.",
  audio_transcription: "Convert audio recordings into accurate text transcripts.",
  video_transcription: "Extract spoken content from videos into text documents.",
  voice_recorder: "Record audio directly in your browser and save securely.",
  notarization_prep: "Prepare documents for online notarization with guided steps.",
  legal_form_generator: "Generate common legal forms with AI-powered assistance.",
  grievance_letter_generator: "Create structured, professional grievance letters automatically.",
  emergency_document_bundle: "Generate a complete emergency-ready document pack instantly.",
  resume_builder: "Create polished, ATS-optimized resumes with AI assistance.",
  cover_letter_generator: "Produce tailored cover letters for any job application.",
  invoice_generator: "Create professional invoices with automatic calculations included.",
  receipt_maker: "Generate clean, printable receipts for business use.",
  business_letter_generator: "Produce formal business letters with correct formatting.",
  contract_template_builder: "Generate customizable contract templates for common agreements."
};

// Get service name by ID
const getServiceNameById = (id) => {
  const names = {
    pdf_to_word: "PDF to Word",
    pdf_to_excel: "PDF to Excel", 
    pdf_to_powerpoint: "PDF to PowerPoint",
    pdf_to_text: "PDF to Text",
    word_to_pdf: "Word to PDF",
    excel_to_pdf: "Excel to PDF",
    powerpoint_to_pdf: "PowerPoint to PDF",
    image_to_pdf: "Image to PDF",
    pdf_merger: "PDF Merger",
    pdf_splitter: "PDF Splitter",
    pdf_compressor: "PDF Compressor",
    pdf_password_protection: "PDF Protection",
    pdf_unlocker: "PDF Unlocker",
    pdf_page_reorder: "Page Reorder",
    pdf_page_extractor: "Page Extractor",
    pdf_watermark: "Watermark Tool",
    pdf_esign: "eSign Tool",
    pdf_form_filler: "Form Filler",
    pdf_redaction: "Redaction Tool",
    pdf_ocr: "PDF OCR",
    document_scanner: "Doc Scanner",
    bulk_document_scanner: "Bulk Scanner",
    image_ocr: "Image OCR",
    handwriting_ocr: "Handwriting OCR",
    fax_sending: "Send Fax",
    fax_receiving: "Receive Fax",
    fax_to_email: "Fax to Email",
    secure_shredding: "Secure Shred",
    bulk_shredding: "Bulk Shred",
    document_translation: "Translation",
    document_summarizer: "Summarizer",
    document_classifier: "Classifier",
    document_tagging: "Auto Tagging",
    document_comparison: "Doc Compare",
    image_enhancer: "Image Enhance",
    image_background_remover: "BG Remover",
    image_upscaler: "Upscaler",
    file_converter: "File Converter",
    zip_extractor: "ZIP Extract",
    zip_creator: "ZIP Creator",
    audio_transcription: "Audio to Text",
    video_transcription: "Video to Text",
    voice_recorder: "Voice Recorder",
    notarization_prep: "Notary Prep",
    legal_form_generator: "Legal Forms",
    grievance_letter_generator: "Grievance Letter",
    emergency_document_bundle: "Emergency Bundle",
    resume_builder: "Resume Builder",
    cover_letter_generator: "Cover Letter",
    invoice_generator: "Invoice Maker",
    receipt_maker: "Receipt Maker",
    business_letter_generator: "Business Letter",
    contract_template_builder: "Contract Builder"
  };
  return names[id] || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'all');
  
  const { services, loading, error } = useServices(
    activeType !== 'all' ? { type: activeType } : 
    searchQuery ? { search: searchQuery } : {}
  );
  const { types: serviceTypes } = useServiceTypes();

  // Group services by type for display
  const groupedServices = groupServicesByType(services, serviceTypes);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
      setActiveType('all');
    } else {
      setSearchParams({});
    }
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    setSearchQuery('');
    if (type !== 'all') {
      setSearchParams({ type });
    } else {
      setSearchParams({});
    }
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "FileSolved Document Services",
    "description": "Professional document processing services",
    "numberOfItems": services.length,
    "itemListElement": services.slice(0, 20).map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service.name,
        "description": service.description,
        "offers": {
          "@type": "Offer",
          "price": service.price,
          "priceCurrency": "USD"
        }
      }
    }))
  };

  return (
    <Layout 
      title="Document Processing Services" 
      description="Explore FileSolved's 50+ professional document services: PDF conversion, OCR, faxing, legal documents, grievance reports, and more."
      schema={servicesSchema}
    >
      {/* Header */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Document Services
              </h1>
              <p className="mt-2 text-lg text-slate-600">
                {services.length}+ professional services. Pay only for what you use.
              </p>
            </div>
            
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="services-search"
                />
              </div>
              <Button type="submit" className="btn-primary">Search</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Service Type Tabs */}
      <section className="border-b border-slate-200 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeType} onValueChange={handleTypeChange}>
            <TabsList className="h-auto flex-wrap justify-start bg-transparent border-0 p-0">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-3"
              >
                All Services
              </TabsTrigger>
              {Object.entries(serviceTypes).map(([type, label]) => (
                <TabsTrigger 
                  key={type}
                  value={type}
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-4 py-3"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600">
              Failed to load services. Please try again.
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No services found matching your criteria.
            </div>
          ) : activeType === 'all' ? (
            // Show grouped by type
            Object.entries(groupedServices).map(([type, group]) => (
              <div key={type} className="mb-12" data-testid={`service-group-${type}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">{group.label}</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleTypeChange(type)}
                    className="text-blue-600"
                  >
                    View all <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.services.slice(0, 4).map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Show flat list for specific type
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} detailed />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Bundles */}
      {activeType === 'all' && (
        <section className="py-12 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Emergency & Bundle Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services
                .filter(s => s.type === 'bundle')
                .slice(0, 3)
                .map(bundle => (
                  <Link 
                    key={bundle.id}
                    to={`/services/${bundle.id}`}
                    className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors"
                    data-testid={`bundle-card-${bundle.id}`}
                  >
                    <Zap className="w-8 h-8 text-yellow-400 mb-4" />
                    <h3 className="font-semibold text-lg">{bundle.name}</h3>
                    <p className="text-slate-400 text-sm mt-2">{bundle.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-yellow-400">
                        ${bundle.price.toFixed(2)}
                      </span>
                      <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                        Bundle
                      </Badge>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Teaser */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Have Questions?</h2>
          <p className="mt-2 text-slate-600">Check out our FAQ or contact support.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/faq">
              <Button variant="outline" className="btn-secondary">View FAQ</Button>
            </Link>
            <Link to="/contact">
              <Button className="btn-primary">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

// Service Card Component
const ServiceCard = ({ service, detailed = false }) => {
  const IconComponent = getIcon(service.icon);
  const isBundle = service.type === 'bundle';
  const isGrievance = service.type === 'grievance';
  const isLegal = service.type === 'legal' || service.type === 'notary';

  return (
    <Link 
      to={`/services/${service.id}`}
      className={`card-base p-5 card-hover group ${detailed ? 'p-6' : ''}`}
      data-testid={`service-card-${service.id}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
          isBundle ? 'bg-yellow-100 group-hover:bg-yellow-200' :
          isGrievance ? 'bg-red-100 group-hover:bg-red-200' :
          isLegal ? 'bg-purple-100 group-hover:bg-purple-200' :
          'bg-slate-100 group-hover:bg-blue-100'
        }`}>
          <IconComponent className={`w-5 h-5 ${
            isBundle ? 'text-yellow-600' :
            isGrievance ? 'text-red-600' :
            isLegal ? 'text-purple-600' :
            'text-slate-600 group-hover:text-blue-600'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 truncate">{service.name}</h3>
            {isBundle && <Badge className="bg-yellow-100 text-yellow-800 flex-shrink-0">Bundle</Badge>}
            {isGrievance && <Badge className="bg-red-100 text-red-800 flex-shrink-0">Legal</Badge>}
          </div>
          {detailed && (
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{service.description}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-blue-600 font-semibold">{getPriceDisplay(service)}</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          {detailed && service.estimated_time && (
            <p className="text-xs text-slate-400 mt-2">Est. time: {service.estimated_time}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ServicesPage;
