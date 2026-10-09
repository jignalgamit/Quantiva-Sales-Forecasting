import React, { useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, ReferenceLine
} from "recharts";
import { motion } from "motion/react";
import { Download, FileText, TrendingUp, Info, Shield, ArrowRight, Plus, MessageSquare, Cpu } from "lucide-react";

interface ForecastReportProps {
  data: any;
  onNewForecast?: () => void;
}


export default function ForecastReport({ data, onNewForecast }: ForecastReportProps) {
  const [clickedData, setClickedData] = useState<any>(null);

  if (!data) return null;

  const { historical, forecast, highlights, metrics } = data;

  // Combine past data with forecast for the chart
  const lastHistoryIndex = historical && historical.length > 0 ? historical.length - 1 : 0;
  
  const chartData = [
    ...(historical || []).map((d: any, i: number) => ({
      ...d,
      type: "Past Sales",
      status: "Historical",
      historySales: d.sales,
      forecastSales: i === lastHistoryIndex ? d.sales : undefined
    })),
    ...(forecast || []).map((d: any) => ({
      ...d,
      type: "Forecast",
      status: "Predicted",
      forecastSales: d.sales
    }))
  ];

  const handleChartClick = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      setClickedData(state.activePayload[0].payload);
    }
  };

  const handleDownload = () => {
    const lines = ["=== QUANTIVA FORECAST REPORT ==="];
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push("");
    lines.push("--- KEY METRICS ---");
    metrics?.forEach((m: any) => lines.push(`${m.label}: ${m.value}`));
    lines.push("");
    lines.push("--- ACTIONABLE INSIGHTS ---");
    data.actionableInsights?.forEach((i: string) => lines.push(`* ${i}`));
    lines.push("");
    lines.push("--- RAW DATA ---");
    lines.push("Type,Date,Month,Sales");
    historical?.forEach((d: any) => lines.push(`Historical,${d.date || 'N/A'},${d.name},${d.sales}`));
    forecast?.forEach((d: any) => lines.push(`Forecast,${d.date || 'N/A'},${d.name},${d.sales}`));

    const blob = new Blob([lines.join("\n")], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `quantiva_forecast_report.txt`;
    link.click();
  };


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden text-white"
    >
      {/* Header */}
      <div className="p-10 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-orange-500" size={18} />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Upcoming Future Sales</h2>
          </div>
          <p className="text-white/40">Advanced predictive analysis with randomized cyclic forecasting.</p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Cpu className="text-blue-500" size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Active Engine</p>
            <p className="text-sm font-bold text-white">XGBoost (Smart Random Dates)</p>
          </div>
        </div>
      </div>

      <div className="p-10 space-y-12">
        {/* ML Performance Metrics */}
        {data.performance && (
          <div className="bg-orange-500/5 border border-orange-500/10 rounded-3xl p-6 flex flex-wrap gap-12 items-center">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                 <Shield size={20} className="text-white" />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Model Accuracy</p>
                 <p className="text-xl font-bold text-white">{data.performance?.accuracy || (data.performance?.r2 * 100).toFixed(1)}% Accuracy</p>
               </div>
             </div>
          </div>
        )}


        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.isArray(metrics) && metrics.map((metric: any, idx: number) => (
            <div key={idx} className="flex flex-col gap-1 p-6 bg-white/[0.03] rounded-3xl border border-white/10 hover:border-orange-500/30 transition-colors">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{metric.label}</span>
              <span className="text-2xl font-bold text-white">{metric.value}</span>
            </div>
          ))}
        </div>

        {/* Sales Trend Section - Improved Graph */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Historical vs Forecasted Sales</h3>
              <p className="text-white/30 text-sm">Interactive trend analysis • Click points for insights</p>
            </div>
            <div className="flex flex-wrap gap-6 items-center">
              {clickedData && (
                <div className="bg-[#151619] border border-orange-500/30 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center gap-4 animate-in fade-in zoom-in-95">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      {clickedData.status} • {clickedData.name} {clickedData.date ? `• ${clickedData.date}` : ''}
                    </span>
                    <span className="text-lg font-bold text-white">₹ {(clickedData.historySales || clickedData.forecastSales || clickedData.sales).toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => setClickedData(null)}
                    className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#4f80c6]" />
                  <span className="text-xs font-bold text-white/80">Historical Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#e8a865]" />
                  <span className="text-xs font-bold text-white/80">Forecasted (INR)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[450px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                onClick={handleChartClick}
                className="cursor-pointer"
              >
                <defs>
                  <linearGradient id="colorPast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f80c6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f80c6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e8a865" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e8a865" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}
                  dy={15}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const val = data.historySales || data.forecastSales || data.sales;
                      return (
                        <div className="bg-[#151619] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">
                            {data.status} • {data.name} {data.date ? `• ${data.date}` : ''}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${data.type === "Past Sales" ? "bg-[#4f80c6]" : "bg-[#e8a865]"}`} />
                            <span className="text-white/90 font-bold text-lg">₹ {val.toLocaleString()}</span>
                          </div>
                          <p className="text-white/30 text-[10px] mt-2 italic">Click point to pin insights</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                {/* Historical Area & Line */}
                <Area 
                  type="linear" 
                  dataKey="historySales" 
                  stroke="#4f80c6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPast)" 
                  connectNulls
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#4f80c6' }}
                  dot={{ r: 5, strokeWidth: 2, fill: '#4f80c6', stroke: '#111' }}
                  animationDuration={1500}
                />
                
                {/* Forecast Area & Line */}
                <Area 
                  type="linear" 
                  dataKey="forecastSales" 
                  stroke="#e8a865" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorForecast)" 
                  connectNulls
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#e8a865' }}
                  dot={{ r: 5, strokeWidth: 2, fill: '#e8a865', stroke: '#111' }}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* Forecast Table Section - NEW */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FileText className="text-blue-500" size={18} />
            </div>
            <h3 className="text-xl font-bold text-white">Upcoming Future Sales</h3>
          </div>
          
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Month</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Target Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-right">Projected (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {forecast?.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-white/80">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-white/40">{item.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-orange-500 text-right">
                      ₹ {item.sales.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <button 
            onClick={onNewForecast}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-black border-2 border-orange-500/20 text-orange-500 rounded-2xl font-bold hover:bg-white/5 transition-all group"
          >
            <Plus size={20} />
            <span>Forecast New File</span>
          </button>
          <button 
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 group"
          >
            <Download size={20} />
            <span>Download Full Report</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
