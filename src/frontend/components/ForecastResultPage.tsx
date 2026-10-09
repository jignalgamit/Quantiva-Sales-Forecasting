import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ForecastReport from "./ForecastReport";
import { motion } from "motion/react";
import { ArrowLeft, Download, Share2, Plus } from "lucide-react";

export default function ForecastResultPage({ user, onLogout }: { user: any; onLogout: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { csvData, reportData } = location.state || {};
  const isLoggedIn = !!user;

  const handleNewForecast = () => {
    navigate("/", { state: { scrollToUpload: true } });
  };

  if (!csvData || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Forecast Data Found</h2>
          <p className="text-white/40 mb-8">Please upload a CSV file and generate a forecast first.</p>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-orange-500 rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogin={() => navigate("/login")} 
        onLogout={onLogout}
      />
      
      <main className="pt-32 pb-24 px-8">
        <div className="container mx-auto">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <button 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-4xl font-bold text-white tracking-tight">Forecast Analysis</h1>
              <p className="text-white/40 mt-2">Powered by Advanced XGBoost Regression • {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleNewForecast}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-sm font-bold text-orange-500 hover:bg-orange-500/20 transition-colors"
              >
                <Plus size={18} />
                <span>Forecast New</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
                <Share2 size={18} />
                <span>Share Report</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                <Download size={18} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Results Section */}
          <ForecastReport data={reportData} onNewForecast={handleNewForecast} />
        </div>
      </main>
    </div>
  );
}
