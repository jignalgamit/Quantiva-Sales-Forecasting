import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 px-8 overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content (Image 1 Style) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Next-gen Sales Intelligence
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
            Transform Your Sales Data into <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Smart Predictions</span>
          </h1>
          
          <p className="text-xl text-white/60 leading-relaxed mb-10 max-w-lg">
            Upload your CSV and unlock advanced insights, forecasts, and visualizations in seconds.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Get started</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

        </motion.div>

        {/* Right Content - Abstract 3D Elements (Image 1 Style) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 w-full aspect-square bg-gradient-to-br from-white/5 to-white/0 rounded-3xl border border-white/10 backdrop-blur-sm p-8 flex items-center justify-center">
             {/* Abstract Shapes representing the 3D blocks in Image 1 */}
             <div className="relative w-full h-full">
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 right-0 w-2/3 h-2/3 bg-white/10 rounded-2xl border border-white/20 shadow-2xl" 
                />
                <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-orange-500/20 rounded-2xl border border-orange-500/30 shadow-2xl backdrop-blur-md" 
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-white rounded-full blur-3xl opacity-20" />
             </div>
          </div>
          
          {/* Floating Stats Card (Image 2 Style) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute -bottom-6 -left-6 z-20 bg-[#151619] border border-white/10 p-6 rounded-2xl shadow-2xl w-64"
          >
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Total balance</p>
            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="text-2xl font-bold text-white">42,830.00</h3>
              <span className="text-green-500 text-xs font-medium">↑ 3.4%</span>
            </div>
            <div className="space-y-3">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-orange-500 rounded-full" />
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-blue-500 rounded-full" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
