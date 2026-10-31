import { useState, useEffect, useRef, useCallback } from 'react';
import mermaid from 'mermaid';
import { ConverterLayout } from '..';
import { useTheme } from '../../../context/ThemeContext';
import {
  Copy,
  Check,
  RotateCw,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  FileCode,
  FileImage,
  Palette,
  Sparkles,
} from 'lucide-react';

interface DiagramSample {
  id: string;
  label: string;
  category: string;
  code: string;
}

const SAMPLES: DiagramSample[] = [
  {
    id: 'cache-flowchart',
    label: 'Cache Architecture (Flowchart)',
    category: 'Architecture',
    code: `flowchart TD
    Client[Client / Web App] -->|1. Request Data| API[API Gateway]
    API -->|2. Check Cache| Cache[(Redis Cache)]
    Cache -->|3a. Cache Hit| API
    Cache -.->|3b. Cache Miss| DB[(Primary Database)]
    DB -.->|4. Update Cache| Cache
    DB -.->|5. Return Data| API
    API -->|6. JSON Response| Client`,
  },
  {
    id: 'cache-sequence',
    label: 'Cache-Aside Flow (Sequence)',
    category: 'Architecture',
    code: `sequenceDiagram
    autonumber
    actor User
    participant App as Application Service
    participant Cache as Redis Cache
    participant DB as PostgreSQL DB

    User->>App: GET /products/101
    App->>Cache: Check Cached Product
    alt Cache Hit
        Cache-->>App: Return Product Data
    else Cache Miss
        Cache-->>App: (null)
        App->>DB: Query Product
        DB-->>App: Return Row
        App->>Cache: SETEX product:101 3600
    end
    App-->>User: 200 OK (Product Details)`,
  },
  {
    id: 'microservices',
    label: 'Microservices Pipeline',
    category: 'System Design',
    code: `flowchart LR
    subgraph Clients [Clients]
        Web[Web SPA]
        Mobile[Mobile App]
    end

    subgraph Edge [API Gateway]
        Gateway[Cloud Gateway]
    end

    subgraph Services [Microservices]
        Auth[Auth Service]
        Order[Order Service]
        Payment[Payment Service]
    end

    subgraph Data [Storage & Events]
        AuthDB[(Auth DB)]
        OrderDB[(Order DB)]
        Kafka[[Kafka Event Bus]]
    end

    Web --> Gateway
    Mobile --> Gateway
    Gateway --> Auth
    Gateway --> Order
    Gateway --> Payment

    Auth --> AuthDB
    Order --> OrderDB
    Order --> Kafka
    Payment --> Kafka`,
  },
  {
    id: 'order-state',
    label: 'Order Lifecycle (State Diagram)',
    category: 'State Machine',
    code: `stateDiagram-v2
    [*] --> Created: User places order
    Created --> PaymentPending: Checkout initiated
    PaymentPending --> Paid: Payment confirmed
    PaymentPending --> Cancelled: Payment failed
    Paid --> Processing: Warehouse preparing
    Processing --> Shipped: Handed to carrier
    Shipped --> Delivered: Customer received package
    Delivered --> [*]
    Cancelled --> [*]`,
  },
  {
    id: 'class-diagram',
    label: 'Domain Model (Class Diagram)',
    category: 'Software Design',
    code: `classDiagram
    class User {
      +String id
      +String email
      +String name
      +login()
      +logout()
    }
    class Order {
      +String orderId
      +Float totalAmount
      +OrderStatus status
      +addItem(Item item)
      +checkout()
    }
    class Item {
      +String id
      +String title
      +Float price
    }
    User "1" --> "*" Order : places
    Order "1" --> "*" Item : contains`,
  },
  {
    id: 'git-graph',
    label: 'Git Branching Strategy',
    category: 'DevOps',
    code: `gitGraph
    commit id: "v1.0.0"
    branch develop
    checkout develop
    commit id: "feat: auth"
    commit id: "feat: cache"
    checkout main
    merge develop id: "release: v1.1.0"
    branch hotfix
    commit id: "fix: timeout"
    checkout main
    merge hotfix id: "v1.1.1"`,
  },
];

type ThemeOption = 'auto' | 'dark' | 'default' | 'neutral' | 'forest';

export default function MermaidRenderer() {
  const { theme } = useTheme();
  const [code, setCode] = useState<string>(SAMPLES[0].code);
  const [selectedSample, setSelectedSample] = useState<string>(SAMPLES[0].id);
  const [diagramTheme, setDiagramTheme] = useState<ThemeOption>('auto');
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);

  // Clipboard copy states
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const renderCounterRef = useRef<number>(0);

  // Render diagram logic
  const renderDiagram = useCallback(
    async (chartCode: string, themeMode: ThemeOption) => {
      const trimmed = chartCode.trim();
      if (!trimmed) {
        setSvgContent('');
        setError(null);
        setIsValid(null);
        setIsRendering(false);
        return;
      }

      setIsRendering(true);
      const isDark = themeMode === 'auto' ? theme === 'dark' : themeMode === 'dark';

      try {
        const config: Parameters<typeof mermaid.initialize>[0] = {
          startOnLoad: false,
          securityLevel: 'loose',
          fontFamily: 'inherit',
        };

        if (themeMode === 'forest' || themeMode === 'neutral') {
          config.theme = themeMode;
        } else {
          config.theme = isDark ? 'dark' : 'default';
          config.themeVariables = isDark
            ? {
                primaryColor: '#2d3748',
                primaryTextColor: '#f7fafc',
                primaryBorderColor: '#4a5568',
                lineColor: '#a0aec0',
                secondaryColor: '#4a5568',
                tertiaryColor: '#1a202c',
              }
            : {
                primaryColor: '#f7fafc',
                primaryTextColor: '#1a202c',
                primaryBorderColor: '#cbd5e0',
                lineColor: '#4a5568',
                secondaryColor: '#edf2f7',
                tertiaryColor: '#ffffff',
              };
        }

        mermaid.initialize(config);

        renderCounterRef.current += 1;
        const renderId = `mermaid-tool-${renderCounterRef.current}`;

        const { svg } = await mermaid.render(renderId, trimmed);
        setSvgContent(svg);
        setError(null);
        setIsValid(true);
      } catch (err: unknown) {
        setIsValid(false);
        const rawMessage = err instanceof Error ? err.message : String(err);
        // Clean up common verbose mermaid error prefixes if needed
        const cleanMessage = rawMessage.replace(/Error: /g, '').trim();
        setError(cleanMessage || 'Syntax error in Mermaid diagram');
      } finally {
        setIsRendering(false);
        // Clean up any stray error / temp divs created by Mermaid in document.body
        const leakedElements = document.querySelectorAll(`[id*="mermaid-tool-"]`);
        leakedElements.forEach((el) => {
          if (el.parentElement === document.body) {
            el.remove();
          }
        });
      }
    },
    [theme]
  );

  // Debounced live rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      renderDiagram(code, diagramTheme);
    }, 250);

    return () => clearTimeout(timer);
  }, [code, diagramTheme, renderDiagram]);

  // Handle sample selection
  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLES.find((s) => s.id === sampleId);
    if (sample) {
      setSelectedSample(sample.id);
      setCode(sample.code);
      setZoom(1);
    }
  };

  // Reset to active sample
  const handleResetSample = () => {
    const sample = SAMPLES.find((s) => s.id === selectedSample) || SAMPLES[0];
    setCode(sample.code);
    setZoom(1);
  };

  // Clear editor
  const handleClear = () => {
    setCode('');
    setSvgContent('');
    setError(null);
    setIsValid(null);
  };

  // Copy Mermaid code
  const handleCopyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy SVG content
  const handleCopySvg = async () => {
    if (!svgContent) return;
    await navigator.clipboard.writeText(svgContent);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  // Download SVG file
  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mermaid-diagram-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download PNG file
  const handleDownloadPng = () => {
    if (!svgContent) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    if (!svgElement) return;

    const viewBox = svgElement.viewBox?.baseVal;
    let width = viewBox && viewBox.width > 0 ? viewBox.width : svgElement.clientWidth || 800;
    let height = viewBox && viewBox.height > 0 ? viewBox.height : svgElement.clientHeight || 600;

    if (!width || width <= 0) width = 800;
    if (!height || height <= 0) height = 600;

    const scale = 2; // High-resolution 2x canvas
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = diagramTheme === 'auto' ? theme === 'dark' : diagramTheme === 'dark';
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      // Background fill so transparent text remains readable
      ctx.fillStyle = isDark ? '#1a202c' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `mermaid-diagram-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
      }, 'image/png');
    };

    img.src = url;
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(2.5, +(prev + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.5, +(prev - 0.25).toFixed(2)));
  const handleResetZoom = () => setZoom(1);

  const lineCount = code ? code.split('\n').length : 0;
  const charCount = code.length;

  return (
    <ConverterLayout
      title="Mermaid Diagram Renderer"
      description="Write or paste Mermaid syntax to visualize, customize, and export architectural and technical diagrams in real-time."
      wide
    >
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-surface border border-border">
        {/* Sample selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-primary" /> Template:
          </span>
          <select
            value={selectedSample}
            onChange={(e) => handleSelectSample(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-background border border-border text-text-primary focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
          >
            {SAMPLES.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleResetSample}
            title="Reset code to current template"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
          >
            <RotateCw size={12} /> Reset
          </button>

          <button
            onClick={handleClear}
            title="Clear editor"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:border-red-400/50 hover:text-red-400 transition-colors cursor-pointer"
          >
            <Trash2 size={12} /> Clear
          </button>
        </div>

        {/* Theme and Export toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Theme selector */}
          <div className="flex items-center gap-1.5">
            <Palette size={14} className="text-text-secondary" />
            <select
              value={diagramTheme}
              onChange={(e) => setDiagramTheme(e.target.value as ThemeOption)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-background border border-border text-text-primary focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="auto">Theme: Auto (Site)</option>
              <option value="dark">Theme: Dark</option>
              <option value="default">Theme: Light</option>
              <option value="neutral">Theme: Neutral</option>
              <option value="forest">Theme: Forest</option>
            </select>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Export buttons */}
          <button
            onClick={handleDownloadSvg}
            disabled={!svgContent || !!error}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download size={13} /> SVG
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={!svgContent || !!error}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-background text-text-primary hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FileImage size={13} /> PNG
          </button>

          <button
            onClick={handleCopySvg}
            disabled={!svgContent || !!error}
            title="Copy SVG XML to clipboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-background text-text-primary hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {copiedSvg ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            {copiedSvg ? 'Copied SVG' : 'Copy SVG'}
          </button>
        </div>
      </div>

      {/* Editor and Preview Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Left Column: Code Editor */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <FileCode size={13} /> Mermaid Syntax
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-secondary">
                {lineCount} lines &bull; {charCount} chars
              </span>
              <button
                onClick={handleCopyCode}
                disabled={!code}
                className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
              >
                {copiedCode ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copiedCode ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            data-lenis-prevent
            spellCheck={false}
            placeholder={`graph TD\n    A[Start] --> B[Process]\n    B --> C[End]`}
            className="w-full px-4 py-3.5 rounded-xl bg-surface border border-border text-text-primary text-sm font-mono leading-relaxed focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-y"
            style={{ minHeight: '540px' }}
          />

          <div className="flex items-center justify-between text-[11px] text-text-secondary px-1">
            <span>Supports Flowcharts, Sequences, Class diagrams, State diagrams, Git graphs &amp; ER diagrams.</span>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-widest">
                Preview
              </span>
              {isRendering ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Rendering...
                </span>
              ) : isValid ? (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20">
                  <CheckCircle2 size={10} /> Valid Diagram
                </span>
              ) : error ? (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 border border-red-400/20">
                  <AlertCircle size={10} /> Syntax Error
                </span>
              ) : null}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                title="Zoom Out"
                className="p-1 rounded text-text-secondary hover:text-primary transition-colors disabled:opacity-40 cursor-pointer"
              >
                <ZoomOut size={14} />
              </button>
              <span className="text-[11px] font-mono text-text-secondary w-11 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 2.5}
                title="Zoom In"
                className="p-1 rounded text-text-secondary hover:text-primary transition-colors disabled:opacity-40 cursor-pointer"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={handleResetZoom}
                title="Reset Zoom (100%)"
                className="p-1 rounded text-text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* Diagram Preview Area */}
          <div
            ref={previewContainerRef}
            data-lenis-prevent
            className="w-full rounded-xl bg-surface border border-border overflow-auto flex flex-col items-center justify-start p-6 transition-colors"
            style={{ minHeight: '540px', maxHeight: '720px' }}
          >
            {error ? (
              <div className="w-full my-auto flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-400/10 text-red-400 flex items-center justify-center mb-3">
                  <AlertCircle size={24} />
                </div>
                <h4 className="text-sm font-semibold text-red-400 mb-1">Diagram Rendering Error</h4>
                <p className="text-xs text-text-secondary max-w-md font-mono bg-background/60 p-3 rounded-lg border border-border break-words text-left">
                  {error}
                </p>
                <p className="text-[11px] text-text-secondary mt-3">
                  Check your Mermaid syntax (missing arrows, unclosed brackets, or invalid keywords).
                </p>
              </div>
            ) : !code.trim() ? (
              <div className="w-full my-auto flex flex-col items-center justify-center p-8 text-center text-text-secondary">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Sparkles size={24} />
                </div>
                <h4 className="text-sm font-semibold text-text-primary mb-1">No Mermaid Code Provided</h4>
                <p className="text-xs max-w-sm mb-4">
                  Paste or write your Mermaid diagram syntax on the left, or choose a template above.
                </p>
                <button
                  onClick={handleResetSample}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm cursor-pointer"
                >
                  Load Sample Diagram
                </button>
              </div>
            ) : (
              <div
                className="w-full flex justify-center transition-transform duration-150"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            )}
          </div>
        </div>
      </div>
    </ConverterLayout>
  );
}

