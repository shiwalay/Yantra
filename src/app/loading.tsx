import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center gap-4">
      <Loader2 size={36} className="text-primary animate-spin" />
      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Loading…</p>
    </div>
  );
}
