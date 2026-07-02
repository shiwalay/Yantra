import { createClient } from "@/utils/supabase/server";
import { Users, ShieldCheck, CheckCircle2, UserPlus } from "lucide-react";

export const dynamic = "force-dynamic";

type ProfileRow = { email: string; role: string; plan: string | null; created_at: string; onboarded: boolean };

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [totalRes, adminRes, onboardedRes, weekRes, recentRes] = await Promise.all([
    supabase.from("user_profiles").select("*", { count: "exact", head: true }),
    supabase.from("user_profiles").select("*", { count: "exact", head: true }).in("role", ["superadmin", "admin"]),
    supabase.from("user_profiles").select("*", { count: "exact", head: true }).eq("onboarded", true),
    supabase.from("user_profiles").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("user_profiles").select("email, role, plan, created_at, onboarded").order("created_at", { ascending: false }).limit(8),
  ]);

  const total = totalRes.count ?? 0;
  const admins = adminRes.count ?? 0;
  const onboarded = onboardedRes.count ?? 0;
  const newThisWeek = weekRes.count ?? 0;
  const recent = (recentRes.data ?? []) as ProfileRow[];
  const onboardedPct = total > 0 ? Math.round((onboarded / total) * 100) : 0;

  const metrics = [
    { label: "Total Users", value: total.toLocaleString(), sub: "all-time signups", icon: Users },
    { label: "Admins", value: admins.toLocaleString(), sub: "superadmin + admin", icon: ShieldCheck },
    { label: "Onboarded", value: `${onboardedPct}%`, sub: `${onboarded.toLocaleString()} completed`, icon: CheckCircle2 },
    { label: "New This Week", value: newThisWeek.toLocaleString(), sub: "last 7 days", icon: UserPlus },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Executive Dashboard</h1>
        <span className="text-xs font-semibold text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-full">Live · Supabase</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Icon size={15} /> <p className="text-sm">{m.label}</p>
              </div>
              <h3 className="text-3xl font-bold text-foreground">{m.value}</h3>
              <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Recent Signups</h2>
          <span className="text-xs text-muted-foreground">Latest {recent.length}</span>
        </div>
        {recent.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">No users yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase tracking-wide border-b border-border/50">
                <tr>
                  <th className="py-2 pr-4 font-semibold">Email</th>
                  <th className="py-2 pr-4 font-semibold">Role</th>
                  <th className="py-2 pr-4 font-semibold">Onboarded</th>
                  <th className="py-2 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((u) => (
                  <tr key={u.email} className="border-b border-border/30">
                    <td className="py-2.5 pr-4 text-foreground font-medium">{u.email}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        u.role === "superadmin" || u.role === "admin"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-white/5 text-muted-foreground border-white/10"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      {u.onboarded
                        ? <span className="text-success">✓</span>
                        : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="py-2.5 text-muted-foreground">{fmtDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-[11px] text-muted-foreground mt-4">
          Revenue &amp; subscription metrics populate once billing (Razorpay) is live.
        </p>
      </div>
    </div>
  );
}
