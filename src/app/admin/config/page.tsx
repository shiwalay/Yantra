import { getConfigs } from './actions';
import ConfigForm from './components/ConfigForm';
import { Key } from 'lucide-react';

export default async function ConfigAdminPage() {
  const configs = await getConfigs();

  // Define the master list of required configurations for the platform
  const requiredConfigs = [
    { key: 'OPENAI_API_KEY', is_encrypted: true, description: 'OpenAI production API key for Research and Script engines.' },
    { key: 'GEMINI_API_KEY', is_encrypted: true, description: 'Google Gemini production API key for fallback engine.' },
    { key: 'RAZORPAY_KEY_ID', is_encrypted: false, description: 'Razorpay public Key ID.' },
    { key: 'RAZORPAY_KEY_SECRET', is_encrypted: true, description: 'Razorpay production Key Secret for verifying payments.' },
    { key: 'YOUTUBE_CLIENT_ID', is_encrypted: true, description: 'YouTube OAuth Client ID for channel analytics.' },
  ];

  // Merge database configs with required placeholders
  const displayConfigs = requiredConfigs.map(req => {
    const found = configs.find(c => c.key === req.key);
    return found || { ...req, value: '' };
  });

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mr-4">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Configuration Center</h1>
          <p className="text-muted-foreground mt-1">Manage API keys and integration secrets without redeploying the application.</p>
        </div>
      </div>

      <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start">
        <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-400">
          Keys marked as <strong className="font-semibold text-blue-300">Encrypted</strong> will be encrypted at rest using AES-256-GCM. 
          When saved, their exact string values are permanently masked from the UI. Next.js will automatically decrypt them in the background at runtime.
        </p>
      </div>

      <div className="space-y-4 max-w-4xl">
        {displayConfigs.map(config => (
          <ConfigForm key={config.key} config={config} />
        ))}
      </div>
    </div>
  );
}
