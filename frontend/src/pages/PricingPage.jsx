import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import Layout from "../components/Layout";
import { 
  Check, Zap, Shield, Clock, Infinity, Star, 
  FileText, ScanLine, PhoneForwarded, Brain, Lock, ArrowRight,
  Loader2
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PricingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [hasSubscription, setHasSubscription] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Check subscription status if email is entered
  const checkSubscription = async (emailToCheck) => {
    if (!emailToCheck) return;
    setCheckingStatus(true);
    try {
      const response = await axios.get(`${API}/subscription/status`, {
        params: { email: emailToCheck }
      });
      setHasSubscription(response.data.hasSubscription);
    } catch (error) {
      console.error('Status check error:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSubscribe = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      // Create subscription with PayPal
      const createResponse = await axios.post(`${API}/subscription/create`, {
        email,
        name,
        planId: 'all_tools_access'
      });

      const { approvalUrl, subscriptionId } = createResponse.data;

      if (approvalUrl) {
        // Redirect to PayPal for approval
        toast.success('Redirecting to PayPal...');
        window.location.href = approvalUrl;
      } else {
        toast.error('Failed to get PayPal approval URL. Please try again.');
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      toast.error(error.response?.data?.error || 'Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Infinity, text: 'Unlimited usage of all 50+ tools' },
    { icon: Zap, text: 'Priority processing - no waiting' },
    { icon: ScanLine, text: 'Premium OCR & scanning tools' },
    { icon: PhoneForwarded, text: 'Fax sending & receiving' },
    { icon: Brain, text: 'AI document tools' },
    { icon: Lock, text: 'Secure shredding tools' },
    { icon: Shield, text: 'No ads - clean experience' },
    { icon: Star, text: 'Access to all future tools' }
  ];

  const comparisonFeatures = [
    { feature: 'PDF Conversion Tools', free: '3 per day', pro: 'Unlimited' },
    { feature: 'PDF Manipulation', free: '3 per day', pro: 'Unlimited' },
    { feature: 'OCR & Scanning', free: 'Limited', pro: 'Full Access' },
    { feature: 'Fax Services', free: 'Not included', pro: 'Full Access' },
    { feature: 'AI Document Tools', free: 'Not included', pro: 'Full Access' },
    { feature: 'Secure Shredding', free: 'Not included', pro: 'Full Access' },
    { feature: 'Processing Speed', free: 'Standard', pro: 'Priority' },
    { feature: 'File Size Limit', free: '10 MB', pro: '100 MB' },
    { feature: 'Ads', free: 'Yes', pro: 'No ads' },
    { feature: 'Support', free: 'Email', pro: 'Priority Email' }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Pricing - All Tools Access | FileSolved</title>
        <meta name="description" content="Get unlimited access to all 50+ FileSolved tools for just $5.99/month. No limits, no ads, priority processing." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm mb-6">
            <Star className="w-4 h-4" />
            Most Popular Plan
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            All Tools Access
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            One simple subscription. Unlimited access to every FileSolved tool. 
            No usage limits. No ads. Just powerful document tools when you need them.
          </p>
          
          {/* Price Card */}
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-md mx-auto p-8 mb-8">
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-5xl font-bold">$5.99</span>
              <span className="text-slate-500">/month</span>
            </div>
            <p className="text-slate-600 mb-6">Billed monthly. Cancel anytime.</p>
            
            <div className="space-y-4 mb-8">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value.includes('@')) {
                    checkSubscription(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {hasSubscription ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
                <Check className="w-5 h-5 inline mr-2" />
                You already have an active subscription!
              </div>
            ) : (
              <Button 
                onClick={handleSubscribe}
                disabled={loading || checkingStatus}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg rounded-xl"
                data-testid="subscribe-button"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing...</>
                ) : (
                  <>Upgrade for $5.99/month <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>
            )}
            
            <p className="text-xs text-slate-500 mt-4">
              Secure payment via PayPal. Cancel anytime from your account.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Everything Included</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-slate-700 font-medium">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Upgrade Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Why Upgrade?</h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            Stop paying per document. Get unlimited access to professional tools for less than a coffee.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Infinity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Unlimited Usage</h3>
              <p className="text-slate-600">No daily limits. Convert, merge, and process as many documents as you need.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Priority Processing</h3>
              <p className="text-slate-600">Skip the queue. Your documents process first with faster servers.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Tools</h3>
              <p className="text-slate-600">Access OCR, faxing, AI tools, and secure shredding - all included.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Free vs All Tools Access</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4 text-slate-500">Free</th>
                  <th className="text-center py-4 px-4 bg-blue-50 rounded-t-xl">
                    <span className="text-blue-600 font-bold">All Tools Access</span>
                    <div className="text-sm text-slate-500">$5.99/mo</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-4 px-4 font-medium">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-slate-500">{row.free}</td>
                    <td className="py-4 px-4 text-center bg-blue-50">
                      <span className="text-blue-600 font-semibold">{row.pro}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-8">
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Upgrade Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <details className="bg-white rounded-xl p-6 shadow-sm">
              <summary className="font-semibold cursor-pointer">Can I cancel anytime?</summary>
              <p className="mt-4 text-slate-600">Yes! You can cancel your subscription at any time. You'll keep access until the end of your current billing period.</p>
            </details>
            
            <details className="bg-white rounded-xl p-6 shadow-sm">
              <summary className="font-semibold cursor-pointer">What payment methods do you accept?</summary>
              <p className="mt-4 text-slate-600">We accept PayPal and all major credit cards through PayPal's secure payment system.</p>
            </details>
            
            <details className="bg-white rounded-xl p-6 shadow-sm">
              <summary className="font-semibold cursor-pointer">Is there a free trial?</summary>
              <p className="mt-4 text-slate-600">We offer limited free usage of basic tools. Premium tools like OCR, faxing, and AI require a subscription.</p>
            </details>
            
            <details className="bg-white rounded-xl p-6 shadow-sm">
              <summary className="font-semibold cursor-pointer">What happens to my files?</summary>
              <p className="mt-4 text-slate-600">Your files are encrypted and automatically deleted within 24 hours. We never access or share your documents.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to unlock all tools?</h2>
          <p className="text-blue-100 mb-8">Join thousands of users who trust FileSolved for their document needs.</p>
          <Button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
          >
            Get Started for $5.99/month
          </Button>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "FileSolved All Tools Access",
        "description": "Unlimited access to all 50+ FileSolved document tools including PDF conversion, OCR, faxing, and AI document tools.",
        "brand": { "@type": "Brand", "name": "FileSolved" },
        "offers": {
          "@type": "Offer",
          "price": "5.99",
          "priceCurrency": "USD",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "url": "https://filesolved.com/pricing"
        }
      })}} />
    </Layout>
  );
};

export default PricingPage;
