"use client";

import React from "react";

// vidIQ-style data-forward UI kit — score rings, rating-word indicator bars,
// stat tiles and tabs. Dark-theme native; goodness drives colour
// (green = good, amber = fair, red = poor). For metrics where a high value is
// BAD (e.g. Competition), pass `invert` so the colour reflects opportunity.

type Tone = "good" | "fair" | "poor";

export function toneForScore(value: number, invert = false): Tone {
  const v = invert ? 100 - value : value;
  if (v >= 67) return "good";
  if (v >= 34) return "fair";
  return "poor";
}

const TONE_TEXT: Record<Tone, string> = {
  good: "text-success",
  fair: "text-warning",
  poor: "text-destructive",
};
const TONE_STROKE: Record<Tone, string> = {
  good: "hsl(var(--success))",
  fair: "hsl(var(--warning))",
  poor: "hsl(var(--destructive))",
};
const TONE_FILL: Record<Tone, string> = {
  good: "bg-success",
  fair: "bg-warning",
  poor: "bg-destructive",
};
const TONE_CHIP: Record<Tone, string> = {
  good: "bg-success/10 text-success border-success/20",
  fair: "bg-warning/10 text-warning border-warning/20",
  poor: "bg-destructive/10 text-destructive border-destructive/20",
};

export function ratingWord(value: number, invert = false): string {
  const v = invert ? 100 - value : value;
  if (v >= 82) return invert ? "VERY LOW" : "VERY HIGH";
  if (v >= 60) return invert ? "LOW" : "HIGH";
  if (v >= 34) return "MEDIUM";
  return invert ? "HIGH" : "LOW";
}

/** vidIQ-signature circular score. */
export function ScoreRing({
  value,
  size = 128,
  label = "/ 100",
  caption,
}: {
  value: number;
  size?: number;
  label?: string;
  caption?: string;
}) {
  const stroke = Math.max(6, Math.round(size * 0.075));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;
  const tone = toneForScore(value);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={TONE_STROKE[tone]}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-semibold leading-none ${TONE_TEXT[tone]}`} style={{ fontSize: size * 0.28 }}>{Math.round(clamped)}</span>
          <span className="text-[10px] text-muted-foreground uppercase font-semibold mt-0.5">{label}</span>
        </div>
      </div>
      {caption && <span className={`text-[11px] font-semibold ${TONE_TEXT[tone]}`}>{caption}</span>}
    </div>
  );
}

/** vidIQ-signature labelled bar: metric name, coloured rating word, fill. */
export function IndicatorBar({
  label,
  value,
  invert = false,
  icon: Icon,
}: {
  label: string;
  value: number;
  invert?: boolean;
  icon?: React.ElementType;
}) {
  const tone = toneForScore(value, invert);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5">
          {Icon && <Icon size={12} />} {label}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${TONE_CHIP[tone]}`}>
          {ratingWord(value, invert)}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${TONE_FILL[tone]}`} style={{ width: `${Math.max(0, Math.min(100, value))}%`, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

/** Compact metric tile (vidIQ stat strip). */
export function StatTile({
  label,
  value,
  sub,
  tone,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  tone?: Tone;
  icon?: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
        {Icon && <Icon size={12} />} {label}
      </span>
      <span className={`text-xl font-semibold leading-tight ${tone ? TONE_TEXT[tone] : "text-white"}`}>{value}</span>
      {sub && <span className="text-[10px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

/** Coloured status chip. */
export function ScoreChip({ value, invert = false, children }: { value: number; invert?: boolean; children?: React.ReactNode }) {
  const tone = toneForScore(value, invert);
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${TONE_CHIP[tone]}`}>
      {children ?? ratingWord(value, invert)}
    </span>
  );
}

/** vidIQ tool tab bar. */
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; icon?: React.ElementType }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
      {tabs.map((t) => {
        const Icon = t.icon;
        const on = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              on ? "bg-primary text-white" : "text-muted-foreground hover:text-white"
            }`}
          >
            {Icon && <Icon size={13} />} {t.label}
          </button>
        );
      })}
    </div>
  );
}
