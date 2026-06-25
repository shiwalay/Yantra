"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Eye, 
  UserPlus, 
  IndianRupee, 
  Info,
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceDot } from "recharts";

// Retention curves data
const videosDatabase: Record<string, any> = {
  "ai-employee": {
    title: "How I Built an AI Employee for ₹0",
    views: "45.2K",
    ctr: "7.4%",
    subs: "+1,240",
    revenue: "₹42,800",
    avd: "4:32",
    retentionData: [
      { time: "0:00", retention: 100, label: "Intro Hook" },
      { time: "0:22", retention: 55, label: "Hook Transition" }, // Drop point 1
      { time: "1:00", retention: 53, label: "PAS Setup" },
      { time: "2:00", retention: 49, label: "Middle Segment" },
      { time: "4:15", retention: 32, label: "Sponsor/Tool Intro" }, // Drop point 2
      { time: "6:00", retention: 31, label: "Case Study Breakdown" },
      { time: "8:00", retention: 29, label: "Results Reveal" },
      { time: "10:00", retention: 28, label: "Outro CTA" },
      { time: "12:00", retention: 20, label: "End" }
    ],
    drops: [
      { id: 1, time: "0:22", pct: "55%", label: "Hook Transition Drop-off", desc: "A steep 45% drop-off occurred when moving from hook to story. Pacing slowed down during the template presentation.", solution: "Add a pattern-interrupt graphic (zoom or slide overlay) within 3 seconds of starting the story segment." },
      { id: 2, time: "4:15", pct: "32%", label: "Sponsor/Tool Intro Skip", desc: "Viewers skipped forward 45 seconds during the software signup tutorial.", solution: "Do not explain signups. Show the screen recorder of the already-working dashboard instead." }
    ]
  },
  "nextjs-tutorial": {
    title: "Next.JS 16 Production Checklist",
    views: "18.4K",
    ctr: "5.8%",
    subs: "+490",
    revenue: "₹18,200",
    avd: "6:10",
    retentionData: [
      { time: "0:00", retention: 100, label: "Intro" },
      { time: "1:00", retention: 70, label: "Checklist Start" },
      { time: "2:00", retention: 65, label: "Docker Setup" },
      { time: "3:30", retention: 41, label: "Config Explainer" }, // Drop point 1
      { time: "6:00", retention: 39, label: "CI/CD Pipeline" },
      { time: "8:00", retention: 38, label: "Vercel Deploy" },
      { time: "10:00", retention: 30, label: "Outro" }
    ],
    drops: [
      { id: 1, time: "3:30", pct: "41%", label: "Config Explainer Drop-off", desc: "Dry reading of code lines caused 24% of viewers to skip to the deploy segment.", solution: "Split coding blocks with a whiteboard flowchart explaining the theory before showing code lines." }
    ]
  }
};

export default function AnalyticsDashboard() {
  const [selectedVideoKey, setSelectedVideoKey] = useState<string>("ai-employee");
  const [selectedDropId, setSelectedDropId] = useState<number | null>(1);

  const videoData = videosDatabase[selectedVideoKey] || videosDatabase["ai-employee"];
  const activeDrop = videoData.drops.find((d: any) => d.id === selectedDropId) || videoData.drops[0];

  // Best upload time mock data (Hours 12 to 23, Days Mon-Sun)
  const heatmapData = [
    { day: "Mon", hour: "12 PM", active: 40 }, { day: "Mon", hour: "3 PM", active: 60 }, { day: "Mon", hour: "6 PM", active: 85 },
    { day: "Tue", hour: "12 PM", active: 45 }, { day: "Tue", hour: "3 PM", active: 65 }, { day: "Tue", hour: "6 PM", active: 90 },
    { day: "Wed", hour: "12 PM", active: 50 }, { day: "Wed", hour: "3 PM", active: 70 }, { day: "Wed", hour: "6 PM", active: 98 }, // Optimal
    { day: "Thu", hour: "12 PM", active: 42 }, { day: "Thu", hour: "3 PM", active: 60 }, { day: "Thu", hour: "6 PM", active: 88 },
    { day: "Fri", hour: "12 PM", active: 38 }, { day: "Fri", hour: "3 PM", active: 55 }, { day: "Fri", hour: "6 PM", active: 70 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Video Selector Dropdown & Key Metrics */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Select Analyzed Video</label>
          <select
            value={selectedVideoKey}
            onChange={(e) => {
              setSelectedVideoKey(e.target.value);
              setSelectedDropId(1);
            }}
            className="bg-[#121216] border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-bold"
          >
            <option value="ai-employee">How I Built an AI Employee for ₹0</option>
            <option value="nextjs-tutorial">Next.JS 16 Production Checklist</option>
          </select>
        </div>

        <div className="flex gap-4 text-xs">
          <span className="text-[10px] text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1">
            <Clock size={12} /> Average View Duration: {videoData.avd}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-black"><Eye size={12} /> Total Views</span>
          <p className="text-xl font-bold text-white">{videoData.views}</p>
          <span className="text-[9px] text-success font-semibold flex items-center gap-0.5">+14.2% (28d)</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-black"><TrendingUp size={12} /> Average CTR</span>
          <p className="text-xl font-bold text-white">{videoData.ctr}</p>
          <span className="text-[9px] text-success font-semibold flex items-center gap-0.5">Above channel avg (+0.8%)</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-black"><UserPlus size={12} /> Subscriber Gain</span>
          <p className="text-xl font-bold text-white">{videoData.subs}</p>
          <span className="text-[9px] text-success font-semibold flex items-center gap-0.5">Conversion rate: 2.1%</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-black"><IndianRupee size={12} /> Revenue Earnings</span>
          <p className="text-xl font-bold text-white">{videoData.revenue}</p>
          <span className="text-[9px] text-success font-semibold flex items-center gap-0.5">RPM: ₹946.00</span>
        </div>
      </div>

      {/* Recharts Area Chart and Drop points info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Retention Chart */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Audience Retention Curve
            </h3>
            <span className="text-xs text-muted-foreground">Click dot markers or list to analyze drops</span>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10 h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={videoData.retentionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="retentionGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#121216", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: "11px" }}
                  itemStyle={{ color: "hsl(var(--primary))", fontSize: "11px" }}
                  formatter={(value: any, name: any, props: any) => [`${value}% (${props.payload.label})`, "Retention"]}
                />
                <Area type="monotone" dataKey="retention" stroke="hsl(var(--primary))" strokeWidth={2.5} fillOpacity={1} fill="url(#retentionGlow)" />
                
                {/* Reference Dots for Drop points */}
                {videoData.drops.map((drop: any) => {
                  const node = videoData.retentionData.find((pt: any) => pt.time === drop.time);
                  if (!node) return null;
                  return (
                    <ReferenceDot
                      key={drop.id}
                      x={drop.time}
                      y={node.retention}
                      r={selectedDropId === drop.id ? 7 : 5}
                      fill={selectedDropId === drop.id ? "hsl(var(--primary))" : "#ef4444"}
                      stroke="#fff"
                      strokeWidth={1.5}
                      className="cursor-pointer"
                      onClick={() => setSelectedDropId(drop.id)}
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Drop point decision editor */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Retention Drop Diagnostics
          </h3>

          <div className="space-y-3">
            {videoData.drops.map((drop: any) => {
              const isSelected = selectedDropId === drop.id;
              return (
                <button
                  key={drop.id}
                  onClick={() => setSelectedDropId(drop.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                    isSelected 
                      ? "border-red-500/40 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
                      : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      Drop at {drop.time}
                    </span>
                    <strong className="text-xs text-white">{drop.pct} retention</strong>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{drop.label}</h4>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Expanded Drop Diagnostic Details */}
      <AnimatePresence mode="wait">
        {activeDrop && (
          <motion.div
            key={activeDrop.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-5 rounded-2xl glass-panel border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-black text-red-400 flex items-center gap-1"><AlertTriangle size={10} /> The Problem</span>
              <h4 className="text-xs font-bold text-white">{activeDrop.label} Deconstruction</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{activeDrop.desc}</p>
            </div>
            <div className="space-y-2 border-l border-white/5 pl-0 md:pl-6">
              <span className="text-[9px] uppercase font-black text-success flex items-center gap-1"><Sparkles size={10} /> AI Coach Decision</span>
              <h4 className="text-xs font-bold text-white">How to fix this in your next video</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{activeDrop.solution}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Publish Hour Heatmap & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Upload Heatmap */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Calendar size={14} className="text-primary" /> Peak Audience Activity & Best Upload Time
          </h3>

          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex gap-6 text-[10px] text-muted-foreground">
              <span>Best Day: <strong className="text-white">Wednesday</strong></span>
              <span>Best Hour: <strong className="text-white">6:00 PM</strong></span>
            </div>

            {/* Simulated Heatmap blocks */}
            <div className="grid grid-cols-5 gap-2">
              {heatmapData.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg text-center flex flex-col justify-between items-center transition-all ${
                    item.active >= 95 
                      ? "bg-primary text-black border border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
                      : item.active >= 70 
                      ? "bg-primary/20 text-white border border-primary/20" 
                      : "bg-white/5 text-muted-foreground border border-white/5"
                  }`}
                >
                  <span className="text-[9px] uppercase font-black">{item.day}</span>
                  <span className="text-xs font-bold my-1">{item.hour}</span>
                  <span className="text-[8px] font-bold opacity-80">{item.active}% active</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Future Recommendations */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary animate-pulse" /> Next Video Decisions
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <p className="font-bold text-white">Create: "AI Employee Client Acquisition"</p>
                <p className="text-[10px] text-muted-foreground leading-normal mt-1">
                  Viewer spikes during the "framework blueprint" segment of your last video indicate strong interest in actual implementation. 
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <p className="font-bold text-white">Target Length: 10m (PAS Framework)</p>
                <p className="text-[10px] text-muted-foreground leading-normal mt-1">
                  Your longer 15m videos are losing session velocity. Keep pacing fast and under 10m to maximize YouTube recommendation loops.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/research?topic=AI Client Acquisition"
            className="w-full mt-4 py-2.5 rounded-xl bg-primary hover:bg-primary-foreground text-black text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
          >
            Research Topic <ArrowRight size={14} />
          </Link>
        </div>

      </div>

    </div>
  );
}
