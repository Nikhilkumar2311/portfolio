import { useState, useEffect } from 'react';
import { ConverterLayout } from '..';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);


  const handleDateChange = (value: string) => {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setTimestamp(Math.floor(date.getTime() / 1000));
    }
  };

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const date = new Date(timestamp * 1000);
  const isValid = !isNaN(date.getTime());

  return (
    <ConverterLayout title="Timestamp Converter" description="Convert between Unix timestamps and human-readable dates.">
      {/* Current time */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
        <span className="text-sm text-text-secondary">Current Unix Timestamp</span>
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono text-primary font-medium">{now}</code>
          <button onClick={() => setTimestamp(now)} className="p-1 rounded hover:bg-primary/10 transition-colors cursor-pointer">
            <RefreshCw size={14} className="text-primary" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Unix timestamp input */}
        <div className="p-4 rounded-xl bg-surface border border-border">
          <label htmlFor="ts-unix" className="text-xs font-medium text-text-secondary uppercase tracking-wide block mb-1.5">Unix Timestamp (seconds)</label>
          <input id="ts-unix" type="number" value={timestamp} onChange={(e) => setTimestamp(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>

        {/* Date input */}
        <div className="p-4 rounded-xl bg-surface border border-border">
          <label htmlFor="ts-date" className="text-xs font-medium text-text-secondary uppercase tracking-wide block mb-1.5">Date & Time</label>
          <input id="ts-date" type="datetime-local" value={isValid ? new Date(timestamp * 1000 - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
      </div>

      {/* Results */}
      {isValid && (
        <div className="space-y-1.5">
          {[
            { label: 'ISO 8601', value: date.toISOString() },
            { label: 'UTC', value: date.toUTCString() },
            { label: 'Local', value: date.toLocaleString() },
            { label: 'Unix (s)', value: String(timestamp) },
            { label: 'Unix (ms)', value: String(timestamp * 1000) },
            { label: 'Relative', value: getRelativeTime(timestamp, now) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border group">
              <span className="text-xs font-medium text-text-secondary">{label}</span>
              <div className="flex items-center gap-2">
                <code className="text-sm text-text-primary font-mono">{value}</code>
                <button onClick={() => copy(value, label)} className="p-1 rounded hover:bg-border transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                  {copied === label ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-text-secondary" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ConverterLayout>
  );
}

function getRelativeTime(ts: number, now: number): string {
  const diff = ts - now;
  const abs = Math.abs(diff);
  const suffix = diff < 0 ? 'ago' : 'from now';

  if (abs < 60) return `${abs} seconds ${suffix}`;
  if (abs < 3600) return `${Math.floor(abs / 60)} minutes ${suffix}`;
  if (abs < 86400) return `${Math.floor(abs / 3600)} hours ${suffix}`;
  if (abs < 2592000) return `${Math.floor(abs / 86400)} days ${suffix}`;
  if (abs < 31536000) return `${Math.floor(abs / 2592000)} months ${suffix}`;
  return `${Math.floor(abs / 31536000)} years ${suffix}`;
}
