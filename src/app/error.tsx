"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface to the console; Sentry (when configured) captures automatically.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-foreground flex flex-col items-center justify-center text-center px-6">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-destructive glow-orb opacity-[0.06]" />
      <h1 className="text-2xl md:text-3xl font-bold text-white">Something went wrong</h1>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        An unexpected error occurred. You can try again, or head back home.
      </p>
      {error?.digest && (
        <p className="text-[10px] text-muted-foreground/60 mt-3 font-mono">ref: {error.digest}</p>
      )}
      <div className="flex items-center gap-3 mt-8">
        <button onClick={reset} className="btn-premium px-6 py-3 rounded-full text-white font-semibold text-sm">
          Try again
        </button>
        <a href="/" className="btn-pill px-6 py-3 text-white font-semibold text-sm">
          Go home
        </a>
      </div>
    </div>
  );
}
