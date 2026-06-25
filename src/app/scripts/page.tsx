"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  FileText, 
  Sparkles, 
  HelpCircle, 
  AlertTriangle, 
  Video, 
  Volume2, 
  CornerDownRight, 
  ArrowRight,
  Loader2,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sample framework-specific templates
const scriptTemplates: Record<number, any> = {
  1: [ // PAS
    {
      time: "0:00 - 0:20",
      section: "Opening Hook",
      script: "Most creators will spend 40 hours building a video, only to get 12 views, because they ignore this ONE structural rule. In the next 10 minutes, I am going to show you exactly why your videos fail, and how to change that starting today.",
      visual: "Pattern Interrupt: Zoom in on face, overlay big text '12 VIEWS' with a deep red slash through it.",
      audio: "Dull bass drop sound effect.",
      tip: "Read this with intense, serious eye contact. Do not blink during the first 6 seconds.",
      warning: "Last video had a drop-off at 0:18. Make sure the transition here happens under 3 seconds."
    },
    {
      time: "0:20 - 1:30",
      section: "Problem",
      script: "The reality is, YouTube's algorithm doesn't care about your camera quality or editing speed. It cares about retention. When you jump straight into the details, you are killing the curiosity loop. I fell into this trap myself for 2 years.",
      visual: "Show a screen capture of a declining analytics retention curve with high contrast red highlights.",
      audio: "Subtle analog static sound.",
      tip: "Use a self-deprecating tone. Keep pacing slow and conversational.",
      warning: null
    },
    {
      time: "1:30 - 3:00",
      section: "Agitate",
      script: "If you don't fix this hook structure, you will keep uploading into the void. Your subscriber count will stay flat, and your business revenue will remain at absolute zero. But what if there was a way to guarantee viewers click and stay?",
      visual: "Show visual symbols: flat subscriber graph, followed by a glowing green lock unlocking.",
      audio: "Heartbeat drum rhythm fades in.",
      tip: "Elevate your voice pitch slightly. Sound urgent and concerned.",
      warning: "High drop-off threat! Pinned text overlay MUST read: 'The 3-Step Fix' to maintain curiosity."
    },
    {
      time: "3:00 - 8:00",
      section: "Solution & Proof",
      script: "Here is the 3-step blueprint. First, structure the hook. Second, use pattern interrupts every 15 seconds. Third, place a visual cue. Look at this channel: using this exact model, views went from 2,000 to 240,000 in under 3 weeks.",
      visual: "Show side-by-side screenshots of analytics showing 240,000 views in green text.",
      audio: "Success ding / chime effect.",
      tip: "Speak with high energy. Point to the screen graphics as they appear.",
      warning: null
    },
    {
      time: "8:00 - 10:00",
      section: "CTA & Next Video",
      script: "I put this entire template into a 1-page PDF checklist. You can download it for free in the pinned comment below. And if you want to know how to edit these videos in under 1 hour, click on this next video right here.",
      visual: "Introduce end screen cards. Point to the right-hand corner of the screen.",
      audio: "Upbeat background synth track fades out.",
      tip: "Smile, point clearly to the card, and end the video abruptly to keep session duration high.",
      warning: "Do not say 'In conclusion' or 'Thanks for watching' - it triggers viewers to click away instantly."
    }
  ],
  4: [ // Case Study
    {
      time: "0:00 - 0:30",
      section: "Proof Hook",
      script: "This brand made ₹1.2 Crores in 30 days without spending a single rupee on ads. They didn't run Facebook campaigns, they didn't write cold emails, they didn't even have an audience. They used a simple 3-part YouTube framework, and in this video, I'm breaking down their exact code.",
      visual: "Whiteboard graphic showing '₹1,20,00,000' with arrow pointing up. Split screen showing a graph.",
      audio: "Whoosh transition sound. Upbeat percussion starts.",
      tip: "Deliver the numbers with high speed and excitement.",
      warning: "Avoid generic greetings. Start speaking within 0.5 seconds of the video starting."
    },
    {
      time: "0:30 - 2:30",
      section: "Case Study Breakdown",
      script: "Let's look at the brand: AutomateFlow. In April, they were struggling, generating under 2 leads a week. Then they launched a video deconstructing how they automated an agency workflow. That single video gained 120K views and brought in 150 high-paying clients.",
      visual: "Display the competitor channel homepage. Scroll down to show their viral video thumbnail.",
      audio: "Mouse click sound effects.",
      tip: "Acknowledge the authority. Sound analytical, like a researcher.",
      warning: "Make sure the screen transition happens at exactly 0:45. A slow graphic will cause an 8% view drop-off."
    },
    {
      time: "2:30 - 7:00",
      section: "Deep Analysis",
      script: "How did they do it? It comes down to a strategy called the 'Curiosity Bridge'. Instead of explaining what their product does, they showed the end results first. The viewer is hooked because they want to know the steps to get that result.",
      visual: "Draw a simple bridging diagram on-screen: 'Problem' ----- (Bridge) ----- 'Result'.",
      audio: "Chalk drawing sound effects.",
      tip: "Slow down the pace. Emphasize keywords like 'Curiosity Bridge'.",
      warning: null
    },
    {
      time: "7:00 - 10:30",
      section: "Repeatable Framework",
      script: "Here is how you can copy this for your own business. First, find a client win. Second, map the timeline of how they did it. Third, reveal the specific tool. That's it. You don't need a professional camera, just a screen recorder.",
      visual: "Bullet list animation: 1. Find client win. 2. Map timeline. 3. Reveal tool.",
      audio: "Slide transitions sweeps.",
      tip: "Sound confident and encouraging. Demystify the difficulty.",
      warning: null
    },
    {
      time: "10:30 - 12:00",
      section: "Action CTA & Next Video",
      script: "If you want my team to help you set up this YouTube engine for your business, book a free strategy call at the link in the description. And if you want to know how we optimize the SEO to rank #1, watch this next video.",
      visual: "Point down for link, then point to the right for the next video card overlay.",
      audio: "Ambient electronic music fades to close.",
      tip: "Close with strong conviction. The CTA should feel like a logical next step, not a sales pitch.",
      warning: "Ensure your end screen card is visible for at least 15 seconds to maximize CTR."
    }
  ]
};

// Fallback script if another framework is selected
const fallbackScript = [
  {
    time: "0:00 - 0:25",
    section: "Framework Hook",
    script: "Everyone is talking about this topic, but 99% of people are getting it completely wrong. Today, we are breaking down the truth and giving you the exact steps to implement this strategy successfully.",
    visual: "Zoom interrupt. Text overlay: 'THE TRUTH' in gold font.",
    audio: "Heavy sweep sound.",
    tip: "Maintain eye contact, speak clearly and with authority.",
    warning: "Keep hook under 30 seconds."
  },
  {
    time: "0:25 - 4:00",
    section: "Body Deconstruction",
    script: "Here is where the problem lies. When you look at the standard approach, you see flat results. The real secret is what we call the 'Leverage Method'. Let me show you how it works on my dashboard.",
    visual: "Show laptop screen dashboard metrics.",
    audio: "Typing sounds.",
    tip: "Speak with conversational energy. Use hand gestures.",
    warning: null
  },
  {
    time: "4:00 - 5:00",
    section: "Call to Action",
    script: "If you want this exact framework, grab the files in the description. I'll see you in the next video right here.",
    visual: "End screen elements.",
    audio: "Upbeat outro beat.",
    tip: "End quickly and point to the next video bridge.",
    warning: "Never drag out the outro."
  }
];

function ScriptEngineContent() {
  const searchParams = useSearchParams();
  const paramTopic = searchParams.get("topic") || "AI Business";
  const paramFramework = parseInt(searchParams.get("framework") || "4");

  const [topic, setTopic] = useState(paramTopic);
  const [audience, setAudience] = useState("Business Owners");
  const [duration, setDuration] = useState("12 min");
  const [frameworkId, setFrameworkId] = useState(paramFramework);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [scriptData, setScriptData] = useState<any[]>(scriptTemplates[paramFramework] || scriptTemplates[4]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<number>(0);

  // Hook generation variables
  const [hookVariations, setHookVariations] = useState<string[]>([
    "This brand made ₹1.2 Crores in 30 days without spending a single rupee on ads.",
    "Most business owners waste 90% of their time on marketing, except for this 3-step secret...",
    "What if you could build a YouTube channel that brings in clients on complete autopilot?"
  ]);
  const [generatingHooks, setGeneratingHooks] = useState(false);

  useEffect(() => {
    // Sync with query params
    if (paramTopic) setTopic(paramTopic);
    if (paramFramework) {
      setFrameworkId(paramFramework);
      setScriptData(scriptTemplates[paramFramework] || fallbackScript);
    }
  }, [paramTopic, paramFramework]);

  const handleGenerateScript = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const selectedScript = scriptTemplates[frameworkId] || fallbackScript;
      
      // Customize topic name in the scripts
      const customized = selectedScript.map((block: any) => {
        let text = block.script;
        if (text.includes("AI Business")) {
          text = text.replace("AI Business", topic);
        }
        if (text.includes("this topic")) {
          text = text.replace("this topic", topic);
        }
        return { ...block, script: text };
      });

      // Generate customized hooks
      setHookVariations([
        `How I utilized ${topic} to acquire high-paying clients in under 14 days.`,
        `The single biggest lie you've been told about ${topic}...`,
        `Why 2026 is the golden window to start a business around ${topic}.`
      ]);

      setScriptData(customized);
      setLoading(false);
      setActiveSection(0);
    }, 1000);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const generateHooks = () => {
    setGeneratingHooks(true);
    setTimeout(() => {
      setHookVariations([
        `The secret ${topic} blueprint that YouTube doesn't want you to know.`,
        `I spent 100 hours researching ${topic} so you don't have to.`,
        `The exact script layout I used to go viral talking about ${topic}.`
      ]);
      setGeneratingHooks(false);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Parameters Settings */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
            Script Configurations
          </h3>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 bg-neutral-950/40">
            <form onSubmit={handleGenerateScript} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Video Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. AI Marketing"
                  className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Target Audience</label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Solo Entrepreneurs"
                  className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Length</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option>5 min</option>
                    <option>8 min</option>
                    <option>10 min</option>
                    <option>12 min</option>
                    <option>15 min</option>
                    <option>18 min</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>Hindi</option>
                    <option>German</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-muted-foreground block mb-1">Structure Framework</label>
                <select
                  value={frameworkId}
                  onChange={(e) => setFrameworkId(parseInt(e.target.value))}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value={1}>PAS Framework (FW 01)</option>
                  <option value={2}>Story Framework (FW 02)</option>
                  <option value={3}>Challenge Framework (FW 03)</option>
                  <option value={4}>Case Study Framework (FW 04)</option>
                  <option value={5}>Myth-Truth Framework (FW 05)</option>
                  <option value={6}>Future Prediction (FW 06)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-foreground text-black font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.2)] mt-2"
              >
                {loading ? <Loader2 size={12} className="animate-spin" /> : "Re-assemble Script Flow"}
              </button>
            </form>
          </div>

          {/* Hook Variant Panel */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4 bg-neutral-950/40">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1">
                <Sparkles size={12} className="text-primary animate-pulse" /> Hook Variations
              </h4>
              <button 
                onClick={generateHooks}
                disabled={generatingHooks}
                className="text-muted-foreground hover:text-white transition"
              >
                <RefreshCw size={12} className={generatingHooks ? "animate-spin" : ""} />
              </button>
            </div>
            <div className="space-y-2">
              {hookVariations.map((hook, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    // Replace the first section's script with this hook
                    const updated = [...scriptData];
                    updated[0].script = hook;
                    setScriptData(updated);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-white/10 transition text-[10px] text-muted-foreground hover:text-white text-left cursor-pointer leading-normal"
                >
                  <p className="font-semibold text-primary mb-0.5">Alt Hook 0{index + 1}</p>
                  "{hook}"
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Script Flow */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText size={14} /> Interactive Script Board
            </h3>
            <span className="text-xs text-muted-foreground">Framework: FW 0{frameworkId}</span>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-96 flex flex-col items-center justify-center gap-4 glass-panel border border-white/10 rounded-2xl"
              >
                <Loader2 size={40} className="text-primary animate-spin" />
                <div className="text-center">
                  <p className="font-bold text-white">Re-writing Script Elements...</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Injecting retention moments, visual directives, and audio overlays</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {scriptData.map((item, idx) => {
                  const isActive = activeSection === idx;
                  return (
                    <div 
                      key={idx}
                      className={`rounded-2xl border transition-all ${
                        isActive 
                          ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(139,92,246,0.1)]" 
                          : "border-white/10 glass-panel"
                      }`}
                    >
                      {/* Block Header */}
                      <button
                        onClick={() => setActiveSection(idx)}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            {item.time}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white">{item.section}</h4>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Voice pacing and cues configuration</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          {isActive ? "Collapse" : "Expand"}
                        </span>
                      </button>

                      {/* Block Details */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-white/5"
                          >
                            <div className="p-4 space-y-4 text-xs">
                              {/* Actual Script Draft */}
                              <div className="space-y-1.5 p-3 rounded-xl bg-neutral-950/60 border border-white/5 relative group">
                                <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-black">Spoken Script</span>
                                <p className="text-white leading-relaxed text-[12px]">{item.script}</p>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(item.script, idx);
                                  }}
                                  className="absolute top-2 right-2 p-1.5 rounded bg-neutral-900 border border-white/15 text-muted-foreground hover:text-white transition opacity-0 group-hover:opacity-100"
                                >
                                  {copiedIndex === idx ? <Check size={10} className="text-success" /> : <Copy size={10} />}
                                </button>
                              </div>

                              {/* Cues Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-1">
                                  <span className="text-[9px] uppercase font-black text-blue-400 flex items-center gap-1">
                                    <Video size={10} /> Visual Cue
                                  </span>
                                  <p className="text-[10px] text-white leading-relaxed">{item.visual}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-1">
                                  <span className="text-[9px] uppercase font-black text-purple-400 flex items-center gap-1">
                                    <Volume2 size={10} /> Audio Cue
                                  </span>
                                  <p className="text-[10px] text-white leading-relaxed">{item.audio}</p>
                                </div>
                              </div>

                              {/* Coach Tip & Warning */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex gap-2 p-2.5 rounded-xl bg-white/5 text-muted-foreground text-[10px] leading-relaxed">
                                  <CornerDownRight size={14} className="text-primary shrink-0" />
                                  <div>
                                    <strong>Coach Delivery Tip:</strong> {item.tip}
                                  </div>
                                </div>

                                {item.warning ? (
                                  <div className="flex gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] leading-relaxed">
                                    <AlertTriangle size={14} className="text-red-400 shrink-0" />
                                    <div>
                                      <strong>Retention Danger:</strong> {item.warning}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-2 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] leading-relaxed">
                                    <Check size={14} className="text-success shrink-0" />
                                    <div>
                                      <strong>Optimal Flow:</strong> Retention risk is predicted as low here.
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Handoff to SEO */}
                <div className="p-6 rounded-2xl glass-panel bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/20 text-primary border border-primary/30 shrink-0">
                      <Sparkles size={20} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Script Complete! Push to SEO Optimizer</h4>
                      <p className="text-xs text-muted-foreground">The AI can instantly generate 20 SEO titles, descriptions, and chapters.</p>
                    </div>
                  </div>
                  <Link
                    href={`/seo?topic=${topic}`}
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-foreground text-black font-bold text-xs transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] shrink-0"
                  >
                    Optimize Video SEO <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function ScriptEngine() {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground">Loading Script Engine...</div>}>
      <ScriptEngineContent />
    </Suspense>
  );
}
