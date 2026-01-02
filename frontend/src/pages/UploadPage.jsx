import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "../components/ui/select";
import { Upload, FileText, X, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const UploadPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(serviceId || "");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (serviceId) {
      setSelectedService(serviceId);
    }
  }, [serviceId]);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast.error("Failed to load services");
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const uploadFile = acceptedFiles[0];
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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    }
  });

  const removeFile = () => {
    setFile(null);
    setUploadedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadedFile || !selectedService || !customerEmail || !customerName) {
      toast.error("Please fill in all fields");
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

      const response = await axios.post(`${API}/orders/create`, formData);
      
      toast.success("Order created! Redirecting to checkout...");
      navigate(`/checkout/${response.data.order_id}`);
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Failed to create order");
    } finally {
      setCreating(false);
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <Layout 
      title="Upload Document" 
      description="Upload your document for processing. Drag and drop or click to browse. Supported formats: PDF, DOC, DOCX, JPG, PNG."
    >
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Upload Your Document
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Select a service, upload your file, and we'll take care of the rest.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Selection */}
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
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <span className="flex items-center justify-between w-full">
                        <span>{service.name}</span>
                        <span className="text-blue-600 font-semibold ml-4">${service.price.toFixed(2)}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedServiceData && (
                <p className="mt-2 text-sm text-slate-500">{selectedServiceData.description}</p>
              )}
            </div>

            {/* File Upload */}
            <div className="card-base p-6">
              <Label className="text-base font-semibold text-slate-900 mb-4 block">
                Upload File
              </Label>
              
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
                        Supported: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
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

            {/* Customer Details */}
            <div className="card-base p-6 space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Your Details</h3>
              
              <div>
                <Label htmlFor="name">Full Name</Label>
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
                <Label htmlFor="email">Email Address</Label>
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
            {selectedServiceData && uploadedFile && (
              <div className="card-base p-6 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{selectedServiceData.name}</p>
                    <p className="text-sm text-slate-500">{uploadedFile.file_name}</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    ${selectedServiceData.price.toFixed(2)}
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
