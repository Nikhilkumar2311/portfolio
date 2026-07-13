import { useState, useCallback } from 'react';
import { ConverterLayout } from '..';
import { Copy, Check } from 'lucide-react';

const ALGORITHMS = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1'] as const;

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState('');

  const generate = useCallback(async () => {
    if (!input) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const newResults: Record<string, string> = {};

    for (const algo of ALGORITHMS) {
      const hash = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hash));
      newResults[algo] = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    setResults(newResults);
  }, [input]);

  const copy = async (algo: string) => {
    await navigator.clipboard.writeText(results[algo]);
    setCopied(algo);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <ConverterLayout title="Hash Generator" description="Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text.">
      <div>
        <label htmlFor="hash-input" className="text-xs font-medium text-text-secondary uppercase tracking-wide block mb-1.5">Input Text</label>
        <textarea id="hash-input" value={input} onChange={(e) => setInput(e.target.value)} rows={4} placeholder="Enter text to hash..."
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-y" />
      </div>

      <button onClick={generate} className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer">Generate Hashes</button>

      {Object.keys(results).length > 0 && (
        <div className="space-y-3">
          {ALGORITHMS.map((algo) => (
            <div key={algo} className="p-3 rounded-xl bg-surface border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-text-secondary">{algo}</span>
                <button onClick={() => copy(algo)} className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer">
                  {copied === algo ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>
              <code className="text-xs text-text-primary font-mono break-all">{results[algo]}</code>
            </div>
          ))}
        </div>
      )}
    </ConverterLayout>
  );
}
