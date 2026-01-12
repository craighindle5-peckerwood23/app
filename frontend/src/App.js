import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Toaster } from "./components/ui/sonner";

// Pages
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import UploadPage from "./pages/UploadPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PricingPage from "./pages/PricingPage";
import SubscriptionSuccessPage from "./pages/SubscriptionSuccessPage";

const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

function App() {
  return (
    <HelmetProvider>
      <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/checkout/:orderId" element={<CheckoutPage />} />
            <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* New routes for bundles and tools - redirect to services for now */}
            <Route path="/bundles/:bundleId" element={<ServicesPage />} />
            <Route path="/tools/:toolId" element={<ServicesPage />} />
            <Route path="/case-file/new" element={<UploadPage />} />
            <Route path="/about" element={<FAQPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </PayPalScriptProvider>
    </HelmetProvider>
  );
}

export default App;
