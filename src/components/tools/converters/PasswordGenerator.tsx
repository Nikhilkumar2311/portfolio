import { useState, useCallback } from 'react';
import { ConverterLayout } from '..';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { setPassword(''); return; }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const pw = Array.from(array, (n) => chars[n % chars.length]).join('');
    setPassword(pw);
  }, [length, uppercase, lowercase, numbers, symbols]);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = getStrength(length, [uppercase, lowercase, numbers, symbols].filter(Boolean).length);

  return (
    <ConverterLayout title="Password Generator" description="Generate secure, random passwords with customizable rules.">
      <div className="p-4 rounded-xl bg-surface border border-border space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">Length</label>
            <span className="text-sm font-medium text-primary">{length}</span>
          </div>
          <input type="range" min={4} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-1.5 rounded-full bg-border appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/25" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Uppercase (A-Z)', value: uppercase, set: setUppercase },
            { label: 'Lowercase (a-z)', value: lowercase, set: setLowercase },
            { label: 'Numbers (0-9)', value: numbers, set: setNumbers },
            { label: 'Symbols (!@#$)', value: symbols, set: setSymbols },
          ].map(({ label, value, set }) => (
            <label key={label} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-background transition-colors">
              <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer accent-[var(--color-primary)]" />
              <span className="text-sm text-text-primary">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={generate} className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer flex items-center justify-center gap-2">
        <RefreshCw size={16} /> Generate Password
      </button>

      {password && (
        <div className="p-4 rounded-xl bg-surface border border-border">
          <div className="flex items-center gap-3 mb-3">
            <code className="flex-1 text-lg text-text-primary font-mono break-all select-all">{password}</code>
            <button onClick={copy} className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors cursor-pointer shrink-0">
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-text-secondary" />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
              <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: `${strength.percent}%` }} />
            </div>
            <span className={`text-xs font-medium ${strength.textColor}`}>{strength.label}</span>
          </div>
        </div>
      )}
    </ConverterLayout>
  );
}

function getStrength(length: number, charTypes: number) {
  const score = Math.min(100, (length / 20) * 50 + charTypes * 12.5);
  if (score < 30) return { percent: score, label: 'Weak', color: 'bg-red-400', textColor: 'text-red-400' };
  if (score < 60) return { percent: score, label: 'Fair', color: 'bg-amber-400', textColor: 'text-amber-400' };
  if (score < 80) return { percent: score, label: 'Strong', color: 'bg-green-400', textColor: 'text-green-400' };
  return { percent: score, label: 'Very Strong', color: 'bg-green-400', textColor: 'text-green-400' };
}
