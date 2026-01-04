import { Link } from "react-router-dom";
import { ArrowRight, Infinity, Zap, Shield } from "lucide-react";
import { Button } from "./ui/button";

const UpgradePrompt = ({ variant = 'inline', serviceName = 'this tool' }) => {
  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Infinity className="w-5 h-5" />
            <span className="font-medium">Need unlimited usage? Get All Tools Access for $5.99/month</span>
          </div>
          <Link to="/pricing">
            <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
              Upgrade Now <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg">All Tools Access</h3>
        </div>
        
        <p className="text-slate-300 mb-4">
          Unlock unlimited usage of all 50+ tools for just $5.99/month.
        </p>
        
        <ul className="space-y-2 mb-6 text-sm">
          <li className="flex items-center gap-2">
            <Infinity className="w-4 h-4 text-blue-400" />
            Unlimited conversions
          </li>
          <li className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            Priority processing
          </li>
          <li className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            Premium tools included
          </li>
        </ul>
        
        <Link to="/pricing">
          <Button className="w-full bg-blue-500 hover:bg-blue-600">
            Upgrade for $5.99/mo <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Infinity className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-700">
          <strong>Need unlimited usage?</strong> Unlock all tools for{" "}
          <Link to="/pricing" className="text-blue-600 hover:underline font-semibold">
            $5.99/month
          </Link>
        </p>
      </div>
      <Link to="/pricing">
        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
          Upgrade
        </Button>
      </Link>
    </div>
  );
};

export default UpgradePrompt;
