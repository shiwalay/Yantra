"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";

const YoutubeIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.503a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.503 9.388.503 9.388.503s7.518 0 9.388-.503a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

function AuthContent() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();
  const [mode, setMode] = useState<"login" | "signup">(params.get("mode") === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setNotice(null);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.session) {
        router.push("/onboarding"); router.refresh();
      } else {
        setNotice("Account created. Check your email to confirm, then sign in.");
        setMode("login"); setLoading(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push("/dashboard"); router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0c] text-foreground">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary glow-orb opacity-[0.05]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary glow-orb opacity-[0.04]" />
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-[0.12]" />

      <div className="w-full max-w-md z-10 space-y-6">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <YoutubeIcon size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Influ<span className="text-primary">Q</span></span>
        </div>

        <div className="p-7 rounded-3xl bg-card border border-white/[0.06] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white">{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
            <p className="text-xs text-muted-foreground mt-1">
              {mode === "signup" ? "Start your AI growth engine in seconds." : "Sign in to your Growth OS."}
            </p>
          </div>

          {error && <div className="mb-4 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-center">{error}</div>}
          {notice && <div className="mb-4 text-xs text-success bg-success/10 border border-success/20 rounded-lg p-3 text-center">{notice}</div>}

          {/* Continue with Google */}
          <button
            onClick={signInWithGoogle}
            type="button"
            className="w-full py-3 rounded-full bg-white text-neutral-900 font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-neutral-100 transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:border-primary/50 outline-none"
                  placeholder="you@email.com" />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:border-primary/50 outline-none"
                  placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-premium w-full py-3 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-1.5 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>{mode === "signup" ? "Create account" : "Sign in"} <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-5">
            {mode === "signup" ? "Already have an account?" : "New to InfluQ?"}{" "}
            <button onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(null); setNotice(null); }}
              className="text-primary font-semibold hover:underline">
              {mode === "signup" ? "Sign in" : "Create one free"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-muted-foreground">Loading…</div>}>
      <AuthContent />
    </Suspense>
  );
}
