import {
  Image, Minimize2, Maximize2, Crop, FileImage,
  Merge, Split, RotateCw, Layers, FileDown,
  FileText, FileSpreadsheet,
  QrCode, Braces, Binary, Fingerprint, Hash,
  Palette, Eye, Lock, Code,
  Link, Link2, Clock, FileOutput,
} from 'lucide-react';
import type { ToolCategory, ToolDefinition, ToolCategoryId } from '../types/toolTypes';

// ─── Categories ─────────────────────────────────────────────
export const toolCategories: ToolCategory[] = [
  {
    id: 'images',
    label: 'Images',
    description: 'Convert, compress, resize, and crop images',
    icon: Image,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
  },
  {
    id: 'documents',
    label: 'Documents',
    description: 'PDF manipulation, Word and Markdown conversions',
    icon: FileText,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/30',
  },
  {
    id: 'spreadsheets',
    label: 'Spreadsheets',
    description: 'Convert between CSV, XLSX, and JSON',
    icon: FileSpreadsheet,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30',
  },
  {
    id: 'utilities',
    label: 'Utilities',
    description: 'QR codes, encoding, hashing, formatting, and more',
    icon: Code,
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    borderColor: 'border-rose-400/30',
  },
];

// Helper to get category by id
export function getCategoryById(id: ToolCategoryId): ToolCategory | undefined {
  return toolCategories.find(c => c.id === id);
}

// ─── Tool Definitions ───────────────────────────────────────
export const tools: ToolDefinition[] = [
  // ── Images ──────────────────────────────────────────────
  {
    slug: 'image-converter',
    title: 'Image Converter',
    description: 'Convert images between PNG, JPG, WEBP, GIF, BMP, SVG, and ICO formats.',
    icon: FileImage,
    category: 'images',
    inputFormats: ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF', 'BMP', 'SVG'],
    outputFormats: ['PNG', 'JPG', 'WEBP', 'BMP', 'ICO'],
    component: () => import('../components/tools/converters/ImageConverter').then(m => ({ default: m.default })),
  },
  {
    slug: 'image-compressor',
    title: 'Image Compressor',
    description: 'Reduce image file size while preserving quality with adjustable compression.',
    icon: Minimize2,
    category: 'images',
    inputFormats: ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF', 'BMP'],
    component: () => import('../components/tools/converters/ImageCompressor').then(m => ({ default: m.default })),
  },
  {
    slug: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize images by exact dimensions or percentage with aspect ratio lock.',
    icon: Maximize2,
    category: 'images',
    inputFormats: ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF', 'BMP'],
    component: () => import('../components/tools/converters/ImageResizer').then(m => ({ default: m.default })),
  },
  {
    slug: 'image-cropper',
    title: 'Image Cropper',
    description: 'Crop images with interactive selection, rotation, and flip support.',
    icon: Crop,
    category: 'images',
    inputFormats: ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF', 'BMP'],
    component: () => import('../components/tools/converters/ImageCropper').then(m => ({ default: m.default })),
  },

  // ── Documents ───────────────────────────────────────────
  {
    slug: 'pdf-converter',
    title: 'PDF Converter',
    description: 'Convert images to PDF documents with customizable page layouts.',
    icon: FileImage,
    category: 'documents',
    inputFormats: ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF', 'BMP'],
    outputFormats: ['PDF'],
    component: () => import('../components/tools/converters/PdfConverter').then(m => ({ default: m.default })),
  },
  {
    slug: 'pdf-merger',
    title: 'PDF Merger',
    description: 'Merge multiple PDF files into a single document.',
    icon: Merge,
    category: 'documents',
    inputFormats: ['PDF'],
    component: () => import('../components/tools/converters/PdfMerger').then(m => ({ default: m.default })),
  },
  {
    slug: 'pdf-splitter',
    title: 'PDF Splitter',
    description: 'Split a PDF into separate files by page ranges.',
    icon: Split,
    category: 'documents',
    inputFormats: ['PDF'],
    component: () => import('../components/tools/converters/PdfSplitter').then(m => ({ default: m.default })),
  },
  {
    slug: 'pdf-rotator',
    title: 'PDF Rotator',
    description: 'Rotate individual pages or entire PDF documents.',
    icon: RotateCw,
    category: 'documents',
    inputFormats: ['PDF'],
    component: () => import('../components/tools/converters/PdfRotator').then(m => ({ default: m.default })),
  },
  {
    slug: 'pdf-page-manager',
    title: 'PDF Page Manager',
    description: 'Reorder, extract, or delete pages from PDF files.',
    icon: Layers,
    category: 'documents',
    inputFormats: ['PDF'],
    component: () => import('../components/tools/converters/PdfPageManager').then(m => ({ default: m.default })),
  },
  {
    slug: 'pdf-compressor',
    title: 'PDF Compressor',
    description: 'Optimize PDF file size by removing redundant data.',
    icon: FileDown,
    category: 'documents',
    inputFormats: ['PDF'],
    component: () => import('../components/tools/converters/PdfCompressor').then(m => ({ default: m.default })),
  },
  {
    slug: 'pdf-to-markdown',
    title: 'PDF to Markdown',
    description: 'Extract text from PDF files and convert to Markdown format.',
    icon: FileOutput,
    category: 'documents',
    inputFormats: ['PDF'],
    outputFormats: ['MD'],
    component: () => import('../components/tools/converters/PdfToMarkdown').then(m => ({ default: m.default })),
  },

  // ── Spreadsheets ────────────────────────────────────────
  {
    slug: 'excel-converter',
    title: 'Excel Converter',
    description: 'Convert between CSV, XLSX, and JSON. Preview spreadsheet data.',
    icon: FileSpreadsheet,
    category: 'spreadsheets',
    inputFormats: ['CSV', 'XLSX', 'XLS', 'JSON'],
    outputFormats: ['CSV', 'XLSX', 'JSON'],
    component: () => import('../components/tools/converters/ExcelConverter').then(m => ({ default: m.default })),
  },

  // ── Utilities ───────────────────────────────────────────
  {
    slug: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Generate QR codes from text, URLs, or any data with customizable options.',
    icon: QrCode,
    category: 'utilities',
    component: () => import('../components/tools/converters/QrGenerator').then(m => ({ default: m.default })),
  },
  {
    slug: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format, validate, and minify JSON. Convert between JSON and YAML.',
    icon: Braces,
    category: 'utilities',
    component: () => import('../components/tools/converters/JsonFormatter').then(m => ({ default: m.default })),
  },
  {
    slug: 'base64-tool',
    title: 'Base64 Encoder / Decoder',
    description: 'Encode text or files to Base64 and decode Base64 strings.',
    icon: Binary,
    category: 'utilities',
    component: () => import('../components/tools/converters/Base64Tool').then(m => ({ default: m.default })),
  },
  {
    slug: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate random UUIDs (v4) with bulk generation support.',
    icon: Fingerprint,
    category: 'utilities',
    component: () => import('../components/tools/converters/UuidGenerator').then(m => ({ default: m.default })),
  },
  {
    slug: 'hash-generator',
    title: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files.',
    icon: Hash,
    category: 'utilities',
    component: () => import('../components/tools/converters/HashGenerator').then(m => ({ default: m.default })),
  },
  {
    slug: 'color-tool',
    title: 'Color Picker & Palette',
    description: 'Pick colors, convert HEX/RGB/HSL, and generate harmonious palettes.',
    icon: Palette,
    category: 'utilities',
    component: () => import('../components/tools/converters/ColorTool').then(m => ({ default: m.default })),
  },
  {
    slug: 'url-shortener',
    title: 'URL Shortener',
    description: 'Shorten long URLs instantly using is.gd — no sign-up required.',
    icon: Link2,
    category: 'utilities',
    component: () => import('../components/tools/converters/UrlShortener').then(m => ({ default: m.default })),
  },
  {
    slug: 'markdown-preview',
    title: 'Markdown Preview',
    description: 'Write or paste Markdown and see a live rendered preview.',
    icon: Eye,
    category: 'utilities',
    component: () => import('../components/tools/converters/MarkdownPreview').then(m => ({ default: m.default })),
  },
  {
    slug: 'password-generator',
    title: 'Password Generator',
    description: 'Generate secure, random passwords with customizable rules.',
    icon: Lock,
    category: 'utilities',
    component: () => import('../components/tools/converters/PasswordGenerator').then(m => ({ default: m.default })),
  },
  {
    slug: 'url-encoder',
    title: 'URL Encoder / Decoder',
    description: 'Encode and decode URLs and query string parameters.',
    icon: Link,
    category: 'utilities',
    component: () => import('../components/tools/converters/UrlEncoder').then(m => ({ default: m.default })),
  },
  {
    slug: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates.',
    icon: Clock,
    category: 'utilities',
    component: () => import('../components/tools/converters/TimestampConverter').then(m => ({ default: m.default })),
  },
];

// ─── Helpers ────────────────────────────────────────────────

/** Get all tools for a given category */
export function getToolsByCategory(categoryId: ToolCategoryId): ToolDefinition[] {
  return tools.filter(t => t.category === categoryId);
}

/** Find a tool by its slug */
export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find(t => t.slug === slug);
}

/** Search tools by query string */
export function searchTools(query: string): ToolDefinition[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return tools;
  return tools.filter(
    t =>
      t.title.toLowerCase().includes(lower) ||
      t.description.toLowerCase().includes(lower) ||
      t.category.toLowerCase().includes(lower) ||
      t.inputFormats?.some(f => f.toLowerCase().includes(lower)) ||
      t.outputFormats?.some(f => f.toLowerCase().includes(lower))
  );
}
