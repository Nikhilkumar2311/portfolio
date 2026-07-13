import { useCallback } from 'react';
import { ConverterLayout, DragDropUploader, FilePreviewList, ProgressIndicator, DownloadCard } from '..';
import { useFileProcessor } from '../../../hooks/useFileProcessor';

export default function PdfMerger() {
  const processor = useFileProcessor({ maxFiles: 50, acceptedTypes: ['application/pdf'] });

  const merge = useCallback(async () => {
    if (processor.files.length < 2) {
      processor.setError('Please add at least 2 PDF files to merge.');
      return;
    }
    processor.setProcessing();

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < processor.files.length; i++) {
        const bytes = await processor.files[i].file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
        processor.setProgress(Math.round(((i + 1) / processor.files.length) * 100));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as BlobPart], { type: 'application/pdf' });

      processor.setSuccess({
        blob,
        fileName: 'merged.pdf',
        mimeType: 'application/pdf',
        size: blob.size,
      });
    } catch (err) {
      processor.setError(err instanceof Error ? err.message : 'Merge failed.');
    }
  }, [processor]);

  return (
    <ConverterLayout title="PDF Merger" description="Merge multiple PDF files into a single document.">
      {processor.files.length === 0 ? (
        <DragDropUploader onFiles={(f) => processor.addFiles(f)} accept=".pdf,application/pdf" multiple acceptLabel="PDF" />
      ) : (
        <>
          <FilePreviewList files={processor.files} onRemove={processor.removeFile} />
          <DragDropUploader onFiles={(f) => processor.addFiles(f)} accept=".pdf,application/pdf" multiple acceptLabel="PDF — add more" />
          <ProgressIndicator state={processor.state} progress={processor.progress} error={processor.error} />
          {processor.state === 'success' && processor.result ? (
            <DownloadCard result={processor.result} onDownload={(name) => processor.download(name)} onReset={processor.reset} />
          ) : (
            processor.state !== 'processing' && (
              <button onClick={merge} className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer">
                Merge {processor.files.length} PDFs
              </button>
            )
          )}
        </>
      )}
    </ConverterLayout>
  );
}
