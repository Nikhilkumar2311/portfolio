import { motion } from 'framer-motion';
import { X, FileText, Image as ImageIcon, File } from 'lucide-react';
import type { FileWithPreview } from '../../types/toolTypes';

interface FilePreviewProps {
  file: FileWithPreview;
  onRemove: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return ImageIcon;
  if (type.includes('pdf') || type.includes('text') || type.includes('document')) return FileText;
  return File;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const Icon = getFileIcon(file.file.type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border group"
    >
      {/* Thumbnail or icon */}
      {file.preview ? (
        <img
          src={file.preview}
          alt={file.file.name}
          className="w-10 h-10 rounded-lg object-cover shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
      )}

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {file.file.name}
        </p>
        <p className="text-xs text-text-secondary">
          {formatFileSize(file.file.size)}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(file.id)}
        className="p-1.5 rounded-lg hover:bg-border transition-colors opacity-0 group-hover:opacity-100"
        aria-label={`Remove ${file.file.name}`}
      >
        <X size={14} className="text-text-secondary" />
      </button>
    </motion.div>
  );
}

interface FilePreviewListProps {
  files: FileWithPreview[];
  onRemove: (id: string) => void;
}

export function FilePreviewList({ files, onRemove }: FilePreviewListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <FilePreview key={file.id} file={file} onRemove={onRemove} />
      ))}
    </div>
  );
}
