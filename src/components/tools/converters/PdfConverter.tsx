import { useState, useCallback } from 'react';
import { ConverterLayout, DragDropUploader, FilePreviewList, FormatSelector, ProgressIndicator, DownloadCard } from '..';
import { useFileProcessor } from '../../../hooks/useFileProcessor';

export default function PdfConverter() {
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [fit, setFit] = useState('contain');
  const processor = useFileProcessor({ maxFiles: 20, acceptedTypes: ['image/*'] });

  const convert = useCallback(async () => {
    if (processor.files.length === 0) return;
    processor.setProcessing();

    try {
      const { default: jsPDF } = await import('jspdf');
      const isLandscape = orientation === 'landscape';
      const doc = new jsPDF({ orientation: isLandscape ? 'landscape' : 'portrait', unit: 'mm', format: pageSize });

      for (let i = 0; i < processor.files.length; i++) {
        if (i > 0) doc.addPage(pageSize, isLandscape ? 'landscape' : 'portrait');
        const file = processor.files[i].file;
        const dataUrl = await fileToDataUrl(file);
        const img = new Image();
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = () => rej(new Error(`Failed to load ${file.name}`));
          img.src = dataUrl;
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;

        let w: number, h: number, x: number, y: number;

        if (fit === 'fill') {
          w = maxW;
          h = maxH;
          x = margin;
          y = margin;
        } else {
          const ratio = Math.min(maxW / img.width, maxH / img.height);
          w = img.width * ratio;
          h = img.height * ratio;
          x = margin + (maxW - w) / 2;
          y = margin + (maxH - h) / 2;
        }

        doc.addImage(dataUrl, 'JPEG', x, y, w, h);
        processor.setProgress(Math.round(((i + 1) / processor.files.length) * 100));
      }

      const blob = doc.output('blob');
      processor.setSuccess({
        blob,
        fileName: 'converted.pdf',
        mimeType: 'application/pdf',
        size: blob.size,
      });
    } catch (err) {
      processor.setError(err instanceof Error ? err.message : 'PDF conversion failed.');
    }
  }, [processor, pageSize, orientation, fit]);

  return (
    <ConverterLayout
      title="PDF Converter"
      description="Convert images to PDF documents with customizable page layouts."
    >
      {processor.files.length === 0 ? (
        <DragDropUploader
          onFiles={(f) => processor.addFiles(f)}
          accept="image/*"
          multiple
          acceptLabel="PNG, JPG, WEBP, GIF, BMP"
        />
      ) : (
        <>
          <FilePreviewList files={processor.files} onRemove={processor.removeFile} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-surface border border-border">
            <FormatSelector label="Page Size" value={pageSize} onChange={setPageSize} id="page-size"
              options={[
                { label: 'A4', value: 'a4' },
                { label: 'Letter', value: 'letter' },
                { label: 'A3', value: 'a3' },
                { label: 'A5', value: 'a5' },
              ]}
            />
            <FormatSelector label="Orientation" value={orientation} onChange={setOrientation} id="orientation"
              options={[
                { label: 'Portrait', value: 'portrait' },
                { label: 'Landscape', value: 'landscape' },
              ]}
            />
            <FormatSelector label="Image Fit" value={fit} onChange={setFit} id="image-fit"
              options={[
                { label: 'Contain', value: 'contain' },
                { label: 'Fill Page', value: 'fill' },
              ]}
            />
          </div>

          <ProgressIndicator state={processor.state} progress={processor.progress} error={processor.error} />

          {processor.state === 'success' && processor.result ? (
            <DownloadCard result={processor.result} onDownload={(name) => processor.download(name)} onReset={processor.reset} />
          ) : (
            processor.state !== 'processing' && (
              <button onClick={convert} className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer">
                Convert {processor.files.length} image{processor.files.length > 1 ? 's' : ''} to PDF
              </button>
            )
          )}
        </>
      )}
    </ConverterLayout>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = () => rej(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
