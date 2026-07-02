"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Search, TrendingUp, Flame, Volume2, DollarSign, Zap, Eye, Sparkles,
  ArrowRight, Loader2, Target, LayoutGrid, Hash, Wand2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { ScoreRing, IndicatorBar, StatTile, Tabs, ScoreChip, toneForScore } from "@/components/vidiq";
import { GradientBorderCard } from "@/components/gradient";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "keywords", label: "Keywords", icon: Hash },
  { id: "competitors", label: "Competitors", icon: Eye },
];

const DEFAULT_SUGGESTIONS = ["AI Business", "Digital Marketing", "NextJS"];

export default function ResearchEngine() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState<any>(null);
  const [rec, setRec] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [insight, setInsight] = useState<string>("");

  // Analyze a topic — always personalized to the signed-in creator (server reads
  // their profile + connected channel).
  const handleSearch = useCallback(async (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;
    setQuery(term);
    setLoading(true);
    setTab("overview");
    try {
      const res = await fetch("/api/ai/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: term }),
      });
      const j = await res.json();
      if (j.analysis) {
        setData(j.analysis);
        setRec(j.recommendation ?? null);
      }
    } catch {
      /* keep prior result; user can retry */
    } finally {
      setLoading(false);
    }
  }, []);

  // On load, pull personalized topic suggestions for this creator, then
  // auto-analyze the strongest one so the page opens on a tailored result.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ai/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "suggest" }),
        });
        const j = await res.json();
        if (cancelled) return;
        const list: string[] = Array.isArray(j.suggestions) && j.suggestions.length ? j.suggestions.slice(0, 6) : DEFAULT_SUGGESTIONS;
        setSuggestions(list);
        if (j.insight) setInsight(j.insight);
        await handleSearch(list[0]);
      } catch {
        if (!cancelled) await handleSearch(DEFAULT_SUGGESTIONS[0]);
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => { cancelled = true; };
  }, [handleSearch]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) handleSearch(query);
  };

  const verdict = !data ? "" : data.score >= 80 ? "Highly Recommended" : data.score >= 60 ? "Moderate Potential" : "High Competition";
  const fitScore: number = rec?.fitScore ?? data?.score ?? 0;
  const fitVerdict = fitScore >= 80 ? "Perfect fit for your channel" : fitScore >= 60 ? "Good fit — angle it right" : "Stretch — adapt it to your niche";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search */}
      <div className="flex flex-col gap-2">
        <form onSubmit={onSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a winning topic — search any idea to see how it fits your channel…"
              className="w-full bg-[#121216] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button type="submit" disabled={loading} className="px-6 rounded-full btn-premium text-white font-semibold text-sm flex items-center gap-1.5 shrink-0">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Analyze"}
          </button>
        </form>

        {/* Personalized insight + suggestion chips */}
        {insight && (
          <div className="flex items-start gap-2 text-xs text-primary/90 bg-primary/5 border border-primary/15 rounded-xl px-3 py-2">
            <Wand2 size={13} className="mt-0.5 shrink-0" />
            <span>{insight}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1"><Sparkles size={12} className="text-primary" /> {insight ? "Winning topics for you:" : "Try searching:"}</span>
          {booting && suggestions === DEFAULT_SUGGESTIONS ? (
            <span className="text-muted-foreground/60 flex items-center gap-1.5"><Loader2 size={11} className="animate-spin" /> personalizing…</span>
          ) : (
            suggestions.map((term) => (
              <button key={term} onClick={() => handleSearch(term)}
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 hover:border-primary/30 hover:text-white text-white/90 transition-colors">
                {term}
              </button>
            ))
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading || (booting && !data) ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-96 flex flex-col items-center justify-center gap-4 bg-card border border-white/[0.06] rounded-3xl shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
            <Loader2 size={40} className="text-primary animate-spin" />
            <div className="text-center">
              <p className="font-semibold text-white">Personalizing your topic report…</p>
              <p className="text-xs text-muted-foreground mt-0.5">Matching demand, trends and competitors against your niche &amp; channel</p>
            </div>
          </motion.div>
        ) : data ? (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-6">
            {/* Personalized recommendation — the always-on "for you" verdict */}
            {rec && (
              <GradientBorderCard gradient="violet" glow="rgba(139,92,246,0.45)" radius={24} thickness={2}
                innerClassName="p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <ScoreRing value={fitScore} size={120} caption="fit for you" />
                  <span className="text-[11px] font-semibold text-white text-center max-w-[140px]">{fitVerdict}</span>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30"><Wand2 size={15} /></span>
                    <h3 className="text-sm font-bold text-white">Recommended for your channel</h3>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">{rec.why}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 border border-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-1"><Target size={11} /> Your angle</p>
                      <p className="text-xs text-white leading-relaxed">{rec.angle}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-1"><Zap size={11} /> First step</p>
                      <p className="text-xs text-white leading-relaxed">{rec.firstStep}</p>
                    </div>
                  </div>
                  <Link href={`/scripts?topic=${encodeURIComponent(data.keyword)}`}
                    className="inline-flex px-5 py-2.5 rounded-full btn-premium text-white font-semibold text-xs items-center gap-1.5">
                    Turn this into a script <ArrowRight size={14} />
                  </Link>
                </div>
              </GradientBorderCard>
            )}

            {/* Header row */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-white tracking-tight">{data.keyword}</h2>
                <ScoreChip value={data.score}>{verdict}</ScoreChip>
              </div>
              <Tabs tabs={TABS} active={tab} onChange={setTab} />
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatTile label="Overall Score" value={`${data.score}/100`} tone={toneForScore(data.score)} sub={verdict} icon={Target} />
              <StatTile label="Search Volume" value={`${data.volume}`} tone={toneForScore(data.volume)} sub="/ 100 demand" icon={Volume2} />
              <StatTile label="Competition" value={`${data.competition}`} tone={toneForScore(data.competition, true)} sub="lower is better" icon={Flame} />
              <StatTile label="Growth Trend" value={`${data.trend}`} tone={toneForScore(data.trend)} sub="6-mo momentum" icon={TrendingUp} />
            </div>

            {tab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Score ring */}
                  <div className="p-6 rounded-3xl bg-card border border-white/[0.06] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center gap-4 text-center">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topic Opportunity Score</h3>
                    <ScoreRing value={data.score} size={150} caption={verdict} />
                    <p className="text-[10px] text-muted-foreground max-w-[220px] leading-normal">
                      {data.score >= 80
                        ? "High search interest with low competitor density — an exceptional candidate for breakout traffic."
                        : "Use a specific framework hook and high-density keywords to rank against dominant competitors."}
                    </p>
                  </div>

                  {/* Scorecard */}
                  <div className="lg:col-span-2 p-6 rounded-3xl bg-card border border-white/[0.06] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-primary" /> Key Performance Scorecard
                    </h3>
                    <div className="space-y-3.5">
                      <IndicatorBar label="Search Volume" value={data.volume} icon={Volume2} />
                      <IndicatorBar label="Competition" value={data.competition} invert icon={Flame} />
                      <IndicatorBar label="Growth Trend" value={data.trend} icon={TrendingUp} />
                      <IndicatorBar label="Revenue Potential" value={data.revenue} icon={DollarSign} />
                      <IndicatorBar label="Virality Velocity" value={data.virality} icon={Zap} />
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="p-6 rounded-3xl bg-card border border-white/[0.06] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search Interest (Last 6 Months)</h3>
                    <div className="flex gap-4 text-[10px] text-muted-foreground flex-wrap">
                      <span><strong>Audience Intent:</strong> {data.intent}</span>
                      <span><strong>Seasonality:</strong> {data.seasonality}</span>
                    </div>
                  </div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "#121216", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }}
                          labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: "11px" }} itemStyle={{ color: "hsl(var(--primary))", fontSize: "11px" }} />
                        <Area type="monotone" dataKey="interest" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#chartGlow)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {tab === "keywords" && (
              <div className="p-6 rounded-3xl bg-card border border-white/[0.06] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] space-y-3">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Breakout Keyword Opportunities</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Sub-niches with growing search interest and lower competition.</p>
                </div>
                <div className="space-y-2">
                  {(data.related ?? []).map((sub: any) => {
                    const diffVal = sub.difficulty === "Easy" ? 20 : sub.difficulty === "Medium" ? 55 : 90;
                    return (
                      <button key={sub.term} onClick={() => handleSearch(sub.term)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition text-left flex justify-between items-center gap-3">
                        <div className="flex items-center gap-3">
                          <Hash size={14} className="text-muted-foreground shrink-0" />
                          <p className="text-xs font-semibold text-white">{sub.term}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <ScoreChip value={diffVal} invert>{`DIFF: ${String(sub.difficulty).toUpperCase()}`}</ScoreChip>
                          <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">{sub.growth}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === "competitors" && (
              <div className="p-6 rounded-3xl bg-card border border-white/[0.06] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 flex-wrap gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Eye size={14} className="text-primary" /> Competitor Intelligence &amp; Viral Videos
                  </h3>
                  <span className="text-[10px] text-warning font-bold bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                    Target Velocity: &gt;500 views/hr
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(data.videos ?? []).map((vid: any) => (
                    <div key={vid.title} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                          <span>{vid.channel}</span><span>{vid.age}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">{vid.title}</h4>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-white/5">
                        <div className="text-[10px]"><span className="text-muted-foreground">Views:</span> <strong className="text-white">{vid.views}</strong></div>
                        <span className="text-[10px] font-bold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded flex items-center gap-0.5">
                          <TrendingUp size={10} /> {vid.velocity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <GradientBorderCard gradient="violet" glow="rgba(139,92,246,0.5)" radius={24} thickness={2} innerClassName="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/20 text-primary border border-primary/30 shrink-0"><Sparkles size={20} /></div>
                <div>
                  <h4 className="text-sm font-bold text-white">Ready to create a strategy for &quot;{data.keyword}&quot;?</h4>
                  <p className="text-xs text-muted-foreground">Pick a retention framework matched to this topic and your goal.</p>
                </div>
              </div>
              <Link href="/frameworks" className="px-5 py-2.5 rounded-full btn-premium text-white font-semibold text-xs flex items-center gap-1.5 shrink-0">
                Choose Video Framework <ArrowRight size={14} />
              </Link>
            </GradientBorderCard>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="h-72 flex flex-col items-center justify-center gap-3 bg-card border border-white/[0.06] rounded-3xl text-center px-6">
            <Search size={30} className="text-muted-foreground" />
            <p className="text-sm font-semibold text-white">Search any topic to see how it fits your channel</p>
            <p className="text-xs text-muted-foreground max-w-sm">Every report is personalized to your niche, goal and connected channel.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
