import { useState } from 'react';
import { ConverterLayout } from '..';
import { Copy, Check, ExternalLink, Link2, AlertCircle } from 'lucide-react';

interface ShortenedUrl {
  original: string;
  short: string;
  timestamp: number;
}

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<ShortenedUrl[]>([]);
  const [copied, setCopied] = useState('');

  const isValidUrl = (str: string): boolean => {
    try {
      const u = new URL(str);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const shorten = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    // Auto-prepend https if missing
    const fullUrl = trimmed.match(/^https?:\/\//) ? trimmed : `https://${trimmed}`;

    if (!isValidUrl(fullUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try is.gd API
      const response = await fetch(
        `https://is.gd/create.php?format=json&url=${encodeURIComponent(fullUrl)}`
      );

      if (!response.ok) throw new Error('Service unavailable');

      const data = await response.json();

      if (data.shorturl) {
        const entry: ShortenedUrl = {
          original: fullUrl,
          short: data.shorturl,
          timestamp: Date.now(),
        };
        setHistory(prev => [entry, ...prev]);
        setUrl('');
      } else if (data.errorcode) {
        throw new Error(data.errormessage || 'Failed to shorten URL');
      }
    } catch (err) {
      // Fallback: try TinyURL
      try {
        const response = await fetch(
          `https://tinyurl.com/api-create.php?url=${encodeURIComponent(fullUrl)}`
        );
        if (!response.ok) throw new Error('Fallback failed');
        const shortUrl = await response.text();
        if (shortUrl.startsWith('http')) {
          const entry: ShortenedUrl = {
            original: fullUrl,
            short: shortUrl.trim(),
            timestamp: Date.now(),
          };
          setHistory(prev => [entry, ...prev]);
          setUrl('');
        } else {
          throw new Error('Invalid response');
        }
      } catch {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to shorten URL. Please check your connection and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <ConverterLayout
      title="URL Shortener"
      description="Shorten long URLs instantly. Powered by is.gd - no sign-up required."
    >
      {/* Input */}
      <div className="p-5 rounded-2xl bg-surface border border-border">
        <label htmlFor="url-input" className="text-xs font-medium text-text-secondary uppercase tracking-wide block mb-2">
          Enter URL to shorten
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') shorten(); }}
              placeholder="https://example.com/very/long/url/here"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button
            onClick={shorten}
            disabled={loading || !url.trim()}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer shrink-0
              ${loading || !url.trim()
                ? 'bg-border text-text-secondary cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25'
              }
            `}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Shortening...
              </span>
            ) : 'Shorten'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 mt-3 p-2.5 rounded-lg bg-red-400/10 border border-red-400/20">
            <AlertCircle size={14} className="text-red-400 shrink-0" />
            <span className="text-xs text-red-400">{error}</span>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            Shortened URLs ({history.length})
          </span>

          {history.map((entry, i) => (
            <div
              key={`${entry.short}-${i}`}
              className="p-4 rounded-xl bg-surface border border-border group hover:border-primary/30 transition-colors"
            >
              {/* Shortened URL */}
              <div className="flex items-center gap-2 mb-2">
                <a
                  href={entry.short}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold text-sm hover:underline flex items-center gap-1.5 flex-1 truncate"
                >
                  {entry.short}
                  <ExternalLink size={12} className="shrink-0" />
                </a>
                <button
                  onClick={() => copy(entry.short, `short-${i}`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-primary/50 hover:text-primary text-text-secondary transition-colors cursor-pointer"
                >
                  {copied === `short-${i}` ? (
                    <><Check size={12} className="text-green-400" /> Copied</>
                  ) : (
                    <><Copy size={12} /> Copy</>
                  )}
                </button>
              </div>

              {/* Original URL */}
              <p className="text-xs text-text-secondary truncate" title={entry.original}>
                {entry.original}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Info note */}
      <p className="text-xs text-text-secondary text-center">
        URLs are shortened using <strong>is.gd</strong> - a free, open URL shortening service. No account required.
      </p>
    </ConverterLayout>
  );
}
