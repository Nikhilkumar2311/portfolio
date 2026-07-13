import { useState, useCallback, useRef, useEffect } from 'react';
import { ConverterLayout, DragDropUploader, ProgressIndicator, DownloadCard } from '..';
import { useFileProcessor } from '../../../hooks/useFileProcessor';
import { RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

type DragMode = 'none' | 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

const HANDLE_SIZE = 10;
const MIN_CROP = 20;

export default function ImageCropper() {
  const processor = useFileProcessor({ maxFiles: 1, acceptedTypes: ['image/*'] });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState('');
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 200 });
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [dragMode, setDragMode] = useState<DragMode>('none');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropStart, setCropStart] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });

  const handleFileAdd = useCallback((files: FileList | File[]) => {
    processor.addFiles(files);
    const file = Array.from(files)[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      const img = new Image();
      img.onload = () => {
        setNaturalSize({ w: img.width, h: img.height });
        const maxW = Math.min(600, window.innerWidth - 64);
        const scale = maxW / img.width;
        const dw = Math.round(img.width * scale);
        const dh = Math.round(img.height * scale);
        setDisplaySize({ w: dw, h: dh });
        // Default crop: 80% centered
        const cx = Math.round(dw * 0.1);
        const cy = Math.round(dh * 0.1);
        const cw = Math.round(dw * 0.8);
        const ch = Math.round(dh * 0.8);
        setCrop({ x: cx, y: cy, width: cw, height: ch });
      };
      img.src = url;
    }
  }, [processor]);

  // ── Draw crop overlay ────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !displaySize.w) return;
    canvas.width = displaySize.w;
    canvas.height = displaySize.h;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Semi-transparent overlay outside crop
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(crop.x, crop.y, crop.width, crop.height);

    // Rule-of-thirds grid
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 2; i++) {
      const gx = crop.x + (crop.width / 3) * i;
      const gy = crop.y + (crop.height / 3) * i;
      ctx.beginPath();
      ctx.moveTo(gx, crop.y);
      ctx.lineTo(gx, crop.y + crop.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(crop.x, gy);
      ctx.lineTo(crop.x + crop.width, gy);
      ctx.stroke();
    }

    // Crop border
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

    // Corner handles
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 2;
    const hs = HANDLE_SIZE;
    const corners: [number, number][] = [
      [crop.x, crop.y],                               // nw
      [crop.x + crop.width, crop.y],                   // ne
      [crop.x, crop.y + crop.height],                  // sw
      [crop.x + crop.width, crop.y + crop.height],     // se
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
      ctx.strokeRect(cx - hs / 2, cy - hs / 2, hs, hs);
    });

    // Edge midpoint handles
    const edges: [number, number][] = [
      [crop.x + crop.width / 2, crop.y],              // n
      [crop.x + crop.width / 2, crop.y + crop.height], // s
      [crop.x, crop.y + crop.height / 2],              // w
      [crop.x + crop.width, crop.y + crop.height / 2], // e
    ];
    edges.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, hs / 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }, [crop, displaySize]);

  // ── Hit detection: which handle is under the mouse? ──────
  const getHitZone = (mx: number, my: number): DragMode => {
    const { x, y, width, height } = crop;
    const r = HANDLE_SIZE;

    // Corner handles
    if (Math.abs(mx - x) < r && Math.abs(my - y) < r) return 'nw';
    if (Math.abs(mx - (x + width)) < r && Math.abs(my - y) < r) return 'ne';
    if (Math.abs(mx - x) < r && Math.abs(my - (y + height)) < r) return 'sw';
    if (Math.abs(mx - (x + width)) < r && Math.abs(my - (y + height)) < r) return 'se';

    // Edge midpoint handles
    if (Math.abs(mx - (x + width / 2)) < r && Math.abs(my - y) < r) return 'n';
    if (Math.abs(mx - (x + width / 2)) < r && Math.abs(my - (y + height)) < r) return 's';
    if (Math.abs(mx - x) < r && Math.abs(my - (y + height / 2)) < r) return 'w';
    if (Math.abs(mx - (x + width)) < r && Math.abs(my - (y + height / 2)) < r) return 'e';

    // Inside crop area = move
    if (mx >= x && mx <= x + width && my >= y && my <= y + height) return 'move';

    return 'none';
  };

  const getCursorForZone = (zone: DragMode): string => {
    switch (zone) {
      case 'nw': case 'se': return 'nwse-resize';
      case 'ne': case 'sw': return 'nesw-resize';
      case 'n': case 's': return 'ns-resize';
      case 'e': case 'w': return 'ew-resize';
      case 'move': return 'move';
      default: return 'crosshair';
    }
  };

  // ── Mouse handlers ───────────────────────────────────────
  const getCanvasCoords = (e: React.MouseEvent): { mx: number; my: number } => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { mx: 0, my: 0 };
    return {
      mx: e.clientX - rect.left,
      my: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { mx, my } = getCanvasCoords(e);
    const zone = getHitZone(mx, my);
    if (zone === 'none') return;

    setDragMode(zone);
    setDragStart({ x: mx, y: my });
    setCropStart({ ...crop });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { mx, my } = getCanvasCoords(e);

    // Update cursor on hover
    if (dragMode === 'none') {
      const zone = getHitZone(mx, my);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = getCursorForZone(zone);
      }
      return;
    }

    const dx = mx - dragStart.x;
    const dy = my - dragStart.y;
    const { x: sx, y: sy, width: sw, height: sh } = cropStart;

    let newCrop = { ...crop };

    switch (dragMode) {
      case 'move': {
        newCrop.x = Math.max(0, Math.min(displaySize.w - sw, sx + dx));
        newCrop.y = Math.max(0, Math.min(displaySize.h - sh, sy + dy));
        newCrop.width = sw;
        newCrop.height = sh;
        break;
      }
      case 'se': {
        newCrop.width = Math.max(MIN_CROP, Math.min(displaySize.w - sx, sw + dx));
        newCrop.height = Math.max(MIN_CROP, Math.min(displaySize.h - sy, sh + dy));
        break;
      }
      case 'nw': {
        const newX = Math.max(0, Math.min(sx + sw - MIN_CROP, sx + dx));
        const newY = Math.max(0, Math.min(sy + sh - MIN_CROP, sy + dy));
        newCrop.width = sw + (sx - newX);
        newCrop.height = sh + (sy - newY);
        newCrop.x = newX;
        newCrop.y = newY;
        break;
      }
      case 'ne': {
        const newY = Math.max(0, Math.min(sy + sh - MIN_CROP, sy + dy));
        newCrop.width = Math.max(MIN_CROP, Math.min(displaySize.w - sx, sw + dx));
        newCrop.height = sh + (sy - newY);
        newCrop.y = newY;
        break;
      }
      case 'sw': {
        const newX = Math.max(0, Math.min(sx + sw - MIN_CROP, sx + dx));
        newCrop.width = sw + (sx - newX);
        newCrop.height = Math.max(MIN_CROP, Math.min(displaySize.h - sy, sh + dy));
        newCrop.x = newX;
        break;
      }
      case 'n': {
        const newY = Math.max(0, Math.min(sy + sh - MIN_CROP, sy + dy));
        newCrop.height = sh + (sy - newY);
        newCrop.y = newY;
        break;
      }
      case 's': {
        newCrop.height = Math.max(MIN_CROP, Math.min(displaySize.h - sy, sh + dy));
        break;
      }
      case 'w': {
        const newX = Math.max(0, Math.min(sx + sw - MIN_CROP, sx + dx));
        newCrop.width = sw + (sx - newX);
        newCrop.x = newX;
        break;
      }
      case 'e': {
        newCrop.width = Math.max(MIN_CROP, Math.min(displaySize.w - sx, sw + dx));
        break;
      }
    }

    setCrop(newCrop);
  };

  const handleMouseUp = () => setDragMode('none');

  // ── Aspect ratio presets ─────────────────────────────────
  const applyPreset = (ratio: number | null) => {
    if (ratio === null) return; // Free-form, do nothing
    const maxW = displaySize.w * 0.8;
    const maxH = displaySize.h * 0.8;
    let w: number, h: number;
    if (ratio >= 1) {
      w = Math.min(maxW, maxH * ratio);
      h = w / ratio;
    } else {
      h = Math.min(maxH, maxW / ratio);
      w = h * ratio;
    }
    setCrop({
      x: (displaySize.w - w) / 2,
      y: (displaySize.h - h) / 2,
      width: w,
      height: h,
    });
  };

  // ── Crop action ──────────────────────────────────────────
  const doCrop = useCallback(async () => {
    if (processor.files.length === 0) return;
    processor.setProcessing();

    try {
      const file = processor.files[0].file;
      const img = new Image();
      const url = URL.createObjectURL(file);

      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error('Failed to load'));
        img.src = url;
      });

      const scaleX = naturalSize.w / displaySize.w;
      const scaleY = naturalSize.h / displaySize.h;

      const sx = crop.x * scaleX;
      const sy = crop.y * scaleY;
      const sw = crop.width * scaleX;
      const sh = crop.height * scaleY;

      const canvas = document.createElement('canvas');
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext('2d')!;

      ctx.save();
      if (rotation || flipH || flipV) {
        ctx.translate(sw / 2, sh / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.translate(-sw / 2, -sh / 2);
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      ctx.restore();
      URL.revokeObjectURL(url);

      const mimeType = file.type.startsWith('image/') ? file.type : 'image/png';
      const blob = await new Promise<Blob>((res, rej) => {
        canvas.toBlob((b) => (b ? res(b) : rej(new Error('Crop failed'))), mimeType, 0.92);
      });

      const baseName = file.name.replace(/\.[^.]+$/, '');
      const ext = file.name.split('.').pop() || 'png';

      processor.setSuccess({
        blob,
        fileName: `${baseName}-cropped.${ext}`,
        mimeType: blob.type,
        preview: URL.createObjectURL(blob),
        size: blob.size,
      });
    } catch (err) {
      processor.setError(err instanceof Error ? err.message : 'Crop failed.');
    }
  }, [processor, crop, naturalSize, displaySize, rotation, flipH, flipV]);

  return (
    <ConverterLayout
      title="Image Cropper"
      description="Crop images with interactive selection, rotation, and flip support."
    >
      {processor.files.length === 0 ? (
        <DragDropUploader
          onFiles={handleFileAdd}
          accept="image/*"
          acceptLabel="PNG, JPG, WEBP, GIF, BMP"
        />
      ) : processor.state === 'success' && processor.result ? (
        <DownloadCard result={processor.result} onDownload={(name) => processor.download(name)} onReset={processor.reset} />
      ) : (
        <>
          {/* Transform controls & aspect presets */}
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setRotation((r) => (r + 90) % 360)} className="p-2 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer" aria-label="Rotate" title="Rotate 90°">
              <RotateCw size={18} className="text-text-secondary" />
            </button>
            <button onClick={() => setFlipH(!flipH)} className={`p-2 rounded-lg border transition-colors cursor-pointer ${flipH ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`} aria-label="Flip Horizontal" title="Flip Horizontal">
              <FlipHorizontal size={18} className={flipH ? 'text-primary' : 'text-text-secondary'} />
            </button>
            <button onClick={() => setFlipV(!flipV)} className={`p-2 rounded-lg border transition-colors cursor-pointer ${flipV ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`} aria-label="Flip Vertical" title="Flip Vertical">
              <FlipVertical size={18} className={flipV ? 'text-primary' : 'text-text-secondary'} />
            </button>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Aspect ratio presets */}
            {[
              { label: 'Free', ratio: null },
              { label: '1:1', ratio: 1 },
              { label: '16:9', ratio: 16 / 9 },
              { label: '4:3', ratio: 4 / 3 },
              { label: '3:2', ratio: 3 / 2 },
            ].map(({ label, ratio }) => (
              <button
                key={label}
                onClick={() => ratio !== null && applyPreset(ratio)}
                className="px-2.5 py-1 rounded-md text-xs font-medium border border-border text-text-secondary hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
                title={`Crop to ${label}`}
              >
                {label}
              </button>
            ))}

            <span className="text-xs text-text-secondary ml-auto">
              {Math.round(crop.width * (naturalSize.w / displaySize.w))} × {Math.round(crop.height * (naturalSize.h / displaySize.h))} px
            </span>
          </div>

          {/* Crop area */}
          <div className="flex justify-center">
            <div
              ref={containerRef}
              className="relative rounded-xl overflow-hidden border border-border select-none"
              style={{ width: Math.min(displaySize.w, 700), maxWidth: '100%' }}
            >
              <img
                src={imageSrc}
                alt="Source"
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: `${displaySize.w} / ${displaySize.h}`,
                  transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                }}
                className="block"
                draggable={false}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
          </div>

          <ProgressIndicator state={processor.state} error={processor.error} />

          {processor.state !== 'processing' && (
            <button
              onClick={doCrop}
              className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 cursor-pointer"
            >
              Crop Image
            </button>
          )}
        </>
      )}
    </ConverterLayout>
  );
}
