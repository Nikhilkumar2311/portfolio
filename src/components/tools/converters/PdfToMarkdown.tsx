import { useState, useCallback } from 'react';
import { ConverterLayout, DragDropUploader, FilePreviewList, ProgressIndicator, DownloadCard } from '..';
import { useFileProcessor } from '../../../hooks/useFileProcessor';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

export default function PdfToMarkdown() {
  const processor = useFileProcessor({ maxFiles: 1, acceptedTypes: ['application/pdf'] });
  const [markdownPreview, setMarkdownPreview] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);

  const convert = useCallback(async () => {
    if (processor.files.length === 0) return;
    processor.setProcessing();

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const bytes = await processor.files[0].file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const totalPages = pdf.numPages;
      const allPageLines: string[] = [];

      // First pass: collect all font sizes to determine body text size
      const allFontSizes: number[] = [];
      interface LineGroup { y: number; items: { str: string; fontSize: number; bold: boolean; x: number }[] }
      const pageLineGroups: LineGroup[][] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const lineGroups: LineGroup[] = [];

        for (const item of content.items) {
          if (!('str' in item)) continue;
          const textItem = item as { str: string; transform: number[]; height: number; fontName: string };
          const y = Math.round(textItem.transform[5]);
          const x = textItem.transform[4];
          const fontSize = textItem.height;
          const bold = textItem.fontName?.toLowerCase().includes('bold') || false;

          if (fontSize > 0) allFontSizes.push(fontSize);

          let group = lineGroups.find(g => Math.abs(g.y - y) <= 2);
          if (!group) {
            group = { y, items: [] };
            lineGroups.push(group);
          }
          group.items.push({ str: textItem.str, fontSize, bold, x });
        }

        lineGroups.sort((a, b) => b.y - a.y);
        pageLineGroups.push(lineGroups);
        processor.setProgress(Math.round((i / totalPages) * 50));
      }

      // Find the most common font size (= body text)
      const sizeFreq: Record<number, number> = {};
      for (const s of allFontSizes) {
        const rounded = Math.round(s * 10) / 10;
        sizeFreq[rounded] = (sizeFreq[rounded] || 0) + 1;
      }
      const bodySize = Number(Object.entries(sizeFreq).sort((a, b) => b[1] - a[1])[0]?.[0]) || 10;

      // Second pass: generate markdown using relative size detection
      for (let i = 0; i < pageLineGroups.length; i++) {
        const lineGroups = pageLineGroups[i];

        for (const group of lineGroups) {
          group.items.sort((a, b) => a.x - b.x);
          const text = group.items.map(it => it.str).join('');
          const trimmed = text.trim();

          if (!trimmed) {
            allPageLines.push('');
            continue;
          }

          const avgFontSize = group.items.reduce((s, it) => s + it.fontSize, 0) / group.items.length;
          const isBold = group.items.some(it => it.bold);
          const ratio = avgFontSize / bodySize;
          const isAllCaps = trimmed === trimmed.toUpperCase() && trimmed.length > 2 && /[A-Z]/.test(trimmed);

          // Heading detection relative to body size
          if (ratio >= 1.8) {
            allPageLines.push(`# ${trimmed}`);
          } else if (ratio >= 1.4) {
            allPageLines.push(`## ${trimmed}`);
          } else if (ratio >= 1.15 || (isAllCaps && isBold)) {
            allPageLines.push(`### ${trimmed}`);
          } else if (isAllCaps && trimmed.length < 60) {
            allPageLines.push(`### ${trimmed}`);
          } else if (isBold && trimmed.length < 80) {
            allPageLines.push(`**${trimmed}**`);
          } else {
            // Detect bullet points
            if (/^[•●○▪▸►‣⁃-]\s/.test(trimmed)) {
              allPageLines.push(`- ${trimmed.replace(/^[•●○▪▸►‣⁃-]\s*/, '')}`);
            } else if (/^\d+[.)]\s/.test(trimmed)) {
              allPageLines.push(trimmed);
            } else {
              allPageLines.push(trimmed);
            }
          }
        }

        if (i < pageLineGroups.length - 1) {
          allPageLines.push('', '---', '');
        }

        processor.setProgress(50 + Math.round(((i + 1) / pageLineGroups.length) * 50));
      }

      // Clean up
      const markdown = allPageLines
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      setMarkdownPreview(markdown);

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const baseName = processor.files[0].file.name.replace(/\.[^.]+$/, '');

      processor.setSuccess({
        blob,
        fileName: `${baseName}.md`,
        mimeType: 'text/markdown',
        size: blob.size,
      });
    } catch (err) {
      processor.setError(err instanceof Error ? err.message : 'Conversion failed.');
    }
  }, [processor]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(markdownPreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ConverterLayout title="PDF to Markdown" description="Extract text from PDF files and convert to Markdown format.">
      {processor.files.length === 0 ? (
        <DragDropUploader onFiles={(f) => processor.addFiles(f)} accept=".pdf,application/pdf" acceptLabel="PDF" />
      ) : (
        <>
          <FilePreviewList files={processor.files} onRemove={processor.removeFile} />

          <div className="p-3 rounded-xl bg-surface border border-border">
            <p className="text-xs text-text-secondary">
              Text is extracted using PDF.js. Headings are detected by font size, bold text is preserved.
              Complex layouts (tables, multi-column) may not convert perfectly.
            </p>
          </div>

          <ProgressIndicator state={processor.state} progress={processor.progress} error={processor.error} />

          {processor.state === 'success' && processor.result ? (
            <>
              {/* Markdown preview */}
              {markdownPreview && (
                <div className="rounded-2xl bg-surface border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                      Extracted Markdown
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer"
                      >
                        {showPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                        {showPreview ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-border text-text-secondary hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
                      >
                        {copied ? <><Check size={12} className="text-green-400" /> Copied</> : <><Copy size={12} /> Copy</>}
                      </button>
                    </div>
                  </div>
                  {showPreview && (
                    <pre className="p-4 text-xs text-text-primary font-mono whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed">
                      {markdownPreview}
                    </pre>
                  )}
                </div>
              )}

              <DownloadCard result={processor.result} onDownload={(name) => processor.download(name)} onReset={() => { processor.reset(); setMarkdownPreview(''); }} />
            </>
          ) : (
            processor.state !== 'processing' && (
              <button onClick={convert} className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer">
                Convert to Markdown
              </button>
            )
          )}
        </>
      )}
    </ConverterLayout>
  );
}
