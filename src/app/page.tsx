"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Play, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  DollarSign, 
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Flame,
  Search,
  FileText,
  Zap,
  Star,
  Building,
  GitFork,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientBorderCard, GradientBadge } from "@/components/gradient";

const FEATURES = [
  { n: "01", color: "#8B5CF6", grad: "violet", Icon: Search, title: "Trend & Opportunity Research",
    desc: "Find breakout keywords with 90%+ volume surges. Analyze competitor view velocities (views/hour) before you script.", kind: "trend" },
  { n: "02", color: "#22D3EE", grad: "cool", Icon: GitFork, title: "6 Proven Video Frameworks",
    desc: "Structure layouts with Case Study, Story Conflict, PAS, or Future Prediction models — with recommended watch-times.", kind: "frameworks" },
  { n: "03", color: "#F472B6", grad: "pink", Icon: FileText, title: "Paced Scripting Editor",
    desc: "Generate interactive drafts matching your framework. Place auditory cues, visual pattern interrupts, and hook variations.", kind: "script" },
  { n: "04", color: "#34D399", grad: "emerald", Icon: Globe, title: "Scorecard SEO Optimizer",
    desc: "Optimize titles by predicted CTR weight. Auto-create chapters, pinned-comment triggers, and tags.", kind: "seo" },
];

const WAVE = [8, 18, 11, 26, 14, 33, 20, 38, 16, 29, 12, 34, 22, 40, 18, 30, 14, 24, 10, 21, 31, 16, 27, 12, 23, 35, 18, 28, 14, 24];

function FeatureGraphic({ kind, color }: { kind: string; color: string }) {
  if (kind === "trend") {
    const bars = [14, 20, 17, 30, 25, 42, 37, 54];
    return (
      <svg viewBox="0 0 220 60" className="w-full h-16">
        {bars.map((h, i) => <rect key={i} x={i * 27 + 5} y={60 - h} width="15" height={h} rx="3" fill={color} opacity={0.18} />)}
        <polyline points="12,47 39,41 66,44 93,31 120,35 147,19 174,24 201,7" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="201" cy="7" r="8" fill={color} opacity="0.25" />
        <circle cx="201" cy="7" r="4" fill={color} />
      </svg>
    );
  }
  if (kind === "frameworks") {
    const bars = [30, 44, 26, 52, 38, 48];
    return (
      <svg viewBox="0 0 220 60" className="w-full h-16">
        {bars.map((h, i) => <rect key={i} x={i * 36 + 6} y={60 - h} width="24" height={h} rx="5" fill={color} opacity={0.28 + i * 0.11} />)}
      </svg>
    );
  }
  if (kind === "script") {
    return (
      <svg viewBox="0 0 220 60" className="w-full h-16">
        <line x1="2" y1="30" x2="218" y2="30" stroke={color} strokeOpacity="0.15" strokeWidth="1" />
        {WAVE.map((h, i) => <rect key={i} x={i * 7.2 + 4} y={30 - h / 2} width="3" height={h} rx="1.5" fill={color} opacity="0.6" />)}
        <circle cx="63" cy="30" r="4" fill={color} /><circle cx="153" cy="30" r="4" fill={color} />
      </svg>
    );
  }
  // seo — scorecard bars
  const bars = [0.92, 0.64, 0.8];
  return (
    <svg viewBox="0 0 220 60" className="w-full h-16">
      {bars.map((w, i) => (
        <g key={i}>
          <rect x="0" y={7 + i * 18} width="220" height="9" rx="4.5" fill={color} opacity="0.12" />
          <rect x="0" y={7 + i * 18} width={220 * w} height="9" rx="4.5" fill={color} />
        </g>
      ))}
    </svg>
  );
}

export default function MarketingLandingPage() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  useEffect(() => {
    setIsOnboarded(localStorage.getItem("influq_onboarded") === "true");
  }, []);
  const [activeDemoTab, setActiveDemoTab] = useState("decision");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const isAnnual = billingCycle === "annual";
  const displayPrice = isAnnual ? "₹2,499" : "₹2,999";
  const billedAnnually = "₹29,988";

  const handleStartFree = () => {
    // Route to the real signup flow.
    window.location.href = "/login?mode=signup";
  };

  const handleSignIn = () => {
    window.location.href = "/login";
  };

  const handleOAuthLogin = () => {
    window.location.href = "/login";
  };

  const faqs = [
    { q: "Is InfluQ just another keyword tool like vidIQ or TubeBuddy?", a: "No. Traditional tools give you charts and search volumes. InfluQ gives you decisions. Our AI tells you exactly WHAT video to make next, WHICH framework to structure it with, and HOW to write hook pacing to maintain 80%+ audience retention." },
    { q: "How secure is the YouTube channel OAuth connection?", a: "Completely secure. We use official Google OAuth 256-bit encrypted read-only tokens. InfluQ reads your analytics data to find retention drops, but we never store your account credentials or publish videos without permission." },
    { q: "Can I use InfluQ if I have zero subscribers?", a: "Yes! In fact, the Creator Starter plan is designed specifically to help solo channels bypass the 'zero-views' zone by using proven visual frameworks and high-opportunity breakout search trends." },
    { q: "Can I cancel my subscription anytime?", a: "Yes. You can manage, upgrade, or cancel your subscription instantly inside your Billing portal. There are no long-term contracts." }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-foreground font-sans relative overflow-x-hidden">
      
      {/* Glow Orbs background — restrained ambient tint */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary glow-orb opacity-[0.05]" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary glow-orb opacity-[0.04]" />
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-[0.12]" />

      {/* Header Nav */}
      <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#0a0a0c]/85 backdrop-blur-md max-w-7xl mx-auto rounded-b-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <YoutubeIcon size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Influ<span className="text-primary">Q</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-muted-foreground">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#compare" className="hover:text-white transition-colors">Comparison</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          {isOnboarded ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <button
                onClick={handleSignIn}
                className="hidden sm:block text-xs font-bold text-white hover:text-primary transition-colors px-3 py-1.5"
              >
                Sign In
              </button>
              <button
                onClick={handleStartFree}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition"
              >
                Start Free
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center space-y-6 max-w-4xl mx-auto px-6 relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest">
          <Sparkles size={12} /> The Next-Gen Creator Engine
        </div>

        <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.02]">
          Build videos <span className="text-gradient-brand">people watch</span>,<br />
          <span className="text-gradient-brand">YouTube recommends</span>, and businesses profit from.
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Instead of giving you complex charts and search volume metrics, InfluQ gives you decisions. We guide your channel from idea research to viral scripting, design audits, and analytics.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <button
            onClick={handleStartFree}
            className="btn-premium w-full sm:w-auto px-7 py-3.5 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-1.5"
          >
            Start Free - 10s Setup <ArrowRight size={15} />
          </button>
          <button
            onClick={() => setShowDemoVideo(true)}
            className="btn-pill w-full sm:w-auto px-7 py-3.5 text-white font-semibold text-sm flex items-center justify-center gap-1.5"
          >
            Watch Demo <Play size={14} className="text-primary fill-primary" />
          </button>
        </div>

        {/* Small trusted indicator */}
        <div className="pt-12 text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center justify-center gap-4">
          <span>Trusted by 10K+ Creators</span>
          <span>•</span>
          <span>Google OAuth Verified</span>
          <span>•</span>
          <span>₹12Cr+ Generated Client Pipeline</span>
        </div>
      </section>

      {/* Interactive AI Product Demo */}
      <section className="py-12 max-w-5xl mx-auto px-6" id="features">
        <div className="p-6 rounded-3xl bg-card border border-white/[0.06] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Interactive Product Preview</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Toggle tabs to see how our AI gives decisions, not just raw stats.</p>
            </div>

            {/* Selector tabs */}
            <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/5 shrink-0 text-[10px] font-semibold">
              {[
                { id: "decision", label: "Coach Decisions" },
                { id: "script", label: "Scripting visualizer" },
                { id: "retention", label: "Retention diagnostics" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDemoTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeDemoTab === tab.id ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[220px] flex items-center justify-center bg-neutral-950/30 rounded-2xl p-4 border border-white/5 relative">
            <AnimatePresence mode="wait">
              {activeDemoTab === "decision" && (
                <motion.div
                  key="decision"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 w-full max-w-2xl"
                >
                  <div className="inline-flex items-center gap-1 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[9px] font-bold">
                    <Sparkles size={8} /> Today's Decision Alert
                  </div>
                  <h4 className="text-lg font-semibold text-white">Create: "How I Built an AI Employee for ₹0"</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Our Trend Engine detected a **340% search volume breakout** for "cheap AI agents" on Google. Competitor 'TechGrowth' got 85K views using a story layout last week. Our model predicts this topic can bring in **45K+ views** for your channel.
                  </p>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-center text-xs">
                      <span className="text-[9px] text-muted-foreground block uppercase font-bold">Best Framework</span>
                      <strong className="text-white mt-0.5 block">Case Study</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-center text-xs">
                      <span className="text-[9px] text-muted-foreground block uppercase font-bold">Hook Style</span>
                      <strong className="text-amber-400 mt-0.5 block">Proof + Curiosity</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-center text-xs">
                      <span className="text-[9px] text-muted-foreground block uppercase font-bold">Expected CTR</span>
                      <strong className="text-success mt-0.5 block">8.4%</strong>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeDemoTab === "script" && (
                <motion.div
                  key="script"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3 w-full max-w-2xl"
                >
                  <div className="p-3.5 rounded-xl border border-primary bg-primary/5 space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-primary font-bold uppercase">Time: 0:00 - 0:20</span>
                      <span className="text-[9px] text-muted-foreground font-semibold">Opening Hook</span>
                    </div>
                    <p className="text-xs text-white leading-relaxed font-mono">
                      "This brand made ₹1.2 Crores in 30 days without spending a single rupee on ads. They didn't run Facebook campaigns, they didn't write cold emails... they used a simple 3-part YouTube framework."
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-[10px]">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-white space-y-1">
                      <span className="text-blue-400 font-bold uppercase block">🎥 Visual Cue</span>
                      <span>Show whiteboard drawing: '₹1,20,00,000' with arrow pointing up.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-white space-y-1">
                      <span className="text-purple-400 font-bold uppercase block">🔊 Audio Cue</span>
                      <span>Heavy whoosh sweep sound effect. Fast background drum beats start.</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeDemoTab === "retention" && (
                <motion.div
                  key="retention"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 w-full max-w-2xl"
                >
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-red-400">
                      <span className="font-bold uppercase">⚠️ Hook-to-Story drop found at 0:22</span>
                      <span className="font-bold">45% Viewer drop</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal">
                      <strong>Problem:</strong> Pacing slowed down during the template presentation screen.
                    </p>
                    <p className="text-xs text-success leading-normal font-semibold">
                      <strong>AI Coach Fix:</strong> Add a pattern-interrupt graphic (zoom in or mock screen sliding overlay) at exactly 0:20 in your next script.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Feature Grids */}
      <section className="py-24 max-w-7xl mx-auto px-6 space-y-14">
        <div className="text-center space-y-4">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-primary">The Complete Growth Arsenal</span>
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[1.05]">
            Four engines. One <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">unfair advantage.</span>
          </h2>
          <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Every engine is built to guide decisions, optimize CTR, and secure retention — not just hand you more charts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {FEATURES.map((f) => {
            const Icon = f.Icon;
            return (
              <GradientBorderCard
                key={f.n}
                gradient={f.grad}
                glow={`${f.color}45`}
                radius={24}
                thickness={2}
                className="group transition-transform duration-300 hover:-translate-y-1.5"
                innerClassName="p-6 md:p-7 overflow-hidden h-full"
              >
                <div className="absolute -top-14 -right-10 w-36 h-36 rounded-full blur-3xl opacity-25 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" style={{ background: f.color }} />
                <span className="absolute top-4 right-6 text-5xl font-black leading-none select-none pointer-events-none" style={{ color: f.color, opacity: 0.14 }}>{f.n}</span>

                <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: `linear-gradient(145deg, ${f.color}, ${f.color}80)`, boxShadow: `0 10px 26px -8px ${f.color}` }}>
                  <Icon size={26} className="text-white" strokeWidth={2.2} />
                </div>

                <h4 className="text-lg md:text-xl font-bold text-white mb-2 tracking-tight">{f.title}</h4>
                <p className="text-sm text-neutral-400 leading-relaxed mb-6">{f.desc}</p>

                <div className="relative">
                  <FeatureGraphic kind={f.kind} color={f.color} />
                </div>
              </GradientBorderCard>
            );
          })}
        </div>
      </section>

      {/* Comparison section */}
      <section className="py-20 max-w-5xl mx-auto px-6 space-y-12" id="compare">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-white uppercase tracking-wider">How we compare</h2>
          <p className="text-xs text-muted-foreground">Why InfluQ is an Operating System, not just keyword statistics data.</p>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-white/[0.06] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 font-bold text-white uppercase tracking-wider">Capability</th>
                <th className="pb-3 font-bold text-primary uppercase tracking-wider">InfluQ</th>
                <th className="pb-3 font-bold text-muted-foreground uppercase tracking-wider">vidIQ</th>
                <th className="pb-3 font-bold text-muted-foreground uppercase tracking-wider">TubeBuddy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-muted-foreground">
              <tr>
                <td className="py-3.5 font-semibold text-white">Topic Strategy output</td>
                <td className="py-3.5 text-primary font-bold">Actionable decisions (What/How/Why)</td>
                <td className="py-3.5">Keyword volumes list</td>
                <td className="py-3.5">Search difficulty scores</td>
              </tr>
              <tr>
                <td className="py-3.5 font-semibold text-white">Interactive Video structures</td>
                <td className="py-3.5 text-primary font-bold">6 Proven audience-retention frameworks</td>
                <td className="py-3.5">No</td>
                <td className="py-3.5">No</td>
              </tr>
              <tr>
                <td className="py-3.5 font-semibold text-white">Paced Script Builder</td>
                <td className="py-3.5 text-primary font-bold">Yes (Includes visual/auditory pacing cues)</td>
                <td className="py-3.5">Basic AI drafts</td>
                <td className="py-3.5">No</td>
              </tr>
              <tr>
                <td className="py-3.5 font-semibold text-white">Retention diagnostics</td>
                <td className="py-3.5 text-primary font-bold">Audience curve click-to-fix suggestions</td>
                <td className="py-3.5">No</td>
                <td className="py-3.5">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing Sections */}
      <section className="py-20 max-w-5xl mx-auto px-6 space-y-12" id="pricing">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest shadow-sm">
            <Sparkles size={12} className="animate-pulse" /> The Ultimate YouTube Growth OS
          </div>
          <h2 className="text-[clamp(36px,5.5vw,60px)] font-black text-white tracking-tight leading-tight">
            One Outcome. <span className="text-gradient-brand">One Price.</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            We don't limit features. You get the complete AI operating system designed to turn your channel into a predictable revenue system.
          </p>
        </div>

        {/* Monthly / Annual Toggle */}
        <div className="flex flex-col items-center justify-center gap-4 mt-8">
          <div className="relative flex items-center p-1.5 bg-neutral-900/50 border border-white/10 rounded-full shadow-inner">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-neutral-800 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-white/5 ${
                billingCycle === "monthly" ? "left-1.5" : "left-[calc(50%+1.5px)]"
              }`}
            />
            
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`relative z-10 px-8 py-3 text-xs font-bold transition-colors w-40 ${
                billingCycle === "monthly" ? "text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`relative z-10 px-8 py-3 text-xs font-bold transition-colors w-40 ${
                billingCycle === "annual" ? "text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              Annually
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/15 text-success border border-success/30 text-[10px] font-bold uppercase tracking-widest"
          >
            <Sparkles size={10} /> Save up to 17%
          </motion.div>
        </div>

        {/* The Single Pricing Card */}
        <div className="max-w-4xl mx-auto mt-12 relative group">
          {/* Deep background glow */}
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-[40px] blur-3xl opacity-50 pointer-events-none" />
          
          <GradientBorderCard gradient="violet" glow="rgba(139,92,246,0.55)" radius={32} thickness={2} innerClassName="relative p-8 md:p-12 overflow-hidden flex flex-col lg:flex-row gap-12">
            
            {/* Decorative radial gradient inside card */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Left Column: Price & CTA */}
            <div className="flex-1 flex flex-col justify-center space-y-6 lg:border-r border-white/10 lg:pr-12 relative z-10">
              <div className="self-start"><GradientBadge gradient="warm">Best Value</GradientBadge></div>
              <div>
                <h3 className="text-2xl font-semibold text-white uppercase tracking-widest flex items-center gap-2">
                  <Globe className="text-primary" size={24} /> AI Growth OS
                </h3>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  The entire operating system to Discover, Plan, Create, Optimize, and Grow.
                </p>
              </div>

              <div className="py-6 border-y border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-semibold text-white tracking-tighter">{displayPrice}</span>
                  <span className="text-sm font-semibold text-muted-foreground">/ month</span>
                </div>
                <div className="min-h-[24px] mt-2">
                  <AnimatePresence mode="wait">
                    {isAnnual && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs font-semibold text-success bg-success/10 inline-block px-3 py-1 rounded-md"
                      >
                        Billed {billedAnnually} yearly
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <button
                onClick={handleStartFree}
                className="btn-premium w-full py-4 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95"
              >
                Start Creating Now <ArrowRight size={18} />
              </button>
              
              <p className="text-center text-[11px] font-semibold text-muted-foreground">
                Cancel anytime. Secured by Stripe.
              </p>
            </div>

            {/* Right Column: Features */}
            <div className="flex-[1.2] relative z-10 space-y-8">
              <div>
                <h4 className="text-sm font-bold text-white mb-4">Everything Included:</h4>
                <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-success shrink-0 mt-0.5" strokeWidth={3} />
                    <span><strong className="text-white">AI Command Center:</strong> Daily personalized growth missions.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-success shrink-0 mt-0.5" strokeWidth={3} />
                    <span><strong className="text-white">Unified Video Builder:</strong> Research to Script to SEO in one flow.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-success shrink-0 mt-0.5" strokeWidth={3} />
                    <span><strong className="text-white">Unlimited Features:</strong> We never gate core functionality.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={18} className="text-success shrink-0 mt-0.5" strokeWidth={3} />
                    <span><strong className="text-white">AI Copilot Everywhere:</strong> Instant insights on every screen.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-[16px] bg-white/5 border border-white/5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <Zap size={14} className="text-primary" /> Fair Usage Limits
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Star size={12} className="text-muted-foreground" /> 500 AI Tasks per month (Scripts, Research, SEO)
                  </li>
                  <li className="flex items-center gap-2">
                    <Star size={12} className="text-muted-foreground" /> 3 Team Members
                  </li>
                  <li className="flex items-center gap-2">
                    <Star size={12} className="text-muted-foreground" /> 5 Connected YouTube Channels
                  </li>
                </ul>
              </div>
            </div>

          </GradientBorderCard>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20 max-w-3xl mx-auto px-6 space-y-8" id="faq">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-white uppercase tracking-wider">Frequently Asked Questions</h2>
          <p className="text-xs text-muted-foreground">Clear queries to help you start.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div 
                key={index}
                className="rounded-xl border border-white/5 bg-white/5 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 text-left flex justify-between items-center text-xs font-bold text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={14} className="text-primary" /> : <ChevronDown size={14} />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-neutral-900/40"
                    >
                      <p className="p-4 text-[11px] text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#070709] text-center text-[10px] text-muted-foreground space-y-4 max-w-7xl mx-auto rounded-t-2xl">
        <div className="flex justify-center items-center gap-2">
          <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
            <YoutubeIcon size={12} className="text-primary" />
          </div>
          <span className="font-bold text-white">InfluQ</span>
        </div>
        <p className="max-w-md mx-auto leading-relaxed">
          The AI YouTube Growth Operating System for creators, businesses, and agencies. Designed to optimize search performance, pacing, and audience retention metrics.
        </p>
        <p>© 2026 InfluQ. All rights reserved. Google & YouTube OAuth verified API integrator.</p>
      </footer>

      {/* Interactive Signup Modal Window overlay */}
      <AnimatePresence>
        {showSignupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-3xl border border-white/15 bg-[#0f0f13] shadow-2xl relative space-y-6"
            >
              <button
                onClick={() => setShowSignupModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-white text-xs font-bold"
              >
                Close
              </button>

              <div className="text-center space-y-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center mx-auto mb-2">
                  <YoutubeIcon size={16} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-white">Welcome to InfluQ</h3>
                <p className="text-xs text-muted-foreground">Get started on your free account and launch your first audit.</p>
              </div>

              <div className="space-y-3.5">
                <button
                  onClick={handleOAuthLogin}
                  className="w-full py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={handleOAuthLogin}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition flex items-center justify-center gap-2 border border-white/10"
                >
                  Continue with GitHub
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-[9px] uppercase font-semibold text-muted-foreground">or email</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-[#121216] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                  <button
                    onClick={handleOAuthLogin}
                    className="btn-premium w-full py-2.5 rounded-xl text-white font-semibold text-xs"
                  >
                    Continue with Email
                  </button>
                </div>
              </div>

              <p className="text-[9px] text-muted-foreground text-center max-w-xs mx-auto leading-normal">
                By signing up, you agree to our Terms of Service and Privacy Policy. Secure channel indexing starts immediately on connection.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Demo Video Mockup Window overlay */}
      <AnimatePresence>
        {showDemoVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl aspect-video rounded-3xl border border-white/15 bg-[#0f0f13] shadow-2xl relative overflow-hidden flex items-center justify-center"
            >
              <button
                onClick={() => setShowDemoVideo(false)}
                className="absolute top-4 right-4 bg-black/80 hover:bg-black p-2 rounded-full text-white text-xs font-bold border border-white/10 z-10"
              >
                Close Demo
              </button>

              <div className="text-center space-y-4 p-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center mx-auto text-xl animate-pulse">
                  <Play size={24} className="fill-primary text-primary ml-1" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">InfluQ Feature Tour (2:00)</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                    Watch the AI Coach deconstruct script timelines, contrast score thumbnails, and identify analytics hook drop points.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDemoVideo(false);
                    handleStartFree();
                  }}
                  className="btn-premium px-5 py-2.5 rounded-xl text-white font-semibold text-xs inline-flex items-center gap-1"
                >
                  Start Creating Now <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inline SVG YoutubeIcon
const YoutubeIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor" 
    className={className}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.503a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.503 9.388.503 9.388.503s7.518 0 9.388-.503a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
