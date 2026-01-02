import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { 
  FileText, FileOutput, Image, ScanText, Scan, Printer, Trash2, 
  Shield, Zap, Clock, CheckCircle, ArrowRight 
} from "lucide-react";

const services = [
  { id: "pdf-to-word", name: "PDF to Word", description: "Convert PDF to editable Word documents", icon: FileText, price: "$2.99" },
  { id: "word-to-pdf", name: "Word to PDF", description: "Convert Word files to PDF format", icon: FileOutput, price: "$1.99" },
  { id: "jpg-to-pdf", name: "Image to PDF", description: "Convert images to PDF documents", icon: Image, price: "$1.49" },
  { id: "ocr", name: "OCR Extraction", description: "Extract text from images & scans", icon: ScanText, price: "$3.99" },
  { id: "document-scan", name: "Document Scan", description: "Clean & enhance scanned docs", icon: Scan, price: "$2.49" },
  { id: "pdf-fax", name: "PDF to Fax", description: "Send documents via fax", icon: Printer, price: "$4.99" },
  { id: "secure-shred", name: "Secure Shred", description: "Permanently destroy documents", icon: Trash2, price: "$1.99" },
];

const features = [
  { icon: Zap, title: "Lightning Fast", description: "Most files processed in under 30 seconds" },
  { icon: Shield, title: "Bank-Level Security", description: "256-bit encryption for all uploads" },
  { icon: Clock, title: "24/7 Availability", description: "Process documents anytime, anywhere" },
];

const HomePage = () => {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FileSolved",
    "url": "https://filesolved.com",
    "description": "Professional document services: PDF conversion, OCR, scanning, faxing, and secure shredding.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://filesolved.com/services?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FileSolved",
    "url": "https://filesolved.com",
    "logo": "https://filesolved.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@filesolved.com",
      "contactType": "customer service"
    }
  };

  return (
    <Layout 
      title="Professional Document Services" 
      description="FileSolved offers fast, secure document processing: PDF conversion, OCR text extraction, document scanning, faxing, and secure shredding. One upload, problem solved."
      schema={[homeSchema, organizationSchema]}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Content */}
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                One Upload.
                <span className="block text-blue-600">Problem Solved.</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-xl">
                Professional document services at your fingertips. Convert, extract, scan, fax, or securely destroy documents in seconds.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/upload" data-testid="hero-get-started">
                  <Button className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/services" data-testid="hero-view-services">
                  <Button variant="outline" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                    View All Services
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Pay per use</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1537655949728-d4e1c7c7bf90?crop=entropy&cs=srgb&fm=jpg&q=85&w=600" 
                  alt="Professional workspace with documents"
                  className="rounded-xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">File Processed</p>
                      <p className="text-sm text-slate-500">in 2.3 seconds</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4" data-testid={`feature-${index}`}>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-sm mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Document Services That Work
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Choose from our range of professional document processing services. Fast, reliable, and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link 
                key={service.id} 
                to={`/services/${service.id}`}
                className="service-card group"
                data-testid={`service-card-${service.id}`}
              >
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <service.icon className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{service.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold">{service.price}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" data-testid="view-all-services">
              <Button variant="outline" className="btn-secondary">
                View All Services
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Three simple steps to process your documents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "1", title: "Upload", description: "Drag and drop your file or click to browse. We support PDF, DOC, DOCX, JPG, PNG, and more." },
              { step: "2", title: "Choose Service", description: "Select the service you need: conversion, OCR, scanning, faxing, or secure deletion." },
              { step: "3", title: "Download", description: "Pay securely with PayPal and receive your processed file instantly via email." },
            ].map((item, index) => (
              <div key={index} className="text-center" data-testid={`how-it-works-${index}`}>
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Upload your first document and see the difference. No signup required.
          </p>
          <Link to="/upload" data-testid="cta-upload">
            <Button className="btn-accent mt-8 text-lg px-10 py-4">
              Upload Your Document
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
