"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Circle,
  Activity,
  TrendingUp,
  Clock,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

// "Alive AI" Loading Component
function AliveLoadingState({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing YouTube...",
    "Checking 1,293 videos...",
    "Finding content gaps...",
    "Studying competitors...",
    "Building your strategy...",
    "Done."
  ];

  useEffect(() => {
    if (step < steps.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => onComplete(), 600);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="w-full mt-6 p-4 rounded-[16px] bg-card border border-primary/20 shadow-[0_0_30px_rgba(139,92,246,0.15)] flex flex-col gap-3"
    >
      <div className="flex items-center justify-between text-xs font-semibold text-primary">
        <span className="flex items-center gap-2">
          <Sparkles size={14} className={step < steps.length - 1 ? "animate-pulse" : ""} />
          {steps[step]}
        </span>
        <span>{Math.round((step / (steps.length - 1)) * 100)}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          transition={{ ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

export default function CommandCenter() {
  const router = useRouter();
  const [topicInput, setTopicInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem("yantra_onboarded");
    if (!onboarded) {
      router.push("/onboarding");
    }
  }, [router]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    setIsGenerating(true);
  };

  const onGenerationComplete = () => {
    // In a real app, this would route to the unified unified workflow page.
    // For now, we simulate redirecting to the first step of the unified builder.
    router.push("/scripts"); 
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[800px] mx-auto space-y-8 pb-20 pt-4 md:pt-10"
    >
      {/* Personalized Hero */}
      <motion.div variants={itemVariants} className="text-center space-y-3">
        <h1 className="text-[clamp(32px,5vw,48px)] font-black text-foreground tracking-tight leading-tight">
          Good Morning, Swapnil
        </h1>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 shadow-sm">
          <Activity size={16} className="text-primary" />
          <span className="text-sm font-semibold text-muted-foreground">Today's Growth Score:</span>
          <span className="text-sm font-black text-foreground">82/100</span>
        </div>
      </motion.div>

      {/* The Single Input AI Engine */}
      <motion.div variants={itemVariants} className="w-full relative z-10">
        <form onSubmit={handleGenerate} className="relative w-full group">
          {/* Animated glow behind input */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[24px] blur-xl opacity-50 group-hover:opacity-100 transition duration-500 pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row items-center bg-card border border-border/50 rounded-[20px] shadow-2xl overflow-hidden focus-within:border-primary/50 transition-colors p-2 gap-2">
            <div className="flex-1 w-full flex items-center px-4 py-2">
              <Sparkles className="text-muted-foreground shrink-0 mr-3" size={20} />
              <input 
                type="text"
                placeholder="What video do you want to make?"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                disabled={isGenerating}
                className="w-full bg-transparent border-none outline-none text-foreground text-lg md:text-xl font-medium placeholder:text-muted-foreground/50 disabled:opacity-50"
              />
            </div>
            <button 
              type="submit"
              disabled={isGenerating || !topicInput.trim()}
              className="w-full md:w-auto px-6 py-4 md:py-3 rounded-[14px] bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] shrink-0 flex items-center justify-center gap-2"
            >
              Generate Strategy <ArrowRight size={18} />
            </button>
          </div>
        </form>

        <AnimatePresence>
          {isGenerating && <AliveLoadingState onComplete={onGenerationComplete} />}
        </AnimatePresence>
      </motion.div>

      {/* Outcome-Driven Daily Dashboard */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* Today's Mission Workflow */}
        <div className="p-6 md:p-8 rounded-[24px] bg-card border border-border/40 shadow-xl flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b border-border/30 mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <Activity size={16} className="text-primary" /> Today's Mission
            </h3>
            <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded">In Progress</span>
          </div>

          <div className="space-y-6 flex-1">
            <div className="flex items-start gap-4 opacity-50">
              <CheckCircle2 size={20} className="text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground line-through decoration-2 decoration-success/50">Find Winning Topic</p>
                <p className="text-xs text-muted-foreground mt-1">"AI SaaS Automation" selected</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 size={20} className="text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">Write Script</p>
                <p className="text-xs text-muted-foreground mt-1">Draft completed. Ready for review.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 relative">
              {/* Active Indicator Pulse */}
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary animate-ping" />
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
              
              <Circle size={20} className="text-primary shrink-0 mt-0.5 ml-2" strokeWidth={3} />
              <div className="ml-2">
                <p className="text-sm font-bold text-primary">Design Thumbnail</p>
                <p className="text-xs text-muted-foreground mt-1">Pending AI composition scoring.</p>
                <button className="mt-3 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors border border-primary/20">
                  Do it now &rarr;
                </button>
              </div>
            </div>
            <div className="flex items-start gap-4 opacity-50">
              <Circle size={20} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">Rank Higher (SEO)</p>
                <p className="text-xs text-muted-foreground mt-1">Pending video file.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 opacity-50">
              <Clock size={20} className="text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">Publish</p>
                <p className="text-xs text-muted-foreground mt-1">Scheduled for Tomorrow, 11:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Impact / Outcome Metrics */}
        <div className="flex flex-col gap-6">
          <div className="p-6 md:p-8 rounded-[24px] bg-card border border-border/40 shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent pointer-events-none" />
            <TrendingUp size={24} className="text-success mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
              Estimated Growth Impact
            </h3>
            <p className="text-4xl font-black text-foreground tracking-tighter">
              +145 <span className="text-lg text-muted-foreground font-semibold tracking-normal">Subs</span>
            </p>
            <p className="text-xs text-muted-foreground mt-3 max-w-[200px] leading-relaxed">
              Completing today's mission keeps you on track for a 12% MoM channel growth.
            </p>
          </div>

          <div className="p-6 rounded-[24px] bg-primary/10 border border-primary/20 shadow-lg flex items-center justify-between group cursor-pointer hover:bg-primary/20 transition-colors">
            <div>
              <h3 className="text-sm font-black text-primary">Resume Workflow</h3>
              <p className="text-xs text-primary/70 mt-1 font-medium">Jump straight to the Thumbnail engine.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
              <Play size={16} className="ml-1" />
            </div>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
