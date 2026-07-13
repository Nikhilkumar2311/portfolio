import { useState, useCallback, useMemo } from 'react';
import { ConverterLayout, DragDropUploader, FilePreviewList, ProgressIndicator, DownloadCard } from '..';
import { useFileProcessor } from '../../../hooks/useFileProcessor';
import { ArrowRight } from 'lucide-react';

const OUTPUT_FORMATS = ['XLSX', 'CSV', 'JSON'];

function detectInputFormat(file: File): string {
  const ext = file.name.split('.').pop()?.toUpperCase();
  if (ext === 'XLSX' || ext === 'XLS') return 'XLSX';
  if (ext === 'CSV') return 'CSV';
  if (ext === 'JSON') return 'JSON';
  if (file.type === 'text/csv') return 'CSV';
  if (file.type === 'application/json') return 'JSON';
  return ext || 'XLSX';
}

export default function ExcelConverter() {
  const [outputFormat, setOutputFormat] = useState('XLSX');
  const [preview, setPreview] = useState<string[][] | null>(null);
  const processor = useFileProcessor({
    maxFiles: 1,
    acceptedTypes: [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/json',
    ],
  });

  const inputFormat = useMemo(() => {
    if (processor.files.length === 0) return '';
    return detectInputFormat(processor.files[0].file);
  }, [processor.files]);

  const availableOutputs = useMemo(() => {
    return OUTPUT_FORMATS.filter(f => f !== inputFormat);
  }, [inputFormat]);

  const handleFileAdd = useCallback(async (files: FileList | File[]) => {
    processor.addFiles(files);
    const file = Array.from(files)[0];
    if (file) {
      // Auto-select first available output
      const fmt = detectInputFormat(file);
      const defaultOut = OUTPUT_FORMATS.find(f => f !== fmt);
      if (defaultOut) setOutputFormat(defaultOut);

      try {
        const XLSX = await import('xlsx');
        const data = await file.arrayBuffer();
        const wb = XLSX.read(data);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
        setPreview(rows.slice(0, 10));
      } catch { /* ignore */ }
    }
  }, [processor]);

  const convert = useCallback(async () => {
    if (processor.files.length === 0) return;
    processor.setProcessing();

    try {
      const XLSX = await import('xlsx');
      const file = processor.files[0].file;
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const baseName = file.name.replace(/\.[^.]+$/, '');

      let blob: Blob;
      let fileName: string;
      let mimeType: string;

      if (outputFormat === 'XLSX') {
        const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        blob = new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fileName = `${baseName}.xlsx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else if (outputFormat === 'CSV') {
        const ws = wb.Sheets[wb.SheetNames[0]];
        const csv = XLSX.utils.sheet_to_csv(ws);
        blob = new Blob([csv], { type: 'text/csv' });
        fileName = `${baseName}.csv`;
        mimeType = 'text/csv';
      } else {
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws);
        const jsonStr = JSON.stringify(json, null, 2);
        blob = new Blob([jsonStr], { type: 'application/json' });
        fileName = `${baseName}.json`;
        mimeType = 'application/json';
      }

      processor.setSuccess({ blob, fileName, mimeType, size: blob.size });
    } catch (err) {
      processor.setError(err instanceof Error ? err.message : 'Conversion failed.');
    }
  }, [processor, outputFormat]);

  return (
    <ConverterLayout title="Excel Converter" description="Convert between CSV, XLSX, and JSON. Preview spreadsheet data.">
      {processor.files.length === 0 ? (
        <DragDropUploader onFiles={handleFileAdd} accept=".csv,.xlsx,.xls,.json" acceptLabel="CSV, XLSX, XLS, JSON" />
      ) : (
        <>
          <FilePreviewList files={processor.files} onRemove={processor.removeFile} />

          {/* Data preview */}
          {preview && (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="p-2 bg-surface border-b border-border">
                <span className="text-xs font-medium text-text-secondary">Preview (first 10 rows)</span>
              </div>
              <div className="overflow-x-auto max-h-48">
                <table className="w-full text-xs">
                  <tbody>
                    {preview.map((row, ri) => (
                      <tr key={ri} className={ri === 0 ? 'bg-primary/5 font-medium' : 'border-t border-border'}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-1.5 text-text-primary whitespace-nowrap">
                            {String(cell ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Conversion Flow: FROM → TO */}
          <div className="p-5 rounded-2xl bg-surface border border-border">
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-medium text-text-secondary uppercase tracking-widest">From</span>
                <div className="px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <span className="text-sm font-bold text-primary">{inputFormat}</span>
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

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-medium text-text-secondary uppercase tracking-widest">Output Format</span>
              <div className="flex flex-wrap gap-2">
                {availableOutputs.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
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
          </div>

          <ProgressIndicator state={processor.state} error={processor.error} />

          {processor.state === 'success' && processor.result ? (
            <DownloadCard result={processor.result} onDownload={(name) => processor.download(name)} onReset={processor.reset} />
          ) : (
            processor.state !== 'processing' && (
              <button
                onClick={convert}
                className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer"
              >
                Convert {inputFormat} → {outputFormat}
              </button>
            )
          )}
        </>
      )}
    </ConverterLayout>
  );
}
