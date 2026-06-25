export default function SettingsAdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">System Settings</h1>
      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <p className="text-muted-foreground">This module manages global branding, feature flags, and tax configurations.</p>
      </div>
    </div>
  );
}
