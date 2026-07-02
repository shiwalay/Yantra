"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, ArrowRight, FileText, Image as ImageIcon, Search, Globe,
  TrendingUp, Eye, Users, Video, Play, Film, Clock,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MetricAreaCard, GradientCard, ActivityRow, CategoryBar } from "@/components/brink";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const viewsData = [{ v: 20 }, { v: 32 }, { v: 26 }, { v: 44 }, { v: 38 }, { v: 56 }, { v: 64 }, { v: 72 }];
const subsData = [{ v: 30 }, { v: 34 }, { v: 31 }, { v: 40 }, { v: 38 }, { v: 33 }, { v: 42 }, { v: 39 }];

const ACTIVITY = [
  { icon: FileText, title: "Script generated — Cold Email for Agencies", time: "Today, 2:14 PM", amount: "+1 draft", positive: true, color: "#8B5CF6" },
  { icon: ImageIcon, title: "Thumbnail scored 87/100", time: "Today, 11:02 AM", amount: "High CTR", positive: true, color: "#22D3EE" },
  { icon: Search, title: "Keyword researched — AI Business", time: "Yesterday, 6:40 PM", amount: "92 score", positive: true, color: "#34D399" },
  { icon: TrendingUp, title: "Retention drop flagged at 0:22", time: "Nov 26, 3:20 PM", amount: "−45%", positive: false, color: "#F87171" },
  { icon: Globe, title: "SEO optimized — 10 tags added", time: "Nov 25, 9:12 AM", amount: "Ready", positive: true, color: "#F472B6" },
];

const CATEGORIES = [
  { icon: Video, label: "Tutorials", value: 78, color: "#8B5CF6", caption: "24 videos published" },
  { icon: Play, label: "Shorts", value: 64, color: "#34D399", caption: "18 shorts this month" },
  { icon: Eye, label: "Reviews", value: 45, color: "#22D3EE", caption: "9 videos published" },
  { icon: Film, label: "Vlogs", value: 30, color: "#F472B6", caption: "6 videos published" },
];

function AliveLoadingState({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const steps = ["Analyzing YouTube...", "Checking 1,293 videos...", "Finding content gaps...", "Studying competitors...", "Building your strategy...", "Done."];
  useEffect(() => {
    if (step < steps.length - 1) {
      const t = setTimeout(() => setStep((s) => s + 1), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => onComplete(), 600);
    return () => clearTimeout(t);
  }, [step, onComplete]);
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
      className="w-full mt-4 p-4 rounded-2xl bg-card border border-primary/20 flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-semibold text-primary">
        <span className="flex items-center gap-2"><Sparkles size={14} className={step < steps.length - 1 ? "animate-pulse" : ""} /> {steps[step]}</span>
        <span>{Math.round((step / (steps.length - 1)) * 100)}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: "0%" }} animate={{ width: `${(step / (steps.length - 1)) * 100}%` }} transition={{ ease: "easeInOut" }} />
      </div>
    </motion.div>
  );
}

export default function CommandCenter() {
  const router = useRouter();
  const [topicInput, setTopicInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("yantra_onboarded")) router.push("/onboarding");
  }, [router]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    setIsGenerating(true);
  };
  const onGenerationComplete = () => router.push(`/scripts?topic=${encodeURIComponent(topicInput)}`);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Create bar */}
      <motion.div variants={itemVariants}>
        <form onSubmit={handleGenerate} className="relative group">
          <div className="surface-elevated flex flex-col md:flex-row items-center rounded-2xl overflow-hidden focus-within:border-primary/50 transition-colors p-2 gap-2">
            <div className="flex-1 w-full flex items-center px-3 py-1.5">
              <Sparkles className="text-muted-foreground shrink-0 mr-3" size={20} />
              <input type="text" placeholder="What video do you want to make?" value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)} disabled={isGenerating}
                className="w-full bg-transparent border-none outline-none text-foreground text-base md:text-lg font-medium placeholder:text-muted-foreground/50 disabled:opacity-50" />
            </div>
            <button type="submit" disabled={isGenerating || !topicInput.trim()}
              className="btn-premium w-full md:w-auto px-6 py-3 rounded-xl disabled:opacity-50 disabled:saturate-50 text-white font-semibold shrink-0 flex items-center justify-center gap-2">
              Generate Strategy <ArrowRight size={18} />
            </button>
          </div>
        </form>
        <AnimatePresence>{isGenerating && <AliveLoadingState onComplete={onGenerationComplete} />}</AnimatePresence>
      </motion.div>

      {/* Row 1: metrics + gradient balance */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <MetricAreaCard label="Views · Last 30 Days" value="248.7K" delta="+12%" up color="#34D399" icon={Eye} data={viewsData} />
        <MetricAreaCard label="Subscribers · Last 30 Days" value="+1,240" delta="-4%" up={false} color="#F87171" icon={Users} data={subsData} />
        <GradientCard label="Est. Monthly Revenue" value="$4,827" last4="4827" expiry="03/26" holder="Swapnil B." badge="Growth Pro" />
      </motion.div>

      {/* Row 2: activity + categories */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent activity */}
        <div className="lg:col-span-2 rounded-3xl bg-card border border-white/[0.06] p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-white">Recent Activity</h3>
            <button onClick={() => router.push("/analytics")}
              className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-3 py-1.5 rounded-lg transition-colors">
              View all
            </button>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {ACTIVITY.map((a) => <ActivityRow key={a.title} {...a} />)}
          </div>
        </div>

        {/* Content categories */}
        <div className="rounded-3xl bg-card border border-white/[0.06] p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
          <h3 className="text-base font-semibold text-white mb-5">Content Categories</h3>
          <div className="space-y-5">
            {CATEGORIES.map((c) => <CategoryBar key={c.label} {...c} />)}
          </div>
        </div>
      </motion.div>

      {/* Today's Mission */}
      <motion.div variants={itemVariants} className="rounded-3xl bg-card border border-white/[0.06] p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white">Today's Mission</h3>
          <span className="text-[10px] uppercase font-bold text-warning bg-warning/10 border border-warning/20 px-2 py-1 rounded">In Progress</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/5 p-4 flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0"><FileText size={15} /></span>
            <div><p className="text-xs font-semibold text-white">Script drafted</p><p className="text-[10px] text-muted-foreground">Ready for review</p></div>
          </div>
          <button onClick={() => router.push("/thumbnails")} className="rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors p-4 flex items-center gap-3 text-left">
            <span className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0"><ImageIcon size={15} /></span>
            <div><p className="text-xs font-semibold text-primary">Design Thumbnail</p><p className="text-[10px] text-primary/70">Do it now →</p></div>
          </button>
          <div className="rounded-2xl bg-white/5 border border-white/5 p-4 flex items-center gap-3 opacity-60">
            <span className="w-9 h-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0"><Clock size={15} /></span>
            <div><p className="text-xs font-semibold text-white">Publish</p><p className="text-[10px] text-muted-foreground">Tomorrow, 11:00 AM</p></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
