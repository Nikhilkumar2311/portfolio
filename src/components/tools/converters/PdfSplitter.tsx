import { useState, useCallback } from 'react';
import { ConverterLayout, DragDropUploader, FilePreviewList, ProgressIndicator, DownloadCard } from '..';
import { useFileProcessor } from '../../../hooks/useFileProcessor';
import { Check, Trash2, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageInfo {
  index: number;      // 0-based
  selected: boolean;
  thumbnail: string;  // data URL
}

export default function PdfSplitter() {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const processor = useFileProcessor({ maxFiles: 1, acceptedTypes: ['application/pdf'] });

  // When a file is added, render thumbnails for all pages
  const handleFileAdd = useCallback(async (files: FileList | File[]) => {
    processor.addFiles(files);
    const file = Array.from(files)[0];
    if (!file) return;

    setLoading(true);
    setPages([]);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const data = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const totalPages = pdf.numPages;
      const rendered: PageInfo[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 }); // Small thumbnails
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;

        await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;

        rendered.push({
          index: i - 1,
          selected: true, // All selected by default
          thumbnail: canvas.toDataURL('image/jpeg', 0.7),
        });
      }

      setPages(rendered);
    } catch (err) {
      processor.setError('Failed to read PDF pages. The file may be corrupted or password-protected.');
    } finally {
      setLoading(false);
    }
  }, [processor]);

  const togglePage = (index: number) => {
    setPages(prev => prev.map(p =>
      p.index === index ? { ...p, selected: !p.selected } : p
    ));
  };

  const selectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: true })));
  const deselectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: false })));
  const invertSelection = () => setPages(prev => prev.map(p => ({ ...p, selected: !p.selected })));

  const selectedCount = pages.filter(p => p.selected).length;
  const totalCount = pages.length;

  const split = useCallback(async () => {
    if (processor.files.length === 0 || selectedCount === 0) return;
    processor.setProcessing();

    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await processor.files[0].file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(bytes);

      const selectedIndices = pages.filter(p => p.selected).map(p => p.index);

      if (selectedIndices.length === 0) {
        processor.setError('No pages selected.');
        return;
      }

      if (selectedIndices.length === sourcePdf.getPageCount()) {
        processor.setError('All pages are selected — deselect the pages you want to remove, or select only the pages you want to keep.');
        return;
      }

      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(sourcePdf, selectedIndices);
      copied.forEach(page => newPdf.addPage(page));

      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes as BlobPart], { type: 'application/pdf' });

      const baseName = processor.files[0].file.name.replace(/\.[^.]+$/, '');
      processor.setSuccess({
        blob,
        fileName: `${baseName}-${selectedCount}pages.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
      });
    } catch (err) {
      processor.setError(err instanceof Error ? err.message : 'Split failed.');
    }
  }, [processor, pages, selectedCount]);

  return (
    <ConverterLayout
      title="PDF Splitter"
      description="Select which pages to keep or remove. Deselect the pages you don't want."
    >
      {processor.files.length === 0 ? (
        <DragDropUploader onFiles={handleFileAdd} accept=".pdf,application/pdf" acceptLabel="PDF" />
      ) : (
        <>
          <FilePreviewList files={processor.files} onRemove={processor.removeFile} />

          {/* Loading thumbnails */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-8">
              <RotateCw size={24} className="text-primary animate-spin" />
              <p className="text-sm text-text-secondary">Rendering page previews...</p>
            </div>
          )}

          {/* Page grid */}
          {pages.length > 0 && !loading && (
            <>
              {/* Selection controls */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-text-primary font-medium">
                  {selectedCount} of {totalCount} pages selected
                </span>
                <div className="flex gap-1.5 ml-auto">
                  <button onClick={selectAll} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:border-primary/50 hover:text-primary transition-colors cursor-pointer">
                    Select All
                  </button>
                  <button onClick={deselectAll} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:border-primary/50 hover:text-primary transition-colors cursor-pointer">
                    Deselect All
                  </button>
                  <button onClick={invertSelection} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:border-primary/50 hover:text-primary transition-colors cursor-pointer">
                    Invert
                  </button>
                </div>
              </div>

              {/* Thumbnail grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                <AnimatePresence>
                  {pages.map((page) => (
                    <motion.button
                      key={page.index}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => togglePage(page.index)}
                      className={`
                        relative rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer group
                        ${page.selected
                          ? 'border-primary shadow-md shadow-primary/15'
                          : 'border-border opacity-50 grayscale hover:opacity-70'
                        }
                      `}
                      title={`Page ${page.index + 1} — click to ${page.selected ? 'remove' : 'keep'}`}
                    >
                      {/* Thumbnail */}
                      <img
                        src={page.thumbnail}
                        alt={`Page ${page.index + 1}`}
                        className="w-full aspect-[3/4] object-cover object-top bg-white"
                        draggable={false}
                      />

                      {/* Page number */}
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent">
                        <span className="text-[10px] font-bold text-white">{page.index + 1}</span>
                      </div>

                      {/* Selection indicator */}
                      <div className={`
                        absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all
                        ${page.selected
                          ? 'bg-primary'
                          : 'bg-black/30 group-hover:bg-red-400/80'
                        }
                      `}>
                        {page.selected ? (
                          <Check size={12} className="text-white" strokeWidth={3} />
                        ) : (
                          <Trash2 size={10} className="text-white" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>

              <p className="text-xs text-text-secondary text-center">
                Click pages to select/deselect. Only <strong>selected</strong> pages will be in the output PDF.
              </p>
            </>
          )}

          <ProgressIndicator state={processor.state} error={processor.error} />

          {processor.state === 'success' && processor.result ? (
            <DownloadCard result={processor.result} onDownload={(name) => processor.download(name)} onReset={processor.reset} />
          ) : (
            processor.state !== 'processing' && pages.length > 0 && !loading && (
              <button
                onClick={split}
                disabled={selectedCount === 0 || selectedCount === totalCount}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors shadow-lg cursor-pointer
                  ${selectedCount === 0 || selectedCount === totalCount
                    ? 'bg-border text-text-secondary cursor-not-allowed shadow-none'
                    : 'bg-primary text-white hover:bg-primary-hover shadow-primary/25'
                  }
                `}
              >
                {selectedCount === 0
                  ? 'Select pages to keep'
                  : selectedCount === totalCount
                    ? 'Deselect pages to remove'
                    : `Extract ${selectedCount} of ${totalCount} pages`
                }
              </button>
            )
          )}
        </>
      )}
    </ConverterLayout>
  );
}
