"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  GitFork, Clock, ArrowRight, Sparkles, Zap, TrendingUp, FileText,
  CheckCircle2, ChevronLeft, ChevronRight, Target, Image as ImageIcon, Megaphone, Film, Heart,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
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

const RECOMMENDED_ID = 4; // AI-recommended framework (Case Study)

export default function FrameworkEngine() {
  const [selectedId, setSelectedId] = useState<number>(RECOMMENDED_ID);
  const [activeStep, setActiveStep] = useState<number>(0);

  const recommended = frameworks.find((f) => f.id === RECOMMENDED_ID) || frameworks[3];
  const currentIndex = frameworks.findIndex((f) => f.id === selectedId);
  const currentFramework = frameworks[currentIndex] || frameworks[3];

  const select = (id: number) => { setSelectedId(id); setActiveStep(0); };
  const cycle = (dir: number) => {
    const next = (currentIndex + dir + frameworks.length) % frameworks.length;
    select(frameworks[next].id);
  };

  // Predicted retention curve for the selected framework: starts at 100%,
  // front-loads the biggest drop (the "retention valley") and settles at the
  // framework's headline retention.
  const curve = useMemo(() => {
    const steps = currentFramework.steps;
    const target = retNum(currentFramework.retention);
    const remaining = 100 - target;
    const pts = [{ x: "Hook", r: 100 }];
    let r = 100;
    steps.forEach((s, i) => {
      const weight = i === 0 ? 0.28 : i === 1 ? 0.42 : 0.3 / Math.max(1, steps.length - 2);
      r = Math.max(target, r - remaining * weight);
      pts.push({ x: s.title, r: Math.round(r) });
    });
    pts[pts.length - 1].r = target;
    return pts;
  }, [currentFramework]);

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
          <h2 className="text-xl font-bold text-white">Recommended Framework: {recommended.name}</h2>
          <p className="text-xs text-muted-foreground max-w-xl">
            For topic <strong>&quot;AI Business&quot;</strong>, competitor view velocities indicate viewers crave real-world proofs and step-by-step deconstruction. Avoid generic listicles.
          </p>
          {selectedId !== recommended.id && (
            <button onClick={() => select(recommended.id)} className="mt-1 text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1">
              Use recommended framework <ArrowRight size={12} />
            </button>
          )}
        </div>

        <div className="flex gap-4 items-center shrink-0">
          <ScoreRing value={96} size={72} label="Match" caption="AI FIT" />
          <div className="grid grid-cols-2 gap-2.5">
            <StatTile
              label="Predicted Retention"
              value={recommended.retention}
              tone={toneForScore(retNum(recommended.retention))}
              icon={TrendingUp}
            />
            <StatTile
              label="Video Duration"
              value={recommended.length}
              icon={Clock}
            />
          </div>
        </div>
      </GradientBorderCard>

      {/* Stacked rows: Available Video Frameworks, then Interactive Retention Flowchart */}
      <div className="space-y-8">
        {/* Row 1: Framework cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <GitFork size={14} /> Available Video Frameworks
            </h3>
            <p className="text-[11px] text-muted-foreground">Selected: <strong className="text-primary">{currentFramework.name}</strong></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {frameworks.map((fw) => {
              const isSelected = selectedId === fw.id;
              const isRecommended = fw.id === recommended.id;
              return (
                <button
                  key={fw.id}
                  onClick={() => select(fw.id)}
                  aria-pressed={isSelected}
                  className={`group p-4 rounded-3xl text-left flex flex-col justify-between gap-5 h-52 relative border transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/60 shadow-[0_0_40px_-8px_rgba(139,92,246,0.55)]"
                      : "border-white/[0.06] bg-card shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] hover:border-primary/40 hover:-translate-y-0.5"
                  }`}
                >
                  {/* Selected / recommended flags */}
                  <div className="absolute top-3 right-3">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-white bg-primary px-2 py-1 rounded-full"><CheckCircle2 size={11} /> Selected</span>
                    ) : isRecommended ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-primary bg-primary/10 border border-primary/25 px-2 py-1 rounded-full"><Sparkles size={10} /> AI Pick</span>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-semibold text-primary bg-primary/15 px-2 py-0.5 rounded border border-primary/20">FW 0{fw.id}</span>
                    <h4 className={`text-sm font-bold leading-snug line-clamp-2 ${isSelected ? "text-white" : "text-white/90"}`}>{fw.name}</h4>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{fw.desc}</p>
                  </div>

                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center justify-between gap-2">
                      <ScoreChip value={retNum(fw.retention)}>{fw.retention} Ret.</ScoreChip>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock size={10} /> {fw.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] pt-2 border-t border-white/5">
                      <span className="text-muted-foreground flex items-center gap-1"><Heart size={10} className="text-primary/70" /> {fw.emotion}</span>
                      <span className={`font-bold flex items-center gap-1 ${isSelected ? "text-primary" : "text-white/60 group-hover:text-primary"}`}>
                        {isSelected ? "Active" : "Select"} <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Interactive Retention Flowchart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <TrendingUp size={14} /> Interactive Retention Flowchart
            </h3>
            {/* Framework switcher */}
            <div className="flex items-center gap-1.5">
              <button onClick={() => cycle(-1)} aria-label="Previous framework" className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-primary/40 transition"><ChevronLeft size={15} /></button>
              <span className="text-[11px] font-semibold text-white px-2 min-w-[130px] text-center">{currentIndex + 1} / {frameworks.length} · <span className="text-primary">Switch</span></span>
              <button onClick={() => cycle(1)} aria-label="Next framework" className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-primary/40 transition"><ChevronRight size={15} /></button>
            </div>
          </div>

          <div className="p-5 md:p-6 rounded-3xl bg-card border border-primary/20 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-56 h-56 bg-primary/[0.06] rounded-full blur-3xl pointer-events-none" />

            {/* Selected framework header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded-full"><CheckCircle2 size={10} /> Selected Framework</span>
                <h4 className="text-lg font-bold text-white flex items-center gap-2"><Target size={18} className="text-primary" /> {currentFramework.name}</h4>
                <p className="text-[11px] text-muted-foreground max-w-xl">{currentFramework.desc}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <ScoreRing value={retNum(currentFramework.retention)} size={64} caption="Retention" />
                <StatTile label="Duration" value={currentFramework.length} icon={Clock} />
              </div>
            </div>

            {/* Meta chips */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
              {([[Zap, "Hook", currentFramework.hookStyle], [Megaphone, "CTA", currentFramework.cta], [ImageIcon, "Thumbnail", currentFramework.thumbnail], [Film, "Editing", currentFramework.editingStyle], [Heart, "Emotion", currentFramework.emotion]] as const).map(([Icon, k, v]) => (
                <div key={k} className="rounded-xl bg-white/5 border border-white/10 p-2.5">
                  <span className="text-[9px] uppercase font-semibold text-primary flex items-center gap-1"><Icon size={11} /> {k}</span>
                  <p className="text-[11px] font-semibold text-white mt-1 leading-snug">{v}</p>
                </div>
              ))}
            </div>

            {/* Predicted retention curve */}
            <div className="rounded-2xl bg-neutral-950/40 border border-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">Predicted Retention Curve</span>
                <span className="text-[10px] text-primary font-bold">{curve[activeStep + 1]?.x}: {curve[activeStep + 1]?.r}%</span>
              </div>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={curve} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="retGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="x" stroke="rgba(255,255,255,0.3)" fontSize={9} interval={0} tickMargin={6} />
                    <YAxis domain={[Math.max(30, retNum(currentFramework.retention) - 20), 100]} stroke="rgba(255,255,255,0.3)" fontSize={9} />
                    <Tooltip contentStyle={{ backgroundColor: "#121216", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }} labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: "11px" }} itemStyle={{ color: "hsl(var(--primary))", fontSize: "11px" }} formatter={(v) => [`${v}%`, "Retention"]} />
                    <ReferenceLine x={curve[activeStep + 1]?.x} stroke="hsl(var(--primary))" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="r" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#retGlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Step flow nodes — click to inspect */}
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">Story Flow · tap a block</span>
              <div className="flex flex-col lg:flex-row lg:items-stretch gap-2 mt-2.5">
                {currentFramework.steps.map((step, index) => {
                  const on = activeStep === index;
                  return (
                    <React.Fragment key={step.title}>
                      <button onClick={() => setActiveStep(index)}
                        className={`flex-1 min-w-0 text-left rounded-2xl border p-3 transition-all ${on ? "border-primary bg-primary/10 ring-1 ring-primary/50" : "border-white/10 bg-white/5 hover:border-primary/30"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[8px] font-bold uppercase ${on ? "text-primary" : "text-white/40"}`}>Block 0{index + 1}</span>
                          <span className={`text-[9px] font-bold ${on ? "text-primary" : "text-white/50"}`}>{curve[index + 1]?.r}%</span>
                        </div>
                        <h5 className="text-xs font-bold text-white leading-snug">{step.title}</h5>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed line-clamp-3">{step.desc}</p>
                        <p className={`text-[9px] font-medium italic mt-1.5 ${on ? "text-primary" : "text-primary/60"}`}>🎯 {step.tip}</p>
                      </button>
                      {index < currentFramework.steps.length - 1 && (
                        <div className="flex items-center justify-center shrink-0 text-white/25">
                          <ChevronRight size={16} className="rotate-90 lg:rotate-0" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <Link
              href={`/scripts?framework=${currentFramework.id}&topic=AI Business`}
              className="w-full py-3 rounded-full btn-premium text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              Assemble Script with {currentFramework.name} <FileText size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
