"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText, Sparkles, ArrowRight, ArrowLeft, Loader2, Copy, Check,
  Target, Users, Layers, Palette, Settings2, Wand2, Video, Volume2,
  Type, Image as ImageIcon, Search, AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientBorderCard } from "@/components/gradient";
import {
  GOALS, TONES, SCRIPT_STYLES, PLATFORMS, LANGUAGES, DURATIONS, VIDEO_TYPES,
  DEFAULT_INPUT, videoTypeByName, generatePackage, parseToMinutes,
  type WizardInput, type ProductionPackage,
} from "@/utils/videoWizard";

const STEPS = [
  { n: 1, label: "End Goal", icon: Target },
  { n: 2, label: "Audience", icon: Users },
  { n: 3, label: "Core Content", icon: Layers },
  { n: 4, label: "Style", icon: Palette },
  { n: 5, label: "Production", icon: Settings2 },
  { n: 6, label: "Generate", icon: Wand2 },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-primary/50 outline-none";

function WizardContent() {
  const searchParams = useSearchParams();
  const paramTopic = searchParams.get("topic");

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WizardInput>({
    ...DEFAULT_INPUT,
    topic: paramTopic || DEFAULT_INPUT.topic,
  });
  const [generating, setGenerating] = useState(false);
  const [pkg, setPkg] = useState<ProductionPackage | null>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const set = <K extends keyof WizardInput>(k: K, v: WizardInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (paramTopic) setForm((f) => ({ ...f, topic: paramTopic }));
  }, [paramTopic]);

  const selectedType = videoTypeByName(form.videoType);
  const canContinue = step !== 3 || form.topic.trim().length > 0;

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1600);
  };

  const runGenerate = async () => {
    setGenerating(true);
    const local = generatePackage(form);
    try {
      const res = await fetch("/api/ai/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          durationMin: parseToMinutes(form.duration),
          frameworkId: selectedType?.engineId ?? 1,
          frameworkName: selectedType?.framework,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.source === "ai" && Array.isArray(data.blocks) && data.blocks.length) {
          setPkg({
            ...local,
            script: data.blocks,
            scenes: data.blocks.map((b: { time: string; section: string; script: string; visual: string }) => ({
              scene: `${b.time} · ${b.section}`, dialogue: b.script, visual: b.visual, emotion: "Engaged",
            })),
            source: "ai",
          });
        } else {
          setPkg(local);
        }
      } else {
        setPkg(local);
      }
    } catch {
      setPkg(local);
    } finally {
      setGenerating(false);
    }
  };

  const next = () => {
    if (step === 5) {
      setStep(6);
      runGenerate();
    } else {
      setStep((s) => Math.min(6, s + 1));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">Engaging Video Script <span className="text-gradient-brand">Generator</span></h1>
        <p className="text-xs text-muted-foreground">Six guided steps from idea to a production-ready package.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between gap-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = step > s.n;
          const active = step === s.n;
          return (
            <React.Fragment key={s.n}>
              <button
                onClick={() => s.n < step && setStep(s.n)}
                disabled={s.n > step}
                className={`flex flex-col items-center gap-1.5 shrink-0 ${s.n <= step ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                  active ? "bg-primary text-white border-primary"
                  : done ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-white/5 text-muted-foreground border-white/10"}`}>
                  {done ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className={`text-[9px] font-semibold uppercase tracking-wide ${active || done ? "text-white" : "text-muted-foreground"}`}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px ${step > s.n ? "bg-primary/40" : "bg-white/10"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Panel */}
      <div className="bg-card border border-white/[0.06] rounded-3xl p-6 md:p-8 min-h-[340px] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1 — End Goal */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">What's the primary goal of this video?</h2>
                  <p className="text-xs text-muted-foreground mt-1">Everything downstream — structure, tone, CTA — is optimized for this outcome.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {GOALS.map((g) => (
                    <button key={g} onClick={() => set("goal", g)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        form.goal === g ? "border-primary bg-primary/10 text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Audience */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">Who is this for?</h2>
                  <p className="text-xs text-muted-foreground mt-1">The clearer the audience, the sharper the script speaks to them.</p>
                </div>
                <Field label="Ideal audience (who / profession)">
                  <input className={inputCls} value={form.audience} onChange={(e) => set("audience", e.target.value)} placeholder="e.g. Solo agency owners doing $10-30k/mo" />
                </Field>
                <Field label="Their biggest pain point">
                  <input className={inputCls} value={form.painPoint} onChange={(e) => set("painPoint", e.target.value)} placeholder="e.g. Inconsistent lead flow" />
                </Field>
                <Field label="Their biggest desire">
                  <input className={inputCls} value={form.desire} onChange={(e) => set("desire", e.target.value)} placeholder="e.g. A predictable client pipeline" />
                </Field>
              </div>
            )}

            {/* Step 3 — Core Content */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">What's the core content?</h2>
                  <p className="text-xs text-muted-foreground mt-1">The topic and the one thing you want people to remember.</p>
                </div>
                <Field label="Main topic *">
                  <input className={inputCls} value={form.topic} onChange={(e) => set("topic", e.target.value)} placeholder="e.g. Cold Email for Agencies" />
                </Field>
                <Field label="Key message (what should they remember?)">
                  <input className={inputCls} value={form.keyMessage} onChange={(e) => set("keyMessage", e.target.value)} placeholder="e.g. Leverage beats volume every time" />
                </Field>
                <Field label="Key points (one per line)">
                  <textarea rows={4} className={inputCls} value={form.keyPoints} onChange={(e) => set("keyPoints", e.target.value)} placeholder={"Point 1\nPoint 2\nPoint 3"} />
                </Field>
              </div>
            )}

            {/* Step 4 — Style */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">Style &amp; experience</h2>
                  <p className="text-xs text-muted-foreground mt-1">The format sets the structure; tone and style set the voice.</p>
                </div>
                <Field label="Video type">
                  <select className={inputCls} value={form.videoType} onChange={(e) => set("videoType", e.target.value)}>
                    {VIDEO_TYPES.map((v) => <option key={v.name} value={v.name}>{v.name} — {v.objective}</option>)}
                  </select>
                </Field>
                {selectedType && (
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-semibold">Framework: {selectedType.framework}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-muted-foreground border border-white/10 font-semibold">Typical: {selectedType.duration}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tone">
                    <select className={inputCls} value={form.tone} onChange={(e) => set("tone", e.target.value)}>
                      {TONES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Script style">
                    <select className={inputCls} value={form.scriptStyle} onChange={(e) => set("scriptStyle", e.target.value)}>
                      {SCRIPT_STYLES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {/* Step 5 — Production */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">Production preferences</h2>
                  <p className="text-xs text-muted-foreground mt-1">Length and language shape the script depth and delivery.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field label="Duration">
                    <select className={inputCls} value={form.duration} onChange={(e) => set("duration", e.target.value)}>
                      {DURATIONS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="Platform">
                    <select className={inputCls} value={form.platform} onChange={(e) => set("platform", e.target.value)}>
                      {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </Field>
                  <Field label="Language">
                    <select className={inputCls} value={form.language} onChange={(e) => set("language", e.target.value)}>
                      {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Call to action">
                  <input className={inputCls} value={form.cta} onChange={(e) => set("cta", e.target.value)} placeholder="e.g. Book a free strategy call in the description" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Brand name (optional)">
                    <input className={inputCls} value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="e.g. InfluQ" />
                  </Field>
                  <Field label="Speaker name (optional)">
                    <input className={inputCls} value={form.speaker} onChange={(e) => set("speaker", e.target.value)} placeholder="e.g. Swapnil" />
                  </Field>
                </div>
              </div>
            )}

            {/* Step 6 — Generate / Package */}
            {step === 6 && (
              <div className="space-y-6">
                {generating ? (
                  <div className="h-72 flex flex-col items-center justify-center gap-4">
                    <Loader2 size={40} className="text-primary animate-spin" />
                    <div className="text-center">
                      <p className="font-semibold text-white">Building your production package…</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Mapping the {selectedType?.framework} beats to {form.duration} · {form.language}</p>
                    </div>
                  </div>
                ) : pkg ? (
                  <Package pkg={pkg} form={form} activeScene={activeScene} setActiveScene={setActiveScene} copy={copy} copied={copied} onRegenerate={runGenerate} />
                ) : null}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      {step < 6 && (
        <div className="flex items-center justify-between">
          <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 hover:bg-white/10 transition">
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Step {step} of 6</span>
          <button onClick={next} disabled={!canContinue}
            className="btn-premium rounded-full px-5 py-2.5 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40">
            {step === 5 ? "Generate Script" : "Continue"} <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Package view ----------------------------- */

function SectionCard({ icon: Icon, title, subtitle, children }: { icon: React.ElementType; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/[0.06] bg-card p-5 space-y-3 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2">
        <Icon size={15} className="text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white">{title}</h3>
        {subtitle && <span className="text-[10px] text-muted-foreground">· {subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function Package({ pkg, form, activeScene, setActiveScene, copy, copied }: {
  pkg: ProductionPackage; form: WizardInput; activeScene: number;
  setActiveScene: (n: number) => void; copy: (t: string, id: string) => void; copied: string | null; onRegenerate: () => void;
}) {
  const showLangNote = form.language !== "English" && pkg.source !== "ai";
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-semibold text-white">Your production package</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{form.videoType} · {pkg.frameworkName} · {form.duration} · {form.language}</p>
        </div>
        <span className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold border ${pkg.source === "ai" ? "bg-primary/10 text-primary border-primary/20" : "bg-white/5 text-muted-foreground border-white/10"}`}>
          {pkg.source === "ai" ? "AI-generated" : "Engine"}
        </span>
      </div>

      {showLangNote && (
        <div className="flex gap-2 p-3 rounded-xl bg-warning/10 border border-warning/20 text-warning text-[11px] leading-relaxed">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <div>Parameter-accurate English structure shown. Connect an AI engine key for the full spoken voiceover in <strong>{form.language}</strong>.</div>
        </div>
      )}

      {/* Titles */}
      <SectionCard icon={Type} title="Viral Title Options" subtitle="10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {pkg.titles.map((t, i) => (
            <button key={i} onClick={() => copy(t, `title-${i}`)}
              className="group flex items-start gap-2 text-left p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition text-[11px] text-muted-foreground hover:text-white">
              <span className="text-primary font-semibold shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1">{t}</span>
              {copied === `title-${i}` ? <Check size={11} className="text-success shrink-0" /> : <Copy size={11} className="opacity-0 group-hover:opacity-100 shrink-0" />}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Hooks + Thumbnails */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard icon={Sparkles} title="Hook Variations" subtitle="10">
          <div className="space-y-1.5">
            {pkg.hooks.map((h, i) => (
              <p key={i} className="text-[11px] text-muted-foreground leading-relaxed"><span className="text-primary font-semibold">{i + 1}.</span> {h}</p>
            ))}
          </div>
        </SectionCard>
        <SectionCard icon={ImageIcon} title="Thumbnail Ideas" subtitle="10">
          <div className="space-y-1.5">
            {pkg.thumbnails.map((t, i) => (
              <p key={i} className="text-[11px] text-muted-foreground leading-relaxed"><span className="text-primary font-semibold">{i + 1}.</span> {t}</p>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Script */}
      <SectionCard icon={FileText} title="Complete Video Script" subtitle={pkg.frameworkName}>
        <div className="space-y-2">
          {pkg.script.map((b, idx) => {
            const open = activeScene === idx;
            return (
              <div key={idx} className={`rounded-xl border transition-all ${open ? "border-primary bg-primary/5" : "border-white/10 bg-white/5"}`}>
                <button onClick={() => setActiveScene(open ? -1 : idx)} className="w-full p-3 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{b.time}</span>
                    <h4 className="text-xs font-bold text-white">{b.section}</h4>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground">{open ? "Collapse" : "Expand"}</span>
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5">
                      <div className="p-3 space-y-3">
                        <div className="relative group p-3 rounded-lg bg-neutral-950/60 border border-white/5">
                          <span className="text-[8px] uppercase tracking-wider text-muted-foreground font-semibold">Spoken Script</span>
                          <p className="text-white leading-relaxed text-[12px] mt-1">{b.script}</p>
                          <button onClick={() => copy(b.script, `script-${idx}`)} className="absolute top-2 right-2 p-1.5 rounded bg-neutral-900 border border-white/15 text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition">
                            {copied === `script-${idx}` ? <Check size={10} className="text-success" /> : <Copy size={10} />}
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
                            <span className="text-[9px] uppercase font-semibold text-blue-400 flex items-center gap-1"><Video size={10} /> Visual</span>
                            <p className="text-[10px] text-white leading-relaxed mt-1">{b.visual}</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-secondary/5 border border-secondary/10">
                            <span className="text-[9px] uppercase font-semibold text-secondary flex items-center gap-1"><Volume2 size={10} /> Audio</span>
                            <p className="text-[10px] text-white leading-relaxed mt-1">{b.audio}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground"><strong className="text-white">Delivery:</strong> {b.tip}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Scene breakdown */}
      <SectionCard icon={Layers} title="Scene-by-Scene Breakdown">
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-left">
            <thead className="text-muted-foreground uppercase tracking-wide">
              <tr className="border-b border-white/10">
                <th className="py-2 pr-3 font-semibold">Scene</th>
                <th className="py-2 pr-3 font-semibold">Visual</th>
                <th className="py-2 font-semibold">Emotion</th>
              </tr>
            </thead>
            <tbody>
              {pkg.scenes.map((s, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2 pr-3 text-white font-semibold align-top whitespace-nowrap">{s.scene}</td>
                  <td className="py-2 pr-3 text-muted-foreground align-top">{s.visual}</td>
                  <td className="py-2 align-top"><span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">{s.emotion}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* SEO */}
      <SectionCard icon={Search} title="SEO Package">
        <div className="space-y-2.5 text-[11px]">
          <div><span className="text-muted-foreground font-semibold uppercase text-[9px] tracking-wide">Title</span><p className="text-white">{pkg.seo.title}</p></div>
          <div><span className="text-muted-foreground font-semibold uppercase text-[9px] tracking-wide">Description</span><p className="text-muted-foreground leading-relaxed">{pkg.seo.description}</p></div>
          <div className="flex flex-wrap gap-1.5">
            {pkg.seo.hashtags.map((h, i) => <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-primary border border-white/10 text-[10px]">{h}</span>)}
          </div>
          <div>
            <span className="text-muted-foreground font-semibold uppercase text-[9px] tracking-wide">Chapters</span>
            <div className="mt-1 space-y-0.5">{pkg.seo.chapters.map((c, i) => <p key={i} className="text-muted-foreground font-mono text-[10px]">{c}</p>)}</div>
          </div>
        </div>
      </SectionCard>

      {/* Retention */}
      <SectionCard icon={Target} title="Viewer Retention Analysis">
        <ul className="space-y-1.5">
          {pkg.retention.map((r, i) => (
            <li key={i} className="text-[11px] text-muted-foreground leading-relaxed flex gap-2"><span className="text-primary shrink-0">▸</span> {r}</li>
          ))}
        </ul>
      </SectionCard>

      {/* Handoff */}
      <GradientBorderCard gradient="violet" glow="rgba(139,92,246,0.5)" radius={24} thickness={2} innerClassName="p-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/20 text-primary border border-primary/30 shrink-0"><Sparkles size={20} /></div>
          <div>
            <h4 className="text-sm font-bold text-white">Script ready — optimize its SEO next</h4>
            <p className="text-xs text-muted-foreground">Generate titles, descriptions and chapters tuned to rank.</p>
          </div>
        </div>
        <Link href={`/seo?topic=${encodeURIComponent(form.topic)}`} className="btn-premium rounded-full px-5 py-2.5 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0">
          Optimize Video SEO <ArrowRight size={14} />
        </Link>
      </GradientBorderCard>
    </div>
  );
}

export default function ScriptEngine() {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center text-xs text-muted-foreground">Loading…</div>}>
      <WizardContent />
    </Suspense>
  );
}
