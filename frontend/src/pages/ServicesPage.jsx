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
  Calculator, Building, Stamp, ClipboardList, Lock, Hash, PenLine
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
