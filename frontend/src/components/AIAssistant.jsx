import { useState } from "react";
import { Link } from "react-router-dom";
import { X, FileText, FolderSearch, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-slate-900 hover:bg-slate-800 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 group"
        title="Need help? Ask the FileSolved Assistant."
        data-testid="ai-assistant-button"
      >
        <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
          <FileText className="w-4 h-4 text-slate-900" />
        </div>
        <span className="absolute -top-10 right-0 bg-slate-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Need help?
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold">FileSolved Assistant</h3>
                    <p className="text-sm text-slate-300">How can I help you today?</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  data-testid="ai-assistant-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Tell me what's going wrong—landlord, employer, officer, agency, neighbor—and I'll guide you to the right tools, bundles, and templates to start organizing your evidence.
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="p-6 space-y-3">
              <Link 
                to="/case-file/new"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                data-testid="ai-option-case-file"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Start a Case File</h4>
                  <p className="text-sm text-slate-500">Begin documenting your situation</p>
                </div>
              </Link>

              <Link 
                to="/services"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                data-testid="ai-option-bundles"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <FolderSearch className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Find the Right Bundle</h4>
                  <p className="text-sm text-slate-500">Browse tools for your situation</p>
                </div>
              </Link>

              <Link 
                to="/faq"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                data-testid="ai-option-question"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <HelpCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Ask a Question</h4>
                  <p className="text-sm text-slate-500">Get answers about FileSolved</p>
                </div>
              </Link>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <p className="text-xs text-center text-slate-400">
                FileSolved helps you organize evidence and document disputes. We are not a law firm.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
