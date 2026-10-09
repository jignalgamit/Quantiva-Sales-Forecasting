import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import CSVUpload from "./components/CSVUpload";
import DataVisualizer from "./components/DataVisualizer";
import AccountPage from "./components/AccountPage";
import HistoryPage from "./components/HistoryPage";
import HelpPage from "./components/HelpPage";
import AboutPage from "./components/AboutPage";
import ForecastResultPage from "./components/ForecastResultPage";
import { motion, AnimatePresence } from "motion/react";
import api from "../lib/api";

import { User, Mail, MapPin, Shield, ArrowRight } from "lucide-react";

function HomePage({ user, onLogout }: { user: any; onLogout: () => void }) {
  const navigate = useNavigate();
  const isLoggedIn = !!user;
  const location = useLocation();
  const [csvData, setCsvData] = useState<any[] | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [insights, setInsights] = useState("");
  const [showForecastButton, setShowForecastButton] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.scrollToUpload) {
      const uploadSection = document.getElementById("upload-section");
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: "smooth" });
        // Reset local state for a fresh start
        setCsvData(null);
        setShowForecastButton(false);
      }
      // Clear state to avoid scrolling on every render
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      const uploadSection = document.getElementById("upload-section");
      uploadSection?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDataLoaded = (data: any[], file: File) => {
    setCsvData(data);
    setCsvFile(file);
    setInsights("");
    setShowForecastButton(true);
    setSaveStatus(null);
  };

  const generateForecast = async () => {
    if (!csvFile) return;
    setIsProcessing(true);
    setSaveStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', csvFile);

      const response = await fetch('/api/forecasts/predict', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo') || '{}').token || ''}`,
        },
        body: formData,
      });

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Server error: ${response.status}`);
      }

      if (!response.ok) {
        setSaveStatus(`Failed: ${result.message || 'ML server error'}`);
        setIsProcessing(false);
        return;
      }

      setSaveStatus('Forecast saved to database successfully.');
      setIsProcessing(false);

      navigate('/forecast-result', {
        state: {
          csvData,
          reportData: result.reportData,
        },
      });
    } catch (err: any) {
      setSaveStatus(`Failed: ${err.message || 'Could not reach server'}`);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogin={() => navigate("/login")} 
        onLogout={onLogout}
      />
      <main className="pb-24">
        <Hero onGetStarted={handleGetStarted} />
        
        {isLoggedIn && (
          <section id="upload-section" className="px-8 pt-24 pb-12">
            <div className="container mx-auto text-center">
              <div className="mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">Start Your Forecast</h2>
                <p className="text-white/40 max-w-lg mx-auto">
                  Upload your sales history in CSV format. Our system will analyze trends and generate a detailed prediction report.
                </p>
              </div>
              
              <CSVUpload 
                onDataLoaded={handleDataLoaded} 
                isProcessing={isProcessing} 
                reset={!csvData} 
              />

              {showForecastButton && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-12"
                >
                  <button
                    onClick={generateForecast}
                    className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <ArrowRight size={20} />
                    <span>Generate AI Forecast</span>
                  </button>
                </motion.div>
              )}
              
              {saveStatus && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col items-center justify-center mt-12 p-4 rounded-2xl text-sm font-bold border ${
                    saveStatus.includes("Failed") || saveStatus.includes("but failed")
                      ? "bg-red-500/10 text-red-500 border-red-500/20" 
                      : "bg-green-500/10 text-green-500 border-green-500/20"
                  }`}
                >
                  {saveStatus}
                </motion.div>
              )}

              {isProcessing && (
                <div className="flex flex-col items-center justify-center mt-12 gap-4">
                  <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-white/60 animate-pulse">Quantiva is analyzing your data...</p>
                </div>
              )}
            </div>
          </section>
        )}

        <section id="account-overview" className="px-8 pt-12 pb-24">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                <User className="text-orange-500" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Account Overview</h2>
                <p className="text-white/40 text-sm">Manage your profile and view performance stats</p>
              </div>
            </div>

            {!isLoggedIn ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-[2.5rem] p-16 text-center backdrop-blur-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-2xl font-bold mb-4">Please sign in first</h3>
                <p className="text-white/40 mb-10 max-w-md mx-auto leading-relaxed">
                  To view your account details, reports, and personalized insights, please sign in to your Quantiva account.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/20 transition-all inline-flex items-center gap-3 group/btn"
                >
                  <span>Sign In First</span>
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl flex flex-col h-full"
                >
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30">
                      <User size={40} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{user?.name || "Member"}</h3>
                      <p className="text-orange-500 font-semibold tracking-wide uppercase text-xs">{user?.role || "Premium Analyst"}</p>
                    </div>
                  </div>
                  <div className="space-y-5 flex-grow">
                    <div className="flex items-center gap-4 text-white/50 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <Mail size={20} className="text-orange-500/50" />
                      <span className="text-sm font-medium">{user?.email || "No Email Provided"}</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <MapPin size={20} className="text-orange-500/50" />
                      <span className="text-sm font-medium">{user?.location || "India"}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/account")}
                    className="mt-10 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <span>View Full Account</span>
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl flex flex-col justify-between h-full"
                >
                  <div>
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-8">Performance Stats</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-white/40 text-sm font-medium">Reports Generated</span>
                        <span className="text-xl font-bold text-white">
                          Success
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-white/40 text-sm font-medium">Accuracy Rate</span>
                        <span className="text-xl font-bold text-green-400">98.2%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 p-5 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                      <Shield size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-orange-500/40 uppercase tracking-wider">Security Status</p>
                      <p className="text-xs font-bold text-orange-500/80">Two-Factor Authentication Enabled</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="py-12 px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 border border-white/20 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">Q</span>
            </div>
            <span className="text-white font-bold text-sm">Quantiva</span>
          </div>
          <p className="text-white/20 text-sm">© 2026 Quantiva. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default function FrontendApp() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen text-white selection:bg-orange-500/30">
        <Routes>
          <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
          <Route path="/account" element={<AccountPage user={user} />} />
          <Route path="/history" element={<HistoryPage user={user} />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/about" element={<AboutPage user={user} onLogout={handleLogout} />} />
          <Route path="/forecast-result" element={<ForecastResultPage user={user} onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}
