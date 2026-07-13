import { useState } from 'react';
import { ConverterLayout } from '..';
import { Copy, Check } from 'lucide-react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = () => {
    if (!input.trim()) return;
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError(mode === 'decode' ? 'Invalid Base64 string.' : 'Encoding failed.');
      setOutput('');
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ConverterLayout title="Base64 Encoder / Decoder" description="Encode text to Base64 and decode Base64 strings.">
      <div className="flex gap-2 p-1 rounded-xl bg-surface border border-border">
        <button onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${mode === 'encode' ? 'bg-primary text-white' : 'text-text-secondary hover:text-primary'}`}>Encode</button>
        <button onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${mode === 'decode' ? 'bg-primary text-white' : 'text-text-secondary hover:text-primary'}`}>Decode</button>
      </div>

      <div>
        <label htmlFor="b64-input" className="text-xs font-medium text-text-secondary uppercase tracking-wide block mb-1.5">
          {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
        </label>
        <textarea id="b64-input" value={input} onChange={(e) => setInput(e.target.value)} rows={6}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-y" />
      </div>

      <button onClick={process} className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer">
        {mode === 'encode' ? 'Encode' : 'Decode'}
      </button>

      {error && (
        <div className="p-3 rounded-xl bg-red-400/10 border border-red-400/30">
          <span className="text-sm font-medium text-red-400">{error}</span>
        </div>
      )}

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Result</span>
            <button onClick={copy} className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer">
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea readOnly value={output} rows={6}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-sm font-mono resize-y" />
        </div>
      )}
    </ConverterLayout>
  );
}
