export default function HealthAdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">API Health Dashboard</h1>
      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <p className="text-muted-foreground">This module monitors OpenAI, Gemini, Razorpay, and PostHog connections.</p>
      </div>
    </div>
  );
}
