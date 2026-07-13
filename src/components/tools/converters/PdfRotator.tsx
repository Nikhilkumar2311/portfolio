import { useState, useCallback } from 'react';
import { ConverterLayout, DragDropUploader, FilePreviewList, FormatSelector, ProgressIndicator, DownloadCard } from '..';
import { useFileProcessor } from '../../../hooks/useFileProcessor';

const ROTATION_OPTIONS = [
  { label: '90° Clockwise', value: '90' },
  { label: '180°', value: '180' },
  { label: '90° Counter-clockwise', value: '270' },
];

export default function PdfRotator() {
  const [rotation, setRotation] = useState('90');
  const [applyTo, setApplyTo] = useState('all');
  const processor = useFileProcessor({ maxFiles: 1, acceptedTypes: ['application/pdf'] });

  const rotate = useCallback(async () => {
    if (processor.files.length === 0) return;
    processor.setProcessing();

    try {
      const { PDFDocument, degrees } = await import('pdf-lib');
      const bytes = await processor.files[0].file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = pdf.getPages();
      const angle = Number(rotation);

      pages.forEach((page, i) => {
        if (applyTo === 'all' || applyTo === 'even' && (i + 1) % 2 === 0 || applyTo === 'odd' && (i + 1) % 2 !== 0) {
          page.setRotation(degrees((page.getRotation().angle + angle) % 360));
        }
      });

      const rotatedBytes = await pdf.save();
      const blob = new Blob([rotatedBytes as BlobPart], { type: 'application/pdf' });

      processor.setSuccess({
        blob,
        fileName: `rotated-${rotation}deg.pdf`,
        mimeType: 'application/pdf',
        size: blob.size,
      });
    } catch (err) {
      processor.setError(err instanceof Error ? err.message : 'Rotation failed.');
    }
  }, [processor, rotation, applyTo]);

  return (
    <ConverterLayout title="PDF Rotator" description="Rotate individual pages or entire PDF documents.">
      {processor.files.length === 0 ? (
        <DragDropUploader onFiles={(f) => processor.addFiles(f)} accept=".pdf,application/pdf" acceptLabel="PDF" />
      ) : (
        <>
          <FilePreviewList files={processor.files} onRemove={processor.removeFile} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface border border-border">
            <FormatSelector label="Rotation" value={rotation} onChange={setRotation} id="rotation" options={ROTATION_OPTIONS} />
            <FormatSelector label="Apply To" value={applyTo} onChange={setApplyTo} id="apply-to" options={[
              { label: 'All Pages', value: 'all' },
              { label: 'Even Pages', value: 'even' },
              { label: 'Odd Pages', value: 'odd' },
            ]} />
          </div>
          <ProgressIndicator state={processor.state} error={processor.error} />
          {processor.state === 'success' && processor.result ? (
            <DownloadCard result={processor.result} onDownload={(name) => processor.download(name)} onReset={processor.reset} />
          ) : (
            processor.state !== 'processing' && (
              <button onClick={rotate} className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer">Rotate PDF</button>
            )
          )}
        </>
      )}
    </ConverterLayout>
  );
}
