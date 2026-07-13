import { Shield } from 'lucide-react';

export function PrivacyBanner() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
      <Shield size={18} className="text-primary shrink-0" />
      <p className="text-sm text-text-secondary">
        <span className="font-medium text-text-primary">Your files never leave your device.</span>{' '}
        Everything is processed locally in your browser. No uploads. No tracking.
      </p>
    </div>
  );
}
