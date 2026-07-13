import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ConverterLayout } from '..';
import { Copy, Check, RotateCw } from 'lucide-react';

const SAMPLE = `# Hello Markdown

This is a **live preview** of your Markdown content.

## Features
- **Bold** and *italic* text
- [Links](https://example.com)
- \`inline code\`

### Code Block
\`\`\`javascript
const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};
\`\`\`

### Table
| Feature | Status |
|---------|--------|
| Preview | ✅ |
| Export  | ✅ |

> Blockquotes work too!

---

1. First ordered item
2. Second item
3. Third item
`;

export default function MarkdownPreview() {
  const [input, setInput] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const copyHtml = async () => {
    const container = document.getElementById('md-preview-output');
    if (container) {
      await navigator.clipboard.writeText(container.innerHTML);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ConverterLayout title="Markdown Preview" description="Write or paste Markdown and see a live rendered preview." wide>
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setInput(SAMPLE)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
        >
          <RotateCw size={12} /> Reset Sample
        </button>
        <button
          onClick={() => setInput('')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
        >
          Clear
        </button>
        <div className="flex-1" />
        <button
          onClick={copyHtml}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
        >
          {copied ? <><Check size={12} className="text-green-400" /> HTML Copied</> : <><Copy size={12} /> Copy HTML</>}
        </button>
        <span className="text-[10px] text-text-secondary">
          {input.length} chars
        </span>
      </div>

      {/* Editor & Preview side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" style={{ minHeight: 520 }}>
        {/* Editor */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest">Markdown</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-sm font-mono leading-relaxed focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            placeholder="Write or paste markdown here..."
            spellCheck={false}
            style={{ minHeight: 480 }}
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest">Preview</span>
          <div
            id="md-preview-output"
            className="flex-1 px-6 py-5 rounded-xl bg-surface border border-border overflow-y-auto md-preview"
            style={{ minHeight: 480 }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3, marginTop: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--text-primary)' }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.3, marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.4, marginTop: '1rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{children}</h3>,
                h4: ({ children }) => <h4 style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.4, marginTop: '0.75rem', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>{children}</h4>,
                p: ({ children }) => <p style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>{children}</p>,
                a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', textUnderlineOffset: 2 }}>{children}</a>,
                strong: ({ children }) => <strong style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{children}</strong>,
                em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote style={{
                    borderLeft: '3px solid var(--primary)',
                    paddingLeft: '1rem',
                    margin: '0.75rem 0',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                  }}>{children}</blockquote>
                ),
                code: ({ className, children }) => {
                  const isBlock = className?.includes('language-');
                  if (isBlock) {
                    return (
                      <pre style={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        padding: '1rem',
                        overflowX: 'auto',
                        margin: '0.75rem 0',
                        fontSize: '0.8rem',
                        lineHeight: 1.6,
                      }}>
                        <code style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: 'var(--text-primary)' }}>
                          {children}
                        </code>
                      </pre>
                    );
                  }
                  return (
                    <code style={{
                      backgroundColor: 'var(--primary-light, rgba(99,102,241,0.1))',
                      color: 'var(--primary)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: 5,
                      fontSize: '0.8rem',
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}>{children}</code>
                  );
                },
                pre: ({ children }) => <>{children}</>,
                ul: ({ children }) => <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', listStyleType: 'disc' }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ paddingLeft: '1.5rem', margin: '0.5rem 0', listStyleType: 'decimal' }}>{children}</ol>,
                li: ({ children }) => <li style={{ fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>{children}</li>,
                hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.5rem 0' }} />,
                table: ({ children }) => (
                  <div style={{ overflowX: 'auto', margin: '0.75rem 0', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead style={{ backgroundColor: 'var(--surface, rgba(99,102,241,0.05))' }}>{children}</thead>,
                th: ({ children }) => <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}>{children}</th>,
                td: ({ children }) => <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>{children}</td>,
                img: ({ src, alt }) => <img src={src} alt={alt || ''} style={{ maxWidth: '100%', borderRadius: 8, margin: '0.5rem 0' }} />,
              }}
            >
              {input}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </ConverterLayout>
  );
}
