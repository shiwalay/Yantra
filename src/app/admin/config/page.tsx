export default function ConfigAdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Live Configuration Center</h1>
      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <p className="text-muted-foreground">This module will read and write AES-256-GCM encrypted API keys to the system_config table.</p>
      </div>
    </div>
  );
}
