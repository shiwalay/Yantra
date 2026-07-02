"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Image as ImageIcon, 
  Sparkles, 
  Upload, 
  Eye, 
  TrendingUp, 
  Contrast, 
  Smile, 
  Grid,
  Info,
  ArrowRight,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScoreRing, IndicatorBar, StatTile, ScoreChip, toneForScore } from "@/components/vidiq";
import { GradientBorderCard } from "@/components/gradient";

// --- Score derivation helpers (read existing string data, no data changes) ---
// Predicted CTR string like "8.7% (High)" -> a 0-100 click-worthiness score.
const ctrScore = (ctr?: string): number => {
  const pct = parseFloat(String(ctr ?? "").replace(/[^0-9.]/g, "")) || 0;
  // ~10% CTR treated as a perfect 100 for scoring purposes.
  return Math.max(0, Math.min(100, Math.round((pct / 10) * 100)));
};
// Contrast string like "8.4:1 (Excellent)" -> 0-100 (WCAG-ish; 10:1 = 100).
const contrastScore = (contrast?: string): number => {
  const ratio = parseFloat(String(contrast ?? "").replace(/[^0-9.]/g, "")) || 0;
  return Math.max(0, Math.min(100, Math.round((ratio / 10) * 100)));
};
// Leading numeric percentage from a "35%" style string.
const pctVal = (p?: string): number =>
  Math.max(0, Math.min(100, parseFloat(String(p ?? "").replace(/[^0-9.]/g, "")) || 0));

const presetVariants = [
  {
    id: 1,
    name: "Variant A: Face + Big Numbers",
    ctr: "8.7% (High)",
    colorGold: "35%",
    colorCharcoal: "50%",
    colorViolet: "15%",
    contrast: "8.4:1 (Excellent)",
    emotion: "Curiosity (92%), Wealth (80%)",
    feedback: "High contrast, gold colors draw eyes to the earnings figures. Recommended style.",
    previewColor: "from-amber-500/20 to-neutral-900",
    thumbText: "₹1.2 Cr",
    thumbSubText: "in 30 Days"
  },
  {
    id: 2,
    name: "Variant B: Minimalist Typography",
    ctr: "5.1% (Low)",
    colorGold: "0%",
    colorCharcoal: "90%",
    colorViolet: "10%",
    contrast: "4.1:1 (Poor)",
    emotion: "Seriousness (70%), Calm (40%)",
    feedback: "Dark typography blends too much into YouTube dark theme. Needs a bright human face or high-contrast graphics.",
    previewColor: "from-neutral-800 to-neutral-900",
    thumbText: "No Ads",
    thumbSubText: "SaaS Blueprint"
  },
  {
    id: 3,
    name: "Variant C: Action Screen + Bright Arrows",
    ctr: "6.3% (Medium)",
    colorGold: "10%",
    colorCharcoal: "30%",
    colorViolet: "60%",
    contrast: "6.2:1 (Good)",
    emotion: "Intrigue (75%), Hype (60%)",
    feedback: "Good use of purple branding. The arrow draws eye movement to the product dashboard, but text is slightly small for mobile.",
    previewColor: "from-purple-500/20 to-neutral-900",
    thumbText: "AI employee",
    thumbSubText: "Live Demo"
  }
];

export default function ThumbnailEngine() {
  const [selectedVariantId, setSelectedVariantId] = useState<number>(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzingFile, setAnalyzingFile] = useState(false);
  const [customAnalysis, setCustomAnalysis] = useState<any | null>(null);

  const currentVariant = presetVariants.find((v) => v.id === selectedVariantId) || presetVariants[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAnalyzingFile(true);
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        setTimeout(() => {
          setUploadedImage(reader.result as string);
          setCustomAnalysis({
            name: `Uploaded: ${file.name.substring(0, 15)}...`,
            ctr: "7.9% (Good)",
            colorGold: "20%",
            colorCharcoal: "40%",
            colorViolet: "40%",
            contrast: "7.1:1 (Good)",
            emotion: "Excitement (85%), Interest (80%)",
            feedback: "Upload analyzed successfully. Great color contrast. Faces are properly centered in the rule of thirds grid.",
            previewColor: "from-emerald-500/20 to-neutral-900",
            thumbText: "Custom",
            thumbSubText: "Uploaded Draft"
          });
          setAnalyzingFile(false);
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeData = customAnalysis || currentVariant;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Section: Uploader & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Upload & Selection */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Draft Upload & preset testing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* Upload Area */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              {analyzingFile ? (
                <div className="space-y-3">
                  <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin inline-block" />
                  <p className="text-xs font-bold text-white">AI Color & Feed Scanning...</p>
                </div>
              ) : uploadedImage ? (
                <div className="relative w-full h-full min-h-[140px] flex items-center justify-center rounded-xl overflow-hidden bg-neutral-950">
                  <img src={uploadedImage} alt="Uploaded draft" className="object-cover w-full h-full" />
                  <button 
                    onClick={() => {
                      setUploadedImage(null);
                      setCustomAnalysis(null);
                    }}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded bg-black/80 hover:bg-black text-[10px] font-bold text-white transition border border-white/10"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer space-y-3 p-4 w-full h-full flex flex-col items-center justify-center">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-all">
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Upload Draft Image</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Drag-and-drop PNG or JPG</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              )}
            </div>

            {/* Presets List */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Preset A/B Variants</span>
              {presetVariants.map((variant) => {
                const isSelected = selectedVariantId === variant.id && !customAnalysis;
                return (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setCustomAnalysis(null);
                      setSelectedVariantId(variant.id);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{variant.name}</p>
                      <span className="text-[10px] text-muted-foreground leading-normal mt-0.5 flex items-center gap-1.5">
                        CTR: {variant.ctr}
                        <ScoreChip value={ctrScore(variant.ctr)} />
                      </span>
                    </div>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Score Card */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            AI Scorecard Decisions
          </h3>

          <div className="p-6 rounded-3xl bg-card border border-white/[0.06] space-y-5 bg-neutral-950/40 relative overflow-hidden shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
            {/* Background design */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.05] rounded-full blur-xl pointer-events-none" />

            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <Sparkles size={14} className="text-primary" /> Diagnostic Results
              </span>
              <span className="text-[10px] text-success font-bold flex items-center gap-0.5">
                <TrendingUp size={10} /> Predicted CTR: {activeData.ctr}
              </span>
            </div>

            {/* Overall click-worthiness score */}
            <div className="flex items-center gap-5">
              <ScoreRing value={ctrScore(activeData.ctr)} size={112} caption="Click-Worthiness" />
              <div className="flex-1 grid grid-cols-2 gap-2.5">
                <StatTile label="Predicted CTR" value={activeData.ctr} tone={toneForScore(ctrScore(activeData.ctr))} icon={TrendingUp} />
                <StatTile label="Contrast" value={activeData.contrast} tone={toneForScore(contrastScore(activeData.contrast))} icon={Contrast} />
              </div>
            </div>

            {/* Checklist Parameters */}
            <div className="space-y-3.5 text-xs">
              {/* Color breakdown */}
              <div className="space-y-3">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Color Psychology Distribution</span>
                <div className="h-3 rounded-full overflow-hidden flex">
                  <div className="bg-amber-400 h-full" style={{ width: activeData.colorGold || "0%" }} />
                  <div className="bg-neutral-700 h-full" style={{ width: activeData.colorCharcoal || "80%" }} />
                  <div className="bg-purple-500 h-full" style={{ width: activeData.colorViolet || "20%" }} />
                </div>
                <IndicatorBar label="Contrast Ratio" value={contrastScore(activeData.contrast)} icon={Contrast} />
                <IndicatorBar label="Gold / Accent Presence" value={pctVal(activeData.colorGold)} icon={Sparkles} />
                <IndicatorBar label="Brand Violet Presence" value={pctVal(activeData.colorViolet)} icon={Eye} />
              </div>

              {/* Emotions */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[9px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                  <Smile size={10} /> Dominant Emotional Trigger
                </span>
                <p className="text-[11px] font-bold text-white leading-relaxed">{activeData.emotion}</p>
              </div>

              {/* Coach feedback */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex gap-2">
                <Info size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  <strong>Coach Recommendation:</strong> {activeData.feedback}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Standout Feed Simulator */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Grid size={14} /> Standout Feed Simulator (A/B Standout Test)
        </h3>

        <div className="p-6 rounded-3xl bg-card border border-white/[0.06] space-y-4 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
          <p className="text-[10px] text-muted-foreground max-w-xl leading-relaxed">
            See exactly how your thumbnail stands out inside a simulated YouTube mobile feed next to current popular competitor videos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feed Item 1: YOUR THUMBNAIL */}
            <div className="space-y-2.5">
              <div className={`aspect-video rounded-xl bg-gradient-to-br ${activeData.previewColor} border border-primary/40 flex items-center justify-center p-4 relative overflow-hidden`}>
                {uploadedImage ? (
                  <img src={uploadedImage} alt="Upload preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="text-center space-y-1">
                    <p className="text-xl font-extrabold text-white tracking-tight uppercase">{activeData.thumbText}</p>
                    <p className="text-xs font-bold text-amber-400 uppercase">{activeData.thumbSubText}</p>
                  </div>
                )}
                <span className="absolute bottom-2 right-2 bg-black text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold">
                  12:00
                </span>
                <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow">
                  YOUR VIDEO
                </span>
              </div>
              <div className="flex gap-2.5 text-xs">
                <div className="w-8 h-8 rounded-full bg-primary shrink-0 flex items-center justify-center text-[10px] font-semibold text-white">
                  TB
                </div>
                <div>
                  <h4 className="font-bold text-white line-clamp-2">How I Built an AI Employee for ₹0 (Step-by-Step)</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">TechBytes AI • 12K views • 2 hours ago</p>
                </div>
              </div>
            </div>

            {/* Feed Item 2: Competitor A */}
            <div className="space-y-2.5 opacity-60 hover:opacity-100 transition-opacity">
              <div className="aspect-video rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="text-center space-y-1">
                  <p className="text-xl font-extrabold text-white/50 tracking-tight uppercase">AI SECRET</p>
                  <p className="text-xs font-bold text-red-500 uppercase">Debunked</p>
                </div>
                <span className="absolute bottom-2 right-2 bg-black text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold">
                  8:45
                </span>
              </div>
              <div className="flex gap-2.5 text-xs">
                <div className="w-8 h-8 rounded-full bg-neutral-800 shrink-0 flex items-center justify-center text-[10px]">
                  💻
                </div>
                <div>
                  <h4 className="font-semibold text-white/80 line-clamp-2">Why 99% of AI Startups Will Fail</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">SaaS Chronicles • 88K views • 5 days ago</p>
                </div>
              </div>
            </div>

            {/* Feed Item 3: Competitor B */}
            <div className="space-y-2.5 opacity-60 hover:opacity-100 transition-opacity">
              <div className="aspect-video rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="text-center space-y-1">
                  <p className="text-xl font-extrabold text-white/50 tracking-tight uppercase">START</p>
                  <p className="text-xs font-bold text-purple-400 uppercase">TONIGHT</p>
                </div>
                <span className="absolute bottom-2 right-2 bg-black text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold">
                  15:20
                </span>
              </div>
              <div className="flex gap-2.5 text-xs">
                <div className="w-8 h-8 rounded-full bg-neutral-800 shrink-0 flex items-center justify-center text-[10px]">
                  🔧
                </div>
                <div>
                  <h4 className="font-semibold text-white/80 line-clamp-2">AI Business Ideas You Can Start Tonight</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">Future Tools • 389K views • 2 weeks ago</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Navigate to Analytics */}
      <GradientBorderCard
        gradient="violet"
        glow="rgba(139,92,246,0.5)"
        radius={24}
        thickness={2}
        innerClassName="p-6 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/[0.05] text-primary border border-primary/30 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Thumbnail Approved! Monitor Performance</h4>
            <p className="text-xs text-muted-foreground">Once uploaded, track audience retention drop points and conversion statistics inside our analytics workspace.</p>
          </div>
        </div>
        <Link
          href="/analytics"
          className="px-5 py-2.5 rounded-full btn-premium text-white font-semibold text-xs transition flex items-center gap-1.5 shrink-0"
        >
          Open Analytics Workspace <ArrowRight size={14} />
        </Link>
      </GradientBorderCard>
    </div>
  );
}
