import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { 
  ArrowLeft, ArrowRight, FileText, Clock, DollarSign, 
  CheckCircle, HelpCircle, Zap, Shield, Play, ExternalLink,
  Loader2, Star
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// "Pairs well with" mapping
const pairsWellWith = {
  pdf_to_word: ["pdf_merger", "document_summarizer", "pdf_ocr"],
  pdf_to_excel: ["pdf_to_word", "document_summarizer", "invoice_generator"],
  pdf_to_powerpoint: ["pdf_merger", "image_to_pdf", "powerpoint_to_pdf"],
  pdf_to_text: ["document_summarizer", "pdf_ocr", "document_translation"],
  word_to_pdf: ["pdf_merger", "pdf_esign", "grievance_letter_generator"],
  excel_to_pdf: ["pdf_compressor", "invoice_generator", "pdf_merger"],
  powerpoint_to_pdf: ["pdf_merger", "pdf_compressor", "image_to_pdf"],
  image_to_pdf: ["pdf_merger", "image_enhancer", "document_scanner"],
  pdf_merger: ["pdf_splitter", "pdf_compressor", "pdf_page_reorder"],
  pdf_splitter: ["pdf_merger", "pdf_page_extractor", "pdf_compressor"],
  pdf_compressor: ["pdf_merger", "image_to_pdf", "pdf_splitter"],
  pdf_password_protection: ["pdf_redaction", "secure_shredding", "pdf_esign"],
  pdf_unlocker: ["pdf_to_word", "pdf_merger", "pdf_form_filler"],
  pdf_page_reorder: ["pdf_merger", "pdf_splitter", "pdf_page_extractor"],
  pdf_page_extractor: ["pdf_merger", "pdf_splitter", "pdf_compressor"],
  pdf_watermark: ["pdf_esign", "pdf_password_protection", "pdf_merger"],
  pdf_esign: ["pdf_form_filler", "grievance_letter_generator", "contract_template_builder"],
  pdf_form_filler: ["pdf_esign", "legal_form_generator", "pdf_to_word"],
  pdf_redaction: ["pdf_password_protection", "secure_shredding", "pdf_to_word"],
  pdf_ocr: ["pdf_to_word", "document_summarizer", "document_scanner"],
  document_scanner: ["pdf_merger", "image_to_pdf", "pdf_ocr"],
  bulk_document_scanner: ["pdf_merger", "document_classifier", "document_tagging"],
  image_ocr: ["pdf_ocr", "document_scanner", "handwriting_ocr"],
  handwriting_ocr: ["image_ocr", "document_scanner", "pdf_ocr"],
  fax_sending: ["pdf_merger", "word_to_pdf", "grievance_letter_generator"],
  fax_receiving: ["pdf_to_word", "document_scanner", "fax_to_email"],
  fax_to_email: ["fax_receiving", "pdf_merger", "document_scanner"],
  secure_shredding: ["pdf_redaction", "bulk_shredding", "pdf_password_protection"],
  bulk_shredding: ["secure_shredding", "zip_creator", "pdf_merger"],
  document_translation: ["document_summarizer", "pdf_to_word", "pdf_ocr"],
  document_summarizer: ["document_translation", "pdf_to_text", "audio_transcription"],
  document_classifier: ["document_tagging", "bulk_document_scanner", "pdf_merger"],
  document_tagging: ["document_classifier", "pdf_merger", "document_summarizer"],
  document_comparison: ["pdf_to_word", "document_summarizer", "pdf_redaction"],
  image_enhancer: ["image_to_pdf", "image_upscaler", "document_scanner"],
  image_background_remover: ["image_enhancer", "image_to_pdf", "image_upscaler"],
  image_upscaler: ["image_enhancer", "image_to_pdf", "image_background_remover"],
  file_converter: ["pdf_merger", "zip_creator", "image_to_pdf"],
  zip_extractor: ["zip_creator", "file_converter", "pdf_merger"],
  zip_creator: ["zip_extractor", "pdf_merger", "bulk_shredding"],
  audio_transcription: ["document_summarizer", "video_transcription", "voice_recorder"],
  video_transcription: ["audio_transcription", "document_summarizer", "voice_recorder"],
  voice_recorder: ["audio_transcription", "pdf_merger", "document_scanner"],
  notarization_prep: ["pdf_esign", "legal_form_generator", "pdf_form_filler"],
  legal_form_generator: ["grievance_letter_generator", "contract_template_builder", "pdf_esign"],
  grievance_letter_generator: ["legal_form_generator", "pdf_merger", "fax_sending"],
  emergency_document_bundle: ["pdf_merger", "document_scanner", "pdf_esign"],
  contract_template_builder: ["legal_form_generator", "pdf_esign", "pdf_form_filler"],
  resume_builder: ["cover_letter_generator", "pdf_to_word", "word_to_pdf"],
  cover_letter_generator: ["resume_builder", "word_to_pdf", "business_letter_generator"],
  invoice_generator: ["receipt_maker", "pdf_esign", "pdf_merger"],
  receipt_maker: ["invoice_generator", "word_to_pdf", "pdf_merger"],
  business_letter_generator: ["cover_letter_generator", "grievance_letter_generator", "word_to_pdf"]
};

// How it works steps for each service type
const howItWorks = {
  conversion: [
    { step: 1, title: "Upload Your File", desc: "Drag and drop or click to select your file." },
    { step: 2, title: "Processing", desc: "Our AI analyzes and converts your document." },
    { step: 3, title: "Download", desc: "Get your converted file instantly." }
  ],
  pdf_tools: [
    { step: 1, title: "Upload PDFs", desc: "Add your PDF files to process." },
    { step: 2, title: "Configure Options", desc: "Choose your settings and preferences." },
    { step: 3, title: "Process & Download", desc: "Get your processed PDF file." }
  ],
  ocr: [
    { step: 1, title: "Upload Document", desc: "Upload scanned PDF or image." },
    { step: 2, title: "OCR Processing", desc: "AI extracts text from your document." },
    { step: 3, title: "Review & Download", desc: "Get searchable, editable text." }
  ],
  legal: [
    { step: 1, title: "Select Template", desc: "Choose the document type you need." },
    { step: 2, title: "Fill Details", desc: "Answer guided questions about your situation." },
    { step: 3, title: "Generate Document", desc: "AI creates your professional document." },
    { step: 4, title: "Review & Download", desc: "Edit if needed and download your file." }
  ],
  default: [
    { step: 1, title: "Upload", desc: "Select your file to process." },
    { step: 2, title: "Process", desc: "Our system handles your request." },
    { step: 3, title: "Download", desc: "Get your result instantly." }
  ]
};

// Why it matters benefits
const benefits = {
  conversion: [
    "Edit documents without retyping",
    "Preserve formatting and structure",
    "Save hours of manual work",
    "Works with any document type"
  ],
  pdf_tools: [
    "Professional document management",
    "Organize evidence efficiently",
    "Reduce file sizes for sharing",
    "Secure sensitive information"
  ],
  legal: [
    "Professional formatting automatically",
    "Correct legal language included",
    "Creates documentation trail",
    "Saves time and money vs lawyers"
  ],
  default: [
    "Fast and accurate results",
    "Secure processing",
    "No software installation needed",
    "Works on any device"
  ]
};

// FAQs for service types
const faqs = {
  conversion: [
    { q: "What file formats are supported?", a: "We support PDF, Word, Excel, PowerPoint, and common image formats." },
    { q: "Will formatting be preserved?", a: "Yes, we preserve tables, fonts, images, and layout structure." },
    { q: "What's the maximum file size?", a: "Files up to 50MB are supported. Use our compressor for larger files." },
    { q: "Is my document secure?", a: "Yes, files are encrypted and automatically deleted within 24 hours." }
  ],
  legal: [
    { q: "Is this legal advice?", a: "No, we provide document tools only. Consult a lawyer for legal advice." },
    { q: "Can I edit the generated document?", a: "Yes, all documents are fully editable before download." },
    { q: "Are the documents legally valid?", a: "Documents follow standard formats but check local requirements." }
  ],
  default: [
    { q: "How long does processing take?", a: "Most files process in 1-3 minutes." },
    { q: "Is my data secure?", a: "Files are encrypted and deleted within 24 hours." },
    { q: "Can I use this on mobile?", a: "Yes, FileSolved works on all devices." }
  ]
};

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedServices, setRelatedServices] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`${API}/services/${serviceId}`);
        setService(response.data);
        
        // Fetch related services
        const pairs = pairsWellWith[serviceId] || [];
        if (pairs.length > 0) {
          const relatedPromises = pairs.slice(0, 3).map(id => 
            axios.get(`${API}/services/${id}`).catch(() => null)
          );
          const results = await Promise.all(relatedPromises);
          setRelatedServices(results.filter(r => r?.data).map(r => r.data));
        }
      } catch (error) {
        console.error('Fetch service error:', error);
        toast.error('Service not found');
      } finally {
        setLoading(false);
      }
    };
    
    fetchService();
  }, [serviceId]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Service Not Found</h1>
          <Link to="/services">
            <Button>Browse All Services</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const serviceType = service.type || 'default';
  const steps = howItWorks[serviceType] || howItWorks.default;
  const serviceBenefits = benefits[serviceType] || benefits.default;
  const serviceFaqs = faqs[serviceType] || faqs.default;
  const price = service.basePrice ? `$${(service.basePrice / 100).toFixed(2)}` : 'Free';

  return (
    <Layout>
      <Helmet>
        <title>{service.name} | FileSolved</title>
        <meta name="description" content={service.description} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/services" className="text-slate-500 hover:text-slate-700">Services</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-medium">{service.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                {service.name}
              </h1>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-600">{price}</span>
                  <span className="text-sm">per {service.unit || 'file'}</span>
                </div>
                {service.processingTime && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-5 h-5" />
                    <span>{service.processingTime}</span>
                  </div>
                )}
              </div>

              {/* Pairs well with */}
              {relatedServices.length > 0 && (
                <div className="mb-8 p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Pairs well with:</span>{" "}
                    {relatedServices.map((rs, idx) => (
                      <span key={rs.id}>
                        <Link to={`/services/${rs.id}`} className="text-blue-600 hover:underline">
                          {rs.name}
                        </Link>
                        {idx < relatedServices.length - 1 && "; "}
                      </span>
                    ))}
                  </p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to={`/upload?service=${serviceId}`}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-5 h-5 mr-2" />
                    Start Now
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline">
                    <Star className="w-5 h-5 mr-2" />
                    Unlimited for $5.99/mo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual/Icon Area */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center">
                <FileText className="w-32 h-32 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Tool Matters */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Why This Tool Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {serviceBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {serviceFaqs.map((faq, idx) => (
              <details key={idx} className="bg-slate-50 rounded-xl p-5 group">
                <summary className="font-semibold text-slate-900 cursor-pointer flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  {faq.q}
                </summary>
                <p className="mt-3 text-slate-600 pl-7">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Related Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((rs) => (
                <Link 
                  key={rs.id} 
                  to={`/services/${rs.id}`}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-slate-900 mb-2">{rs.name}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{rs.description}</p>
                  <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to use {service.name}?
          </h2>
          <p className="text-blue-100 mb-8">
            Get started now or upgrade to All Tools Access for unlimited usage.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={`/upload?service=${serviceId}`}>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Start Now - {price}
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Unlimited for $5.99/mo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.name,
        "description": service.description,
        "provider": {
          "@type": "Organization",
          "name": "FileSolved"
        },
        "offers": {
          "@type": "Offer",
          "price": service.basePrice ? (service.basePrice / 100).toFixed(2) : "0",
          "priceCurrency": "USD"
        }
      })}} />
    </Layout>
  );
};

export default ServiceDetailPage;
