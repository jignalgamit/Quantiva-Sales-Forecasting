import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  HelpCircle, Search, ArrowLeft, ChevronDown, 
  Upload, BarChart3, AlertCircle, Mail, PlayCircle, 
  Cpu, Lightbulb, CheckCircle2, Download, Info, LayoutDashboard,
  MessageCircle, Rocket
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HelpPage() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>("getting-started");

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections = [
    { id: "getting-started", label: "Getting Started Guide", icon: Rocket, content: <GettingStartedSection /> },
    { id: "csv-guide", label: "CSV Upload Instructions", icon: Upload, content: <CSVGuideSection /> },
    { id: "features", label: "Feature Explanation", icon: BarChart3, content: <FeaturesSection /> },
    { id: "faq", label: "Frequently Asked Questions", icon: HelpCircle, content: <FAQSection /> },
    { id: "errors", label: "Error Messages Guide", icon: AlertCircle, content: <ErrorGuideSection /> },
    { id: "tips", label: "Tips for Better Predictions", icon: Lightbulb, content: <TipsSection /> },
    { id: "contact", label: "Contact & Support", icon: Mail, content: <ContactSection /> },
  ];

  return (
    <div className="min-h-screen text-white p-8 pt-32">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
              <HelpCircle className="text-orange-500" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Help Center</h1>
              <p className="text-white/40">Find everything you need to master Quantiva</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="text"
              placeholder="Search help topics..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <div 
              key={section.id}
              className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden backdrop-blur-sm transition-all hover:bg-white/[0.07]"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    openSection === section.id 
                      ? "bg-orange-500 border-orange-400 text-white" 
                      : "bg-white/5 border-white/10 text-white/60"
                  }`}>
                    <section.icon size={20} />
                  </div>
                  <span className={`text-lg font-bold transition-colors ${
                    openSection === section.id ? "text-white" : "text-white/80"
                  }`}>
                    {section.label}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: openSection === section.id ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-white/20"
                >
                  <ChevronDown size={24} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-8 md:px-8 md:pb-12 border-t border-white/5 pt-8">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GettingStartedSection() {
  return (
    <div className="space-y-8">
      <p className="text-white/60 leading-relaxed">
        Quantiva is an advanced sales forecasting platform that transforms your historical data into actionable future insights. We use sophisticated algorithms to identify patterns, seasonality, and growth opportunities.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { step: "01", title: "Upload Data", desc: "Drag your CSV file into the dashboard." },
          { step: "02", title: "Data Analysis", desc: "Our system processes your sales history." },
          { step: "03", title: "View Results", desc: "Get forecasts and strategic insights." }
        ].map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <span className="text-orange-500 font-bold text-sm mb-2 block">{item.step}</span>
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p className="text-white/40 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CSVGuideSection() {
  return (
    <div className="space-y-8">
      <p className="text-white/60">Your data quality directly impacts prediction accuracy. Follow these guidelines for the best results.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <CheckCircle2 className="text-green-500" size={18} />
            Required Columns
          </h3>
          <ul className="space-y-2 text-sm text-white/40">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <strong>Date:</strong> YYYY-MM-DD or DD/MM/YYYY format
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <strong>Sales:</strong> Numerical value (Revenue or Volume)
            </li>
            <li className="flex items-center gap-2 text-xs italic">
              * Optional: Category, Region, Product ID
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Info className="text-blue-500" size={18} />
            File Format
          </h3>
          <p className="text-sm text-white/40">We exclusively support <strong>.csv</strong> files. Excel (.xlsx) files must be saved as "Comma Separated Values" before uploading.</p>
          <button className="flex items-center gap-2 text-orange-500 text-sm font-bold hover:underline">
            <Download size={16} />
            Download Sample Dataset
          </button>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
        <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          Common Data Issues
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-black/20 rounded-xl">
            <p className="font-bold text-white/80 mb-1">Missing Values</p>
            <p className="text-white/40">Empty cells can break the time-series logic. Ensure every date has a value (even if 0).</p>
          </div>
          <div className="p-4 bg-black/20 rounded-xl">
            <p className="font-bold text-white/80 mb-1">Wrong Date Format</p>
            <p className="text-white/40">Inconsistent date strings (e.g., mixing US and UK formats) will cause parsing errors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: BarChart3, title: "Forecast Graph", desc: "Interactive visualization of your historical data vs. predicted future performance for the next 12 months." },
          { icon: Lightbulb, title: "Smart Insights", desc: "Automated strategic summaries identifying trends, seasonality, and potential risks in your sales cycle." },
          { icon: Cpu, title: "Model Selection", desc: "Utilizes Random Forest Regression for robust and accurate predictions." },
          { icon: Download, title: "Export Reports", desc: "Download high-resolution charts and detailed PDF summaries of your analysis to share with your team." }
        ].map((feature, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20 mb-4">
              <feature.icon className="text-orange-500" size={20} />
            </div>
            <h3 className="font-bold mb-2">{feature.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Why is my CSV not uploading?", a: "Check if the file is open in another program (like Excel), or if it exceeds our 10MB size limit. Ensure it has a .csv extension." },
    { q: "Why are predictions inaccurate?", a: "The system needs historical context. If you provide less than 3 months of data, predictions may be less reliable. Check for outliers or missing values." },
    { q: "What data size is supported?", a: "We support files up to 10MB or approximately 50,000 rows of data for real-time processing." },
    { q: "Can I upload multiple files?", a: "Currently, we process one file at a time. To combine data, merge your CSVs into a single file before uploading." }
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <button 
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <h3 className="font-bold flex items-center gap-3 pr-8">
              <HelpCircle size={18} className="text-orange-500 shrink-0" />
              {faq.q}
            </h3>
            <ChevronDown 
              size={18} 
              className={`text-white/20 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} 
            />
          </button>
          <AnimatePresence>
            {openFaq === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-6 pb-6 pt-2 border-t border-white/5">
                  <p className="text-sm text-white/40 leading-relaxed">{faq.a}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function ErrorGuideSection() {
  const [openError, setOpenError] = useState<number | null>(null);

  const errors = [
    { code: "Invalid CSV format", fix: "Ensure your file is a standard CSV. Check for extra commas or special characters in headers." },
    { code: "Missing values detected", fix: "Fill empty cells with 0 or use interpolation to estimate missing data points." },
    { code: "Model failed to converge", fix: "This usually happens with highly volatile data. Try smoothing your data or providing a longer history." }
  ];

  return (
    <div className="space-y-4">
      {errors.map((err, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <button 
            onClick={() => setOpenError(openError === i ? null : i)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <h3 className="font-bold text-red-400">{err.code}</h3>
            </div>
            <ChevronDown 
              size={18} 
              className={`text-white/20 transition-transform duration-300 ${openError === i ? "rotate-180" : ""}`} 
            />
          </button>
          <AnimatePresence>
            {openError === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-6 pb-6 pt-2 border-t border-white/5">
                  <p className="text-sm text-white/40 leading-relaxed pl-9">{err.fix}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function TipsSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4">
        {[
          { title: "Consistent Intervals", desc: "Ensure your data points are evenly spaced (e.g., every Monday, or the 1st of every month)." },
          { title: "Clean Historical Data", desc: "Remove extreme outliers that were caused by one-time events to prevent skewing the trend." },
          { title: "Provide Enough History", desc: "For yearly seasonality detection, at least 18-24 months of data is recommended." },
          { title: "Avoid Gaps", desc: "Continuous data without long breaks allows the system to better understand the momentum." }
        ].map((tip, i) => (
          <div key={i} className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs">
              {i + 1}
            </div>
            <div>
              <h3 className="font-bold text-sm">{tip.title}</h3>
              <p className="text-xs text-white/40">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <p className="text-white/60">Need direct assistance? Our team is here to help you with technical issues or data interpretation.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="text-orange-500" size={18} />
              <span>support@quantiva.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MessageCircle className="text-orange-500" size={18} />
              <span>Live Chat (Mon-Fri, 9am-5pm)</span>
            </div>
          </div>
        </div>
        
        <form className="space-y-4">
          <input 
            type="text" 
            placeholder="Subject" 
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500"
          />
          <textarea 
            placeholder="How can we help?" 
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500"
          />
          <button className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
