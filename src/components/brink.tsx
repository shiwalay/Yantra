"use client";

import React from "react";
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

// "Brink"-style fintech-dashboard UI kit: soft premium dark cards, an
// area-chart metric card, a vibrant gradient balance card, clean activity
// rows, and coloured category bars. Dark-theme native, violet-forward.

function slug(s: string) {
  return s.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

/** Metric card with a big value, delta chip and a mini area chart. */
export function MetricAreaCard({
  label,
  value,
  delta,
  up = true,
  color,
  icon: Icon,
  data,
}: {
  label: string;
  value: string;
  delta: string;
  up?: boolean;
  color: string;
  icon: React.ElementType;
  data: { v: number }[];
}) {
  const id = `grad-${slug(label)}`;
  return (
    <div className="rounded-3xl bg-card border border-white/[0.06] p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}22`, color }}>
            <Icon size={16} />
          </span>
          <span className="text-xs font-semibold text-muted-foreground">{label}</span>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5"
          style={{ background: up ? "hsl(var(--success)/0.15)" : "hsl(var(--destructive)/0.15)", color: up ? "hsl(var(--success))" : "hsl(var(--destructive))" }}
        >
          {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {delta}
        </span>
      </div>
      <div className="text-[26px] font-semibold text-white mt-3 leading-none tracking-tight">{value}</div>
      <div className="h-16 -mx-1 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2.5} fill={`url(#${id})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Vibrant gradient "balance"/credit-card hero. */
export function GradientCard({
  label,
  value,
  last4,
  expiry,
  holder,
  badge,
}: {
  label: string;
  value: string;
  last4: string;
  expiry: string;
  holder: string;
  badge: string;
}) {
  return (
    <div
      className="relative rounded-3xl p-5 overflow-hidden text-white flex flex-col justify-between min-h-[190px] shadow-[0_24px_60px_-24px_rgba(168,85,247,0.6)]"
      style={{ background: "linear-gradient(135deg, #6D28D9 0%, #A855F7 48%, #EC4899 100%)" }}
    >
      <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-white/15 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-8 w-44 h-44 rounded-full bg-black/15 blur-2xl pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <span className="text-xs font-semibold opacity-90">{label}</span>
        <MoreHorizontal size={18} className="opacity-80" />
      </div>
      <div className="relative text-[32px] font-semibold leading-none tracking-tight mt-1">{value}</div>

      <div className="relative flex items-center justify-between text-xs mt-6">
        <span className="tracking-[0.2em] font-medium opacity-90">•••• {last4}</span>
        <span className="opacity-90">{expiry}</span>
      </div>
      <div className="relative flex items-end justify-between mt-3">
        <div>
          <p className="text-[9px] uppercase tracking-wider opacity-70">Card Holder</p>
          <p className="text-sm font-semibold">{holder}</p>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">{badge}</span>
      </div>
    </div>
  );
}

/** Transaction/activity row with circular icon + coloured amount. */
export function ActivityRow({
  icon: Icon,
  title,
  time,
  amount,
  positive = true,
  color,
}: {
  icon: React.ElementType;
  title: string;
  time: string;
  amount: string;
  positive?: boolean;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}22`, color }}>
          <Icon size={15} />
        </span>
        <div>
          <p className="text-xs font-semibold text-white">{title}</p>
          <p className="text-[10px] text-muted-foreground">{time}</p>
        </div>
      </div>
      <span className={`text-xs font-bold ${positive ? "text-success" : "text-destructive"}`}>{amount}</span>
    </div>
  );
}

/** Category row with coloured progress bar (spending-categories style). */
export function CategoryBar({
  icon: Icon,
  label,
  value,
  color,
  caption,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  caption: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}22`, color }}>
        <Icon size={15} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white">{label}</p>
        <div className="h-1.5 rounded-full bg-white/10 mt-1.5 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">{caption}</p>
      </div>
    </div>
  );
}
