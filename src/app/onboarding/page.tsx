"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Loader2, Lock, Shield, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

const YoutubeIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.503a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.503 9.388.503 9.388.503s7.518 0 9.388-.503a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const creatorTypes = [
  { id: "solo", label: "Solo Creator", desc: "Personal brand or lifestyle channel" },
  { id: "coach", label: "Coach / Consultant", desc: "Attract high-paying leads & students" },
  { id: "agency", label: "Agency Owner", desc: "Manage multiple client channels" },
  { id: "business", label: "Business / SaaS", desc: "Drive product sales & awareness" },
];

const niches = ["Tech & AI", "Business & Finance", "Education / How-to", "Vlogs & Lifestyle", "SaaS & Software"];

const goals = [
  { id: "views", label: "Views & Reach" },
  { id: "subs", label: "Subscribers" },
  { id: "leads", label: "Leads & Sales" },
  { id: "brand", label: "Brand Authority" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = About you, 2 = Connect
  const [creatorType, setCreatorType] = useState("");
  const [niche, setNiche] = useState("");
  const [goal, setGoal] = useState("");
  const [showOauthModal, setShowOauthModal] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const canContinue = creatorType && niche && goal;

  const complete = async () => {
    setShowOauthModal(false);
    setFinishing(true);
    localStorage.setItem("influq_onboarded", "true");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("user_profiles").update({ onboarded: true }).eq("id", user.id);
      }
    } catch { /* non-blocking */ }
    setTimeout(() => router.push("/dashboard"), 1100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0c] text-foreground">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary glow-orb opacity-[0.05]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary glow-orb opacity-[0.04]" />
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-[0.12]" />

      <div className="w-full max-w-lg z-10 space-y-6">
        {/* Logo + progress */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-secondary shadow-[0_0_12px_rgba(139,92,246,0.4)] flex items-center justify-center">
              <YoutubeIcon size={15} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Influ<span className="text-primary">Q</span></span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
            <span className={step >= 1 ? "text-primary" : ""}>About You</span>
            <span>•</span>
            <span className={step >= 2 ? "text-primary" : ""}>Connect</span>
          </div>
          <div className="w-28 h-1 rounded-full bg-neutral-800 mx-auto overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / 2) * 100}%` }} />
          </div>
        </div>

        {/* Card */}
        <div className="p-6 rounded-3xl bg-card border border-white/[0.06] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] relative min-h-[380px] flex flex-col">
          <AnimatePresence mode="wait">
            {finishing ? (
              <motion.div key="finish" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 size={36} className="text-primary animate-spin" />
                <div>
                  <p className="text-sm font-bold text-white">Building your workspace…</p>
                  <p className="text-xs text-muted-foreground mt-1">Personalizing frameworks for your channel</p>
                </div>
              </motion.div>
            ) : step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5 flex-1 flex flex-col">
                <div>
                  <h2 className="text-lg font-bold text-white">Tell us about yourself</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">We&apos;ll tailor your strategy frameworks to match.</p>
                </div>

                {/* Creator type */}
                <div className="grid grid-cols-2 gap-2.5">
                  {creatorTypes.map((t) => (
                    <button key={t.id} onClick={() => setCreatorType(t.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${creatorType === t.id ? "border-primary bg-primary/10" : "border-white/5 bg-white/5 hover:border-white/10"}`}>
                      <h4 className="text-xs font-bold text-white flex items-center justify-between">
                        {t.label} {creatorType === t.id && <Check size={13} className="text-primary" />}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{t.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Niche */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-muted-foreground block">Channel Niche</label>
                  <div className="flex flex-wrap gap-2">
                    {niches.map((n) => (
                      <button key={n} onClick={() => setNiche(n)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${niche === n ? "border-primary bg-primary/20 text-white" : "border-white/5 bg-white/5 text-muted-foreground hover:border-white/10"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-muted-foreground block">Primary Goal</label>
                  <div className="flex flex-wrap gap-2">
                    {goals.map((g) => (
                      <button key={g.id} onClick={() => setGoal(g.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${goal === g.id ? "border-primary bg-primary/20 text-white" : "border-white/5 bg-white/5 text-muted-foreground hover:border-white/10"}`}>
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button disabled={!canContinue} onClick={() => setStep(2)}
                  className="btn-premium w-full mt-auto py-2.5 rounded-xl disabled:opacity-40 disabled:saturate-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5">
                  Continue <ArrowRight size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-center pt-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-2">
                    <YoutubeIcon size={24} />
                  </div>
                  <h2 className="text-lg font-bold text-white">Connect your YouTube channel</h2>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Secure, read-only access to your metrics so InfluQ can find retention drops and opportunity gaps.
                  </p>
                </div>

                <div className="space-y-4">
                  <button onClick={() => setShowOauthModal(true)}
                    className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center justify-center gap-2">
                    <YoutubeIcon size={16} /> Connect via YouTube OAuth
                  </button>
                  <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 text-center">
                    <Lock size={10} /> 256-bit encrypted. We never store credentials.
                  </p>
                </div>

                <div className="flex gap-3 border-t border-white/5 pt-4">
                  <button onClick={() => setStep(1)} className="w-24 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white text-xs font-bold transition">
                    Back
                  </button>
                  <button onClick={complete} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold transition">
                    Skip for now (Demo Mode)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* OAuth modal */}
      <AnimatePresence>
        {showOauthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-3xl border border-white/[0.06] bg-card shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-[10px] uppercase font-black text-muted-foreground flex items-center gap-1"><Shield size={10} /> Google Accounts Auth</span>
                <button onClick={() => setShowOauthModal(false)} className="text-muted-foreground hover:text-white text-xs">Cancel</button>
              </div>
              <div className="space-y-4 text-xs">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center font-bold text-xs text-white">SB</div>
                  <div>
                    <h4 className="font-bold text-white">Swapnil B.</h4>
                    <p className="text-[10px] text-muted-foreground">swapnil@gmail.com</p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2 text-[11px] leading-relaxed">
                  <p className="font-bold text-white flex items-center gap-1"><Sparkles size={11} className="text-primary" /> InfluQ requests permission to:</p>
                  <ul className="space-y-1 text-muted-foreground list-disc pl-4">
                    <li>View YouTube Analytics reports for your channels</li>
                    <li>View search terms, view durations, and click stats</li>
                  </ul>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowOauthModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition border border-white/5">Deny</button>
                  <button onClick={complete} className="btn-premium flex-1 py-2.5 rounded-xl text-white font-semibold transition">Allow</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
