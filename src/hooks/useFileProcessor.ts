import { useState, useCallback } from 'react';
import type { FileWithPreview, ConversionResult, ProcessingState } from '../types/toolTypes';

let fileIdCounter = 0;
function generateFileId(): string {
  return `file-${Date.now()}-${++fileIdCounter}`;
}

interface UseFileProcessorOptions {
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Accepted MIME types (e.g. ['image/png', 'image/jpeg']) */
  acceptedTypes?: string[];
}

interface UseFileProcessorReturn {
  files: FileWithPreview[];
  result: ConversionResult | null;
  results: ConversionResult[];
  state: ProcessingState;
  error: string | null;
  progress: number;
  addFiles: (newFiles: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  setProcessing: () => void;
  setSuccess: (result: ConversionResult) => void;
  setMultipleResults: (results: ConversionResult[]) => void;
  setError: (message: string) => void;
  setProgress: (value: number) => void;
  reset: () => void;
  download: (resOrName?: ConversionResult | string, customName?: string) => void;
}

export function useFileProcessor(options: UseFileProcessorOptions = {}): UseFileProcessorReturn {
  const { maxFiles = 20, maxFileSize = 100 * 1024 * 1024, acceptedTypes } = options;

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [state, setState] = useState<ProcessingState>('idle');
  const [error, setErrorState] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const validFiles: FileWithPreview[] = [];
      const errors: string[] = [];

      for (const file of fileArray) {
        if (files.length + validFiles.length >= maxFiles) {
          errors.push(`Maximum ${maxFiles} files allowed.`);
          break;
        }
        if (file.size > maxFileSize) {
          errors.push(`"${file.name}" exceeds the ${(maxFileSize / (1024 * 1024)).toFixed(0)}MB limit.`);
          continue;
        }
        if (acceptedTypes && acceptedTypes.length > 0) {
          const isAccepted = acceptedTypes.some(type => {
            if (type.endsWith('/*')) {
              return file.type.startsWith(type.replace('/*', '/'));
            }
            return file.type === type;
          });
          if (!isAccepted) {
            errors.push(`"${file.name}" is not a supported file type.`);
            continue;
          }
        }

        const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
        validFiles.push({ file, preview, id: generateFileId() });
      }

      if (errors.length > 0) {
        setErrorState(errors[0]);
      }

      if (validFiles.length > 0) {
        setFiles(prev => [...prev, ...validFiles]);
        setState('idle');
        setResult(null);
        setResults([]);
        setErrorState(errors.length > 0 ? errors[0] : null);
      }
    },
    [files.length, maxFiles, maxFileSize, acceptedTypes]
  );

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
    setResult(null);
    setResults([]);
    setState('idle');
    setErrorState(null);
    setProgress(0);
  }, [files]);

  const setProcessing = useCallback(() => {
    setState('processing');
    setErrorState(null);
    setProgress(0);
  }, []);

  const setSuccess = useCallback((res: ConversionResult) => {
    setState('success');
    setResult(res);
    setProgress(100);
  }, []);

  const setMultipleResults = useCallback((res: ConversionResult[]) => {
    setState('success');
    setResults(res);
    setProgress(100);
  }, []);

  const setError = useCallback((message: string) => {
    setState('error');
    setErrorState(message);
  }, []);

  const reset = useCallback(() => {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    if (result?.preview) URL.revokeObjectURL(result.preview);
    results.forEach(r => {
      if (r.preview) URL.revokeObjectURL(r.preview);
    });
    setFiles([]);
    setResult(null);
    setResults([]);
    setState('idle');
    setErrorState(null);
    setProgress(0);
  }, [files, result, results]);

  const download = useCallback((resOrName?: ConversionResult | string, customName?: string) => {
    let target: ConversionResult | null = null;
    let fileName: string | undefined;

    if (typeof resOrName === 'string') {
      // Called as download('custom-name.pdf') from DownloadCard
      target = result;
      fileName = resOrName;
    } else {
      target = resOrName || result;
      fileName = customName;
    }

    if (!target) return;

    const url = URL.createObjectURL(target.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || target.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result]);

  return {
    files,
    result,
    results,
    state,
    error,
    progress,
    addFiles,
    removeFile,
    clearFiles,
    setProcessing,
    setSuccess,
    setMultipleResults,
    setError,
    setProgress,
    reset,
    download,
  };
}
