"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GitFork, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  Play, 
  Sparkles, 
  Eye,
  Zap,
  TrendingUp,
  Volume2,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StatTile, ScoreChip, ScoreRing, toneForScore } from "@/components/vidiq";
import { GradientBorderCard } from "@/components/gradient";

// Parse a retention string like "93%" into a 0-100 number for the vidIQ kit.
const retNum = (r: string) => parseInt(r, 10) || 0;

const frameworks = [
  {
    id: 1,
    name: "Problem-Agitate-Solution-Proof",
    desc: "Best for software demos, B2B services, and problem-solving guides.",
    retention: "93%",
    length: "10 min",
    hookStyle: "Pain point introduction",
    cta: "Lead Magnet / Guide download",
    thumbnail: "Extreme Reaction + Zoomed UI",
    editingStyle: "Fast-paced with popups",
    emotion: "Frustration to Relief",
    steps: [
      { title: "Problem", desc: "Define the creator's pain point in under 15 seconds.", tip: "Use a zoom pattern-interrupt." },
      { title: "Agitate", desc: "Elaborate why ignoring this problem destroys growth.", tip: "Add dark sound design." },
      { title: "Solution", desc: "Introduce your tool/service as the key resolution.", tip: "Clear overlay graphic." },
      { title: "Proof", desc: "Show client dashboards or screen recordings.", tip: "Keep proof fast (5-sec clips)." },
      { title: "CTA", desc: "Offer the free PDF/Template in the pinned comment.", tip: "End screen with point card." }
    ]
  },
  {
    id: 2,
    name: "Story-Conflict-Discovery-Lesson",
    desc: "Best for vlogs, personal branding, docu-style essays, and bio-videos.",
    retention: "89%",
    length: "15 min",
    hookStyle: "In media res (start mid-action)",
    cta: "Newsletter signup",
    thumbnail: "Real Landscape + Mysterious Title",
    editingStyle: "Cinematic, documentary flow",
    emotion: "Curiosity & Empathy",
    steps: [
      { title: "Story", desc: "Open at the absolute lowest point of your journey.", tip: "Remove music for raw emotion." },
      { title: "Conflict", desc: "The brick wall: details of why it looked hopeless.", tip: "Introduce tension beats." },
      { title: "Discovery", desc: "The 'aha' moment of realization.", tip: "Slow push-in zoom." },
      { title: "Lesson", desc: "Break down the core framework you discovered.", tip: "Write key steps on screen." },
      { title: "CTA", desc: "Drive users to read the full story in your letter.", tip: "Keep speech energetic." }
    ]
  },
  {
    id: 3,
    name: "Challenge-Obstacle-Win-Lesson",
    desc: "Best for challenge videos ('I spent 30 days doing X') and experiments.",
    retention: "91%",
    length: "12 min",
    hookStyle: "Extreme stakes commitment",
    cta: "Product pitch",
    thumbnail: "Face + Split screen comparison",
    editingStyle: "Vloggy, countdown indicators",
    emotion: "Excitement & Anticipation",
    steps: [
      { title: "Challenge", desc: "Introduce the rules and the deadline.", tip: "Use large on-screen countdowns." },
      { title: "Obstacle", desc: "Show where you wanted to quit at Day 10.", tip: "Use raw phone camera footage." },
      { title: "Win", desc: "Reveal the final results and reward.", tip: "Vibrant high-contrast grading." },
      { title: "Lesson", desc: "Explain the repeatable blueprint for the viewers.", tip: "Summary bullet points." }
    ]
  },
  {
    id: 4,
    name: "Case Study-Analysis-Action",
    desc: "Best for breakdowns of famous companies, creators, or campaigns.",
    retention: "94%",
    length: "12 min",
    hookStyle: "Proof and shocking statistics",
    cta: "Consulting strategy call",
    thumbnail: "Brand Logo + Face + Arrow",
    editingStyle: "Highly visual, whiteboard graphics",
    emotion: "Aha! Realization",
    steps: [
      { title: "Case Study", desc: "State the incredible success of [Brand/Person].", tip: "Show a line chart spiking." },
      { title: "Analysis", desc: "Deconstruct the 3 variables that caused it.", tip: "Color-coded section slides." },
      { title: "Framework", desc: "Synthesize these into a reusable framework.", tip: "Show flowchart overlays." },
      { title: "Action", desc: "Give the exact next steps for the viewer.", tip: "Link next video bridge." }
    ]
  },
  {
    id: 5,
    name: "Myth-Truth-Evidence-CTA",
    desc: "Best for contrarian opinion pieces and debunking industry lies.",
    retention: "87%",
    length: "8 min",
    hookStyle: "Contrarian shock statement",
    cta: "Free software trial",
    thumbnail: "Big Red 'X' on popular beliefs",
    editingStyle: "Rapid cuts and text highlights",
    emotion: "Disbelief and Curiosity",
    steps: [
      { title: "Myth", desc: "State the common lie everyone in your niche believes.", tip: "Use a mock tweet visual." },
      { title: "Truth", desc: "Reveal why this myth is holding them back.", tip: "Sound design: record scratch." },
      { title: "Evidence", desc: "Provide data, graphs, and logic proving it wrong.", tip: "Show official research paper screenshots." },
      { title: "Example", desc: "Show a person who succeeded by doing the opposite.", tip: "Short video clip cameo." },
      { title: "CTA", desc: "Show the tool that helps automate the true way.", tip: "Highlight button click." }
    ]
  },
  {
    id: 6,
    name: "Future Prediction-Current Problem-Action",
    desc: "Best for tech reviews, trend forecasting, and industry updates.",
    retention: "90%",
    length: "18 min",
    hookStyle: "Fear of missing out (FOMO) / Change",
    cta: "SaaS Trial signups",
    thumbnail: "Futuristic assets + Glowing dates",
    editingStyle: "Cyberpunk visuals, sound sweeps",
    emotion: "Urgency and Empowerment",
    steps: [
      { title: "Future", desc: "Paint the picture of the industry in 3 years.", tip: "Use epic cinematic stock footage." },
      { title: "Current", desc: "Show why current skills/tools will be obsolete.", tip: "Fast transition sound sweep." },
      { title: "Trend", desc: "Explain the data signals backing this shift.", tip: "Overlay live terminal or data feeds." },
      { title: "Prediction", desc: "Specify the exact winners and losers.", tip: "Use side-by-side comparison charts." },
      { title: "Action", desc: "Tell the audience how to prepare starting today.", tip: "Call to action with time urgency." }
    ]
  }
];

export default function FrameworkEngine() {
  const [selectedId, setSelectedId] = useState<number>(4); // Case Study default

  const currentFramework = frameworks.find((f) => f.id === selectedId) || frameworks[3];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Recommendation */}
      <GradientBorderCard
        gradient="violet"
        glow="rgba(139,92,246,0.45)"
        radius={24}
        thickness={2}
        innerClassName="p-6 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
            <Sparkles size={10} /> AI Recommendation Match: 96%
          </div>
          <h2 className="text-xl font-bold text-white">Recommended Framework: Case Study Analysis</h2>
          <p className="text-xs text-muted-foreground max-w-xl">
            For topic <strong>"AI Business"</strong>, competitor view velocities indicate viewers crave real-world proofs and step-by-step deconstruction. Avoid generic listicles.
          </p>
        </div>

        <div className="flex gap-4 items-center shrink-0">
          <ScoreRing value={96} size={72} label="Match" caption="AI FIT" />
          <div className="grid grid-cols-2 gap-2.5">
            <StatTile
              label="Predicted Retention"
              value={currentFramework.retention}
              tone={toneForScore(retNum(currentFramework.retention))}
              icon={TrendingUp}
            />
            <StatTile
              label="Video Duration"
              value={currentFramework.length}
              icon={Clock}
            />
          </div>
        </div>
      </GradientBorderCard>

      {/* Grid Layout: Left Framework cards, Right Interactive Timeline preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Cards */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <GitFork size={14} /> Available Video Frameworks
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {frameworks.map((fw) => {
              const isSelected = selectedId === fw.id;
              return (
                <button
                  key={fw.id}
                  onClick={() => setSelectedId(fw.id)}
                  className={`p-4 rounded-3xl bg-card shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] border text-left flex flex-col justify-between gap-6 h-48 relative ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-white/[0.06]"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-semibold text-primary bg-primary/20 px-2 py-0.5 rounded border border-primary/20">
                        FW 0{fw.id}
                      </span>
                      <ScoreChip value={retNum(fw.retention)}>
                        {fw.retention} Ret.
                      </ScoreChip>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">{fw.name}</h4>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {fw.desc}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 border-t border-white/5 mt-auto">
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {fw.length}
                    </span>
                    <span className="text-primary font-bold group-hover:underline flex items-center gap-0.5">
                      Select {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Flowchart & Decisional Rules */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Interactive Retention Flowchart
          </h3>

          <div className="p-6 rounded-3xl bg-card border border-white/[0.06] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-primary/[0.05] rounded-full blur-2xl" />

            <div className="pb-3 border-b border-white/5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500 animate-bounce" /> {currentFramework.name} Rules
              </h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">Custom structured rules recommended by the coach.</p>
            </div>

            {/* Strategic Details */}
            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div>
                <span className="text-[9px] text-muted-foreground uppercase font-semibold block">Hook style</span>
                <span className="font-bold text-white">{currentFramework.hookStyle}</span>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground uppercase font-semibold block">CTA Trigger</span>
                <span className="font-bold text-white">{currentFramework.cta}</span>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground uppercase font-semibold block">Thumbnail Concept</span>
                <span className="font-bold text-white">{currentFramework.thumbnail}</span>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground uppercase font-semibold block">Editing Speed</span>
                <span className="font-bold text-white">{currentFramework.editingStyle}</span>
              </div>
            </div>

            {/* Steps Timeline Flowchart */}
            <div className="relative pl-4 space-y-4 border-l border-white/10 pt-1">
              {currentFramework.steps.map((step, index) => (
                <div key={step.title} className="relative group/step">
                  {/* Timeline bullet */}
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-900 border border-white/30 group-hover/step:border-primary group-hover/step:bg-primary transition-all shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                  
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-white/40 uppercase">Block 0{index+1}</span>
                      <h5 className="text-xs font-bold text-white">{step.title}</h5>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                    <p className="text-[9px] text-primary/80 font-medium italic">🎯 {step.tip}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href={`/scripts?framework=${currentFramework.id}&topic=AI Business`}
                className="w-full py-2.5 rounded-full btn-premium text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
              >
                Assemble Script Engine <FileText size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
