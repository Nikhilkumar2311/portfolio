import type { LucideIcon } from 'lucide-react';

/** Processing states for tool operations */
export type ProcessingState = 'idle' | 'loading' | 'processing' | 'success' | 'error';

/** A file with optional preview URL */
export interface FileWithPreview {
  file: File;
  preview?: string;
  id: string;
}

/** Result of a conversion operation */
export interface ConversionResult {
  blob: Blob;
  fileName: string;
  mimeType: string;
  preview?: string;
  size: number;
}

/** Tool category identifiers */
export type ToolCategoryId = 'images' | 'documents' | 'spreadsheets' | 'utilities';

/** A tool category */
export interface ToolCategory {
  id: ToolCategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

/** A single tool definition */
export interface ToolDefinition {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategoryId;
  inputFormats?: string[];
  outputFormats?: string[];
  isDisabled?: boolean;
  disabledReason?: string;
  /** Dynamic import function for the tool component */
  component: () => Promise<{ default: React.ComponentType }>;
}
