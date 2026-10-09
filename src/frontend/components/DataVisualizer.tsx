import React from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, PieChart, Pie 
} from "recharts";
import { motion } from "motion/react";
import { TrendingUp, IndianRupee, Package, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface DataVisualizerProps {
  data: any[];
  insights: string;
  predictions: any[];
}

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];

export default function DataVisualizer({ data, insights, predictions }: DataVisualizerProps) {
  // Mocking some metrics based on the data
  const totalSales = data.reduce((acc, curr) => acc + (parseFloat(curr.Sales || curr.Amount || 0)), 0);
  const avgOrderValue = totalSales / (data.length || 1);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto mt-20 space-y-12"
    >
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          icon={IndianRupee} 
          label="Total Revenue" 
          value={`${totalSales.toLocaleString()}`} 
          trend="+12.5%" 
          isPositive 
        />
        <MetricCard 
          icon={TrendingUp} 
          label="Avg. Order Value" 
          value={`${avgOrderValue.toFixed(2)}`} 
          trend="+5.2%" 
          isPositive 
        />
        <MetricCard 
          icon={Package} 
          label="Total Orders" 
          value={data.length.toLocaleString()} 
          trend="-2.1%" 
          isPositive={false} 
        />
        <MetricCard 
          icon={Users} 
          label="New Customers" 
          value="1,284" 
          trend="+18.4%" 
          isPositive 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Sales Forecast</h3>
              <p className="text-white/40 text-sm">AI-powered predictions for the next 6 months</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <span className="text-xs text-white/40">Historical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-xs text-white/40">Predicted</span>
              </div>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#151619", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    borderRadius: "12px",
                    color: "#fff"
                  }}
                  itemStyle={{ color: "#f97316" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#f97316" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "#f97316", strokeWidth: 2, stroke: "#151619" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
              <TrendingUp className="text-orange-500" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">AI Insights</h3>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-sm text-white/80 leading-relaxed">
                {insights || "Analyzing your data to provide strategic recommendations..."}
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Key Recommendations</h4>
              <ul className="space-y-3">
                <RecommendationItem text="Increase inventory for Q3 based on seasonal trend" />
                <RecommendationItem text="Optimize ad spend in the Northeast region" />
                <RecommendationItem text="Target high-value customers with loyalty program" />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ icon: Icon, label, value, trend, isPositive }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
          <Icon className="text-white/60" size={24} />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold",
          isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        )}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <p className="text-white/40 text-sm mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-white tracking-tight">{value}</h4>
    </div>
  );
}

function RecommendationItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
      <span className="text-sm text-white/60 leading-tight">{text}</span>
    </li>
  );
}
