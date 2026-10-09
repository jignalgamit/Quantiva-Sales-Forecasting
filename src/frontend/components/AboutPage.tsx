import React from "react";
import { motion } from "motion/react";
import { 
  Target, Rocket, Upload, Cpu, BarChart3, Download, 
  CheckCircle2, TrendingUp, LayoutDashboard, Mail,
  Globe, Heart, Code2, Database, Zap, User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function AboutPage({ user, onLogout }: { user: any; onLogout: () => void }) {
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogin={() => navigate("/login")} 
        onLogout={onLogout}
      />

      <main className="pt-32 pb-24 px-8">
        <div className="container mx-auto max-w-5xl">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl font-bold mb-6 tracking-tight">About Us</h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              We help you predict your sales with the power of <span className="text-orange-500 font-semibold">Advanced Analytics</span>.
            </p>
          </motion.div>

          {/* Mission & What We Do */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-[32px] p-10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                  <Target className="text-orange-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-white/60 leading-relaxed">
                <span className="text-white font-semibold">Simplifying sales forecasting</span> for smarter business decisions. We aim to democratize advanced analytics for businesses of all sizes.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-[32px] p-10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Rocket className="text-blue-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold">What We Do</h2>
              </div>
              <p className="text-lg text-white/60 leading-relaxed">
                <span className="text-white font-semibold">Upload your sales data</span> and get accurate forecasts in minutes. Our platform handles the heavy lifting of data processing and modeling.
              </p>
            </motion.div>
          </div>

          {/* Key Features */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard icon={Upload} title="Upload CSV Data" desc="Seamlessly import your historical sales records." />
              <FeatureCard icon={Cpu} title="Automated Forecasting" desc="Our system automatically selects the best parameters." />
              <FeatureCard icon={BarChart3} title="Interactive Charts" desc="Visualize trends with dynamic, responsive graphs." />
              <FeatureCard icon={Download} title="Download Reports" desc="Export your insights as professional PDF reports." />
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              {/* Desktop Wave Connector */}
              <div className="hidden md:block absolute top-[32px] left-0 w-full h-24 -z-10 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <motion.path
                    d="M 125 50 C 200 10, 300 90, 375 50 C 450 10, 550 90, 625 50 C 700 10, 800 90, 875 50"
                    stroke="#f97316"
                    strokeWidth="4"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    variants={{
                      hidden: { pathLength: 0, opacity: 0 },
                      visible: { pathLength: 1, opacity: 1 }
                    }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  {/* Moving pulse on the line */}
                  <motion.path
                    d="M 125 50 C 200 10, 300 90, 375 50 C 450 10, 550 90, 625 50 C 700 10, 800 90, 875 50"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="20 80"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 0.5 }
                    }}
                    animate={{ strokeDashoffset: [100, -100] }}
                    transition={{ 
                      opacity: { duration: 0.5 },
                      strokeDashoffset: { duration: 3, repeat: Infinity, ease: "linear" } 
                    }}
                  />
                </svg>
              </div>

              {/* Mobile Vertical Connector */}
              <div className="md:hidden absolute left-[32px] top-8 bottom-8 w-1 -z-10 pointer-events-none">
                <div className="h-full w-full bg-orange-500/30 rounded-full relative overflow-hidden">
                  <motion.div 
                    className="absolute top-0 left-0 w-full bg-orange-500 h-24 shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 }
                    }}
                    animate={{ top: ["-10%", "110%"] }}
                    transition={{ 
                      opacity: { duration: 0.5 },
                      top: { duration: 2, repeat: Infinity, ease: "easeInOut" } 
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                <StepItem step="1" title="Upload Your Data" icon={Upload} />
                <StepItem step="2" title="System Analyses Data" icon={Cpu} />
                <StepItem step="3" title="View Predictions" icon={TrendingUp} />
                <StepItem step="4" title="Get Insights & Reports" icon={BarChart3} />
              </div>
            </motion.div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <WhyCard icon={CheckCircle2} title="Accurate Forecasts" desc="High-precision models trained on your specific data patterns." />
              <WhyCard icon={TrendingUp} title="Identify Trends & Patterns" desc="Uncover hidden seasonality and growth drivers automatically." />
              <WhyCard icon={LayoutDashboard} title="Easy to Use Dashboard" desc="No data science degree required. Simple, intuitive interface." />
            </div>
          </div>

          {/* About the Creator */}
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 mb-24 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -z-10" />
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-48 h-48 rounded-full bg-orange-500/10 border-4 border-orange-500/20 flex items-center justify-center flex-shrink-0 text-6xl">
                👤
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-6">About the Creator</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-white/80">
                    <User className="text-orange-500" size={20} />
                    <span>Created by <span className="text-white font-bold">Jignal Gamit</span></span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 text-white/80">
                    <Globe className="text-orange-500" size={20} />
                    <span>Data Science Enthusiast</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-3 text-white/80">
                    <Heart className="text-orange-500" size={20} />
                    <span>Passionate about helping businesses grow with data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-all group">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mx-auto mb-4 group-hover:scale-110 transition-transform">
        <Icon className="text-orange-500" size={24} />
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}

function StepItem({ step, title, icon: Icon }: any) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-400 transition-all duration-500">
          <Icon className="text-white group-hover:scale-110 transition-transform" size={28} />
        </div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center text-[10px] font-bold border-2 border-[#050505]">
          {step}
        </div>
      </div>
      <h4 className="text-sm font-bold text-white/80 max-w-[120px]">{title}</h4>
    </div>
  );
}

function TechBadge({ icon: Icon, label }: any) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:border-orange-500/50 transition-colors">
      <Icon className="text-orange-500" size={18} />
      <span className="text-sm font-medium text-white/80">{label}</span>
    </div>
  );
}

function WhyCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-all">
      <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 mb-6">
        <Icon className="text-orange-500" size={24} />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}
