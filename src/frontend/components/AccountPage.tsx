import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Mail, Shield, Calendar, MapPin, ArrowLeft, Building2, Globe, FileText, Edit3, Save, X, History, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function AccountPage({ user: authUser }: { user: any }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  
  // User data state
  const [user, setUser] = useState({
    name: authUser?.name || "Guest User",
    email: authUser?.email || "guest@example.com",
    role: authUser?.role || "Premium Analyst",
    joined: authUser?.joined || "March 2026",
    location: authUser?.location || "India",
    status: authUser?.status || "Active",
    bio: authUser?.bio || "Passionate data analyst focused on sales forecasting and market trends.",
    company: authUser?.company || "Quantiva AI",
    website: authUser?.website || "https://quantiva.ai"
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser) return;
      setIsLoading(true);
      try {
        const { data } = await api.get('/users/profile');
        setUser(data);
        
        // Also fetch history for stats
        const historyRes = await api.get('/forecasts');
        setHistoryItems(historyRes.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await api.put('/users/profile', user);
      setUser(data);
      // Update local storage too
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...data }));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your account</h2>
        <button onClick={() => navigate("/login")} className="px-6 py-2 bg-orange-500 rounded-xl font-bold">Log In</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-8 pt-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-bold"
            >
              <Edit3 size={16} />
              <span>Edit Account</span>
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-bold text-white/60"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 rounded-xl hover:bg-orange-600 transition-all text-sm font-bold"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-sm">
              <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
                <User size={48} className="text-white" />
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center text-xl font-bold focus:outline-none focus:border-orange-500"
                />
              ) : (
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
              )}
              <p className="text-orange-500 text-sm font-medium mb-6">{user.role}</p>
              
              <div className="flex justify-center gap-4">
                <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-white/60">
                  {user.status}
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-sm">Reports Generated</span>
                  <span className="text-white font-bold">
                    {historyItems.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-sm">Data Points Analyzed</span>
                  <span className="text-white font-bold">12.5k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-sm">Accuracy Rate</span>
                  <span className="text-white font-bold text-green-500">98.2%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-8">Account Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoItem icon={Mail} label="Email Address" value={user.email} />
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
                    <MapPin className="text-white/40" size={20} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Location</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={user.location}
                        onChange={(e) => setUser({ ...user, location: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-white font-medium">{user.location}</p>
                    )}
                  </div>
                </div>

                <InfoItem icon={Calendar} label="Member Since" value={user.joined} />
                <InfoItem icon={Shield} label="Account Security" value="Two-Factor Enabled" />
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-8">Additional Information</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
                    <FileText className="text-white/40" size={20} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Bio</p>
                    {isEditing ? (
                      <textarea
                        value={user.bio}
                        onChange={(e) => setUser({ ...user, bio: e.target.value })}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 resize-none"
                      />
                    ) : (
                      <p className="text-white/80 text-sm leading-relaxed">{user.bio}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
                      <Building2 className="text-white/40" size={20} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Company</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={user.company}
                          onChange={(e) => setUser({ ...user, company: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-white font-medium">{user.company}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
                      <Globe className="text-white/40" size={20} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Website</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={user.website}
                          onChange={(e) => setUser({ ...user, website: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-orange-500"
                        />
                      ) : (
                        <p className="text-orange-500 font-medium hover:underline cursor-pointer">{user.website}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Analysis History</h3>
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                  <History className="text-orange-500" size={20} />
                </div>
              </div>
              
              <div className="space-y-4">
                {historyItems.length > 0 ? (
                  historyItems.map((item: any) => (
                    <div 
                      key={item.id}
                      onClick={() => navigate("/forecast-result", { state: { csvData: [], reportData: item.reportData } })}
                      className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-white/40" />
                          <h4 className="font-bold text-white group-hover:text-orange-500 transition-colors">{item.name}</h4>
                        </div>
                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-wider">{item.date}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-white/40">{item.records} records analyzed</p>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[8px] font-bold uppercase tracking-wider rounded-full border border-green-500/20">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                    <p className="text-white/40 text-sm">No analysis history yet.</p>
                    <button 
                      onClick={() => navigate("/")}
                      className="mt-4 text-orange-500 text-xs font-bold hover:underline"
                    >
                      Start your first forecast
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0">
        <Icon className="text-white/40" size={20} />
      </div>
      <div>
        <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({ title, time, description }: any) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-white">{title}</h4>
        <span className="text-[10px] text-white/20 font-bold uppercase tracking-wider">{time}</span>
      </div>
      <p className="text-sm text-white/40">{description}</p>
    </div>
  );
}
