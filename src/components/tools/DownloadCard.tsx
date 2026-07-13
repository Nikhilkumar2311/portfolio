import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, FileText, Image as ImageIcon, File, Pencil } from 'lucide-react';
import type { ConversionResult } from '../../types/toolTypes';

interface DownloadCardProps {
  result: ConversionResult;
  onDownload: (customName?: string) => void;
  onReset: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getResultIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.includes('pdf') || mimeType.includes('text') || mimeType.includes('document')) return FileText;
  return File;
}

function splitFileName(name: string): { base: string; ext: string } {
  const lastDot = name.lastIndexOf('.');
  if (lastDot <= 0) return { base: name, ext: '' };
  return { base: name.slice(0, lastDot), ext: name.slice(lastDot) };
}

export function DownloadCard({ result, onDownload, onReset }: DownloadCardProps) {
  const Icon = getResultIcon(result.mimeType);
  const { base, ext } = splitFileName(result.fileName);
  const [customName, setCustomName] = useState(base);
  const [isEditing, setIsEditing] = useState(false);

  const handleDownload = () => {
    const finalName = (customName.trim() || base) + ext;
    onDownload(finalName);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-border bg-surface"
    >
      <div className="flex items-start gap-4">
        {/* Preview */}
        {result.preview ? (
          <img
            src={result.preview}
            alt="Result preview"
            className="w-16 h-16 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon size={24} className="text-primary" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">
            {(customName.trim() || base) + ext}
          </p>
          <p className="text-xs text-text-secondary mt-0.5">
            {formatFileSize(result.size)} · {result.mimeType}
          </p>
        </div>
      </div>

      {/* Editable filename */}
      <div className="mt-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer mb-2"
        >
          <Pencil size={12} />
          {isEditing ? 'Done editing' : 'Rename file'}
        </button>
        {isEditing && (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder={base}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') { setIsEditing(false); } }}
            />
            <span className="text-sm text-text-secondary font-mono shrink-0">{ext}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer"
        >
          <Download size={16} />
          Download
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-text-primary text-sm font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
        >
          <RefreshCw size={16} />
          New
        </button>
      </div>
    </motion.div>
  );
}
