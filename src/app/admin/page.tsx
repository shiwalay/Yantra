export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Executive Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Users", value: "24,892", trend: "+12%" },
          { label: "Active Subs", value: "8,401", trend: "+5%" },
          { label: "MRR", value: "$428K", trend: "+18%" },
          { label: "API Health", value: "99.9%", trend: "Stable" }
        ].map((metric, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm" >
            <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-foreground">{metric.value}</h3>
              <span className="text-sm font-medium text-emerald-500">{metric.trend}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-4">Revenue Overview</h2>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          [Revenue Chart Module goes here]
        </div>
      </div>
    </div>
  );
}
