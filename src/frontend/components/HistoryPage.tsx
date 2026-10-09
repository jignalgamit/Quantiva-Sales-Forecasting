import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { History, FileText, Calendar, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function HistoryPage({ user }: { user: any }) {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data } = await api.get('/forecasts');
        setHistoryItems(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-8">
        <h2 className="text-2xl font-bold mb-4">Please log in to view history</h2>
        <button onClick={() => navigate("/login")} className="px-6 py-2 bg-orange-500 rounded-xl font-bold">Log In</button>
      </div>
    );
  }

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

        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
            <History className="text-orange-500" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Analysis History</h1>
            <p className="text-white/40">View and manage your previous data insights</p>
          </div>
        </div>

        <div className="space-y-4">
          {historyItems.length > 0 ? historyItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate("/forecast-result", { state: { csvData: [], reportData: item.reportData } })}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <FileText className="text-white/40" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <Calendar size={12} />
                        {item.date}
                      </div>
                      <div className="text-xs text-white/40">
                        {item.records} records analyzed
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-500/20">
                    {item.status}
                  </span>
                  <ArrowRight size={20} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
              <p className="text-white/40 mb-4">No analysis history found.</p>
              <button 
                onClick={() => navigate("/")}
                className="text-orange-500 font-bold hover:underline"
              >
                Create your first analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
