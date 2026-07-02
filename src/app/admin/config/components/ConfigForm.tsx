'use client';

import { useState } from 'react';
import { updateConfig } from '../actions';

interface ConfigItem {
  key: string;
  value: string;
  is_encrypted: boolean;
  description: string;
}

export default function ConfigForm({ config }: { config: ConfigItem }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.append('key', config.key);
    formData.append('is_encrypted', config.is_encrypted.toString());
    formData.append('description', config.description);

    const result = await updateConfig(formData);
    
    setLoading(false);
    if (result?.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } else {
      alert(result?.error || "Failed to update configuration");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">{config.key}</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
        {config.is_encrypted && (
          <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded-md">
            Encrypted
          </span>
        )}
      </div>

      <div className="flex space-x-4">
        <input
          name="value"
          type={config.is_encrypted ? "password" : "text"}
          defaultValue={config.value}
          className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
          placeholder="Enter configuration value..."
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl px-6 py-2 transition-colors disabled:opacity-50 min-w-[120px]"
        >
          {loading ? 'Saving...' : success ? 'Saved!' : 'Save'}
        </button>
      </div>
    </form>
  );
}
