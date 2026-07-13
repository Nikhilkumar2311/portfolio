import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileUp } from 'lucide-react';
import { useClipboardPaste } from '../../hooks/useClipboardPaste';

interface DragDropUploaderProps {
  onFiles: (files: FileList | File[]) => void;
  accept?: string;
  multiple?: boolean;
  acceptLabel?: string;
  maxSizeMB?: number;
}

export function DragDropUploader({
  onFiles,
  accept,
  multiple = false,
  acceptLabel,
  maxSizeMB = 100,
}: DragDropUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        onFiles(e.dataTransfer.files);
      }
    },
    [onFiles]
  );

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(e.target.files);
      e.target.value = '';
    }
  };

  // Clipboard paste support
  useClipboardPaste((files) => onFiles(files));

  return (
    <div
      role="button"
      tabIndex={0}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`
        relative flex flex-col items-center justify-center gap-3
        p-8 md:p-12 rounded-2xl cursor-pointer
        border-2 border-dashed transition-all duration-300
        ${isDragging
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-border hover:border-primary/50 hover:bg-surface/80'
        }
      `}
      aria-label="Upload files"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={isDragging ? 'drag' : 'idle'}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          <div className={`p-3 rounded-xl ${isDragging ? 'bg-primary/20' : 'bg-primary/10'}`}>
            {isDragging ? (
              <FileUp size={28} className="text-primary" />
            ) : (
              <Upload size={28} className="text-primary" />
            )}
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-text-primary">
              {isDragging ? 'Drop your files here' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              or <span className="text-primary font-medium">click to browse</span>
              {' · '}paste from clipboard
            </p>
          </div>

          {acceptLabel && (
            <p className="text-xs text-text-secondary mt-1">
              Supported: {acceptLabel} · Max {maxSizeMB}MB
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
