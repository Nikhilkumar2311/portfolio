import { useState, useCallback, useRef } from 'react';
import { ConverterLayout, DragDropUploader, FilePreviewList, ProgressIndicator, DownloadCard } from '..';
import { useFileProcessor } from '../../../hooks/useFileProcessor';
import { Trash2, RotateCw, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageInfo {
  originalIndex: number; // 0-based original page number
  thumbnail: string;     // data URL
}

export default function PdfPageManager() {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const dragCounterRef = useRef(0);
  const processor = useFileProcessor({ maxFiles: 1, acceptedTypes: ['application/pdf'] });

  // Render page thumbnails when file is added
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
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;

        rendered.push({
          originalIndex: i - 1,
          thumbnail: canvas.toDataURL('image/jpeg', 0.7),
        });
      }

      setPages(rendered);
    } catch {
      processor.setError('Failed to read PDF pages.');
    } finally {
      setLoading(false);
    }
  }, [processor]);

  // ── Drag & Drop reordering ──────────────────────────────
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    dragCounterRef.current = 0;
  };

  const handleDragEnter = (index: number) => {
    dragCounterRef.current++;
    if (draggedIndex !== null && draggedIndex !== index) {
      setDropTarget(index);
    }
  };

  const handleDragLeave = () => {
    dragCounterRef.current--;
    if (dragCounterRef.current <= 0) {
      setDropTarget(null);
      dragCounterRef.current = 0;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDropTarget(null);
      return;
    }

    setPages(prev => {
      const next = [...prev];
      const [moved] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });

    setDraggedIndex(null);
    setDropTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTarget(null);
  };

  // ── Page actions ────────────────────────────────────────
  const removePage = (index: number) => {
    setPages(prev => prev.filter((_, i) => i !== index));
  };

  // ── Save ────────────────────────────────────────────────
  const save = useCallback(async () => {
    if (processor.files.length === 0 || pages.length === 0) return;
    processor.setProcessing();

    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await processor.files[0].file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();

      const indices = pages.map(p => p.originalIndex);
      const copied = await newPdf.copyPages(sourcePdf, indices);
      copied.forEach(page => newPdf.addPage(page));

      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes as BlobPart], { type: 'application/pdf' });

      const baseName = processor.files[0].file.name.replace(/\.[^.]+$/, '');
      processor.setSuccess({
        blob,
        fileName: `${baseName}-managed.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
      });
    } catch (err) {
      processor.setError(err instanceof Error ? err.message : 'Failed to save.');
    }
  }, [processor, pages]);

  const totalOriginal = pages.length; // After any removals

  return (
    <ConverterLayout title="PDF Page Manager" description="Drag to reorder, click ✕ to delete pages. Visual page previews.">
      {processor.files.length === 0 ? (
        <DragDropUploader onFiles={handleFileAdd} accept=".pdf,application/pdf" acceptLabel="PDF" />
      ) : (
        <>
          <FilePreviewList files={processor.files} onRemove={processor.removeFile} />

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-8">
              <RotateCw size={24} className="text-primary animate-spin" />
              <p className="text-sm text-text-secondary">Rendering page previews...</p>
            </div>
          )}

          {/* Page grid with drag & drop */}
          {pages.length > 0 && !loading && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-primary font-medium">
                  {totalOriginal} pages — drag to reorder, click ✕ to delete
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                <AnimatePresence>
                  {pages.map((page, index) => (
                    <motion.div
                      key={`${page.originalIndex}-${index}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                      onDragEnd={handleDragEnd}
                      className={`
                        relative rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-grab active:cursor-grabbing group
                        ${draggedIndex === index
                          ? 'opacity-40 scale-95 border-border'
                          : dropTarget === index
                            ? 'border-primary shadow-lg shadow-primary/20 scale-105'
                            : 'border-border hover:border-primary/40'
                        }
                      `}
                    >
                      {/* Thumbnail */}
                      <img
                        src={page.thumbnail}
                        alt={`Page ${page.originalIndex + 1}`}
                        className="w-full aspect-[3/4] object-cover object-top bg-white pointer-events-none"
                        draggable={false}
                      />

                      {/* Drag handle indicator */}
                      <div className="absolute top-1 left-1 p-0.5 rounded bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={12} className="text-white" />
                      </div>

                      {/* Page number */}
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white">
                          {page.originalIndex + 1}
                        </span>
                        <span className="text-[9px] text-white/60">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); removePage(index); }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500/80 opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all cursor-pointer"
                        title={`Remove page ${page.originalIndex + 1}`}
                      >
                        <Trash2 size={10} className="text-white" />
                      </button>

                      {/* Drop indicator line */}
                      {dropTarget === index && draggedIndex !== null && (
                        <div className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none" />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <p className="text-xs text-text-secondary text-center">
                Original page numbers shown bottom-left. Current position shown bottom-right (#).
              </p>
            </>
          )}

          <ProgressIndicator state={processor.state} error={processor.error} />

          {processor.state === 'success' && processor.result ? (
            <DownloadCard result={processor.result} onDownload={(name) => processor.download(name)} onReset={processor.reset} />
          ) : (
            processor.state !== 'processing' && pages.length > 0 && !loading && (
              <button
                onClick={save}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer"
              >
                Save {pages.length} Pages
              </button>
            )
          )}
        </>
      )}
    </ConverterLayout>
  );
}
