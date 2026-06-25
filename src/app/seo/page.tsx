"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Globe, 
  Sparkles, 
  CheckSquare, 
  Copy, 
  Check, 
  ListOrdered, 
  ChevronRight, 
  Tag, 
  MessageSquare,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SeoEngineContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "AI Business";

  const [activeTab, setActiveTab] = useState<string>("titles");
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [copiedText, setCopiedText] = useState<string>("");
  
  // Checklist states
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Target keyword placed in first 2 lines of description", checked: true, points: 15 },
    { id: 2, text: "Keyword density at 1.5% - 2.5% in description", checked: true, points: 10 },
    { id: 3, text: "Timeline chapters added in description", checked: false, points: 25 },
    { id: 4, text: "Pinned comment drafted with user engagement prompt", checked: false, points: 15 },
    { id: 5, text: "End screens and cards configured in YouTube Studio", checked: false, points: 20 },
    { id: 6, text: "Internal links to related playlists added", checked: true, points: 15 }
  ]);

  const [seoScore, setSeoScore] = useState<number>(40);

  useEffect(() => {
    // Recalculate score based on checked items
    const score = checklist.reduce((acc, item) => acc + (item.checked ? item.points : 0), 0);
    setSeoScore(score);
  }, [checklist]);

  const toggleChecklist = (id: number) => {
    setChecklist(
      checklist.map((item) => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  // Mock SEO Data based on topic
  const titles = [
    { text: `I Built a $10,000/mo ${topic} in 14 Days`, type: "Clickbait / Story", ctr: "9.4%" },
    { text: `${topic} Ideas You Can Start Tonight (No Coding)`, type: "Curiosity", ctr: "8.8%" },
    { text: `How to Start a ${topic} in 2026 (Full Step-by-Step)`, type: "Educational", ctr: "8.2%" },
    { text: `Why 99% of ${topic}s Will Fail (And How to Avoid It)`, type: "Contrarian", ctr: "8.7%" },
    { text: `The Secret ${topic} Framework that Changed My Life`, type: "Emotional", ctr: "7.9%" }
  ];

  const descriptions = [
    `Want to know how to start a ${topic} in 2026? In this video, I break down the exact step-by-step framework we used to go from zero to ₹1.2 Crores in revenue. 

🔥 Grab the free PDF checklist here: https://yantra.ai/templates/free
💼 Book a free strategy call: https://yantra.ai/consulting

TIMESTAMPS:
0:00 - Intro
0:30 - Case Study Breakdown
2:30 - Deep Analysis
7:00 - Repeatable Framework
10:30 - Next Steps

Please make sure to like and subscribe for more content on AI automation!`,
  ];

  const tags = `${topic.toLowerCase()}, ${topic.toLowerCase()} tutorial, how to start ${topic.toLowerCase()}, ${topic.toLowerCase()} ideas, ${topic.toLowerCase()} 2026, automation, no code SaaS, side hustle 2026, tech business, agency scaling`;

  const chapters = `0:00 Intro & Shock Proof
0:30 Case Study: AutomateFlow Deconstruction
2:30 The Curiosity Bridge Method
7:00 Your Step-by-Step Blueprint
10:30 Outro & How to scale`;

  const communityPost = `🚀 Tomorrow at 6 PM, I'm dropping a brand new breakdown detailing how we built a ${topic} that generates ₹10,000/mo on complete autopilot. 

This video has our highest quality frameworks and step-by-step blueprints yet. 

Vote below: Are you currently running a channel or business in this space? 
[ ] Yes, full time!
[ ] Yes, as a side hustle
[ ] No, but I want to start soon!`;

  const pinnedComment = `Question for you: What is the biggest obstacle holding you back from launching your ${topic}? 

Leave a comment below and I'll personally reply to the first 50 creators with a custom roadmap! 👇`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Section: Score and Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Wheel */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
          <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">SEO Optimization Score</h3>

          <div className="relative my-4 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-4 border-dashed border-primary/20 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center bg-neutral-950 transition-all duration-500 shadow-[0_0_25px_rgba(16,185,129,0.2)]"
                style={{ borderColor: seoScore >= 80 ? "hsl(var(--success))" : "hsl(var(--secondary))" }}
              >
                <span className="text-4xl font-black text-white">{seoScore}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-black">/ 100</span>
              </div>
            </div>
            {/* Ping indicator */}
            <div className={`absolute top-2 right-2 w-3.5 h-3.5 rounded-full border-2 border-background animate-pulse ${
              seoScore >= 80 ? "bg-success" : "bg-secondary"
            }`} />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-white">
              {seoScore >= 80 ? "✅ SEO Ready for Upload" : "⚠️ Needs Optimization"}
            </p>
            <p className="text-[10px] text-muted-foreground max-w-[220px] leading-normal">
              {seoScore >= 80 
                ? "Excellent. Keywords, timeline chapters, and links are optimally distributed for high search indexation."
                : "Complete more items on the checklist to push your SEO score into the recommended green zone (80+)."}
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CheckSquare size={14} className="text-primary" /> Publishing SEO Checklist
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors ${
                    item.checked 
                      ? "bg-emerald-500/5 border-emerald-500/20 text-white" 
                      : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-all ${
                    item.checked 
                      ? "bg-success border-success text-white" 
                      : "border-white/20"
                  }`}>
                    {item.checked && <Check size={10} strokeWidth={4} />}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold leading-snug">{item.text}</p>
                    <span className="text-[9px] text-primary font-bold mt-1 block">+{item.points} points</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation for metadata assets */}
      <div className="space-y-4">
        <div className="flex border-b border-white/10">
          {[
            { id: "titles", label: "Titles & CTR", icon: Sparkles },
            { id: "desc", label: "Description Template", icon: Globe },
            { id: "tags", label: "Tags & Chapters", icon: Tag },
            { id: "community", label: "Community Tab & Pinned", icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all shrink-0 ${
                  active 
                    ? "border-primary text-white bg-primary/5" 
                    : "border-transparent text-muted-foreground hover:text-white"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10">
          <AnimatePresence mode="wait">
            {activeTab === "titles" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <h4 className="text-xs font-bold text-white">Suggested Video Titles (Optimized for CTR)</h4>
                  <span className="text-[10px] text-muted-foreground">Select a title to use as primary</span>
                </div>

                <div className="space-y-3">
                  {titles.map((title, idx) => {
                    const isSelected = selectedTitle === title.text;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedTitle(title.text)}
                        className={`p-3.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                          isSelected 
                            ? "border-primary bg-primary/10" 
                            : "border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-black text-primary bg-primary/20 px-2 py-0.5 rounded border border-primary/20">
                            {title.type}
                          </span>
                          <p className="text-xs font-bold text-white mt-1">"{title.text}"</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-[9px] text-muted-foreground uppercase font-black block">Predicted CTR</span>
                            <strong className="text-sm font-extrabold text-success flex items-center gap-0.5">
                              <TrendingUp size={12} /> {title.ctr}
                            </strong>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(title.text, `title-${idx}`);
                            }}
                            className="p-2 rounded bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-white transition"
                          >
                            {copiedText === `title-${idx}` ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === "desc" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <h4 className="text-xs font-bold text-white">Full Video Description Layout</h4>
                  <button
                    onClick={() => handleCopy(descriptions[0], "desc")}
                    className="px-3 py-1.5 rounded bg-primary hover:bg-primary-foreground text-black text-xs font-bold transition flex items-center gap-1 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                  >
                    {copiedText === "desc" ? <Check size={12} /> : <Copy size={12} />}
                    {copiedText === "desc" ? "Copied" : "Copy Description"}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/60 border border-white/5">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono">
                    {descriptions[0]}
                  </pre>
                </div>
              </motion.div>
            )}

            {activeTab === "tags" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Comma-separated Tags */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><Tag size={12} /> Search Tags (40)</h4>
                    <button
                      onClick={() => handleCopy(tags, "tags")}
                      className="text-primary hover:underline text-xs font-bold flex items-center gap-1"
                    >
                      {copiedText === "tags" ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                      Copy Comma-separated
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-white/5 flex flex-wrap gap-2">
                    {tags.split(", ").map((t) => (
                      <span key={t} className="text-[10px] font-bold text-white bg-white/5 px-2.5 py-1 rounded-full border border-white/5 hover:border-primary/20 transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested Chapters */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><ListOrdered size={12} /> Video Chapters</h4>
                    <button
                      onClick={() => {
                        handleCopy(chapters, "chapters");
                        // Mark chapters in checklist
                        setChecklist(
                          checklist.map((item) => 
                            item.id === 3 ? { ...item, checked: true } : item
                          )
                        );
                      }}
                      className="text-primary hover:underline text-xs font-bold flex items-center gap-1"
                    >
                      {copiedText === "chapters" ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                      Copy Chapters
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-white/5 font-mono text-xs text-muted-foreground space-y-2">
                    {chapters.split("\n").map((line, index) => (
                      <div key={index} className="flex gap-4">
                        <span className="text-primary font-bold">{line.split(" ")[0]}</span>
                        <span>{line.split(" ").slice(1).join(" ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "community" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Community Post */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h4 className="text-xs font-bold text-white">Community Tab Promotion</h4>
                    <button
                      onClick={() => handleCopy(communityPost, "community")}
                      className="text-primary hover:underline text-xs font-bold flex items-center gap-1"
                    >
                      {copiedText === "community" ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                      Copy Post
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-white/5 whitespace-pre-wrap text-xs text-muted-foreground leading-relaxed">
                    {communityPost}
                  </div>
                </div>

                {/* Pinned comment */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h4 className="text-xs font-bold text-white">Engagement Pinned Comment</h4>
                    <button
                      onClick={() => {
                        handleCopy(pinnedComment, "pinned");
                        // Mark pinned comment in checklist
                        setChecklist(
                          checklist.map((item) => 
                            item.id === 4 ? { ...item, checked: true } : item
                          )
                        );
                      }}
                      className="text-primary hover:underline text-xs font-bold flex items-center gap-1"
                    >
                      {copiedText === "pinned" ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                      Copy Comment
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-white/5 whitespace-pre-wrap text-xs text-muted-foreground leading-relaxed">
                    {pinnedComment}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigate to Thumbnails */}
      <div className="p-6 rounded-2xl glass-panel bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/20 text-primary border border-primary/30 shrink-0">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Analyze your Thumbnail variants</h4>
            <p className="text-xs text-muted-foreground">Ensure your thumbnail's colors and composition align with your primary title: "{selectedTitle || titles[0].text.substring(0, 45) + '...'}"</p>
          </div>
        </div>
        <Link
          href={`/thumbnails?topic=${topic}`}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-foreground text-black font-bold text-xs transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] shrink-0"
        >
          Score Thumbnail CTR <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function SeoEngine() {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground">Loading SEO Engine...</div>}>
      <SeoEngineContent />
    </Suspense>
  );
}
