import { useState, useCallback, useRef, useEffect } from 'react';
import { ConverterLayout } from '..';
import { Download, Copy, Check } from 'lucide-react';

export default function QrGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(async () => {
    if (!text.trim() || !canvasRef.current) return;
    const QRCode = await import('qrcode');
    await QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      color: { dark: fgColor, light: bgColor },
      margin: 2,
    });
    setGenerated(true);
  }, [text, size, fgColor, bgColor]);

  useEffect(() => {
    if (text.trim()) generate();
  }, [text, size, fgColor, bgColor, generate]);

  const download = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      const blob = await new Promise<Blob>((res) =>
        canvasRef.current!.toBlob((b) => res(b!), 'image/png')
      );
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* Fallback: download */ download(); }
  };

  return (
    <ConverterLayout title="QR Code Generator" description="Generate QR codes from text, URLs, or any data.">
      <div className="p-4 rounded-xl bg-surface border border-border space-y-4">
        <div>
          <label htmlFor="qr-text" className="text-xs font-medium text-text-secondary uppercase tracking-wide block mb-1.5">Text or URL</label>
          <textarea
            id="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="https://example.com"
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-y"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="qr-size" className="text-xs font-medium text-text-secondary uppercase tracking-wide block mb-1.5">Size (px)</label>
            <input id="qr-size" type="number" value={size} onChange={(e) => setSize(Math.max(64, Number(e.target.value)))} min={64} max={1024}
              className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div>
            <label htmlFor="qr-fg" className="text-xs font-medium text-text-secondary uppercase tracking-wide block mb-1.5">Foreground</label>
            <input id="qr-fg" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 rounded-lg border border-border cursor-pointer" />
          </div>
          <div>
            <label htmlFor="qr-bg" className="text-xs font-medium text-text-secondary uppercase tracking-wide block mb-1.5">Background</label>
            <input id="qr-bg" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded-lg border border-border cursor-pointer" />
          </div>
        </div>
      </div>

      {/* QR Code Preview */}
      <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-surface border border-border">
        <canvas ref={canvasRef} className="rounded-lg" style={{ display: generated ? 'block' : 'none' }} />
        {!generated && <p className="text-sm text-text-secondary">Enter text to generate a QR code</p>}

        {generated && (
          <div className="flex gap-3">
            <button onClick={download} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer">
              <Download size={16} /> Download PNG
            </button>
            <button onClick={copyToClipboard} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-text-primary text-sm font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer">
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </ConverterLayout>
  );
}
