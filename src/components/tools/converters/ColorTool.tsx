import { useState, useEffect, useMemo } from 'react';
import { ConverterLayout } from '..';
import { Copy, Check, RefreshCw, Sparkles } from 'lucide-react';

type PaletteMode = 'analogous' | 'complementary' | 'triadic' | 'split-complementary' | 'shades' | 'random';

export default function ColorTool() {
  const [hex, setHex] = useState('#6366F1');
  const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241 });
  const [hsl, setHsl] = useState({ h: 239, s: 84, l: 67 });
  const [copied, setCopied] = useState('');
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('analogous');
  const [paletteKey, setPaletteKey] = useState(0); // for random refresh

  useEffect(() => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    setRgb({ r, g, b });
    setHsl(rgbToHsl(r, g, b));
  }, [hex]);

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const hexStr = hex.toUpperCase();
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const formats = [
    { label: 'HEX', value: hexStr },
    { label: 'RGB', value: rgbStr },
    { label: 'HSL', value: hslStr },
  ];

  // ── Palette generation ────────────────────────────────────
  const palette = useMemo(() => {
    const { h, s, l } = hsl;
    switch (paletteMode) {
      case 'analogous':
        return [
          hslToHex((h - 30 + 360) % 360, s, l),
          hslToHex((h - 15 + 360) % 360, s, l),
          hslToHex(h, s, l),
          hslToHex((h + 15) % 360, s, l),
          hslToHex((h + 30) % 360, s, l),
        ];
      case 'complementary':
        return [
          hslToHex(h, s, l),
          hslToHex(h, Math.max(s - 20, 0), Math.min(l + 15, 95)),
          hslToHex((h + 180) % 360, s, l),
          hslToHex((h + 180) % 360, Math.max(s - 20, 0), Math.min(l + 15, 95)),
          hslToHex((h + 180) % 360, s, Math.max(l - 15, 5)),
        ];
      case 'triadic':
        return [
          hslToHex(h, s, l),
          hslToHex((h + 120) % 360, s, l),
          hslToHex((h + 240) % 360, s, l),
          hslToHex((h + 120) % 360, s, Math.min(l + 15, 95)),
          hslToHex((h + 240) % 360, s, Math.max(l - 15, 5)),
        ];
      case 'split-complementary':
        return [
          hslToHex(h, s, l),
          hslToHex((h + 150) % 360, s, l),
          hslToHex((h + 210) % 360, s, l),
          hslToHex((h + 150) % 360, Math.max(s - 15, 0), Math.min(l + 10, 95)),
          hslToHex((h + 210) % 360, Math.max(s - 15, 0), Math.min(l + 10, 95)),
        ];
      case 'shades':
        return [
          hslToHex(h, s, Math.max(l - 30, 5)),
          hslToHex(h, s, Math.max(l - 15, 5)),
          hslToHex(h, s, l),
          hslToHex(h, s, Math.min(l + 15, 95)),
          hslToHex(h, s, Math.min(l + 30, 95)),
        ];
      case 'random':
        // Seed-based randomness using paletteKey
        return Array.from({ length: 5 }, (_, i) => {
          const rh = (h + (i * 73 + paletteKey * 37) % 360) % 360;
          const rs = Math.max(30, Math.min(100, s + ((i * 17 + paletteKey * 13) % 40 - 20)));
          const rl = Math.max(20, Math.min(80, l + ((i * 29 + paletteKey * 7) % 30 - 15)));
          return hslToHex(rh, rs, rl);
        });
      default:
        return [];
    }
  }, [hsl, paletteMode, paletteKey]);

  const paletteModes: { id: PaletteMode; label: string }[] = [
    { id: 'analogous', label: 'Analogous' },
    { id: 'complementary', label: 'Complementary' },
    { id: 'triadic', label: 'Triadic' },
    { id: 'split-complementary', label: 'Split' },
    { id: 'shades', label: 'Shades' },
    { id: 'random', label: 'Random' },
  ];

  const copyPalette = async () => {
    const text = palette.join(', ');
    await navigator.clipboard.writeText(text);
    setCopied('palette-all');
    setTimeout(() => setCopied(''), 2000);
  };

  // ── Contrast info ─────────────────────────────────────────
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const textOnColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

  return (
    <ConverterLayout title="Color Picker & Palette Generator" description="Pick colors, convert formats, and generate harmonious color palettes.">
      {/* Color picker section */}
      <div className="p-5 rounded-2xl bg-surface border border-border">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Large preview */}
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-border shadow-lg shrink-0 flex items-center justify-center transition-colors duration-200"
            style={{ backgroundColor: hex }}
          >
            <span className="text-xs font-mono font-bold" style={{ color: textOnColor }}>
              {hexStr}
            </span>
          </div>

          {/* Picker + input */}
          <div className="flex flex-col gap-3 flex-1 w-full">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-11 h-11 rounded-lg border border-border cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setHex(e.target.value); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-text-primary text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                maxLength={7}
                placeholder="#000000"
              />
            </div>

            {/* Format values */}
            <div className="space-y-1.5">
              {formats.map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border group">
                  <span className="text-[10px] font-bold text-text-secondary w-7 uppercase">{label}</span>
                  <code className="flex-1 text-xs text-text-primary font-mono">{value}</code>
                  <button onClick={() => copy(value, label)} className="p-0.5 rounded hover:bg-border transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                    {copied === label ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-text-secondary" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Palette Generator */}
      <div className="p-5 rounded-2xl bg-surface border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-semibold text-text-primary">Color Palette</span>
          </div>
          <div className="flex items-center gap-2">
            {paletteMode === 'random' && (
              <button
                onClick={() => setPaletteKey(k => k + 1)}
                className="p-1.5 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                title="Generate new random palette"
              >
                <RefreshCw size={14} className="text-text-secondary" />
              </button>
            )}
            <button
              onClick={copyPalette}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
            >
              {copied === 'palette-all' ? <><Check size={12} className="text-green-400" /> Copied</> : <><Copy size={12} /> Copy All</>}
            </button>
          </div>
        </div>

        {/* Mode selector */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {paletteModes.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPaletteMode(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                ${paletteMode === id
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-background border border-border text-text-secondary hover:border-primary/50 hover:text-primary'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Palette display */}
        <div className="flex rounded-xl overflow-hidden border border-border">
          {palette.map((color, i) => (
            <button
              key={`${color}-${i}`}
              onClick={() => copy(color, `pal-${i}`)}
              className="flex-1 h-20 relative group cursor-pointer transition-transform hover:scale-y-110 origin-bottom"
              style={{ backgroundColor: color }}
              title={`Click to copy ${color}`}
            >
              <span
                className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-1 py-0.5 rounded"
                style={{
                  color: getTextColor(color),
                  backgroundColor: 'rgba(0,0,0,0.15)',
                }}
              >
                {copied === `pal-${i}` ? '✓' : color.toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        {/* Palette as text */}
        <div className="flex flex-wrap gap-2 mt-3">
          {palette.map((color, i) => (
            <button
              key={`chip-${i}`}
              onClick={() => { setHex(color); }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors cursor-pointer"
              title={`Set as active color`}
            >
              <span className="w-3 h-3 rounded-full shrink-0 border border-border" style={{ backgroundColor: color }} />
              <code className="text-[10px] text-text-primary font-mono">{color.toUpperCase()}</code>
            </button>
          ))}
        </div>
      </div>
    </ConverterLayout>
  );
}

// ── Color utilities ─────────────────────────────────────────

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color)))
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
