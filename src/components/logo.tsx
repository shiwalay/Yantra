import React from "react";

// InfluQ brand mark: a "Q" monogram (ring + tail) with an upward growth
// chevron inside — "influence rising" — on the violet→blue brand gradient.
export function InfluqMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="influq-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A855F7" />
          <stop offset="0.5" stopColor="#6366F1" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#influq-grad)" />
      {/* Q ring */}
      <circle cx="15" cy="15" r="6.6" fill="none" stroke="white" strokeWidth="2.6" />
      {/* Q tail */}
      <path d="M18.7 18.9 L23.2 23.6" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
      {/* upward growth chevron inside the Q */}
      <path d="M11.9 16.5 L15 12.9 L18.1 16.5" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Full lockup: mark + "InfluQ" wordmark (Q accented).
export function InfluqLogo({ size = 32, textClass = "text-lg" }: { size?: number; textClass?: string }) {
  return (
    <div className="flex items-center gap-2">
      <InfluqMark size={size} />
      <span className={`${textClass} font-bold tracking-tight text-white`}>
        Influ<span className="text-primary">Q</span>
      </span>
    </div>
  );
}
