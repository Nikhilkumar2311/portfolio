import { useState } from 'react';
import { ConverterLayout } from '..';
import { Copy, Check } from 'lucide-react';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const process = () => {
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput('Invalid input for decoding.');
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ConverterLayout title="URL Encoder / Decoder" description="Encode and decode URLs and query string parameters.">
      <div className="flex gap-2 p-1 rounded-xl bg-surface border border-border">
        <button onClick={() => { setMode('encode'); setOutput(''); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${mode === 'encode' ? 'bg-primary text-white' : 'text-text-secondary hover:text-primary'}`}>Encode</button>
        <button onClick={() => { setMode('decode'); setOutput(''); }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${mode === 'decode' ? 'bg-primary text-white' : 'text-text-secondary hover:text-primary'}`}>Decode</button>
      </div>

      <div>
        <label htmlFor="url-input" className="text-xs font-medium text-text-secondary uppercase tracking-wide block mb-1.5">Input</label>
        <textarea id="url-input" value={input} onChange={(e) => setInput(e.target.value)} rows={4}
          placeholder={mode === 'encode' ? 'https://example.com/path?q=hello world' : 'https%3A%2F%2Fexample.com'}
          className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-y" />
      </div>

      <button onClick={process} className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer">
        {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
      </button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Result</span>
            <button onClick={copy} className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer">
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea readOnly value={output} rows={4}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-sm font-mono resize-y" />
        </div>
      )}
    </ConverterLayout>
  );
}
