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
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{title ? `${title} | FileSolved` : "FileSolved - Turn Your Proof Into Power"}</title>
        <meta name="description" content={description || "FileSolved is a public empowerment platform that helps you document abuse, negligence, misconduct, and broken promises—then turn that evidence into actionable reports, letters, and bundles."} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://filesolved.com${location.pathname}`} />
        {schema && (
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        )}
      </Helmet>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" data-testid="logo-link">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-slate-800 transition-colors">
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
                      ? "text-blue-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/case-file/new" data-testid="nav-get-started">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Start a Case File
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
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
                  className="block py-3 text-slate-600 hover:text-slate-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/case-file/new"
                className="block mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-lg">
                  Start a Case File
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-900" />
                </div>
                <span className="font-bold text-xl">FileSolved</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Turn your proof into power. Document abuse, negligence, and misconduct with tools that work for you.
              </p>
            </div>

            {/* Bundles */}
            <div>
              <h4 className="font-semibold mb-4">Featured Bundles</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/bundles/landlord-protection" className="hover:text-white transition-colors">Landlord Protection</Link></li>
                <li><Link to="/bundles/officer-misconduct" className="hover:text-white transition-colors">Officer Misconduct</Link></li>
                <li><Link to="/bundles/hoa-homeowner" className="hover:text-white transition-colors">HOA & Homeowner</Link></li>
                <li><Link to="/bundles/lawyer-fiduciary" className="hover:text-white transition-colors">Lawyer & Fiduciary</Link></li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/tools/evidence-builder" className="hover:text-white transition-colors">Evidence Builder</Link></li>
                <li><Link to="/tools/complaint-generator" className="hover:text-white transition-colors">Complaint Generator</Link></li>
                <li><Link to="/tools/pdf-tools" className="hover:text-white transition-colors">PDF & Document Tools</Link></li>
                <li><Link to="/tools/case-file-organizer" className="hover:text-white transition-colors">Case File Organizer</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About FileSolved</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-400 text-center sm:text-left">
                © {new Date().getFullYear()} FileSolved — Official Documentation & Evidence Platform. Not affiliated with FileSolve.
              </p>
              <p className="text-xs text-slate-500 text-center sm:text-right">
                FileSolved helps you organize evidence and document disputes. We are not a law firm and do not provide legal advice.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
