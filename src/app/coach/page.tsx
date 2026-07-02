"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Volume2, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  Loader2,
  Bookmark,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  sender: "coach" | "user";
  text: string;
  timestamp: string;
  loading?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "coach",
    text: "Hello Swapnil! I've analyzed your channel 'TechBytes AI'. Your CTR is healthy at 7.4%, but we have a retention drop-off threat at 0:22 in your last video. What are we planning to work on today? Ask me about topics, frameworks, or script structures.",
    timestamp: "10:30 AM"
  }
];

const suggestedPrompts = [
  "Audit my last video retention",
  "Recommend a topic for AI agency",
  "How to fix hook drop-off at 0:22",
  "Suggest clickbait titles for Next.js"
];

const coachResponses: Record<string, string> = {
  "audit my last video retention": "Your video 'How I Built an AI Employee for ₹0' had a 45% drop-off at 0:22 during the Hook-to-Story transition. The pacing slowed down. For your next video, use a 'Pattern Interrupt' (like a screen zoom or visual overlay) within 3 seconds of starting the story.",
  "recommend a topic for ai agency": "I highly recommend the topic: 'How I Built an AI Employee for ₹0' or 'Starting an AI Agency with Gemini API'. These search trends are up 340% this week. Use the 'Case Study' framework for best results.",
  "how to fix hook drop-off at 0:22": "To fix a transition drop-off, do NOT give long greetings. Immediately follow the hook with a 'Stakes Statement' (e.g., 'If you don't do this, X will happen') and introduce a visual change (whiteboard sketch or code screen) at exactly 0:20.",
  "suggest clickbait titles for next.js": "Here are 3 high-CTR titles: \n1. 'Why 99% of Next.js Deployments Fail' (Estimated CTR: 9.4%)\n2. 'Next.js 16 tutorial Vercel doesn't want you to watch' (Estimated CTR: 8.8%)\n3. 'Next.js Server Actions: The Good, the Bad, the Ugly' (Estimated CTR: 8.2%)"
};

export default function GrowthCoach() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [brandVoice, setBrandVoice] = useState("Contrarian Expert");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate coach decision logic
    setTimeout(() => {
      const normalized = textToSend.toLowerCase().trim();
      let replyText = "I've logged that! That's a great question. Let's look at your channel metrics. We should structure a Case Study framework around that topic to maximize engagement. What hook style are you planning to use?";
      
      // Match predefined responses
      for (const key of Object.keys(coachResponses)) {
        if (normalized.includes(key) || key.includes(normalized)) {
          replyText = coachResponses[key];
          break;
        }
      }

      const coachMsg: Message = {
        id: Date.now() + 1,
        sender: "coach",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, coachMsg]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between">
      
      {/* Top Section: Sidebar recommendations & Chat Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 min-h-0">
        
        {/* Left Side: Chat Workspace */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-card border border-white/[0.06] rounded-3xl relative overflow-hidden shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0d0d11]/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary border border-primary/30 flex items-center justify-center">
                <Bot size={18} className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">InfluQ Growth Coach</h3>
                <p className="text-[10px] text-muted-foreground">Level 2 - Pro Assistant Connected</p>
              </div>
            </div>

            {/* Brand Voice Toggle */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground text-[10px] uppercase font-semibold">Brand Voice</span>
              <select
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                className="bg-[#121216] border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white"
              >
                <option>Contrarian Expert</option>
                <option>Enthusiastic Teacher</option>
                <option>Minimalist Coder</option>
                <option>Storyteller</option>
              </select>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isCoach = msg.sender === "coach";
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isCoach ? "mr-auto text-left" : "ml-auto flex-row-reverse text-left"}`}
                >
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs ${
                    isCoach 
                      ? "bg-primary/20 text-primary border border-primary/20" 
                      : "bg-white/10 text-white"
                  }`}>
                    {isCoach ? <Bot size={14} /> : <User size={14} />}
                  </div>

                  <div className="space-y-1">
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      isCoach 
                        ? "bg-white/5 border border-white/5 text-white" 
                        : "bg-primary text-white font-semibold"
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-[9px] text-muted-foreground ${isCoach ? "text-left" : "text-right"}`}>{msg.timestamp}</p>
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="flex gap-3 mr-auto items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/20 flex items-center justify-center">
                  <Bot size={14} />
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions chips */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-white/5 bg-neutral-900/10">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 text-[10px] text-muted-foreground hover:text-white transition shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-4 border-t border-white/10 bg-[#0d0d11]/80 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Ask the coach: 'Suggest 3 topic opportunities'..."
              className="flex-1 bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
            />
            <button
              onClick={() => handleSend(input)}
              className="p-2.5 rounded-xl btn-premium text-white font-semibold transition shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Right Side: Decisions Action panel */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Coach Growth Decisions
          </h3>

          <div className="flex-1 p-6 rounded-3xl bg-card border border-white/[0.06] space-y-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.05] rounded-full blur-xl pointer-events-none" />

            <div className="pb-3 border-b border-white/5">
              <span className="text-[10px] text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                Action Items (3)
              </span>
              <p className="text-[10px] text-muted-foreground mt-1">Direct decisions recommended to maximize recommendation velocity.</p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Item 1 */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                <span className="text-[9px] uppercase font-semibold text-amber-400 flex items-center gap-1">
                  <TrendingUp size={10} /> Rename Video
                </span>
                <p className="font-bold text-white">Rename "NextJS 16 Production" to "Why 99% of Deployments Fail"</p>
                <p className="text-[10px] text-muted-foreground leading-normal mt-1">
                  Contrast ratio checks indicate the previous text is too dry for recommendation lists. This change can boost CTR by +2.1%.
                </p>
                <Link href="/seo" className="text-primary hover:underline text-[10px] font-semibold flex items-center gap-0.5 pt-1">
                  Optimize SEO <ArrowRight size={10} />
                </Link>
              </div>

              {/* Item 2 */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                <span className="text-[9px] uppercase font-semibold text-red-400 flex items-center gap-1">
                  <AlertTriangle size={10} /> Script Adjustment
                </span>
                <p className="font-bold text-white">Skip Sign-up walk-throughs</p>
                <p className="text-[10px] text-muted-foreground leading-normal mt-1">
                  Audience retention data found a 45-second skip at 4:15. Do not explain standard dashboard login screens.
                </p>
                <Link href="/scripts" className="text-primary hover:underline text-[10px] font-semibold flex items-center gap-0.5 pt-1">
                  Go to Script Editor <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
