import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Layout } from "../components/Layout";
import { FileText, Loader2, Shield, Lock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${API}/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      toast.error("Order not found");
      navigate("/upload");
    } finally {
      setLoading(false);
    }
  };

  const createPayPalOrder = async () => {
    try {
      const formData = new FormData();
      formData.append("order_id", orderId);
      
      const response = await axios.post(`${API}/paypal/create-order`, formData);
      return response.data.paypal_order_id;
    } catch (error) {
      console.error("PayPal order creation error:", error);
      toast.error("Failed to create payment");
      throw error;
    }
  };

  const onPayPalApprove = async (data) => {
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("paypal_order_id", data.orderID);
      formData.append("order_id", orderId);
      
      await axios.post(`${API}/paypal/capture-order`, formData);
      
      toast.success("Payment successful!");
      navigate(`/confirmation/${orderId}`);
    } catch (error) {
      console.error("Payment capture error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const onPayPalError = (error) => {
    console.error("PayPal error:", error);
    toast.error("Payment error. Please try again.");
  };

  if (loading) {
    return (
      <Layout title="Checkout">
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout title="Order Not Found">
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-slate-600">Order not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Checkout" 
      description="Complete your payment securely with PayPal."
    >
      <section className="py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Complete Your Order
            </h1>
            <p className="mt-2 text-slate-600">
              Secure payment powered by PayPal
            </p>
          </div>

          {/* Order Summary */}
          <div className="card-base p-6 mb-6" data-testid="order-summary">
            <h2 className="font-semibold text-slate-900 mb-4">Order Summary</h2>
            
            <div className="flex items-start gap-4 pb-4 border-b border-slate-200">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{order.service_name}</p>
                <p className="text-sm text-slate-500">{order.file_name}</p>
              </div>
              <p className="font-semibold text-slate-900">${order.amount.toFixed(2)}</p>
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900">${order.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Processing Fee</span>
                <span className="text-slate-900">$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                <span className="text-slate-900">Total</span>
                <span className="text-blue-600">${order.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="card-base p-6 mb-6">
            <h2 className="font-semibold text-slate-900 mb-4">Delivery Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Name</span>
                <span className="text-slate-900">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="text-slate-900">{order.customer_email}</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Your processed file will be sent to this email address.
            </p>
          </div>

          {/* PayPal Button */}
          <div className="card-base p-6" data-testid="paypal-container">
            {processing ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-slate-600">Processing your payment...</p>
              </div>
            ) : (
              <>
                <PayPalButtons
                  createOrder={createPayPalOrder}
                  onApprove={onPayPalApprove}
                  onError={onPayPalError}
                  style={{
                    layout: "vertical",
                    color: "blue",
                    shape: "rect",
                    label: "pay"
                  }}
                />
                
                {/* Security Badges */}
                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    <span>256-bit SSL</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Order ID */}
          <p className="mt-6 text-center text-xs text-slate-400 font-mono">
            Order ID: {order.order_id}
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
