import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "../components/ui/select";
import { 
  Upload, FileText, X, Loader2, ArrowRight, ArrowLeft, Zap, 
  CheckCircle, Clock, Shield, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useService, useServices, getPriceDisplay } from "../hooks/useServices";
import { Link } from "react-router-dom";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const UploadPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  // Service state
  const { service: selectedServiceData, loading: serviceLoading } = useService(serviceId);
  const { services: allServices, loading: servicesLoading } = useServices();
  
  const [selectedService, setSelectedService] = useState(serviceId || "");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [creating, setCreating] = useState(false);
  
  // Extra fields for special services (grievance, notary, etc.)
  const [extraFields, setExtraFields] = useState({});
  const [showExtraFields, setShowExtraFields] = useState(false);

  // Get current service data
  const currentService = selectedServiceData || allServices.find(s => s.id === selectedService);

  useEffect(() => {
    if (serviceId) {
      setSelectedService(serviceId);
    }
  }, [serviceId]);

  // Check if service requires extra fields
  useEffect(() => {
    if (currentService?.requires_extra_fields?.length > 0) {
      setShowExtraFields(true);
      // Initialize extra fields
      const initialFields = {};
      currentService.requires_extra_fields.forEach(field => {
        initialFields[field] = extraFields[field] || '';
      });
      setExtraFields(initialFields);
    } else {
      setShowExtraFields(false);
    }
  }, [currentService]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const uploadFile = acceptedFiles[0];
    
    // Validate file size against service limit
    if (currentService?.max_file_size) {
      const maxBytes = currentService.max_file_size * 1024 * 1024;
      if (uploadFile.size > maxBytes) {
        toast.error(`File size exceeds limit of ${currentService.max_file_size}MB`);
        return;
      }
    }
    
    setFile(uploadFile);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);

      const response = await axios.post(`${API}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setUploadedFile(response.data);
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
      setFile(null);
    } finally {
      setUploading(false);
    }
  }, [currentService]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: currentService?.supported_formats ? 
      Object.fromEntries(
        currentService.supported_formats.map(ext => [
          ext === '.pdf' ? 'application/pdf' :
          ext === '.doc' ? 'application/msword' :
          ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
          ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
          ext === '.png' ? 'image/png' :
          ext === '.gif' ? 'image/gif' :
          ext === '.xls' ? 'application/vnd.ms-excel' :
          ext === '.xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
          `application/${ext.slice(1)}`,
          [ext]
        ])
      ) : undefined
  });

  const removeFile = () => {
    setFile(null);
    setUploadedFile(null);
  };

  const handleExtraFieldChange = (field, value) => {
    setExtraFields(prev => ({ ...prev, [field]: value }));
  };

  const validateExtraFields = () => {
    if (!currentService?.requires_extra_fields) return true;
    
    for (const field of currentService.requires_extra_fields) {
      if (!extraFields[field] || extraFields[field].trim() === '') {
        toast.error(`Please fill in: ${formatFieldName(field)}`);
        return false;
      }
    }
    return true;
  };

  const formatFieldName = (field) => {
    return field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadedFile || !selectedService || !customerEmail || !customerName) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!validateExtraFields()) {
      return;
    }

    setCreating(true);

    try {
      const formData = new FormData();
      formData.append("service_id", selectedService);
      formData.append("file_id", uploadedFile.file_id);
      formData.append("file_name", uploadedFile.file_name);
      formData.append("customer_email", customerEmail);
      formData.append("customer_name", customerName);
      formData.append("quantity", quantity.toString());
      
      if (Object.keys(extraFields).length > 0) {
        formData.append("extra_fields", JSON.stringify(extraFields));
      }

      const response = await axios.post(`${API}/orders/create`, formData);
      
      toast.success("Order created! Redirecting to checkout...");
      navigate(`/checkout/${response.data.order_id}`);
    } catch (error) {
      console.error("Order creation error:", error);
      const errorDetail = error.response?.data?.detail;
      if (typeof errorDetail === 'object' && errorDetail.errors) {
        errorDetail.errors.forEach(err => toast.error(err));
      } else {
        toast.error(errorDetail || "Failed to create order");
      }
    } finally {
      setCreating(false);
    }
  };

  const calculatePrice = () => {
    if (!currentService) return 0;
    const basePrice = currentService.price || currentService.base_price / 100;
    
    if (currentService.type === 'bundle' || currentService.unit === 'flat') {
      return basePrice;
    }
    return basePrice * quantity;
  };

  const isBundle = currentService?.type === 'bundle';
  const isGrievance = currentService?.type === 'grievance';

  return (
    <Layout 
      title={currentService ? `${currentService.name} - Upload` : "Upload Document"}
      description="Upload your document for processing."
    >
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link to="/services" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>

          {/* Service Header */}
          {currentService && (
            <div className="card-base p-6 mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900">{currentService.name}</h1>
                    {isBundle && <Badge className="bg-yellow-100 text-yellow-800">Bundle</Badge>}
                    {isGrievance && <Badge className="bg-red-100 text-red-800">Legal Service</Badge>}
                  </div>
                  <p className="text-slate-600 mt-2">{currentService.description}</p>
                  
                  {/* Service info badges */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {currentService.estimated_time && (
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        {currentService.estimated_time}
                      </div>
                    )}
                    {currentService.max_file_size && (
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Shield className="w-4 h-4" />
                        Max {currentService.max_file_size}MB
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">
                    {getPriceDisplay(currentService)}
                  </p>
                </div>
              </div>

              {/* Bundle includes */}
              {isBundle && currentService.included_services && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">This bundle includes:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentService.included_services.map(inc => (
                      <Link 
                        key={inc.id}
                        to={`/services/${inc.id}`}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {inc.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection (if no service pre-selected) */}
            {!serviceId && (
              <div className="card-base p-6">
                <Label htmlFor="service" className="text-base font-semibold text-slate-900">
                  Select Service
                </Label>
                <Select 
                  value={selectedService} 
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger className="mt-2" data-testid="service-select">
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {allServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <span className="flex items-center justify-between w-full">
                          <span>{service.name}</span>
                          <span className="text-blue-600 font-semibold ml-4">
                            ${service.price.toFixed(2)}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* File Upload */}
            <div className="card-base p-6">
              <Label className="text-base font-semibold text-slate-900 mb-4 block">
                Upload File
              </Label>
              
              {currentService?.supported_formats && (
                <p className="text-sm text-slate-500 mb-4">
                  Supported formats: {currentService.supported_formats.join(', ')}
                </p>
              )}
              
              {!file ? (
                <div
                  {...getRootProps()}
                  className={`upload-zone p-12 text-center cursor-pointer relative z-10 ${isDragActive ? 'upload-zone-active' : ''}`}
                  data-testid="upload-dropzone"
                >
                  <input {...getInputProps()} data-testid="file-input" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-blue-600 font-medium">Drop the file here...</p>
                  ) : (
                    <>
                      <p className="text-slate-600 font-medium">
                        Drag & drop your file here, or click to browse
                      </p>
                      <p className="text-sm text-slate-400 mt-2">
                        {currentService?.max_file_size 
                          ? `Max file size: ${currentService.max_file_size}MB`
                          : 'Max 50MB'}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    ) : (
                      <FileText className="w-8 h-8 text-blue-600" />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-500">
                        {uploading ? "Uploading..." : `${(file.size / 1024).toFixed(1)} KB`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 hover:bg-slate-200 rounded-md transition-colors"
                    data-testid="remove-file"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Quantity (for per-page/per-file services) */}
            {currentService && currentService.unit !== 'flat' && (
              <div className="card-base p-6">
                <Label htmlFor="quantity" className="text-base font-semibold text-slate-900">
                  Quantity ({currentService.unit.replace('per_', '').replace('_', ' ')}s)
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-2 w-32"
                  data-testid="quantity-input"
                />
              </div>
            )}

            {/* Extra Fields for Special Services */}
            {showExtraFields && currentService?.requires_extra_fields && (
              <div className="card-base p-6 border-l-4 border-amber-400">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-semibold text-slate-900">
                    Additional Information Required
                  </h3>
                </div>
                <div className="space-y-4">
                  {currentService.requires_extra_fields.map(field => (
                    <div key={field}>
                      <Label htmlFor={field}>{formatFieldName(field)} *</Label>
                      {field === 'summary' || field === 'records_description' ? (
                        <Textarea
                          id={field}
                          value={extraFields[field] || ''}
                          onChange={(e) => handleExtraFieldChange(field, e.target.value)}
                          placeholder={`Enter ${formatFieldName(field).toLowerCase()}`}
                          className="mt-1"
                          rows={4}
                          required
                          data-testid={`extra-field-${field}`}
                        />
                      ) : field.includes('date') ? (
                        <Input
                          id={field}
                          type="date"
                          value={extraFields[field] || ''}
                          onChange={(e) => handleExtraFieldChange(field, e.target.value)}
                          className="mt-1"
                          required
                          data-testid={`extra-field-${field}`}
                        />
                      ) : (
                        <Input
                          id={field}
                          type="text"
                          value={extraFields[field] || ''}
                          onChange={(e) => handleExtraFieldChange(field, e.target.value)}
                          placeholder={`Enter ${formatFieldName(field).toLowerCase()}`}
                          className="mt-1"
                          required
                          data-testid={`extra-field-${field}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Details */}
            <div className="card-base p-6 space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Your Details</h3>
              
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-1"
                  required
                  data-testid="customer-name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="mt-1"
                  required
                  data-testid="customer-email"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Your processed file will be sent to this email.
                </p>
              </div>
            </div>

            {/* Price Summary */}
            {currentService && uploadedFile && (
              <div className="card-base p-6 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{currentService.name}</p>
                    <p className="text-sm text-slate-500">{uploadedFile.file_name}</p>
                    {quantity > 1 && (
                      <p className="text-sm text-slate-500">
                        {quantity} {currentService.unit.replace('per_', '')}(s) × ${currentService.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    ${calculatePrice().toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="btn-accent w-full py-4 text-lg"
              disabled={!uploadedFile || !selectedService || !customerEmail || !customerName || creating}
              data-testid="proceed-to-checkout"
            >
              {creating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Order...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default UploadPage;
