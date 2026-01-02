import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { 
  FileText, FileOutput, Image, Images, ScanText, Scan, Printer, Trash2, ArrowRight 
} from "lucide-react";

const iconMap = {
  FileText, FileOutput, Image, Images, ScanText, Scan, Printer, Trash2
};

const services = [
  { 
    id: "pdf-to-word", 
    name: "PDF to Word Conversion", 
    description: "Convert your PDF documents into fully editable Microsoft Word files. Preserve formatting, tables, and images while gaining the ability to edit text and content.",
    icon: "FileText", 
    price: 2.99,
    category: "conversion",
    features: ["Preserves formatting", "Editable text", "Tables & images retained", "Multiple page support"]
  },
  { 
    id: "word-to-pdf", 
    name: "Word to PDF Conversion", 
    description: "Transform your Word documents into universally readable PDF files. Perfect for sharing, archiving, or printing documents.",
    icon: "FileOutput", 
    price: 1.99,
    category: "conversion",
    features: ["Universal compatibility", "Print-ready output", "Preserves layout", "Smaller file size"]
  },
  { 
    id: "jpg-to-pdf", 
    name: "Image to PDF Conversion", 
    description: "Convert JPG, PNG, and other image formats into professional PDF documents. Great for creating portfolios or document archives.",
    icon: "Image", 
    price: 1.49,
    category: "conversion",
    features: ["Multiple formats supported", "High quality output", "Batch conversion", "Maintains resolution"]
  },
  { 
    id: "pdf-to-jpg", 
    name: "PDF to Image Extraction", 
    description: "Extract pages from PDF files as high-quality images. Perfect for presentations, social media, or further editing.",
    icon: "Images", 
    price: 1.99,
    category: "conversion",
    features: ["High resolution", "All pages extracted", "Multiple formats", "Maintains quality"]
  },
  { 
    id: "ocr", 
    name: "OCR Text Extraction", 
    description: "Extract text from scanned documents, images, and PDFs using advanced Optical Character Recognition technology.",
    icon: "ScanText", 
    price: 3.99,
    category: "extraction",
    features: ["High accuracy", "Multiple languages", "Handwriting support", "Searchable output"]
  },
  { 
    id: "document-scan", 
    name: "Document Scanning & Enhancement", 
    description: "Clean up and enhance scanned documents. Remove noise, straighten pages, and improve readability.",
    icon: "Scan", 
    price: 2.49,
    category: "scanning",
    features: ["Noise removal", "Auto-straightening", "Contrast enhancement", "Professional output"]
  },
  { 
    id: "pdf-fax", 
    name: "PDF to Fax Service", 
    description: "Send your PDF documents via fax to any number worldwide. Perfect for legal documents, contracts, and official communications.",
    icon: "Printer", 
    price: 4.99,
    category: "faxing",
    features: ["Worldwide coverage", "Delivery confirmation", "High priority sending", "Secure transmission"]
  },
  { 
    id: "secure-shred", 
    name: "Secure Document Shredding", 
    description: "Permanently and securely destroy your digital documents. Receive a certificate of destruction for compliance and peace of mind.",
    icon: "Trash2", 
    price: 1.99,
    category: "security",
    features: ["Permanent deletion", "Certificate provided", "GDPR compliant", "Audit trail"]
  },
];

const ServicesPage = () => {
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "FileSolved Document Services",
    "description": "Professional document processing services",
    "itemListElement": services.map((service, index) => ({
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
      description="Explore FileSolved's professional document services: PDF conversion, Word conversion, OCR text extraction, document scanning, faxing, and secure shredding. Pay per use, no subscription required."
      schema={servicesSchema}
    >
      {/* Header */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              Document Services
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Professional document processing at affordable prices. No subscription, pay only for what you use.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon];
              return (
                <div 
                  key={service.id} 
                  className="card-base p-8 card-hover"
                  data-testid={`service-detail-${service.id}`}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {IconComponent && <IconComponent className="w-7 h-7 text-slate-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">{service.name}</h2>
                        <span className="text-2xl font-bold text-blue-600">${service.price.toFixed(2)}</span>
                      </div>
                      <p className="mt-2 text-slate-600">{service.description}</p>
                      
                      <ul className="mt-4 grid grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Link to={`/services/${service.id}`} className="inline-block mt-6">
                        <Button className="btn-primary" data-testid={`select-service-${service.id}`}>
                          Select Service
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Have Questions?</h2>
          <p className="mt-2 text-slate-600">Check out our frequently asked questions or contact our support team.</p>
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

export default ServicesPage;
