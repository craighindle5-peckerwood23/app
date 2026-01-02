import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const Layout = ({ children, title, description, schema }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Services", href: "/services" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white noise-bg">
      <Helmet>
        <title>{title ? `${title} | FileSolved` : "FileSolved - One Upload. Problem Solved."}</title>
        <meta name="description" content={description || "Professional document services: PDF conversion, OCR, scanning, faxing, and secure shredding. Fast, secure, and automated."} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://filesolved.com${location.pathname}`} />
        {schema && (
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        )}
      </Helmet>

      {/* Header */}
      <header className="glass-header sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" data-testid="logo-link">
              <div className="w-10 h-10 bg-slate-900 rounded-md flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">FileSolved</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/upload" data-testid="nav-get-started">
                <Button className="btn-primary">Get Started</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block py-2 text-slate-600 hover:text-slate-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/upload"
                className="block mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="btn-primary w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-900" />
                </div>
                <span className="font-bold text-xl">FileSolved</span>
              </div>
              <p className="text-slate-400 text-sm">
                One Upload. Problem Solved.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/services/pdf-to-word" className="hover:text-white transition-colors">PDF to Word</Link></li>
                <li><Link to="/services/word-to-pdf" className="hover:text-white transition-colors">Word to PDF</Link></li>
                <li><Link to="/services/ocr" className="hover:text-white transition-colors">OCR Extraction</Link></li>
                <li><Link to="/services/secure-shred" className="hover:text-white transition-colors">Secure Shredding</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>support@filesolved.com</li>
                <li>Mon-Fri: 9AM - 6PM EST</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} FileSolved. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
