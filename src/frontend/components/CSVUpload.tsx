import React, { useState, useRef } from "react";
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

interface CSVUploadProps {
  onDataLoaded: (data: any[], file: File) => void;
  isProcessing: boolean;
  reset?: boolean;
}

export default function CSVUpload({ onDataLoaded, isProcessing, reset }: CSVUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (reset) {
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [reset]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file.");
      return;
    }

    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onDataLoaded(results.data, file);
      },
      error: (error) => {
        console.error("CSV Parsing Error:", error);
        alert("Error parsing CSV file.");
      },
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={cn(
          "relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-6 text-center",
          dragActive 
            ? "border-orange-500 bg-orange-500/5" 
            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
          fileName && "border-green-500/50 bg-green-500/5"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".csv"
          onChange={handleChange}
        />

        <AnimatePresence mode="wait">
          {!fileName ? (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 border border-orange-500/20 group-hover:scale-110 transition-transform">
                <Upload className="text-orange-500" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Upload sales data</h3>
              <p className="text-white/40 text-xs max-w-xs mx-auto">
                Drag and drop CSV or click to browse
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="file-selected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 border border-green-500/20">
                {isProcessing ? (
                  <Loader2 className="text-green-500 animate-spin" size={24} />
                ) : (
                  <CheckCircle2 className="text-green-500" size={24} />
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="text-white/40" size={16} />
                <h3 className="text-sm font-bold text-white truncate max-w-[150px]">{fileName}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={14} className="text-white/40 hover:text-white" />
                </button>
              </div>
              <p className="text-white/40 text-xs">
                {isProcessing ? "AI is analyzing..." : "Success"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 flex justify-center gap-4 text-[10px] text-white/20 uppercase tracking-widest font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Secure Upload
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          AI Analysis
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Instant Insights
        </div>
      </div>
    </div>
  );
}
