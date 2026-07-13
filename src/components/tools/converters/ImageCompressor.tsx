import { useState, useCallback } from 'react';
import { ConverterLayout, DragDropUploader, FilePreviewList, QualitySlider, ProgressIndicator, DownloadCard } from '..';
import { useFileProcessor } from '../../../hooks/useFileProcessor';

export default function ImageCompressor() {
  const [quality, setQuality] = useState(70);
  const [maxWidth, setMaxWidth] = useState(1920);
  const processor = useFileProcessor({ maxFiles: 1, acceptedTypes: ['image/*'] });

  const compress = useCallback(async () => {
    if (processor.files.length === 0) return;
    processor.setProcessing();

    try {
      const { default: imageCompression } = await import('browser-image-compression');
      const file = processor.files[0].file;

      const compressed = await imageCompression(file, {
        maxSizeMB: (quality / 100) * (file.size / (1024 * 1024)) * 0.8,
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        initialQuality: quality / 100,
      });

      const preview = URL.createObjectURL(compressed);
      const baseName = file.name.replace(/\.[^.]+$/, '');
      const ext = file.name.split('.').pop() || 'jpg';

      processor.setSuccess({
        blob: compressed,
        fileName: `${baseName}-compressed.${ext}`,
        mimeType: compressed.type,
        preview,
        size: compressed.size,
      });
    } catch (err) {
      processor.setError(err instanceof Error ? err.message : 'Compression failed.');
    }
  }, [processor, quality, maxWidth]);

  const originalSize = processor.files[0]?.file.size;
  const savedPercent = processor.result
    ? Math.round((1 - processor.result.size / originalSize) * 100)
    : 0;

  return (
    <ConverterLayout
      title="Image Compressor"
      description="Reduce image file size while preserving quality with adjustable compression."
    >
      {processor.files.length === 0 ? (
        <DragDropUploader
          onFiles={(f) => processor.addFiles(f)}
          accept="image/*"
          acceptLabel="PNG, JPG, WEBP, GIF, BMP"
        />
      ) : (
        <>
          <FilePreviewList files={processor.files} onRemove={processor.removeFile} />

          <div className="space-y-4 p-4 rounded-xl bg-surface border border-border">
            <QualitySlider value={quality} onChange={setQuality} label="Compression Quality" />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="max-width" className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                Max Width (px)
              </label>
              <input
                id="max-width"
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Math.max(100, Number(e.target.value)))}
                min={100}
                max={10000}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <ProgressIndicator state={processor.state} error={processor.error} />

          {processor.state === 'success' && processor.result ? (
            <>
              {savedPercent > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-400/10 border border-green-400/30">
                  <span className="text-sm font-medium text-green-400">
                    🎉 Reduced by {savedPercent}% — saved {((originalSize - processor.result.size) / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}
              <DownloadCard
                result={processor.result}
                onDownload={(name) => processor.download(name)}
                onReset={processor.reset}
              />
            </>
          ) : (
            processor.state !== 'processing' && (
              <button
                onClick={compress}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer"
              >
                Compress Image
              </button>
            )
          )}
        </>
      )}
    </ConverterLayout>
  );
}
