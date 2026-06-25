"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  TrendingUp, 
  Flame, 
  Volume2, 
  DollarSign, 
  Zap, 
  AlertCircle, 
  Eye, 
  Sparkles,
  ArrowRight,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

// Pre-packaged search templates
const database: Record<string, any> = {
  "ai business": {
    keyword: "AI Business",
    score: 92,
    volume: 95,
    competition: 42,
    trend: 98,
    revenue: 87,
    virality: 91,
    intent: "Commercial / Educational",
    seasonality: "Year-round high demand with Q4 peaks",
    chartData: [
      { name: "Jan", interest: 45 },
      { name: "Feb", interest: 50 },
      { name: "Mar", interest: 62 },
      { name: "Apr", interest: 78 },
      { name: "May", interest: 85 },
      { name: "Jun", interest: 98 }
    ],
    related: [
      { term: "AI Agency Setup", growth: "+380%", difficulty: "Medium" },
      { term: "AI Employee Automation", growth: "+210%", difficulty: "Easy" },
      { term: "Make money with AI 2026", growth: "+145%", difficulty: "Hard" },
      { term: "Gemini 3.5 API tutorial", growth: "+490%", difficulty: "Easy" }
    ],
    videos: [
      { title: "I Built a $10,000/mo AI Agency in 14 Days", channel: "Techopreneur", views: "142K", velocity: "2.4K v/h", age: "3 days ago" },
      { title: "AI Business Ideas You Can Start TONIGHT", channel: "Future Tools", views: "389K", velocity: "900 v/h", age: "2 weeks ago" },
      { title: "Why 99% of AI Startups Will Fail", channel: "SaaS Chronicles", views: "88K", velocity: "1.1K v/h", age: "5 days ago" }
    ]
  },
  "digital marketing": {
    keyword: "Digital Marketing",
    score: 68,
    volume: 88,
    competition: 82,
    trend: 55,
    revenue: 72,
    virality: 45,
    intent: "Transactional / Educational",
    seasonality: "Slight dip in December, high in Q1",
    chartData: [
      { name: "Jan", interest: 70 },
      { name: "Feb", interest: 72 },
      { name: "Mar", interest: 69 },
      { name: "Apr", interest: 71 },
      { name: "May", interest: 68 },
      { name: "Jun", interest: 65 }
    ],
    related: [
      { term: "Digital marketing for beginners", growth: "+15%", difficulty: "Hard" },
      { term: "TikTok ads framework", growth: "+88%", difficulty: "Medium" },
      { term: "B2B lead generation automation", growth: "+120%", difficulty: "Medium" },
      { term: "SEO checklist 2026", growth: "+45%", difficulty: "Hard" }
    ],
    videos: [
      { title: "Digital Marketing Tutorial for Beginners (Full Course)", channel: "Marketing Max", views: "1.2M", velocity: "150 v/h", age: "6 months ago" },
      { title: "How to Get Your First Marketing Client", channel: "Agency Builder", views: "94K", velocity: "300 v/h", age: "1 month ago" },
      { title: "The Death of Traditional Advertising", channel: "Ad Guru", views: "180K", velocity: "420 v/h", age: "3 weeks ago" }
    ]
  },
  "nextjs": {
    keyword: "Next.js",
    score: 84,
    volume: 78,
    competition: 38,
    trend: 92,
    revenue: 80,
    virality: 85,
    intent: "Developer / Informational",
    seasonality: "Spikes during Vercel conferences (Oct/May)",
    chartData: [
      { name: "Jan", interest: 60 },
      { name: "Feb", interest: 64 },
      { name: "Mar", interest: 72 },
      { name: "Apr", interest: 81 },
      { name: "May", interest: 90 },
      { name: "Jun", interest: 92 }
    ],
    related: [
      { term: "Next.js 16 tutorial app router", growth: "+450%", difficulty: "Easy" },
      { term: "Next.js React Server Actions", growth: "+160%", difficulty: "Medium" },
      { term: "Next.js Tailwind v4 configuration", growth: "+310%", difficulty: "Easy" },
      { term: "Deploy Nextjs Docker", growth: "+75%", difficulty: "Medium" }
    ],
    videos: [
      { title: "Next.js 16 Crash Course (Everything You Need to Know)", channel: "CodeStack", views: "64K", velocity: "850 v/h", age: "2 days ago" },
      { title: "React 19 & Next.js Server Components Tutorial", channel: "Web Dev Simplified", views: "245K", velocity: "400 v/h", age: "3 weeks ago" },
      { title: "Why I'm Moving Away from Next.js in 2026", channel: "TechRant", views: "115K", velocity: "1.2K v/h", age: "4 days ago" }
    ]
  }
};

export default function ResearchEngine() {
  const [query, setQuery] = useState("AI Business");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(database["ai business"]);

  const handleSearch = (searchTerm: string) => {
    setLoading(true);
    setTimeout(() => {
      const formatted = searchTerm.toLowerCase().trim();
      let matchedData = database[formatted];
      
      // Dynamic generator if not in database
      if (!matchedData) {
        // Generate random but realistic looking values
        const volumeVal = Math.floor(Math.random() * 40) + 55;
        const compVal = Math.floor(Math.random() * 50) + 30;
        const trendVal = Math.floor(Math.random() * 40) + 60;
        const revVal = Math.floor(Math.random() * 30) + 60;
        const viralVal = Math.floor(Math.random() * 40) + 50;
        const overallScore = Math.round((volumeVal * 0.3 + (100 - compVal) * 0.2 + trendVal * 0.2 + revVal * 0.15 + viralVal * 0.15));

        matchedData = {
          keyword: searchTerm,
          score: overallScore,
          volume: volumeVal,
          competition: compVal,
          trend: trendVal,
          revenue: revVal,
          virality: viralVal,
          intent: "Informational / Commercial",
          seasonality: "Standard demand with seasonal variations",
          chartData: [
            { name: "Jan", interest: Math.floor(Math.random() * 30) + 20 },
            { name: "Feb", interest: Math.floor(Math.random() * 40) + 30 },
            { name: "Mar", interest: Math.floor(Math.random() * 40) + 40 },
            { name: "Apr", interest: Math.floor(Math.random() * 50) + 40 },
            { name: "May", interest: Math.floor(Math.random() * 60) + 40 },
            { name: "Jun", interest: trendVal }
          ],
          related: [
            { term: `${searchTerm} tutorial 2026`, growth: `+${Math.floor(Math.random()*200)+80}%`, difficulty: "Easy" },
            { term: `${searchTerm} secrets`, growth: `+${Math.floor(Math.random()*150)+40}%`, difficulty: "Medium" },
            { term: `Best ${searchTerm} strategies`, growth: `+${Math.floor(Math.random()*100)+20}%`, difficulty: "Hard" }
          ],
          videos: [
            { title: `How to master ${searchTerm} fast`, channel: "Creator Pro", views: "34K", velocity: "120 v/h", age: "1 week ago" },
            { title: `The truth about ${searchTerm}`, channel: "Inside Tech", views: "82K", velocity: "410 v/h", age: "4 days ago" }
          ]
        };
      }

      setData(matchedData);
      setLoading(false);
    }, 800);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) handleSearch(query);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Search Bar section */}
      <div className="flex flex-col gap-2">
        <form onSubmit={onSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search keyword (e.g. AI Business, NextJS, Digital Marketing)..."
              className="w-full bg-[#121216] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm transition focus:border-primary focus:ring-1 focus:ring-primary shadow-2xl"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 rounded-2xl bg-primary hover:bg-primary-foreground text-black font-bold text-sm transition shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center gap-1.5 shrink-0"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Analyze"}
          </button>
        </form>

        {/* Quick Suggestion Tags */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span>Try searching:</span>
          {["AI Business", "Digital Marketing", "NextJS"].map((term) => (
            <button
              key={term}
              onClick={() => {
                setQuery(term);
                handleSearch(term);
              }}
              className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 hover:border-white/10 text-white transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
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
              <p className="font-bold text-white">Researching Opportunity Metrics...</p>
              <p className="text-xs text-muted-foreground mt-0.5">Fetching search volume, Google trends and competitor velocities</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Opportunity Scores Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Overall Score Wheel */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col items-center justify-between text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Topic Opportunity Score</h3>

                <div className="relative my-4 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border-4 border-dashed border-primary/20 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-primary flex flex-col items-center justify-center bg-neutral-950 shadow-[0_0_25px_rgba(139,92,246,0.3)]">
                      <span className="text-4xl font-black text-white">{data.score}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-black">/ 100</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">
                    {data.score >= 80 ? "🔥 Highly Recommended Topic" : data.score >= 60 ? "📈 Moderate Potential" : "⚠️ High Competition / Low Interest"}
                  </p>
                  <p className="text-[10px] text-muted-foreground max-w-[220px] leading-normal">
                    {data.score >= 80 
                      ? "High search interest combined with low competitor density makes this topic an exceptional candidate for breakout traffic."
                      : "Consider using a very specific framework hook and high-density keywords to rank against dominant competitors."}
                  </p>
                </div>
              </div>

              {/* Specific Score Bars */}
              <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-primary" /> Key Performance Scorecard
                  </h3>

                  <div className="space-y-4">
                    {/* Volume */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1"><Volume2 size={12} /> Search Volume</span>
                        <span className="font-bold text-white">{data.volume}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data.volume}%` }} />
                      </div>
                    </div>

                    {/* Competition */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1"><Flame size={12} /> Competition</span>
                        <span className="font-bold text-white">{data.competition}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${data.competition}%` }} />
                      </div>
                    </div>

                    {/* Trend */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1"><TrendingUp size={12} /> Growth Trend</span>
                        <span className="font-bold text-white">{data.trend}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full" style={{ width: `${data.trend}%` }} />
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1"><DollarSign size={12} /> Revenue Potential</span>
                        <span className="font-bold text-white">{data.revenue}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${data.revenue}%` }} />
                      </div>
                    </div>

                    {/* Virality */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1"><Zap size={12} /> Virality Velocity</span>
                        <span className="font-bold text-white">{data.virality}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${data.virality}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart and Sub-topics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Google Trends Seasonality */}
              <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
                <div className="space-y-2 mb-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Search Interest (Last 6 Months)</h3>
                  <div className="flex gap-4 text-[10px] text-muted-foreground">
                    <span><strong>Audience Intent:</strong> {data.intent}</span>
                    <span><strong>Seasonality:</strong> {data.seasonality}</span>
                  </div>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#121216", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }}
                        labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: "11px" }}
                        itemStyle={{ color: "hsl(var(--primary))", fontSize: "11px" }}
                      />
                      <Area type="monotone" dataKey="interest" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#chartGlow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Related Sub-topics */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Breakout Opportunities</h3>
                  <p className="text-[10px] text-muted-foreground">Sub-niches with growing search interest and lower competition.</p>

                  <div className="space-y-2">
                    {data.related.map((sub: any) => (
                      <button
                        key={sub.term}
                        onClick={() => {
                          setQuery(sub.term);
                          handleSearch(sub.term);
                        }}
                        className="w-full p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition text-left flex justify-between items-center"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{sub.term}</p>
                          <span className={`text-[9px] font-bold ${
                            sub.difficulty === "Easy" ? "text-success" : sub.difficulty === "Medium" ? "text-amber-400" : "text-red-400"
                          }`}>
                            Diff: {sub.difficulty}
                          </span>
                        </div>
                        <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          {sub.growth}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Competitor Intelligence */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Eye size={14} className="text-primary" /> Competitor Intelligence & Viral Videos
                </h3>
                <span className="text-[10px] text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                  Target View Velocity: &gt;500 views/hr
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.videos.map((vid: any) => (
                  <div key={vid.title} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                        <span>{vid.channel}</span>
                        <span>{vid.age}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">
                        {vid.title}
                      </h4>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <div className="text-[10px]">
                        <span className="text-muted-foreground">Views:</span>{" "}
                        <strong className="text-white">{vid.views}</strong>
                      </div>
                      <span className="text-[10px] font-bold text-success bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-0.5">
                        <TrendingUp size={10} /> {vid.velocity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Strategy Coach Card */}
            <div className="p-6 rounded-2xl glass-panel bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/20 text-primary border border-primary/30 shrink-0">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Ready to create a strategy for "{data.keyword}"?</h4>
                  <p className="text-xs text-muted-foreground">The AI Coach has mapped this topic to 3 optimal audience-retention frameworks.</p>
                </div>
              </div>
              <Link
                href="/frameworks"
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-foreground text-black font-bold text-xs transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] shrink-0"
              >
                Choose Video Framework <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
