import { Layout } from "../components/Layout";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Button } from "../components/ui/button";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is FileSolved?",
        a: "FileSolved is an automated document processing platform that offers PDF conversion, OCR text extraction, document scanning, faxing, and secure document shredding services. Simply upload your file, pay, and receive your processed document."
      },
      {
        q: "Do I need to create an account?",
        a: "No! FileSolved works without requiring an account. Just upload your file, enter your email for delivery, pay with PayPal, and receive your processed document. It's that simple."
      },
      {
        q: "What file formats do you support?",
        a: "We support PDF, DOC, DOCX, JPG, JPEG, and PNG files. Each service may have specific format requirements - check the service page for details."
      },
      {
        q: "How long does processing take?",
        a: "Most documents are processed within 30 seconds to 2 minutes, depending on file size and service type. You'll receive your file via email as soon as it's ready."
      }
    ]
  },
  {
    category: "Services",
    questions: [
      {
        q: "What does PDF to Word conversion include?",
        a: "Our PDF to Word service extracts text from your PDF and creates an editable Word document. Formatting, tables, and text structure are preserved as much as possible."
      },
      {
        q: "How does OCR text extraction work?",
        a: "OCR (Optical Character Recognition) scans your image or PDF and extracts readable text. This is perfect for digitizing scanned documents, photos of text, or any image containing text."
      },
      {
        q: "What is secure document shredding?",
        a: "Secure shredding permanently deletes your document from our servers. You receive a certificate of destruction for compliance and record-keeping purposes."
      },
      {
        q: "Can you fax to international numbers?",
        a: "Yes, our PDF to Fax service supports faxing to most countries worldwide. Pricing may vary for international destinations."
      }
    ]
  },
  {
    category: "Payment & Pricing",
    questions: [
      {
        q: "How do I pay?",
        a: "We accept PayPal for all transactions. This includes PayPal balance, linked bank accounts, and major credit/debit cards through PayPal's secure checkout."
      },
      {
        q: "Is there a subscription?",
        a: "No subscriptions required! FileSolved operates on a pay-per-use model. You only pay for the services you need, when you need them."
      },
      {
        q: "What is your refund policy?",
        a: "If you're not satisfied with the output or there was a technical issue with processing, contact us within 24 hours for a full refund. We want you to be happy with our service."
      },
      {
        q: "Are there any hidden fees?",
        a: "No hidden fees. The price you see on the service page is the price you pay. No processing fees, no membership fees, no surprises."
      }
    ]
  },
  {
    category: "Security & Privacy",
    questions: [
      {
        q: "Is my data secure?",
        a: "Absolutely. We use 256-bit SSL encryption for all uploads and downloads. Your files are processed on secure servers and automatically deleted after 24 hours."
      },
      {
        q: "Who can access my documents?",
        a: "Only our automated processing systems touch your files. No human ever views your documents unless you explicitly request support assistance."
      },
      {
        q: "How long do you keep my files?",
        a: "Files are automatically deleted 24 hours after processing. If you choose secure shredding, files are deleted immediately after you receive your destruction certificate."
      },
      {
        q: "Are you GDPR compliant?",
        a: "Yes, FileSolved is fully GDPR compliant. We respect your privacy and only collect the minimum data necessary to provide our services."
      }
    ]
  }
];

const FAQPage = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.flatMap(category => 
      category.questions.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    )
  };

  return (
    <Layout 
      title="Frequently Asked Questions" 
      description="Find answers to common questions about FileSolved's document processing services, pricing, security, and more."
      schema={faqSchema}
    >
      {/* Header */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to know about FileSolved. Can't find what you're looking for? Contact our support team.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12" data-testid={`faq-category-${categoryIndex}`}>
              <h2 className="text-xl font-bold text-slate-900 mb-6">{category.category}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem 
                    key={faqIndex} 
                    value={`${categoryIndex}-${faqIndex}`}
                    className="card-base px-6"
                  >
                    <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Still Have Questions?</h2>
          <p className="mt-2 text-slate-600">Our support team is here to help you.</p>
          <Link to="/contact">
            <Button className="btn-primary mt-6">Contact Support</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default FAQPage;
