const fs = require('fs');

const path = 'src/frontend/components/ForecastReport.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('import React from "react";', 'import React, { useState } from "react";');

// Update chartData and clicking functionality
const stateAdd = `
  const [clickedData, setClickedData] = useState<any>(null);

  if (!data) return null;`;
  
content = content.replace('  if (!data) return null;', stateAdd);


const chartDataReplacement = `  // Combine past data with forecast for the chart
  const lastHistoryIndex = historical ? historical.length - 1 : 0;
  
  // Format data specifically for continuous line chart with dots
  const chartData = [
    ...(historical || []).map((d: any, i: number) => ({
      ...d,
      type: "Past Sales",
      status: "Historical",
      historySales: d.sales,
      // Pass the last historical point's sales as forecastSales to connect lines seamlessly
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
  };`;

content = content.replace(/  \/\/ Combine past data with forecast for the chart[\s\S]*?(?=  const lastHistorical)/, chartDataReplacement + '\n\n');


// We need to modify the Trend Section UI to match the photo styling and add the clicked panel
const trendSectionStart = `<div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">`;
const trendSectionEndRegex = /<\/AreaChart>[\s\S]*?<\/ResponsiveContainer>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

// For the trend section
const newTrendSection = `<div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Historical vs Forecasted Sales</h3>
              <p className="text-white/30 text-sm">Interactive trend analysis • Click points for insights</p>
            </div>
            <div className="flex flex-wrap gap-6 items-center">
              {clickedData && (
                <div className="bg-[#151619] border border-white/10 px-4 py-2 rounded-xl shadow-lg flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{clickedData.status} • {clickedData.name}</span>
                    <span className="text-lg font-bold text-white">₹{clickedData.sales.toLocaleString()}</span>
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
                  <span className="text-xs font-bold text-white/80">Forecasted Sales</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full relative bg-white/[0.01] rounded-xl border border-white/5 overflow-hidden" style={{ height: '450px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                onClick={handleChartClick}
                className="cursor-pointer"
              >
                <defs>
                  <linearGradient id="colorPast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f80c6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f80c6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e8a865" stopOpacity={0.4}/>
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
                  tickFormatter={(val) => \`\${val.toLocaleString()}\`}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#151619] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{data.status} • {data.name}</p>
                          <div className="flex items-center gap-2">
                            <div className={\`w-2 h-2 rounded-full \${data.type === "Past Sales" ? "bg-[#4f80c6]" : "bg-[#e8a865]"}\`} />
                            <span className="text-white/90 font-bold text-lg">₹{data.sales.toLocaleString()}</span>
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
        </div>`;

// We replace from `<div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">` to the end of that div
let parts = content.split('<div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">');
if(parts.length === 2) {
  let subParts = parts[1].split('        {/* Action Buttons */}');
  content = parts[0] + newTrendSection + '\n\n        {/* Action Buttons */}' + subParts[1];
}

fs.writeFileSync(path, content, 'utf8');
console.log('Update complete');
