import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { CheckCircle, Mail, Download, Loader2, ArrowRight, Clock } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    // Poll for status updates
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  const handleDownload = async () => {
    try {
      window.open(`${API}/orders/${orderId}/download`, '_blank');
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (loading) {
    return (
      <Layout title="Order Confirmation">
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </Layout>
    );
  }

  const isCompleted = order?.status === "completed";
  const isPaid = order?.status === "paid";
  const isProcessing = isPaid && !isCompleted;

  return (
    <Layout 
      title="Order Confirmed" 
      description="Your order has been confirmed. Your processed file will be sent to your email."
    >
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Payment Successful!
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Thank you for your order. Your document is being processed.
            </p>
          </div>

          {/* Order Details */}
          <div className="card-base p-8" data-testid="confirmation-details">
            <h2 className="font-semibold text-slate-900 mb-6">Order Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Order ID</span>
                <span className="font-mono text-sm text-slate-900">{order?.order_id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Service</span>
                <span className="text-slate-900">{order?.service_name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">File</span>
                <span className="text-slate-900">{order?.file_name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-semibold text-slate-900">${order?.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isCompleted 
                    ? 'bg-green-100 text-green-800' 
                    : isProcessing 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-amber-100 text-amber-800'
                }`}>
                  {isCompleted ? 'Completed' : isProcessing ? 'Processing' : order?.status}
                </span>
              </div>
            </div>

            {/* Processing Status */}
            {isProcessing && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <div className="absolute inset-0 animate-ping">
                      <Clock className="w-6 h-6 text-blue-600 opacity-50" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Processing Your Document</p>
                    <p className="text-sm text-blue-700">
                      This usually takes less than a minute. The page will update automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Download Section */}
            {isCompleted && (
              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Download className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Ready for Download</p>
                      <p className="text-sm text-green-700">Your processed file is ready.</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleDownload}
                    className="btn-primary"
                    data-testid="download-btn"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {/* Email Notice */}
            <div className="mt-8 flex items-start gap-3 text-sm text-slate-600">
              <Mail className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <p>
                A copy of your processed file will also be sent to{" "}
                <span className="font-medium text-slate-900">{order?.customer_email}</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload">
              <Button className="btn-accent w-full sm:w-auto" data-testid="process-another">
                Process Another Document
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="btn-secondary w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ConfirmationPage;
