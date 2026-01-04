import { useState } from "react";
import { Link } from "react-router-dom";
import { X, FileText, FolderSearch, HelpCircle, MessageCircle } from "lucide-react";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button with Custom Logo */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-16 h-16 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-110 hover:shadow-blue-500/50 group overflow-hidden border-2 border-blue-400"
        title="Need help? Ask the FileSolved Assistant."
        data-testid="ai-assistant-button"
      >
        <img 
          src="/hero-fs-logo.png" 
          alt="FileSolved Assistant" 
          className="w-full h-full object-cover rounded-full"
        />
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
            {/* Header with Logo */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg shadow-blue-500/30">
                    <img 
                      src="/hero-fs-logo.png" 
                      alt="FileSolved" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">FileSolved Assistant</h3>
                    <p className="text-sm text-blue-300">How can I help you today?</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  data-testid="ai-assistant-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="p-6 border-b border-slate-100 bg-slate-50">
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
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-100 rounded-xl transition-all group border border-blue-100"
                data-testid="ai-option-case-file"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-md">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Start a Case File</h4>
                  <p className="text-sm text-slate-500">Begin documenting your situation</p>
                </div>
              </Link>

              <Link 
                to="/services"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-100 rounded-xl transition-all group border border-purple-100"
                data-testid="ai-option-bundles"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors shadow-md">
                  <FolderSearch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Find the Right Bundle</h4>
                  <p className="text-sm text-slate-500">Browse tools for your situation</p>
                </div>
              </Link>

              <Link 
                to="/faq"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-100 rounded-xl transition-all group border border-green-100"
                data-testid="ai-option-question"
              >
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors shadow-md">
                  <HelpCircle className="w-6 h-6 text-white" />
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
