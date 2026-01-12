import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import AIAssistant from "../components/AIAssistant";
import { Button } from "../components/ui/button";
import { 
  Camera, FolderOpen, Send, ArrowRight, CheckCircle,
  Home, Shield, Scale, Users, FileWarning, Building2,
  FileText, PenLine, FileStack, FolderKanban
} from "lucide-react";

// Bundle data
const bundles = [
  {
    id: "landlord-protection",
    title: "Landlord Protection Bundle",
    description: "Document ignored repairs, retaliation, illegal entries, harassment, and unsafe living conditions.",
    icon: Home,
    color: "blue",
    href: "/bundles/landlord-protection"
  },
  {
    id: "officer-misconduct",
    title: "Officer Misconduct Bundle",
    description: "Log badge numbers, incidents, witnesses, recordings, and problematic interactions.",
    icon: Shield,
    color: "red",
    href: "/bundles/officer-misconduct"
  },
  {
    id: "ice-immigration",
    title: "ICE & Immigration Grievance Bundle",
    description: "Document threats, discrimination, due process violations, and agency misconduct.",
    icon: FileWarning,
    color: "orange",
    href: "/bundles/ice-immigration"
  },
  {
    id: "lawyer-fiduciary",
    title: "Lawyer & Fiduciary Misconduct Bundle",
    description: "Track missed deadlines, unexplained fees, ignored communication, and conflicts of interest.",
    icon: Scale,
    color: "purple",
    href: "/bundles/lawyer-fiduciary"
  },
  {
    id: "hoa-homeowner",
    title: "HOA & Homeowner Dispute Bundle",
    description: "Document selective enforcement, harassment, unfair fines, and board misconduct.",
    icon: Building2,
    color: "green",
    href: "/bundles/hoa-homeowner"
  },
  {
    id: "community-improvement",
    title: "Community Improvement Bundle",
    description: "Turn ideas and safety concerns into structured proposals for councils and boards.",
    icon: Users,
    color: "teal",
    href: "/bundles/community-improvement"
  }
];

// Services data
const services = [
  {
    id: "evidence-builder",
    title: "Evidence Builder",
    description: "Turn scattered screenshots, photos, messages, and notes into a clear, chronological record with dates, names, and locations.",
    example: "A tenant logs every time the landlord ignored repair requests, attaching photos and texts. The Evidence Builder exports a timeline PDF for housing authorities.",
    icon: FileText,
    href: "/tools/evidence-builder"
  },
  {
    id: "complaint-generator",
    title: "Complaint & Grievance Letter Generator",
    description: "Create structured, respectful, but firm letters. Choose who you're writing to—landlord, employer, HOA, agency, school—and get a ready-to-edit letter.",
    example: "A worker documents unpaid overtime and uses the generator to create a formal complaint letter to HR and the labor board.",
    icon: PenLine,
    href: "/tools/complaint-generator"
  },
  {
    id: "pdf-tools",
    title: "PDF & Document Tools",
    description: "Convert images to PDF, merge multiple files, redact sensitive information, and create labeled evidence packets that are clean and professional.",
    example: "A parent compiles school incident emails, screenshots, and photos into one organized PDF to present to the principal and school board.",
    icon: FileStack,
    href: "/tools/pdf-tools"
  },
  {
    id: "case-file-organizer",
    title: "Case File Organizer",
    description: "Create a \"case file\" for each situation—your landlord, employer, HOA dispute. Group documents, notes, and letters so each conflict stays organized.",
    example: "Someone dealing with both a landlord problem and a custody issue runs two separate case files so each conflict remains organized.",
    icon: FolderKanban,
    href: "/tools/case-file-organizer"
  }
];

// Pillar colors
const pillarColors = {
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  green: "bg-green-100 text-green-600"
};

// Bundle colors
const bundleColors = {
  blue: { bg: "bg-blue-50 hover:bg-blue-100", icon: "bg-blue-100 text-blue-600" },
  red: { bg: "bg-red-50 hover:bg-red-100", icon: "bg-red-100 text-red-600" },
  orange: { bg: "bg-orange-50 hover:bg-orange-100", icon: "bg-orange-100 text-orange-600" },
  purple: { bg: "bg-purple-50 hover:bg-purple-100", icon: "bg-purple-100 text-purple-600" },
  green: { bg: "bg-green-50 hover:bg-green-100", icon: "bg-green-100 text-green-600" },
  teal: { bg: "bg-teal-50 hover:bg-teal-100", icon: "bg-teal-100 text-teal-600" }
};

const HomePage = () => {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FileSolved",
    "url": "https://filesolved.com",
    "description": "FileSolved is a public empowerment platform that helps you document abuse, negligence, misconduct, and broken promises—then turn that evidence into actionable reports, letters, and bundles.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://filesolved.com/services?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FileSolved",
    "url": "https://filesolved.com",
    "logo": "https://filesolved.com/logo.png",
    "description": "FileSolved is a digital, public-facing platform that helps people build evidence, letters, and documentation for real-world problems.",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@filesolved.com",
      "contactType": "customer service"
    }
  };

  return (
    <Layout 
      title="Turn Your Proof Into Power" 
      description="FileSolved helps you document abuse, negligence, misconduct, and broken promises—then turn that evidence into clear, actionable reports, letters, and bundles you can actually use."
      schema={[homeSchema, organizationSchema]}
    >
      {/* SECTION 1 — HERO WITH IMAGE */}
      <section className="relative overflow-hidden min-h-[600px]">
        {/* Background Image - Man at desk */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/man-at-desk.png" 
            alt="FileSolved - Document Solutions" 
            className="w-full h-full object-cover object-right-top"
          />
          {/* Solid dark background on left half, gradient fade to show image on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 from-40% via-slate-950/90 via-50% to-transparent to-100%" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-xl bg-slate-950/80 p-8 rounded-2xl backdrop-blur-sm">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Turn your proof into power
              <span className="block text-blue-400">with FileSolved</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-200 leading-relaxed">
              FileSolved helps you document abuse, negligence, misconduct, and broken promises—then turn that evidence into clear, actionable reports, letters, and bundles you can actually use.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/services" data-testid="hero-start-case">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 w-full sm:w-auto rounded-xl shadow-lg shadow-blue-600/30">
                  Browse Tools
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pricing" data-testid="hero-browse-tools">
                <Button variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto rounded-xl border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                  Upgrade for $5.99/mo
                </Button>
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              No legal jargon. No gatekeeping. Just tools that help you stand up for yourself.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — COMMUNITY EMPOWERMENT */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            For people who are tired of being
            <span className="block text-blue-600">ignored, dismissed, or gaslit</span>
          </h2>
          <div className="mt-8 text-lg text-slate-600 leading-relaxed space-y-4 text-left sm:text-center">
            <p>
              FileSolved exists for renters, workers, caregivers, homeowners, students, immigrants, and anyone who's ever thought: <em>"I know this is wrong… but I don't know how to fight it."</em>
            </p>
            <p>
              We give you simple, guided tools to capture what happened, organize your evidence, and turn it into letters, complaints, and reports you can send to landlords, agencies, lawyers, or community leaders.
            </p>
            <p className="font-medium text-slate-900">
              You don't need to be a lawyer. You just need the truth and a little structure. FileSolved gives you both.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — EMPOWERMENT PILLARS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              How We Empower You
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Three simple steps to turn chaos into evidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Pillar 1: Capture */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow" data-testid="pillar-capture">
              <div className={`w-16 h-16 ${pillarColors.blue} rounded-2xl flex items-center justify-center mb-6`}>
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Capture</h3>
              <p className="text-slate-600 leading-relaxed">
                Upload screenshots, photos, messages, receipts, and notes. FileSolved helps you turn raw chaos into clear, timestamped records so your story can't be brushed off as "he said, she said."
              </p>
            </div>

            {/* Pillar 2: Organize */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow" data-testid="pillar-organize">
              <div className={`w-16 h-16 ${pillarColors.purple} rounded-2xl flex items-center justify-center mb-6`}>
                <FolderOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Organize</h3>
              <p className="text-slate-600 leading-relaxed">
                Convert, merge, and structure your documents into clean, labeled PDFs and timelines. Our tools help you group incidents by date, offender, location, and type of harm.
              </p>
            </div>

            {/* Pillar 3: Act */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow" data-testid="pillar-act">
              <div className={`w-16 h-16 ${pillarColors.green} rounded-2xl flex items-center justify-center mb-6`}>
                <Send className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Act</h3>
              <p className="text-slate-600 leading-relaxed">
                Generate tailored letters, complaints, and report bundles for specific situations—landlord abuse, officer misconduct, HOA disputes, lack of transparency—so you know exactly what to send and where.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FEATURED BUNDLES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Guided Bundles for Your Situation
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Pre-structured collections of tools, templates, and instructions tailored for specific types of conflicts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle) => {
              const colors = bundleColors[bundle.color];
              const IconComponent = bundle.icon;
              return (
                <Link
                  key={bundle.id}
                  to={bundle.href}
                  className={`${colors.bg} rounded-2xl p-6 transition-all hover:scale-[1.02] border border-transparent hover:border-slate-200`}
                  data-testid={`bundle-${bundle.id}`}
                >
                  <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{bundle.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{bundle.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-slate-900">
                    Learn more <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5 — SERVICES OVERVIEW */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Core Tools & Services
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Individual tools to help you capture, organize, and act on your evidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={service.id} 
                  className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-colors"
                  data-testid={`service-${service.id}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                  <div className="mt-6 pl-16">
                    <div className="bg-slate-700/50 rounded-xl p-4">
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-blue-400">Example: </span>
                        {service.example}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" data-testid="services-view-all">
              <Button variant="outline" className="text-white border-slate-600 hover:bg-slate-800 px-8 py-4">
                View All Tools
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CTA */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Ready to Turn Your Proof Into Power?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Start documenting your situation today. No signup required—just choose your bundle or start a case file.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/case-file/new" data-testid="cta-start-case">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 w-full sm:w-auto rounded-xl shadow-lg shadow-blue-600/25">
                Start Your Case File
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/services" data-testid="cta-browse">
              <Button variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto rounded-xl border-2">
                Browse All Bundles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7 — AI ASSISTANT (Floating) */}
      <AIAssistant />
    </Layout>
  );
};

export default HomePage;
