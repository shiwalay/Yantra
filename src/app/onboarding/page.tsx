"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Loader2, 
  Lock, 
  Activity, 
  Compass, 
  BarChart, 
  Shield 
} from "lucide-react";

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
import { motion, AnimatePresence } from "framer-motion";

function OnboardingContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [creatorType, setCreatorType] = useState("");
  const [niche, setNiche] = useState("");
  const [goal, setGoal] = useState("");
  
  // Connection states
  const [connecting, setConnecting] = useState(false);
  const [showOauthModal, setShowOauthModal] = useState(false);
  const [channelConnected, setChannelConnected] = useState(false);

  // Auditing states
  const [auditing, setAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  const creatorTypes = [
    { id: "solo", label: "Solo Creator", desc: "Building a personal brand or lifestyle channel" },
    { id: "coach", label: "Coach / Consultant", desc: "Attracting high-paying leads and students" },
    { id: "agency", label: "Agency Owner", desc: "Managing multiple client channels and campaigns" },
    { id: "business", label: "Business / SaaS", desc: "Driving product sales and brand awareness" }
  ];

  const niches = [
    "Tech & AI", "Business & Finance", "Education / How-to", "Vlogs & Lifestyle", "SaaS & Software"
  ];

  const goals = [
    { id: "views", label: "Maximize Views & Reach", desc: "Optimize for recommendations algorithm" },
    { id: "subs", label: "Grow Subscriber Base", desc: "Build a loyal community of viewers" },
    { id: "leads", label: "Lead Gen & Sales", desc: "Convert viewers into clients and buyers" },
    { id: "brand", label: "Brand Awareness", desc: "Increase exposure and industry authority" }
  ];

  const triggerOAuthConnection = () => {
    setShowOauthModal(true);
  };

  const handleOAuthAllow = () => {
    setShowOauthModal(false);
    setConnecting(true);
    setTimeout(() => {
      setChannelConnected(true);
      setConnecting(false);
      setStep(4);
      triggerAuditScan();
    }, 1500);
  };

  const triggerAuditScan = () => {
    setAuditing(true);
    const logs = [
      "Connecting to YouTube Analytics API...",
      "Analyzing latest 10 video uploads...",
      "Measuring average view duration (AVD)...",
      "Scanning hook retention drop points...",
      "Analyzing competitor search volume overlap...",
      "Compiling opportunity score card..."
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAuditing(false);
          setStep(5);
          return 100;
        }
        
        // Add log items gradually
        if (prev % 18 === 0 && currentLogIndex < logs.length) {
          setAuditLogs((l) => [...l, logs[currentLogIndex]]);
          currentLogIndex++;
        }
        
        return prev + 2;
      });
    }, 50);
  };

  const completeOnboarding = () => {
    localStorage.setItem("yantra_onboarded", "true");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0c] text-foreground">
      {/* Background Decorative glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary glow-orb opacity-25" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary glow-orb opacity-20" />
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />

      <div className="w-full max-w-xl z-10 space-y-6">
        {/* Logo and Progress Tracker */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-purple-500 shadow-[0_0_12px_rgba(139,92,246,0.4)] flex items-center justify-center">
              <YoutubeIcon size={15} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Yantra<span className="text-primary">.ai</span>
            </span>
          </div>

          {/* Stepper Progress bar */}
          <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
            <span className={step >= 1 ? "text-primary" : ""}>Profile</span>
            <span>•</span>
            <span className={step >= 2 ? "text-primary" : ""}>Goals</span>
            <span>•</span>
            <span className={step >= 3 ? "text-primary" : ""}>Connect</span>
            <span>•</span>
            <span className={step >= 4 ? "text-primary" : ""}>Audit</span>
            <span>•</span>
            <span className={step >= 5 ? "text-primary" : ""}>Finish</span>
          </div>
          <div className="w-36 h-1 rounded-full bg-neutral-800 mx-auto overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Dynamic Step Content Cards */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl relative min-h-[360px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Profile Setup */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white">Tell us about yourself</h2>
                  <p className="text-xs text-muted-foreground">We'll customize your video strategy frameworks based on your creator type.</p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {creatorTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setCreatorType(type.id)}
                      className={`p-3 rounded-xl border text-left flex justify-between items-center transition-all ${
                        creatorType === type.id 
                          ? "border-primary bg-primary/10" 
                          : "border-white/5 bg-white/5 hover:border-white/10"
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{type.label}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{type.desc}</p>
                      </div>
                      {creatorType === type.id && <Check size={14} className="text-primary" />}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-muted-foreground block">Select Channel Niche</label>
                  <div className="flex flex-wrap gap-2">
                    {niches.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNiche(n)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          niche === n 
                            ? "border-primary bg-primary/20 text-white" 
                            : "border-white/5 bg-white/5 text-muted-foreground hover:border-white/10"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!creatorType || !niche}
                  onClick={() => setStep(2)}
                  className="w-full mt-4 py-2.5 rounded-xl bg-primary hover:bg-primary-foreground disabled:bg-neutral-800 disabled:text-muted-foreground text-black font-bold text-xs transition flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                >
                  Continue <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {/* Step 2: Goal Identification */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white">What is your primary goal?</h2>
                  <p className="text-xs text-muted-foreground">This helps our AI Coach tailor click and retention suggestions.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {goals.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setGoal(item.id)}
                      className={`p-3.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                        goal === item.id 
                          ? "border-primary bg-primary/10" 
                          : "border-white/5 bg-white/5 hover:border-white/10"
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.label}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      {goal === item.id && <Check size={14} className="text-primary" />}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white text-xs font-bold transition"
                  >
                    Back
                  </button>
                  <button
                    disabled={!goal}
                    onClick={() => setStep(3)}
                    className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-foreground disabled:bg-neutral-800 disabled:text-muted-foreground text-black font-bold text-xs transition flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Channel Connection */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex flex-col justify-between h-full"
              >
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-pulse">
                    <YoutubeIcon size={24} />
                  </div>
                  <h2 className="text-lg font-bold text-white">Connect Your YouTube Channel</h2>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Yantra needs secure, read-only access to your channel metrics to find retention drops and opportunity gaps.
                  </p>
                </div>

                {connecting ? (
                  <div className="py-6 flex flex-col items-center justify-center gap-3">
                    <Loader2 size={32} className="text-primary animate-spin" />
                    <p className="text-xs font-bold text-white">Authenticating with Google OAuth...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={triggerOAuthConnection}
                      className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                    >
                      <YoutubeIcon size={16} /> Connect Channel via YouTube OAuth
                    </button>
                    
                    <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 text-center">
                      <Lock size={10} /> 256-bit encrypted secure OAuth protocol. We never store credentials.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-4 border-t border-white/5 pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="w-24 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white text-xs font-bold transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      // Bypass mock connection
                      setStep(4);
                      triggerAuditScan();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-white text-xs font-bold transition"
                  >
                    Skip Channel connection (Demo Mode)
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Audit Scanning */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-1 text-center">
                  <Activity size={24} className="text-primary animate-spin mx-auto mb-2" />
                  <h2 className="text-lg font-bold text-white">Running Channel Growth Audit</h2>
                  <p className="text-xs text-muted-foreground">The AI Coach is auditing video elements against competitor indexes.</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground font-black uppercase">
                    <span>Audit Progress</span>
                    <span>{auditProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full transition-all duration-100" 
                      style={{ width: `${auditProgress}%` }}
                    />
                  </div>
                </div>

                {/* Console Logs */}
                <div className="h-32 p-3 rounded-xl bg-neutral-950 border border-white/5 font-mono text-[10px] text-muted-foreground space-y-1.5 overflow-y-auto scrollbar-thin">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-primary">✓</span>
                      <span className="text-neutral-300">{log}</span>
                    </div>
                  ))}
                  {auditing && (
                    <div className="flex gap-2 items-center text-primary font-bold animate-pulse">
                      <span>&gt;</span>
                      <span>Scanning assets...</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 5: Onboarding Finished */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 flex flex-col justify-between h-full"
              >
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2 text-xl animate-bounce">
                    ✓
                  </div>
                  <h2 className="text-lg font-bold text-white">Onboarding Complete!</h2>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Your channel <strong>"TechBytes AI"</strong> is connected and audited. We found initial opportunities for you.
                  </p>
                </div>

                {/* Audit summary */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1"><Sparkles size={12} className="text-primary" /> Initial Decisions Found:</h4>
                  
                  <ul className="space-y-2 text-[11px] text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">1.</span>
                      <span>Breakout search trend detected: <strong>"AI employee frameworks"</strong> (+340% volume growth).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">2.</span>
                      <span>Hook retention fix needed: 28% drop in views at 0:22 due to lack of visual pattern interrupts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">3.</span>
                      <span>Best publish day calculated: <strong>Wednesday at 6:00 PM</strong>.</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={completeOnboarding}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary-foreground text-black font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  Enter Growth OS Dashboard <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* OAuth Simulator Modal Window overlay */}
      <AnimatePresence>
        {showOauthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl border border-white/10 bg-[#0f0f13] shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-1"><Shield size={10} /> Google Accounts Auth</span>
                <button onClick={() => setShowOauthModal(false)} className="text-muted-foreground hover:text-white text-xs">Cancel</button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                    SB
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Swapnil B.</h4>
                    <p className="text-[10px] text-muted-foreground">swapnil@gmail.com</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2 text-[11px] leading-relaxed">
                  <p className="font-bold text-white">Yantra.ai requests permission to:</p>
                  <ul className="space-y-1 text-muted-foreground list-disc pl-4">
                    <li>View YouTube Analytics reports for your channels</li>
                    <li>View search terms, view durations, and click statistics</li>
                    <li>Manage video description assets and playlists</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowOauthModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition border border-white/5"
                  >
                    Deny
                  </button>
                  <button
                    onClick={handleOAuthAllow}
                    className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-foreground text-black font-bold transition shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  >
                    Allow
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-muted-foreground">Loading Onboarding Wizard...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
