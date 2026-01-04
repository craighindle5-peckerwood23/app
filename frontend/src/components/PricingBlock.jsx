import { Link } from "react-router-dom";
import { Zap, Infinity, Shield, Star, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const PricingBlock = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm mb-4">
            <Star className="w-4 h-4" />
            Save with All Tools Access
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Unlimited Tools for $5.99/month
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Stop paying per document. Get unlimited access to all 50+ tools with one simple subscription.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Features List */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Infinity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Unlimited Usage</h3>
                <p className="text-slate-400">Convert, merge, and process as many documents as you need. No daily limits.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Priority Processing</h3>
                <p className="text-slate-400">Skip the queue. Your documents process first on faster servers.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Premium Tools Included</h3>
                <p className="text-slate-400">Access OCR, faxing, AI document tools, and secure shredding.</p>
              </div>
            </div>
          </div>

          {/* Price Card */}
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-sm text-slate-500 mb-2">All Tools Access</div>
            <div className="flex items-baseline justify-center gap-1 mb-4">
              <span className="text-5xl font-bold text-slate-900">$5.99</span>
              <span className="text-slate-500">/month</span>
            </div>
            <p className="text-slate-600 mb-6">Cancel anytime. No contracts.</p>
            
            <Link to="/pricing">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg rounded-xl mb-4">
                Upgrade Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <ul className="text-left space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 50+ document tools
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Priority processing
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> No ads
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> All future tools included
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingBlock;
