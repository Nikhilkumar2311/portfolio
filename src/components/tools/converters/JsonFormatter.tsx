import { useState, useCallback } from 'react';
import { ConverterLayout } from '..';
import { Copy, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'format' | 'minify' | 'yaml'>('format');

  const process = useCallback(() => {
    if (!input.trim()) return;

    if (mode === 'yaml') {
      try {
        const parsed = JSON.parse(input);
        setOutput(jsonToYaml(parsed));
        setIsValid(true);
        setError('');
      } catch (e) {
        // Try YAML to JSON
        try {
          const parsed = yamlToJson(input);
          setOutput(JSON.stringify(parsed, null, 2));
          setIsValid(true);
          setError('');
        } catch {
          setIsValid(false);
          setError(e instanceof Error ? e.message : 'Invalid input');
          setOutput('');
        }
      }
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setIsValid(true);
      setError('');
      if (mode === 'format') {
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (e) {
      setIsValid(false);
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input, mode]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ConverterLayout title="JSON Formatter" description="Format, validate, and minify JSON. Convert between JSON and YAML.">
      <div className="flex gap-2 p-1 rounded-xl bg-surface border border-border">
        {(['format', 'minify', 'yaml'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${mode === m ? 'bg-primary text-white' : 'text-text-secondary hover:text-primary'}`}>
            {m === 'yaml' ? 'JSON ↔ YAML' : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label htmlFor="json-input" className="text-xs font-medium text-text-secondary uppercase tracking-wide block mb-1.5">
            Input {mode === 'yaml' ? '(JSON or YAML)' : '(JSON)'}
          </label>
          <textarea id="json-input" value={input} onChange={(e) => setInput(e.target.value)} rows={14}
            placeholder='{"key": "value"}'
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-y" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Output</span>
            {output && (
              <button onClick={copy} className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer">
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <textarea readOnly value={output} rows={14}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-sm font-mono resize-y" />
        </div>
      </div>

      {isValid !== null && (
        <div className={`flex items-center gap-2 p-3 rounded-xl ${isValid ? 'bg-green-400/10 border border-green-400/30' : 'bg-red-400/10 border border-red-400/30'}`}>
          {isValid ? <CheckCircle2 size={16} className="text-green-400" /> : <AlertCircle size={16} className="text-red-400" />}
          <span className={`text-sm font-medium ${isValid ? 'text-green-400' : 'text-red-400'}`}>
            {isValid ? 'Valid!' : error}
          </span>
        </div>
      )}

      <button onClick={process} className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer">
        {mode === 'format' ? 'Format' : mode === 'minify' ? 'Minify' : 'Convert'}
      </button>
    </ConverterLayout>
  );
}

// Simple JSON to YAML converter
function jsonToYaml(obj: unknown, indent = 0): string {
  const prefix = '  '.repeat(indent);
  if (obj === null) return `${prefix}null`;
  if (typeof obj === 'string') return obj.includes('\n') ? `|\n${obj.split('\n').map(l => `${prefix}  ${l}`).join('\n')}` : obj;
  if (typeof obj !== 'object') return String(obj);
  if (Array.isArray(obj)) {
    return obj.map(item => `${prefix}- ${typeof item === 'object' && item !== null ? '\n' + jsonToYaml(item, indent + 1) : jsonToYaml(item, 0)}`).join('\n');
  }
  return Object.entries(obj as Record<string, unknown>)
    .map(([key, val]) => {
      if (typeof val === 'object' && val !== null) {
        return `${prefix}${key}:\n${jsonToYaml(val, indent + 1)}`;
      }
      return `${prefix}${key}: ${jsonToYaml(val, 0)}`;
    })
    .join('\n');
}

// Simple YAML to JSON parser (handles basic cases)
function yamlToJson(yaml: string): unknown {
  const lines = yaml.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
  const result: Record<string, unknown> = {};

  for (const line of lines) {
    const match = line.match(/^(\s*)(\w[\w\s]*?):\s*(.*)$/);
    if (match) {
      const [, , key, value] = match;
      if (value === '') continue;
      result[key.trim()] = isNaN(Number(value)) ? (value === 'true' ? true : value === 'false' ? false : value === 'null' ? null : value.replace(/^["']|["']$/g, '')) : Number(value);
    }
  }
  return result;
}
