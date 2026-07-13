import { useState, useCallback } from 'react';
import { ConverterLayout, DragDropUploader, FilePreviewList, NumberInput, ProgressIndicator, DownloadCard } from '..';
import { useFileProcessor } from '../../../hooks/useFileProcessor';
import { Lock, Unlock } from 'lucide-react';

export default function ImageResizer() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ w: 0, h: 0 });
  const processor = useFileProcessor({ maxFiles: 1, acceptedTypes: ['image/*'] });

  const handleFileAdd = useCallback((files: FileList | File[]) => {
    processor.addFiles(files);
    const file = Array.from(files)[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ w: img.width, h: img.height });
        setWidth(img.width);
        setHeight(img.height);
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    }
  }, [processor]);

  const handleWidthChange = (w: number) => {
    setWidth(w);
    if (lockAspect && originalDimensions.w > 0) {
      setHeight(Math.round((w / originalDimensions.w) * originalDimensions.h));
    }
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    if (lockAspect && originalDimensions.h > 0) {
      setWidth(Math.round((h / originalDimensions.h) * originalDimensions.w));
    }
  };

  const resize = useCallback(async () => {
    if (processor.files.length === 0 || width === 0 || height === 0) return;
    processor.setProcessing();

    try {
      const file = processor.files[0].file;
      const img = new Image();
      const url = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      const mimeType = file.type.startsWith('image/') ? file.type : 'image/png';
      const blob = await new Promise<Blob>((res, rej) => {
        canvas.toBlob(
          (b) => (b ? res(b) : rej(new Error('Resize failed'))),
          mimeType,
          0.92
        );
      });

      const baseName = file.name.replace(/\.[^.]+$/, '');
      const ext = file.name.split('.').pop() || 'png';

      processor.setSuccess({
        blob,
        fileName: `${baseName}-${width}x${height}.${ext}`,
        mimeType: blob.type,
        preview: URL.createObjectURL(blob),
        size: blob.size,
      });
    } catch (err) {
      processor.setError(err instanceof Error ? err.message : 'Resize failed.');
    }
  }, [processor, width, height]);

  return (
    <ConverterLayout
      title="Image Resizer"
      description="Resize images by exact dimensions with aspect ratio lock."
    >
      {processor.files.length === 0 ? (
        <DragDropUploader
          onFiles={handleFileAdd}
          accept="image/*"
          acceptLabel="PNG, JPG, WEBP, GIF, BMP"
        />
      ) : (
        <>
          <FilePreviewList files={processor.files} onRemove={(id) => { processor.removeFile(id); setWidth(0); setHeight(0); }} />

          {originalDimensions.w > 0 && (
            <p className="text-xs text-text-secondary">
              Original: {originalDimensions.w} × {originalDimensions.h} px
            </p>
          )}

          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <NumberInput label="Width" value={width} onChange={handleWidthChange} min={1} max={10000} suffix="px" id="resize-width" />
              </div>
              <button
                onClick={() => setLockAspect(!lockAspect)}
                className="p-2.5 rounded-lg border border-border hover:border-primary/50 transition-colors mb-0.5 cursor-pointer"
                aria-label={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
              >
                {lockAspect ? <Lock size={16} className="text-primary" /> : <Unlock size={16} className="text-text-secondary" />}
              </button>
              <div className="flex-1">
                <NumberInput label="Height" value={height} onChange={handleHeightChange} min={1} max={10000} suffix="px" id="resize-height" />
              </div>
            </div>
          </div>

          <ProgressIndicator state={processor.state} error={processor.error} />

          {processor.state === 'success' && processor.result ? (
            <DownloadCard result={processor.result} onDownload={(name) => processor.download(name)} onReset={processor.reset} />
          ) : (
            processor.state !== 'processing' && (
              <button
                onClick={resize}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer"
              >
                Resize to {width} × {height}
              </button>
            )
          )}
        </>
      )}
    </ConverterLayout>
  );
}
