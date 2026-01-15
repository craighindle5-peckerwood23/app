import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "../components/Layout";
import { Check, ArrowRight, FileText, Settings, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SubscriptionSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const subscriptionId = searchParams.get('subscription_id');
  const baToken = searchParams.get('ba_token');
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [subscription, setSubscription] = useState(null);
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const activateAndFetch = async () => {
      // If returning from PayPal with subscription_id, activate it
      if (subscriptionId && !activated) {
        setActivating(true);
        try {
          const activateResponse = await axios.post(`${API}/subscription/activate`, {
            paypalSubscriptionId: subscriptionId
          });
          
          if (activateResponse.data.success) {
            setActivated(true);
            setSubscription({
              hasSubscription: true,
              status: 'active',
              plan: activateResponse.data.subscription,
              currentPeriodEnd: activateResponse.data.subscription?.currentPeriodEnd
            });
            toast.success('Subscription activated successfully!');
          }
        } catch (error) {
          console.error('Activation error:', error);
          toast.error('Failed to activate subscription. Please contact support.');
        } finally {
          setActivating(false);
        }
      } else if (email) {
        // Fallback: fetch by email
        try {
          const response = await axios.get(`${API}/subscription/status`, {
            params: { email }
          });
          setSubscription(response.data);
          if (response.data.hasSubscription) {
            setActivated(true);
          }
        } catch (error) {
          console.error('Fetch status error:', error);
        }
      }
    };
    
    activateAndFetch();
  }, [subscriptionId, email, activated]);

  return (
    <Layout>
      <Helmet>
        <title>Subscription Active | FileSolved</title>
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-green-50 to-white py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Your Subscription is Active!
          </h1>
          
          <p className="text-lg text-slate-600 mb-8">
            Welcome to <strong>All Tools Access</strong>. You now have unlimited access to all 50+ FileSolved tools.
          </p>

          {subscription && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left">
              <h2 className="font-semibold text-lg mb-4">Subscription Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan</span>
                  <span className="font-medium">{subscription.plan?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Price</span>
                  <span className="font-medium">{subscription.plan?.priceFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
                {subscription.currentPeriodEnd && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Next billing</span>
                    <span className="font-medium">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Link to="/services">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                <FileText className="w-5 h-5 mr-2" />
                Start Using Tools
              </Button>
            </Link>
            
            <Link to="/" className="block">
              <Button variant="outline" className="w-full py-3">
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-sm mb-2">Manage Your Subscription</h3>
            <p className="text-xs text-slate-500">
              To cancel or update your subscription, email us at support@filesolved.com or visit your PayPal subscriptions dashboard.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionSuccessPage;
