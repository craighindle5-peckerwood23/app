import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, FileText, FolderSearch, HelpCircle, MessageCircle, Send, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('menu'); // 'menu' | 'chat'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChat = () => {
    setMode('chat');
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm the FileSolved Assistant. Tell me about your situation—are you dealing with a landlord, employer, government agency, or another issue? I'll help you find the right tools to document and organize your evidence."
      }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(`${API}/ai/chat`, {
        message: userMessage,
        sessionId
      });

      setSessionId(response.data.sessionId);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response 
      }]);
    } catch (error) {
      console.error('AI Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again in a moment, or browse our tools and bundles directly.",
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMode('menu');
    setMessages([]);
    setSessionId(null);
  };

  return (
    <>
      {/* Floating Button with FS Logo */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-16 h-16 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-110 hover:shadow-blue-500/50 group overflow-hidden border-2 border-blue-400"
        title="Need help? Ask the FileSolved Assistant."
        data-testid="ai-assistant-button"
      >
        <img 
          src="/fs-neon-logo.jpg" 
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col" style={{ maxHeight: '80vh' }}>
            {/* Header with Logo */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sm:p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {mode === 'chat' && (
                    <button 
                      onClick={resetChat}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors mr-1"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg shadow-blue-500/30">
                    <img 
                      src="/fs-neon-logo.jpg" 
                      alt="FileSolved" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">FileSolved Assistant</h3>
                    <p className="text-xs sm:text-sm text-blue-300">
                      {mode === 'chat' ? 'AI-powered help' : 'How can I help you today?'}
                    </p>
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

            {mode === 'menu' ? (
              /* Menu Mode */
              <>
                {/* Welcome Message */}
                <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Tell me what's going wrong—landlord, employer, officer, agency, neighbor—and I'll guide you to the right tools, bundles, and templates.
                    </p>
                  </div>
                </div>

                {/* Options */}
                <div className="p-4 sm:p-6 space-y-3 overflow-y-auto flex-1">
                  <button 
                    onClick={startChat}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-100 rounded-xl transition-all group border border-blue-100 text-left"
                    data-testid="ai-option-ask-ai"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-md flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Chat with AI Assistant</h4>
                      <p className="text-sm text-slate-500">Describe your situation for personalized help</p>
                    </div>
                  </button>

                  <Link 
                    to="/case-file/new"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-100 rounded-xl transition-all group border border-green-100"
                    data-testid="ai-option-case-file"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors shadow-md flex-shrink-0">
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
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors shadow-md flex-shrink-0">
                      <FolderSearch className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Browse Tools & Bundles</h4>
                      <p className="text-sm text-slate-500">Find the right tools for your situation</p>
                    </div>
                  </Link>
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex-shrink-0">
                  <p className="text-xs text-center text-slate-400">
                    FileSolved helps you organize evidence and document disputes. We are not a law firm.
                  </p>
                </div>
              </>
            ) : (
              /* Chat Mode */
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
                  {messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user' 
                            ? 'bg-blue-500 text-white rounded-br-md' 
                            : msg.error 
                              ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
                              : 'bg-slate-100 text-slate-800 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                        <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-200 bg-white flex-shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your situation..."
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={loading}
                      data-testid="ai-chat-input"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim() || loading}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4"
                      data-testid="ai-chat-send"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">
                    Powered by AI • Not legal advice
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
