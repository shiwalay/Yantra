export default function AuditAdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">System Audit Logs</h1>
      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <p className="text-muted-foreground">This module displays a read-only stream of all administrative actions recorded in the audit_logs table.</p>
      </div>
    </div>
  );
}
