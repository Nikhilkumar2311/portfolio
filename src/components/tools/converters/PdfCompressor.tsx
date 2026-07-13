import { useCallback } from 'react';
import { ConverterLayout, DragDropUploader, FilePreviewList, ProgressIndicator, DownloadCard } from '..';
import { useFileProcessor } from '../../../hooks/useFileProcessor';

export default function PdfCompressor() {
  const processor = useFileProcessor({ maxFiles: 1, acceptedTypes: ['application/pdf'] });

  const compress = useCallback(async () => {
    if (processor.files.length === 0) return;
    processor.setProcessing();

    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await processor.files[0].file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      // Remove metadata to reduce size
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setKeywords([]);
      pdf.setProducer('');
      pdf.setCreator('');

      const compressedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const blob = new Blob([compressedBytes as BlobPart], { type: 'application/pdf' });
      const originalSize = processor.files[0].file.size;
      const saved = Math.round((1 - blob.size / originalSize) * 100);

      processor.setSuccess({
        blob,
        fileName: 'compressed.pdf',
        mimeType: 'application/pdf',
        size: blob.size,
      });

      if (saved <= 0) {
        // If no savings, inform user
        processor.setError('This PDF is already well-optimized. No further compression possible in-browser.');
      }
    } catch (err) {
      processor.setError(err instanceof Error ? err.message : 'Compression failed.');
    }
  }, [processor]);

  const originalSize = processor.files[0]?.file.size || 0;
  const savedPercent = processor.result
    ? Math.max(0, Math.round((1 - processor.result.size / originalSize) * 100))
    : 0;

  return (
    <ConverterLayout title="PDF Compressor" description="Optimize PDF file size by removing redundant data and metadata.">
      {processor.files.length === 0 ? (
        <DragDropUploader onFiles={(f) => processor.addFiles(f)} accept=".pdf,application/pdf" acceptLabel="PDF" />
      ) : (
        <>
          <FilePreviewList files={processor.files} onRemove={processor.removeFile} />

          <div className="p-3 rounded-xl bg-surface border border-border">
            <p className="text-xs text-text-secondary">
              Browser-based compression removes metadata and optimizes object streams.
              For heavy compression of scanned PDFs, a server-side tool may yield better results.
            </p>
          </div>

          <ProgressIndicator state={processor.state} error={processor.error} />

          {processor.state === 'success' && processor.result ? (
            <>
              {savedPercent > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-400/10 border border-green-400/30">
                  <span className="text-sm font-medium text-green-400">
                    Reduced by {savedPercent}% — saved {((originalSize - processor.result.size) / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}
              <DownloadCard result={processor.result} onDownload={(name) => processor.download(name)} onReset={processor.reset} />
            </>
          ) : (
            processor.state !== 'processing' && (
              <button onClick={compress} className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer">Compress PDF</button>
            )
          )}
        </>
      )}
    </ConverterLayout>
  );
}
