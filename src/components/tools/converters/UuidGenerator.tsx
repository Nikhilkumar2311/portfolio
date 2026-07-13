import { useState } from 'react';
import { ConverterLayout } from '..';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => crypto.randomUUID());
    setUuids(newUuids);
  };

  const copyOne = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ConverterLayout title="UUID Generator" description="Generate random UUIDs (v4) with bulk generation support.">
      <div className="flex items-end gap-3 p-4 rounded-xl bg-surface border border-border">
        <div className="flex-1">
          <label htmlFor="uuid-count" className="text-xs font-medium text-text-secondary uppercase tracking-wide block mb-1.5">Count</label>
          <input id="uuid-count" type="number" value={count} onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))} min={1} max={100}
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <button onClick={generate} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer">
          <RefreshCw size={16} /> Generate
        </button>
      </div>

      {uuids.length > 0 && (
        <div className="p-4 rounded-xl bg-surface border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{uuids.length} UUIDs</span>
            <button onClick={copyAll} className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer">
              {copied === -1 ? <Check size={12} className="text-green-400" /> : <Copy size={12} />} {copied === -1 ? 'Copied all' : 'Copy all'}
            </button>
          </div>
          <div className="space-y-1.5">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border group">
                <code className="flex-1 text-sm text-text-primary font-mono truncate">{uuid}</code>
                <button onClick={() => copyOne(uuid, i)} className="p-1 rounded hover:bg-border transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                  {copied === i ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-text-secondary" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </ConverterLayout>
  );
}
