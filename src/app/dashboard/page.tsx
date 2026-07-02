"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, ArrowRight, FileText, Image as ImageIcon, Search, Globe,
  TrendingUp, Eye, Users, Video, Play, Film, Clock, Loader2, Target, Layers, Type,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { MetricAreaCard, ActivityRow, CategoryBar } from "@/components/brink";
import { createClient } from "@/utils/supabase/client";

function fmt(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}
function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

type YTConn = {
  channel_title: string;
  subscriber_count: number;
  view_count: number;
  video_count: number;
  last_synced_at: string | null;
  analytics: { series: { day: string; views: number; minutes: number; subs: number }[]; totals: { views: number; minutes: number; subs: number }; avgRetention: number } | null;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const ACTIVITY = [
  { icon: FileText, title: "Script generated — Cold Email for Agencies", time: "Today, 2:14 PM", amount: "+1 draft", positive: true, color: "#8B5CF6" },
  { icon: ImageIcon, title: "Thumbnail scored 87/100", time: "Today, 11:02 AM", amount: "High CTR", positive: true, color: "#22D3EE" },
  { icon: Search, title: "Keyword researched — AI Business", time: "Yesterday, 6:40 PM", amount: "92 score", positive: true, color: "#34D399" },
  { icon: TrendingUp, title: "Retention drop flagged at 0:22", time: "Nov 26, 3:20 PM", amount: "−45%", positive: false, color: "#F87171" },
  { icon: Globe, title: "SEO optimized — 10 tags added", time: "Nov 25, 9:12 AM", amount: "Ready", positive: true, color: "#F472B6" },
];

const CATEGORIES = [
  { icon: Video, label: "Tutorials", value: 78, color: "#8B5CF6", caption: "24 videos published" },
  { icon: Play, label: "Shorts", value: 64, color: "#34D399", caption: "18 shorts this month" },
  { icon: Eye, label: "Reviews", value: 45, color: "#22D3EE", caption: "9 videos published" },
  { icon: Film, label: "Vlogs", value: 30, color: "#F472B6", caption: "6 videos published" },
];

type Strategy = {
  angle: string; framework: string; targetAudience: string; whyItWorks: string;
  titles: string[]; hook: string; thumbnailIdea: string; cta: string; firstStep: string;
};

function StratField({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/5 p-3.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 mb-1"><Icon size={12} /> {label}</p>
      <p className="text-xs text-white leading-relaxed">{children}</p>
    </div>
  );
}

function StrategyView({ strategy, onCreateScript }: { strategy: Strategy; onCreateScript: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-card border border-white/[0.06] p-6 md:p-7 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] space-y-5">
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center"><Sparkles size={16} /></span>
        <h3 className="text-base font-semibold text-white">Your Video Strategy</h3>
        <span className="ml-auto text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">Tailored to your channel</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StratField icon={Target} label="Angle">{strategy.angle}</StratField>
        <StratField icon={Layers} label="Framework">{strategy.framework}</StratField>
        <StratField icon={Users} label="Target audience">{strategy.targetAudience}</StratField>
        <StratField icon={Sparkles} label="Why it works">{strategy.whyItWorks}</StratField>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 flex items-center gap-1.5"><Type size={12} /> Title ideas</p>
        <div className="space-y-1.5">
          {strategy.titles?.map((t, i) => (<p key={i} className="text-sm text-white"><span className="text-primary font-semibold">{i + 1}.</span> {t}</p>))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StratField icon={Sparkles} label="Hook">{strategy.hook}</StratField>
        <StratField icon={ImageIcon} label="Thumbnail idea">{strategy.thumbnailIdea}</StratField>
        <StratField icon={ArrowRight} label="Call to action">{strategy.cta}</StratField>
        <StratField icon={Play} label="First step">{strategy.firstStep}</StratField>
      </div>
      <button onClick={onCreateScript} className="btn-premium px-6 py-3 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2">
        Create the full script <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}

export default function CommandCenter() {
  const router = useRouter();
  const [topicInput, setTopicInput] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [yt, setYt] = useState<YTConn | null>(null);
  const [ytLoaded, setYtLoaded] = useState(false);
  const [ytError, setYtError] = useState<string | null>(null);

  // Auth is enforced by middleware (real Supabase session) — no localStorage gate.

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("youtube") === "error") setYtError(params.get("reason") || "unknown");
    const supabase = createClient();
    supabase
      .from("youtube_connections")
      .select("channel_title,subscriber_count,view_count,video_count,last_synced_at,analytics")
      .maybeSingle()
      .then(({ data }) => { setYt(data as YTConn | null); setYtLoaded(true); });
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim() || genLoading) return;
    setGenLoading(true);
    setStrategy(null);
    try {
      const res = await fetch("/api/ai/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicInput }),
      });
      const data = await res.json();
      if (data.strategy) setStrategy(data.strategy as Strategy);
    } catch {
      /* keep the bar usable; user can retry */
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Create bar */}
      <motion.div variants={itemVariants}>
        <form onSubmit={handleGenerate} className="relative group">
          <div className="surface-elevated flex flex-col md:flex-row items-center rounded-2xl overflow-hidden focus-within:border-primary/50 transition-colors p-2 gap-2">
            <div className="flex-1 w-full flex items-center px-3 py-1.5">
              <Sparkles className="text-muted-foreground shrink-0 mr-3" size={20} />
              <input type="text" placeholder="What video do you want to make?" value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)} disabled={genLoading}
                className="w-full bg-transparent border-none outline-none text-foreground text-base md:text-lg font-medium placeholder:text-muted-foreground/50 disabled:opacity-50" />
            </div>
            <button type="submit" disabled={genLoading || !topicInput.trim()}
              className="btn-premium w-full md:w-auto px-6 py-3 rounded-xl disabled:opacity-50 disabled:saturate-50 text-white font-semibold shrink-0 flex items-center justify-center gap-2">
              {genLoading ? (<><Loader2 size={18} className="animate-spin" /> Building strategy…</>) : (<>Generate Strategy <ArrowRight size={18} /></>)}
            </button>
          </div>
        </form>
        {!strategy && !genLoading && (
          <p className="mt-2 px-1 text-xs text-muted-foreground">
            Get an instant, personalized strategy for any idea — tailored to your creator profile and goal.
          </p>
        )}
      </motion.div>

      {/* Generated strategy */}
      <AnimatePresence>
        {strategy && (
          <motion.div variants={itemVariants} key="strategy">
            <StrategyView strategy={strategy} onCreateScript={() => router.push(`/scripts?topic=${encodeURIComponent(topicInput)}`)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube connect error surfacing */}
      {ytError && (
        <motion.div variants={itemVariants} className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
          <strong>YouTube connect failed</strong> (reason: {ytError}).{" "}
          {ytError.startsWith("token") && "Server couldn't exchange the code — check GOOGLE_CLIENT_SECRET in Vercel (invalid_client = wrong secret; redirect_uri_mismatch = URI not registered)."}
          {ytError === "state" && "Security check failed — try connecting again."}
          {ytError === "channel" && "No YouTube channel found on that Google account (or the Data API isn't enabled)."}
        </motion.div>
      )}

      {/* YouTube connection status / connect CTA */}
      {ytLoaded && (
        <motion.div variants={itemVariants}>
          {yt ? (
            <div className="flex items-center justify-between rounded-2xl bg-card border border-white/[0.06] px-4 py-2.5 text-xs">
              <span className="text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" /> Connected:{" "}
                <strong className="text-white">{yt.channel_title}</strong>
                {yt.last_synced_at && <span className="text-muted-foreground/70">· synced {timeAgo(yt.last_synced_at)}</span>}
              </span>
              <a href="/api/youtube/connect" className="text-primary font-semibold hover:underline shrink-0">Refresh</a>
            </div>
          ) : (
            <a href="/api/youtube/connect" className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary/15 to-transparent border border-primary/20 px-4 py-3 group">
              <span className="text-sm text-white font-semibold flex items-center gap-2"><Play size={16} className="text-primary" /> Connect your YouTube channel for real analytics</span>
              <span className="text-primary text-xs font-semibold group-hover:translate-x-0.5 transition">Connect &rarr;</span>
            </a>
          )}
        </motion.div>
      )}

      {/* Real channel dashboard — only once a YouTube channel is connected */}
      {yt && (
        <>
      {/* Row 1: metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <MetricAreaCard label="Total Views" value={fmt(yt.view_count)} delta={`+${fmt(yt.analytics?.totals.views ?? 0)}`} up color="#34D399" icon={Eye} data={(yt.analytics?.series ?? []).map((d) => ({ v: d.views }))} />
        <MetricAreaCard label="Subscribers" value={fmt(yt.subscriber_count)} delta={`+${fmt(yt.analytics?.totals.subs ?? 0)}`} up color="#22D3EE" icon={Users} data={(yt.analytics?.series ?? []).map((d) => ({ v: d.subs }))} />
        <MetricAreaCard label="Watch Hours · 28d" value={fmt(Math.round((yt.analytics?.totals.minutes ?? 0) / 60))} delta="28d" up color="#8B5CF6" icon={Clock} data={(yt.analytics?.series ?? []).map((d) => ({ v: d.minutes }))} />
      </motion.div>

      {/* Row 2: activity + categories */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent activity */}
        <div className="lg:col-span-2 rounded-3xl bg-card border border-white/[0.06] p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-white">Recent Activity</h3>
            <button onClick={() => router.push("/analytics")}
              className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-3 py-1.5 rounded-lg transition-colors">
              View all
            </button>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {ACTIVITY.map((a) => <ActivityRow key={a.title} {...a} />)}
          </div>
        </div>

        {/* Content categories */}
        <div className="rounded-3xl bg-card border border-white/[0.06] p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
          <h3 className="text-base font-semibold text-white mb-5">Content Categories</h3>
          <div className="space-y-5">
            {CATEGORIES.map((c) => <CategoryBar key={c.label} {...c} />)}
          </div>
        </div>
      </motion.div>

      {/* Today's Mission */}
      <motion.div variants={itemVariants} className="rounded-3xl bg-card border border-white/[0.06] p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white">Today's Mission</h3>
          <span className="text-[10px] uppercase font-bold text-warning bg-warning/10 border border-warning/20 px-2 py-1 rounded">In Progress</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/5 p-4 flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0"><FileText size={15} /></span>
            <div><p className="text-xs font-semibold text-white">Script drafted</p><p className="text-[10px] text-muted-foreground">Ready for review</p></div>
          </div>
          <button onClick={() => router.push("/thumbnails")} className="rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors p-4 flex items-center gap-3 text-left">
            <span className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0"><ImageIcon size={15} /></span>
            <div><p className="text-xs font-semibold text-primary">Design Thumbnail</p><p className="text-[10px] text-primary/70">Do it now →</p></div>
          </button>
          <div className="rounded-2xl bg-white/5 border border-white/5 p-4 flex items-center gap-3 opacity-60">
            <span className="w-9 h-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0"><Clock size={15} /></span>
            <div><p className="text-xs font-semibold text-white">Publish</p><p className="text-[10px] text-muted-foreground">Tomorrow, 11:00 AM</p></div>
          </div>
        </div>
      </motion.div>
        </>
      )}
    </motion.div>
  );
}
