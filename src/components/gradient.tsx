"use client";

import React from "react";

// Gradient design system — glowing gradient-border cards, brand gradient
// headlines, and pill buttons. Dark-theme native, bold and colourful.

export const GRADIENTS = {
  warm: "linear-gradient(135deg, #FBBF24, #F97316, #EF4444)",
  pink: "linear-gradient(135deg, #EC4899, #F43F5E, #EF4444)",
  cool: "linear-gradient(135deg, #3B82F6, #6366F1, #8B5CF6)",
  brand: "linear-gradient(90deg, #A855F7, #6366F1, #3B82F6)",
  violet: "linear-gradient(135deg, #8B5CF6, #6366F1, #22D3EE)",
  emerald: "linear-gradient(135deg, #34D399, #10B981, #059669)",
} as const;

export type GradientKey = keyof typeof GRADIENTS;

/** Card with a glowing gradient border and a dark inner surface. */
export function GradientBorderCard({
  gradient = "violet",
  glow,
  className = "",
  innerClassName = "",
  radius = 24,
  thickness = 1.5,
  children,
}: {
  gradient?: GradientKey | string;
  glow?: string;
  className?: string;
  innerClassName?: string;
  radius?: number;
  thickness?: number;
  children: React.ReactNode;
}) {
  const grad = (GRADIENTS as Record<string, string>)[gradient as string] || gradient;
  return (
    <div
      className={`relative ${className}`}
      style={{
        borderRadius: radius,
        background: grad,
        padding: thickness,
        boxShadow: glow ? `0 12px 44px -14px ${glow}` : undefined,
      }}
    >
      <div
        className={`relative h-full bg-[#0d0d11] ${innerClassName}`}
        style={{ borderRadius: radius - thickness }}
      >
        {children}
      </div>
    </div>
  );
}

/** Gradient badge pill (e.g. "BEST DEAL!"). */
export function GradientBadge({ gradient = "warm", children }: { gradient?: GradientKey | string; children: React.ReactNode }) {
  const grad = (GRADIENTS as Record<string, string>)[gradient as string] || gradient;
  return (
    <span
      className="inline-block text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-[#17140a]"
      style={{ backgroundImage: grad }}
    >
      {children}
    </span>
  );
}
