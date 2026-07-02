"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowRight, ArrowLeft, Check, Loader2, Plus, X, ChevronUp, ChevronDown,
  Compass, Target, Users, Wand2, Rocket, Calendar, Search, Share2, Crown, Handshake,
  DollarSign, Workflow, BarChart3, Download, Pencil, Trophy,
} from "lucide-react";
import { InfluqMark } from "@/components/logo";

/* ------------------------------------------------------------------ */
/* Questionnaire config                                                */
/* ------------------------------------------------------------------ */

const STORY_TYPES = ["Mythology", "History", "Business", "Entrepreneurship", "Spirituality", "Self-growth", "Children's stories", "Moral stories", "Family", "Culture", "Real-life stories", "Inspirational biographies", "Fiction", "Science", "Technology"];
const EMOTIONS = ["Inspired", "Curious", "Emotional", "Happy", "Hopeful", "Peaceful", "Motivated", "Proud", "Confident", "Connected"];
const SKILLS = ["Camera Confidence", "Storytelling", "Writing", "Research", "Voice", "Editing", "Consistency", "Leadership", "Communication", "Creativity", "Planning", "AI Knowledge"];
const RESOURCES = ["Camera", "Microphone", "Studio", "Editor", "Designer", "Writer", "Researcher", "AI Tools", "Website", "Newsletter", "Email List", "Community", "Budget"];
const PLATFORMS = ["YouTube", "Instagram", "Facebook", "LinkedIn", "Podcast", "Spotify", "Newsletter", "WhatsApp", "Telegram", "X", "Website"];
const MONETIZATION = ["AdSense", "Brand Deals", "Courses", "Membership", "Books", "Speaking", "Consulting", "Affiliate Marketing", "Digital Products", "Merchandise", "Licensing"];
const FREQUENCIES = ["Daily", "3/week", "2/week", "Weekly"];

type Creator = { name: string; platform: string; reason: string };
type Brand = { brand: string; reason: string };

type Answers = {
  mission: string;
  audience: { age: string; gender: string; countries: string; languages: string; interests: string; problems: string; aspirations: string; creatorsFollowed: string };
  storyTypes: string[]; storyTypesOther: string;
  uniqueAdvantage: string;
  emotions: string[];
  transformation: string;
  inspirations: Creator[];
  strengths: Record<string, number>; limitations: string;
  resources: string[]; resourcesOther: string;
  success: { subscribers: string; views: string; revenue: string; brandCollaborations: string; books: string; speaking: string; courses: string; communitySize: string; other: string };
  hoursPerWeek: number; uploadFrequency: string;
  platforms: string[];
  monetizationRank: string[];
  brandCollaborations: Brand[]; neverPromote: string;
  legacy: string;
};

const EMPTY: Answers = {
  mission: "",
  audience: { age: "", gender: "", countries: "", languages: "", interests: "", problems: "", aspirations: "", creatorsFollowed: "" },
  storyTypes: [], storyTypesOther: "",
  uniqueAdvantage: "",
  emotions: [],
  transformation: "",
  inspirations: [{ name: "", platform: "", reason: "" }],
  strengths: Object.fromEntries(SKILLS.map((s) => [s, 5])), limitations: "",
  resources: [], resourcesOther: "",
  success: { subscribers: "", views: "", revenue: "", brandCollaborations: "", books: "", speaking: "", courses: "", communitySize: "", other: "" },
  hoursPerWeek: 10, uploadFrequency: "Weekly",
  platforms: ["YouTube"],
  monetizationRank: MONETIZATION,
  brandCollaborations: [{ brand: "", reason: "" }], neverPromote: "",
  legacy: "",
};

const SECTIONS = [
  "Vision", "Audience", "Content", "Unique Advantage", "Emotional Goal", "Transformation", "Inspiration",
  "Strengths", "Resources", "Success", "Availability", "Distribution", "Revenue", "Collaborations", "Legacy",
];

const LS_KEY = "influq_strategy_draft";

/* ------------------------------------------------------------------ */
/* Small field primitives                                              */
/* ------------------------------------------------------------------ */

const label = "text-[10px] uppercase font-semibold tracking-wider text-muted-foreground";
const inputCls = "w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary/50 outline-none placeholder:text-muted-foreground/50";
const areaCls = inputCls + " min-h-[130px] leading-relaxed resize-y";

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

function ChipGroup({ options, value, onToggle }: { options: string[]; value: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button key={o} type="button" onClick={() => onToggle(o)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${on ? "bg-primary/15 text-primary border-primary/40" : "bg-white/5 text-white/80 border-white/10 hover:border-primary/30"}`}>
            {on && <Check size={11} className="inline mr-1 -mt-0.5" />}{o}
          </button>
        );
      })}
    </div>
  );
}

function AiHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-1.5 text-[11px] text-primary/80 bg-primary/5 border border-primary/15 rounded-lg px-2.5 py-1.5">
      <Wand2 size={12} className="mt-0.5 shrink-0" /> {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

function Step({ index, answers, set }: { index: number; answers: Answers; set: <K extends keyof Answers>(k: K, v: Answers[K]) => void }) {
  const a = answers;
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  switch (index) {
    case 0: // Vision / mission
      return (
        <Field>
          <p className="text-sm text-white/70">Imagine your storytelling channel becomes one of the biggest in the world. What change do you want to create?</p>
          <textarea className={areaCls} value={a.mission} onChange={(e) => set("mission", e.target.value)} placeholder="My mission is to…" />
          <AiHint>Your mission defines your brand positioning.</AiHint>
        </Field>
      );
    case 1: // Audience
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {([["age", "Age range"], ["gender", "Gender (optional)"], ["countries", "Countries"], ["languages", "Languages"], ["interests", "Interests"], ["problems", "Problems they face"], ["aspirations", "Their aspirations"], ["creatorsFollowed", "Creators they follow"]] as const).map(([k, lab]) => (
            <Field key={k}>
              <span className={label}>{lab}</span>
              <input className={inputCls} value={a.audience[k]} onChange={(e) => set("audience", { ...a.audience, [k]: e.target.value })} />
            </Field>
          ))}
        </div>
      );
    case 2: // Content story types
      return (
        <Field>
          <p className="text-sm text-white/70">Pick every kind of story you want to tell.</p>
          <ChipGroup options={STORY_TYPES} value={a.storyTypes} onToggle={(v) => set("storyTypes", toggle(a.storyTypes, v))} />
          <input className={inputCls + " mt-1"} value={a.storyTypesOther} onChange={(e) => set("storyTypesOther", e.target.value)} placeholder="Other (comma separated)…" />
        </Field>
      );
    case 3:
      return (
        <Field>
          <p className="text-sm text-white/70">Why should people listen to your stories instead of someone else&apos;s?</p>
          <textarea className={areaCls} value={a.uniqueAdvantage} onChange={(e) => set("uniqueAdvantage", e.target.value)} placeholder="What makes you different…" />
        </Field>
      );
    case 4:
      return (
        <Field>
          <p className="text-sm text-white/70">How should viewers feel after watching your videos?</p>
          <ChipGroup options={EMOTIONS} value={a.emotions} onToggle={(v) => set("emotions", toggle(a.emotions, v))} />
        </Field>
      );
    case 5:
      return (
        <Field>
          <p className="text-sm text-white/70">What transformation do you want your audience to experience over the next five years?</p>
          <textarea className={areaCls} value={a.transformation} onChange={(e) => set("transformation", e.target.value)} placeholder="In five years, my audience will…" />
        </Field>
      );
    case 6: // Inspirations (repeatable, max 10)
      return (
        <div className="space-y-2.5">
          <p className="text-sm text-white/70">Which creators inspire you? (up to 10)</p>
          {a.inspirations.map((c, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.4fr_auto] gap-2 items-center">
              <input className={inputCls} value={c.name} onChange={(e) => { const n = [...a.inspirations]; n[i] = { ...c, name: e.target.value }; set("inspirations", n); }} placeholder="Creator name" />
              <input className={inputCls} value={c.platform} onChange={(e) => { const n = [...a.inspirations]; n[i] = { ...c, platform: e.target.value }; set("inspirations", n); }} placeholder="Platform" />
              <input className={inputCls} value={c.reason} onChange={(e) => { const n = [...a.inspirations]; n[i] = { ...c, reason: e.target.value }; set("inspirations", n); }} placeholder="Why?" />
              <button type="button" onClick={() => set("inspirations", a.inspirations.filter((_, x) => x !== i))} className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-destructive shrink-0"><X size={14} /></button>
            </div>
          ))}
          {a.inspirations.length < 10 && (
            <button type="button" onClick={() => set("inspirations", [...a.inspirations, { name: "", platform: "", reason: "" }])} className="text-xs font-semibold text-primary flex items-center gap-1"><Plus size={13} /> Add creator</button>
          )}
        </div>
      );
    case 7: // Strengths
      return (
        <div className="space-y-4">
          <p className="text-sm text-white/70">Rate yourself 1–10 on each skill.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {SKILLS.map((s) => (
              <div key={s} className="flex items-center gap-3">
                <span className="text-xs text-white/80 w-36 shrink-0">{s}</span>
                <input type="range" min={1} max={10} value={a.strengths[s]} onChange={(e) => set("strengths", { ...a.strengths, [s]: Number(e.target.value) })} className="flex-1 accent-[var(--primary)]" />
                <span className="text-xs font-bold text-primary w-6 text-right">{a.strengths[s]}</span>
              </div>
            ))}
          </div>
          <Field>
            <span className={label}>Your biggest limitations</span>
            <textarea className={areaCls} value={a.limitations} onChange={(e) => set("limitations", e.target.value)} placeholder="What holds you back right now…" />
          </Field>
        </div>
      );
    case 8: // Resources
      return (
        <Field>
          <p className="text-sm text-white/70">Which resources do you already have?</p>
          <ChipGroup options={RESOURCES} value={a.resources} onToggle={(v) => set("resources", toggle(a.resources, v))} />
          <input className={inputCls + " mt-1"} value={a.resourcesOther} onChange={(e) => set("resourcesOther", e.target.value)} placeholder="Other resources…" />
        </Field>
      );
    case 9: // Success
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {([["subscribers", "Subscribers"], ["views", "Views"], ["revenue", "Revenue"], ["brandCollaborations", "Brand collaborations"], ["books", "Books"], ["speaking", "Speaking engagements"], ["courses", "Courses"], ["communitySize", "Community size"], ["other", "Other"]] as const).map(([k, lab]) => (
            <Field key={k}>
              <span className={label}>{lab}</span>
              <input className={inputCls} value={a.success[k]} onChange={(e) => set("success", { ...a.success, [k]: e.target.value })} placeholder="After 1 year…" />
            </Field>
          ))}
        </div>
      );
    case 10: // Availability
      return (
        <div className="space-y-5">
          <Field>
            <div className="flex items-center justify-between"><span className={label}>Hours per week</span><span className="text-sm font-bold text-primary">{a.hoursPerWeek}h</span></div>
            <input type="range" min={5} max={60} value={a.hoursPerWeek} onChange={(e) => set("hoursPerWeek", Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </Field>
          <Field>
            <span className={label}>Preferred upload frequency</span>
            <div className="flex flex-wrap gap-2">
              {FREQUENCIES.map((f) => (
                <button key={f} type="button" onClick={() => set("uploadFrequency", f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${a.uploadFrequency === f ? "bg-primary/15 text-primary border-primary/40" : "bg-white/5 text-white/80 border-white/10"}`}>{f}</button>
              ))}
            </div>
          </Field>
        </div>
      );
    case 11: // Platforms
      return (
        <Field>
          <p className="text-sm text-white/70">Which platforms do you want to build?</p>
          <ChipGroup options={PLATFORMS} value={a.platforms} onToggle={(v) => set("platforms", toggle(a.platforms, v))} />
        </Field>
      );
    case 12: // Revenue ranking
      return (
        <div className="space-y-2">
          <p className="text-sm text-white/70">Rank your preferred monetization methods (top = most preferred).</p>
          {a.monetizationRank.map((m, i) => (
            <div key={m} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="text-sm text-white flex-1">{m}</span>
              <button type="button" disabled={i === 0} onClick={() => { const n = [...a.monetizationRank]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; set("monetizationRank", n); }} className="p-1 rounded text-muted-foreground hover:text-white disabled:opacity-20"><ChevronUp size={16} /></button>
              <button type="button" disabled={i === a.monetizationRank.length - 1} onClick={() => { const n = [...a.monetizationRank]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; set("monetizationRank", n); }} className="p-1 rounded text-muted-foreground hover:text-white disabled:opacity-20"><ChevronDown size={16} /></button>
            </div>
          ))}
        </div>
      );
    case 13: // Brand collaborations
      return (
        <div className="space-y-2.5">
          <p className="text-sm text-white/70">Which brands would you love to collaborate with?</p>
          {a.brandCollaborations.map((b, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_auto] gap-2 items-center">
              <input className={inputCls} value={b.brand} onChange={(e) => { const n = [...a.brandCollaborations]; n[i] = { ...b, brand: e.target.value }; set("brandCollaborations", n); }} placeholder="Brand" />
              <input className={inputCls} value={b.reason} onChange={(e) => { const n = [...a.brandCollaborations]; n[i] = { ...b, reason: e.target.value }; set("brandCollaborations", n); }} placeholder="Why them?" />
              <button type="button" onClick={() => set("brandCollaborations", a.brandCollaborations.filter((_, x) => x !== i))} className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-destructive shrink-0"><X size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => set("brandCollaborations", [...a.brandCollaborations, { brand: "", reason: "" }])} className="text-xs font-semibold text-primary flex items-center gap-1"><Plus size={13} /> Add brand</button>
          <Field>
            <span className={label}>Which industries or products would you never promote?</span>
            <textarea className={areaCls} value={a.neverPromote} onChange={(e) => set("neverPromote", e.target.value)} placeholder="I would never promote…" />
          </Field>
        </div>
      );
    case 14: // Legacy
      return (
        <Field>
          <p className="text-sm text-white/70">Imagine it&apos;s five years from now. Complete this sentence:</p>
          <div className="text-base text-white font-semibold">&ldquo;When people think of my channel, they say…&rdquo;</div>
          <textarea className={areaCls} value={a.legacy} onChange={(e) => set("legacy", e.target.value)} placeholder="…" />
        </Field>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Processing screen                                                   */
/* ------------------------------------------------------------------ */

const PROCESSING_MSGS = [
  "Analyzing your audience…", "Understanding your positioning…", "Finding growth opportunities…",
  "Building your content pillars…", "Designing your publishing strategy…", "Generating your monetization roadmap…",
  "Creating your brand collaboration strategy…", "Preparing your six-month action plan…",
];

function Processing() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % PROCESSING_MSGS.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 border-primary/20 flex items-center justify-center">
          <Loader2 size={40} className="text-primary animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl -z-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white">Building your personalized strategy</h2>
        <AnimatePresence mode="wait">
          <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-sm text-primary font-medium">
            {PROCESSING_MSGS[i]}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="text-xs text-muted-foreground max-w-sm">This usually takes 30–60 seconds. We&apos;re analyzing your vision, audience, strengths and goals.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Roadmap view                                                        */
/* ------------------------------------------------------------------ */

function Card({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/[0.06] bg-card p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] space-y-4 break-inside-avoid">
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0"><Icon size={16} /></span>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Bullets({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return <ul className="space-y-1.5">{items.map((t, i) => <li key={i} className="text-xs text-white/85 leading-relaxed flex gap-2"><span className="text-primary shrink-0">▸</span>{t}</li>)}</ul>;
}

function KV({ k, v }: { k: string; v?: string }) {
  if (!v) return null;
  return <div><p className={label}>{k}</p><p className="text-xs text-white/85 leading-relaxed mt-0.5">{v}</p></div>;
}

function Roadmap({ report, onEdit, onRegenerate, regenerating }: { report: any; onEdit: () => void; onRegenerate: () => void; regenerating: boolean }) {
  const r = report || {};
  const es = r.executiveSummary || {};
  const b = r.brand || {};
  const au = r.audience || {};
  const c = r.content || {};
  const seo = r.seo || {};
  const dist = r.distribution || {};
  const pb = r.personalBrand || {};
  const bc = r.brandCollab || {};
  const prod = r.productivity || {};

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Hero */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-6 md:p-8 print:border-none">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full"><Sparkles size={11} /> Your 6-Month Growth Strategy</span>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight max-w-2xl">{b.mission || "Your personalized storytelling roadmap"}</h1>
            {b.uvp && <p className="text-sm text-white/70 max-w-2xl">{b.uvp}</p>}
          </div>
          <div className="flex gap-2 print:hidden">
            <button onClick={() => window.print()} className="px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-white/10"><Download size={14} /> PDF</button>
            <button onClick={onEdit} className="px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-white/10"><Pencil size={14} /> Edit answers</button>
            <button onClick={onRegenerate} disabled={regenerating} className="btn-premium px-3.5 py-2 rounded-full text-white text-xs font-semibold flex items-center gap-1.5">{regenerating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} Regenerate</button>
          </div>
        </div>
        {b.taglines?.length ? (
          <div className="flex flex-wrap gap-2 mt-4">
            {b.taglines.map((t: string, i: number) => <span key={i} className="text-xs text-primary/90 bg-primary/10 border border-primary/20 rounded-full px-3 py-1">&ldquo;{t}&rdquo;</span>)}
          </div>
        ) : null}
      </div>

      {/* Executive summary */}
      <Card icon={Compass} title="Executive Summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KV k="Current position" v={es.currentPosition} />
          <KV k="Growth potential" v={es.growthPotential} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><p className={label + " mb-1.5"}>Key challenges</p><Bullets items={es.keyChallenges} /></div>
          <div><p className={label + " mb-1.5"}>Competitive advantages</p><Bullets items={es.competitiveAdvantages} /></div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand */}
        <Card icon={Crown} title="Brand Positioning">
          <KV k="Vision" v={b.vision} />
          <KV k="Voice" v={b.voice} />
          <KV k="Content promise" v={b.contentPromise} />
          {b.personality?.length ? <div className="flex flex-wrap gap-1.5">{b.personality.map((p: string, i: number) => <span key={i} className="text-[11px] text-white/85 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5">{p}</span>)}</div> : null}
        </Card>
        {/* Audience */}
        <Card icon={Users} title="Audience Persona">
          <KV k="Primary" v={au.primary} />
          <KV k="Secondary" v={au.secondary} />
          <div className="grid grid-cols-2 gap-4">
            <div><p className={label + " mb-1.5"}>Pain points</p><Bullets items={au.painPoints} /></div>
            <div><p className={label + " mb-1.5"}>Desires</p><Bullets items={au.desires} /></div>
          </div>
          <KV k="Viewing habits" v={au.viewingHabits} />
        </Card>
      </div>

      {/* Content strategy */}
      <Card icon={Target} title="Content Strategy">
        {c.pillars?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {c.pillars.map((p: any, i: number) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-xs font-bold text-white flex items-center gap-1.5"><span className="text-primary">{i + 1}.</span>{p.name}</p>
                <p className="text-[11px] text-white/70 mt-1 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KV k="Long-form" v={c.longForm} />
          <KV k="Shorts" v={c.shorts} />
          <KV k="Storytelling framework" v={c.storytellingFramework} />
          <KV k="Content mix" v={c.contentMix} />
        </div>
        {c.seriesIdeas?.length ? <div><p className={label + " mb-1.5"}>Series ideas</p><Bullets items={c.seriesIdeas} /></div> : null}
      </Card>

      {/* Calendar */}
      {Array.isArray(r.calendar) && r.calendar.length ? (
        <Card icon={Calendar} title="6-Month Publishing Calendar">
          <div className="space-y-3">
            {r.calendar.map((m: any, i: number) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <p className="text-xs font-bold text-white"><span className="text-primary">Month {m.month ?? i + 1}</span> · {m.theme}</p>
                  {m.goal && <span className="text-[10px] text-muted-foreground">{m.goal}</span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {(m.uploads || []).map((u: any, j: number) => (
                    <div key={j} className="rounded-lg bg-neutral-950/50 border border-white/5 p-2">
                      <p className="text-[10px] text-primary font-semibold">Week {u.week ?? j + 1} · {u.format}</p>
                      <p className="text-[11px] text-white mt-0.5 leading-snug">{u.topic}</p>
                      {u.kpi && <p className="text-[9px] text-muted-foreground mt-1">{u.kpi}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO */}
        <Card icon={Search} title="SEO Strategy">
          <KV k="Title formula" v={seo.titleFormula} />
          <KV k="Thumbnail strategy" v={seo.thumbnailStrategy} />
          <KV k="Description template" v={seo.descriptionTemplate} />
          {seo.keywordClusters?.length ? <div><p className={label + " mb-1.5"}>Keyword clusters</p><Bullets items={seo.keywordClusters} /></div> : null}
          {seo.hashtags?.length ? <div className="flex flex-wrap gap-1.5">{seo.hashtags.map((h: string, i: number) => <span key={i} className="text-[10px] text-primary bg-white/5 border border-white/10 rounded px-2 py-0.5">{h}</span>)}</div> : null}
        </Card>
        {/* Distribution */}
        <Card icon={Share2} title="Distribution Plan">
          <KV k="Instagram" v={dist.instagram} />
          <KV k="LinkedIn" v={dist.linkedin} />
          <KV k="Newsletter" v={dist.newsletter} />
          <KV k="Podcast" v={dist.podcast} />
          <KV k="Community" v={dist.community} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal brand */}
        <Card icon={Rocket} title="Personal Brand">
          <KV k="Authority building" v={pb.authority} />
          <KV k="Networking" v={pb.networking} />
          <KV k="Speaking" v={pb.speaking} />
          <KV k="Media outreach" v={pb.mediaOutreach} />
          {pb.bookIdeas?.length ? <div><p className={label + " mb-1.5"}>Book ideas</p><Bullets items={pb.bookIdeas} /></div> : null}
        </Card>
        {/* Brand collab */}
        <Card icon={Handshake} title="Brand Collaboration Strategy">
          <KV k="Readiness" v={bc.readiness} />
          <KV k="Sponsorship positioning" v={bc.sponsorshipPositioning} />
          {bc.idealCategories?.length ? <div><p className={label + " mb-1.5"}>Ideal categories</p><Bullets items={bc.idealCategories} /></div> : null}
          {bc.mediaKit?.length ? <div><p className={label + " mb-1.5"}>Media kit</p><Bullets items={bc.mediaKit} /></div> : null}
        </Card>
      </div>

      {/* Monetization */}
      {Array.isArray(r.monetization) && r.monetization.length ? (
        <Card icon={DollarSign} title="Monetization Roadmap">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {r.monetization.map((m: any, i: number) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-xs font-bold text-primary">Month {m.month ?? i + 1}</p>
                <p className="text-[11px] text-white mt-0.5">{m.focus}</p>
                <Bullets items={m.streams} />
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {/* Productivity */}
      <Card icon={Workflow} title="Productivity System">
        {prod.weeklyWorkflow?.length ? <div><p className={label + " mb-1.5"}>Weekly workflow</p><Bullets items={prod.weeklyWorkflow} /></div> : null}
        {prod.pipeline ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {(["research", "writing", "recording", "editing", "publishing"] as const).map((k) => prod.pipeline[k] ? (
              <div key={k} className="rounded-lg bg-white/5 border border-white/10 p-2.5">
                <p className="text-[10px] uppercase font-semibold text-primary">{k}</p>
                <p className="text-[11px] text-white/80 mt-1 leading-snug">{prod.pipeline[k]}</p>
              </div>
            ) : null)}
          </div>
        ) : null}
      </Card>

      {/* KPIs */}
      {Array.isArray(r.kpis) && r.kpis.length ? (
        <Card icon={BarChart3} title="KPI Dashboard · 6-Month Targets">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {r.kpis.map((k: any, i: number) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                <p className="text-[10px] uppercase font-semibold text-muted-foreground">{k.metric}</p>
                <p className="text-lg font-bold text-primary mt-1">{k.sixMonthTarget}</p>
                {k.current && k.current !== "—" && <p className="text-[9px] text-muted-foreground mt-0.5">from {k.current}</p>}
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {/* Continue */}
      <div className="rounded-3xl border border-white/[0.06] bg-card p-6 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center"><Sparkles size={18} /></span>
          <div>
            <h4 className="text-sm font-bold text-white">Your strategy is live — start executing</h4>
            <p className="text-xs text-muted-foreground">Jump into the workspace to research topics and produce your first video.</p>
          </div>
        </div>
        <Link href="/dashboard" className="btn-premium rounded-full px-5 py-2.5 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0">Continue to Workspace <ArrowRight size={14} /></Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page orchestrator                                                   */
/* ------------------------------------------------------------------ */

type Stage = "loading" | "welcome" | "wizard" | "review" | "processing" | "roadmap";

export default function PersonalStrategy() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("loading");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [report, setReport] = useState<any>(null);
  const [regenerating, setRegenerating] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = useCallback(<K extends keyof Answers>(k: K, v: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [k]: v }));
  }, []);

  // Load existing report (or resume a draft).
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("strategy_profiles").select("answers, report, status").maybeSingle();
      if (data?.report && data.status === "ready") {
        setReport(data.report);
        if (data.answers) setAnswers({ ...EMPTY, ...(data.answers as Answers) });
        setStage("roadmap");
        return;
      }
      // Resume local draft if present.
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) setAnswers({ ...EMPTY, ...JSON.parse(raw) });
      } catch { /* ignore */ }
      if (data?.answers) setAnswers({ ...EMPTY, ...(data.answers as Answers) });
      setStage("welcome");
    })();
  }, []);

  // Auto-save the draft (debounced) whenever answers change during the wizard.
  useEffect(() => {
    if (stage !== "wizard" && stage !== "review") return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(LS_KEY, JSON.stringify(answers)); } catch { /* ignore */ }
    }, 500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [answers, stage]);

  const submit = useCallback(async () => {
    setStage("processing");
    try {
      const res = await fetch("/api/ai/strategy-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const j = await res.json();
      if (j.report) {
        setReport(j.report);
        try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
        setStage("roadmap");
      } else {
        setStage("review");
      }
    } catch {
      setStage("review");
    }
  }, [answers]);

  const regenerate = useCallback(async () => {
    setRegenerating(true);
    try {
      const res = await fetch("/api/ai/strategy-engine", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }),
      });
      const j = await res.json();
      if (j.report) setReport(j.report);
    } catch { /* ignore */ } finally { setRegenerating(false); }
  }, [answers]);

  const progress = useMemo(() => Math.round(((step + 1) / SECTIONS.length) * 100), [step]);

  if (stage === "loading") {
    return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground"><Loader2 className="animate-spin" /></div>;
  }

  if (stage === "roadmap" && report) {
    return <Roadmap report={report} onEdit={() => { setStage("wizard"); setStep(0); }} onRegenerate={regenerate} regenerating={regenerating} />;
  }

  if (stage === "processing") return <Processing />;

  if (stage === "welcome") {
    return (
      <div className="min-h-[72vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto gap-6">
        <InfluqMark size={54} />
        <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">Premium Strategy Consultation</span>
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">Let&apos;s Build Your Storytelling Empire</h1>
        <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xl">
          Answer a few strategic questions. Our AI will analyze your vision, audience, strengths and goals to create your personalized 6-month YouTube and Personal Brand Growth Strategy.
        </p>
        <p className="text-xs text-muted-foreground">Estimated time: <strong className="text-white">8–10 minutes</strong> · Progress auto-saves</p>
        <button onClick={() => setStage("wizard")} className="btn-premium rounded-full px-7 py-3.5 text-white font-semibold flex items-center gap-2">
          Start Strategy Session <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  if (stage === "review") {
    return (
      <div className="max-w-3xl mx-auto space-y-5 pb-16">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Review your answers</h1>
          <p className="text-sm text-muted-foreground">Edit anything before we generate your strategy.</p>
        </div>
        <div className="space-y-2.5">
          {SECTIONS.map((s, i) => (
            <button key={s} onClick={() => { setStep(i); setStage("wizard"); }}
              className="w-full text-left rounded-2xl border border-white/[0.06] bg-card p-4 hover:border-primary/30 transition-colors flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-semibold tracking-wider text-primary">Section {i + 1} · {s}</p>
                <p className="text-sm text-white/80 truncate mt-0.5">{summarize(i, answers)}</p>
              </div>
              <Pencil size={14} className="text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 pt-2">
          <button onClick={() => { setStep(SECTIONS.length - 1); setStage("wizard"); }} className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-semibold flex items-center gap-1.5"><ArrowLeft size={15} /> Back</button>
          <button onClick={submit} className="btn-premium rounded-full px-6 py-3 text-white font-semibold text-sm flex items-center gap-2"><Trophy size={16} /> Generate My AI Strategy</button>
        </div>
      </div>
    );
  }

  // wizard
  return (
    <div className="max-w-2xl mx-auto pb-16">
      {/* Progress */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-primary">Section {step + 1} of {SECTIONS.length} · {SECTIONS[step]}</span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" animate={{ width: `${progress}%` }} transition={{ ease: "easeInOut" }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}
          className="rounded-3xl border border-white/[0.06] bg-card p-5 md:p-7 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">{QUESTION_TITLES[step]}</h2>
          <Step index={step} answers={answers} set={set} />
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center justify-between gap-3 mt-5">
        <button onClick={() => (step === 0 ? setStage("welcome") : setStep((s) => s - 1))}
          className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-semibold flex items-center gap-1.5"><ArrowLeft size={15} /> {step === 0 ? "Welcome" : "Previous"}</button>
        {step < SECTIONS.length - 1 ? (
          <button onClick={() => setStep((s) => s + 1)} className="btn-premium rounded-full px-6 py-2.5 text-white text-sm font-semibold flex items-center gap-1.5">Next <ArrowRight size={15} /></button>
        ) : (
          <button onClick={() => setStage("review")} className="btn-premium rounded-full px-6 py-2.5 text-white text-sm font-semibold flex items-center gap-1.5">Review <ArrowRight size={15} /></button>
        )}
      </div>
    </div>
  );
}

const QUESTION_TITLES = [
  "What is your mission?",
  "Describe your ideal audience.",
  "What kinds of stories do you want to tell?",
  "Why should people listen to your stories?",
  "How should viewers feel after watching?",
  "What transformation do you want to create?",
  "Which creators inspire you?",
  "Rate your strengths.",
  "Which resources do you already have?",
  "What does success look like after one year?",
  "How much time can you dedicate?",
  "Which platforms do you want to build?",
  "Rank your monetization methods.",
  "Which brands would you love to work with?",
  "What legacy do you want to leave?",
];

function summarize(i: number, a: Answers): string {
  switch (i) {
    case 0: return a.mission || "—";
    case 1: return [a.audience.age, a.audience.countries, a.audience.interests].filter(Boolean).join(" · ") || "—";
    case 2: return [...a.storyTypes, a.storyTypesOther].filter(Boolean).join(", ") || "—";
    case 3: return a.uniqueAdvantage || "—";
    case 4: return a.emotions.join(", ") || "—";
    case 5: return a.transformation || "—";
    case 6: return a.inspirations.filter((c) => c.name).map((c) => c.name).join(", ") || "—";
    case 7: return `${Object.values(a.strengths).filter((v) => v >= 7).length} strong skills` + (a.limitations ? ` · ${a.limitations.slice(0, 40)}` : "");
    case 8: return [...a.resources, a.resourcesOther].filter(Boolean).join(", ") || "—";
    case 9: return [a.success.subscribers && `${a.success.subscribers} subs`, a.success.revenue && `${a.success.revenue} revenue`].filter(Boolean).join(" · ") || "—";
    case 10: return `${a.hoursPerWeek}h/week · ${a.uploadFrequency}`;
    case 11: return a.platforms.join(", ") || "—";
    case 12: return a.monetizationRank.slice(0, 3).join(" → ");
    case 13: return a.brandCollaborations.filter((b) => b.brand).map((b) => b.brand).join(", ") || "—";
    case 14: return a.legacy || "—";
    default: return "—";
  }
}
