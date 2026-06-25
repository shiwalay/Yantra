export default function PromptsAdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Prompt Library</h1>
      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <p className="text-muted-foreground">This module will manage AI prompt versions stored in the prompt_library table.</p>
      </div>
    </div>
  );
}
