import { useState, useCallback, useMemo } from 'react';
import { ConverterLayout, DragDropUploader, FilePreviewList, QualitySlider, ProgressIndicator, DownloadCard } from '..';
import { useFileProcessor } from '../../../hooks/useFileProcessor';
import { ArrowRight, Download, Package } from 'lucide-react';

const INPUT_FORMATS = ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF', 'BMP', 'SVG'];
const OUTPUT_FORMATS = ['PNG', 'JPG', 'WEBP', 'BMP', 'ICO'];

const MIME_MAP: Record<string, string> = {
  PNG: 'image/png',
  JPG: 'image/jpeg',
  JPEG: 'image/jpeg',
  WEBP: 'image/webp',
  BMP: 'image/bmp',
  ICO: 'image/x-icon',
};

function detectFormat(file: File): string {
  const ext = file.name.split('.').pop()?.toUpperCase();
  if (ext && INPUT_FORMATS.includes(ext)) return ext;
  if (file.type === 'image/png') return 'PNG';
  if (file.type === 'image/jpeg') return 'JPG';
  if (file.type === 'image/webp') return 'WEBP';
  if (file.type === 'image/gif') return 'GIF';
  if (file.type === 'image/bmp') return 'BMP';
  if (file.type === 'image/svg+xml') return 'SVG';
  return ext || 'IMG';
}

export default function ImageConverter() {
  const [outputFormat, setOutputFormat] = useState('PNG');
  const [quality, setQuality] = useState(92);
  const processor = useFileProcessor({
    maxFiles: 50,
    acceptedTypes: ['image/*'],
  });

  // Batch results for multi-file mode
  const [batchResults, setBatchResults] = useState<{ name: string; blob: Blob; preview?: string }[]>([]);

  const isBatch = processor.files.length > 1;

  const inputFormat = useMemo(() => {
    if (processor.files.length === 0) return '';
    return detectFormat(processor.files[0].file);
  }, [processor.files]);

  const availableOutputs = useMemo(() => {
    if (isBatch) return OUTPUT_FORMATS; // Don't filter for batch — mixed inputs
    return OUTPUT_FORMATS.filter(f => {
      if (inputFormat === 'JPEG' && f === 'JPG') return false;
      if (inputFormat === 'JPG' && f === 'JPG') return false;
      if (inputFormat === f) return false;
      return true;
    });
  }, [inputFormat, isBatch]);

  const handleFileAdd = useCallback((files: FileList | File[]) => {
    processor.addFiles(files);
    setBatchResults([]);
    const file = Array.from(files)[0];
    if (file && processor.files.length === 0) {
      const fmt = detectFormat(file);
      const defaultOut = OUTPUT_FORMATS.find(f => f !== fmt && !(fmt === 'JPEG' && f === 'JPG'));
      if (defaultOut) setOutputFormat(defaultOut);
    }
  }, [processor]);

  const convertSingle = useCallback(async (file: File): Promise<{ name: string; blob: Blob; preview?: string }> => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load ${file.name}`));
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    const mimeType = MIME_MAP[outputFormat] || 'image/png';
    const qualityValue = ['JPG', 'JPEG', 'WEBP'].includes(outputFormat) ? quality / 100 : undefined;
    const ext = outputFormat.toLowerCase();
    const baseName = file.name.replace(/\.[^.]+$/, '');

    let blob: Blob;

    if (outputFormat === 'ICO') {
      const icoCanvas = document.createElement('canvas');
      icoCanvas.width = 32;
      icoCanvas.height = 32;
      icoCanvas.getContext('2d')!.drawImage(img, 0, 0, 32, 32);
      const pngBlob = await new Promise<Blob>((res, rej) => {
        icoCanvas.toBlob((b) => (b ? res(b) : rej(new Error('ICO failed'))), 'image/png');
      });
      const pngBuffer = await pngBlob.arrayBuffer();
      const icoBuffer = createIco(new Uint8Array(pngBuffer), 32, 32);
      blob = new Blob([icoBuffer], { type: 'image/x-icon' });
    } else {
      blob = await new Promise<Blob>((res, rej) => {
        canvas.toBlob(
          (b) => (b ? res(b) : rej(new Error('Conversion failed'))),
          mimeType,
          qualityValue
        );
      });
    }

    return {
      name: `${baseName}.${ext}`,
      blob,
      preview: blob.type.startsWith('image/') ? URL.createObjectURL(blob) : undefined,
    };
  }, [outputFormat, quality]);

  const convert = useCallback(async () => {
    if (processor.files.length === 0) return;
    processor.setProcessing();
    setBatchResults([]);

    try {
      if (isBatch) {
        // Batch mode
        const results: { name: string; blob: Blob; preview?: string }[] = [];
        for (let i = 0; i < processor.files.length; i++) {
          const res = await convertSingle(processor.files[i].file);
          results.push(res);
          processor.setProgress(Math.round(((i + 1) / processor.files.length) * 100));
        }
        setBatchResults(results);
        // Also set single result as ZIP for the DownloadCard
        const { default: JSZip } = await import('jszip');
        const zip = new JSZip();
        results.forEach(r => zip.file(r.name, r.blob));
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        processor.setSuccess({
          blob: zipBlob,
          fileName: `converted-images.zip`,
          mimeType: 'application/zip',
          size: zipBlob.size,
        });
      } else {
        // Single file mode
        const file = processor.files[0].file;
        const res = await convertSingle(file);
        processor.setSuccess({
          blob: res.blob,
          fileName: res.name,
          mimeType: res.blob.type,
          preview: res.preview,
          size: res.blob.size,
        });
      }
    } catch (err) {
      processor.setError(err instanceof Error ? err.message : 'Conversion failed.');
    }
  }, [processor, isBatch, convertSingle]);

  const downloadOne = (r: { name: string; blob: Blob }) => {
    const url = URL.createObjectURL(r.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = r.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ConverterLayout
      title="Image Converter"
      description="Convert images between PNG, JPG, WEBP, GIF, BMP, SVG, and ICO formats."
    >
      {processor.files.length === 0 ? (
        <DragDropUploader
          onFiles={handleFileAdd}
          accept="image/*"
          multiple
          acceptLabel={INPUT_FORMATS.join(', ')}
          maxSizeMB={50}
        />
      ) : (
        <>
          <FilePreviewList files={processor.files} onRemove={processor.removeFile} />

          {/* Add more files */}
          {processor.state !== 'success' && (
            <DragDropUploader
              onFiles={handleFileAdd}
              accept="image/*"
              multiple
              acceptLabel="Add more images"
              maxSizeMB={50}
            />
          )}

          {/* Conversion Flow: FROM → TO */}
          <div className="p-5 rounded-2xl bg-surface border border-border">
            {/* Visual format flow */}
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-medium text-text-secondary uppercase tracking-widest">From</span>
                <div className="px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <span className="text-sm font-bold text-primary">
                    {isBatch ? `${processor.files.length} files` : inputFormat}
                  </span>
                </div>
              </div>
              <ArrowRight size={20} className="text-text-secondary mt-5" />
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-medium text-text-secondary uppercase tracking-widest">To</span>
                <div className="px-5 py-2.5 rounded-xl bg-secondary/10 border border-secondary/20">
                  <span className="text-sm font-bold text-secondary">{outputFormat}</span>
                </div>
              </div>
            </div>

            {/* Output format chips */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-medium text-text-secondary uppercase tracking-widest">Output Format</span>
              <div className="flex flex-wrap gap-2">
                {availableOutputs.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
                      ${outputFormat === fmt
                        ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                        : 'bg-background border border-border text-text-secondary hover:border-primary/50 hover:text-primary'
                      }
                    `}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality slider for lossy formats */}
            {['JPG', 'WEBP'].includes(outputFormat) && (
              <div className="mt-4 pt-4 border-t border-border">
                <QualitySlider value={quality} onChange={setQuality} />
              </div>
            )}
          </div>

          <ProgressIndicator state={processor.state} progress={processor.progress} error={processor.error} />

          {processor.state === 'success' && processor.result ? (
            <>
              {/* Batch results: individual downloads */}
              {isBatch && batchResults.length > 0 && (
                <div className="p-4 rounded-2xl bg-surface border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                      {batchResults.length} files converted
                    </span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {batchResults.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-border group">
                        {r.preview && (
                          <img src={r.preview} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                        )}
                        <span className="text-sm text-text-primary flex-1 truncate">{r.name}</span>
                        <button
                          onClick={() => downloadOne(r)}
                          className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          title={`Download ${r.name}`}
                        >
                          <Download size={14} className="text-primary" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ZIP / single download */}
              <DownloadCard
                result={processor.result}
                onDownload={(name) => processor.download(name)}
                onReset={() => { processor.reset(); setBatchResults([]); }}
              />

              {isBatch && (
                <p className="text-xs text-text-secondary text-center">
                  <Package size={12} className="inline mr-1" />
                  Download all as ZIP, or hover individual files above for separate downloads.
                </p>
              )}
            </>
          ) : (
            processor.state !== 'processing' && (
              <button
                onClick={convert}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer"
              >
                {isBatch
                  ? `Convert ${processor.files.length} images to ${outputFormat}`
                  : `Convert ${inputFormat} → ${outputFormat}`
                }
              </button>
            )
          )}
        </>
      )}
    </ConverterLayout>
  );
}

function createIco(pngData: Uint8Array, width: number, height: number): ArrayBuffer {
  const iconDir = 6;
  const iconDirEntry = 16;
  const headerSize = iconDir + iconDirEntry;
  const totalSize = headerSize + pngData.length;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);
  view.setUint8(6, width >= 256 ? 0 : width);
  view.setUint8(7, height >= 256 ? 0 : height);
  view.setUint8(8, 0);
  view.setUint8(9, 0);
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, pngData.length, true);
  view.setUint32(18, headerSize, true);
  const arr = new Uint8Array(buffer);
  arr.set(pngData, headerSize);
  return buffer;
}
