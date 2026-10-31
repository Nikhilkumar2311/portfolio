import { compileMermaid, FlowchartParser, FlowchartGenerator } from '../src/lib/mermaid';
import { diagram } from '../node_modules/mermaid/dist/chunks/mermaid.esm/flowDiagram-3HAHYXQ6.mjs';

function verifyWithNativeMermaid(canonicalCode: string): void {
  (diagram.parser.parser as any).yy = diagram.db;
  (diagram.parser.parser as any).yy.sanitizeText = (t: string) => t;
  diagram.db.clear();
  if ((diagram.parser.parser as any).lexer) {
    (diagram.parser.parser as any).lexer.conditionStack = ['INITIAL'];
  }
  diagram.parser.parse(canonicalCode);
}

let passedCount = 0;
let totalCount = 0;

function runTest(name: string, fn: () => void) {
  totalCount++;
  try {
    fn();
    console.log(`[PASS] Test ${totalCount}: ${name}`);
    passedCount++;
  } catch (err: any) {
    console.error(`[FAIL] Test ${totalCount}: ${name}`);
    console.error(err.stack || err.message || err);
    process.exitCode = 1;
  }
}

console.log('====================================================');
console.log('   Mermaid Flowchart Compiler Test Suite');
console.log('====================================================\n');

// 1. The exact diagram provided in the user request
runTest('Exact diagram from user request', () => {
  const chart = `flowchart TB
    subgraph Browser/Client
      U[User Uploads Lottie JSON or .lottie] --> PV[Lottie Previewer Canvas]
      PV --> J[JavaScript Renderer (Lottie Web)]
      Edit[Lottie Editor UI (Colors/Timeline/JSON)] --> J
      Assets[Asset Manager UI] --> Parser[JSON Parser]
      Parser --> |Remove/Add images| J
      IMG[Image Compressor (Canvas/WASM)] -.-> Parser
      Export[Client-side Export (JSON, GIF)] -.-> J
    end

    subgraph Server/Backend
      Analytics[(Usage Tracking)]
      API[API / Paid Tasks]
    end

    U --> Analytics
    U --> API
    PV -.-> Analytics`;

  const result = compileMermaid(chart);
  if (!result.isValid || !result.ast) {
    throw new Error(`Compilation failed: ${result.error?.message}`);
  }

  // Check AST structure
  if (result.ast.statements.length !== 5) {
    throw new Error(`Expected 5 top-level statements, got ${result.ast.statements.length}`);
  }

  // Verify native Mermaid acceptance
  verifyWithNativeMermaid(result.code);
});

// 2. Subgraph names containing special characters
runTest('Subgraph names containing special characters', () => {
  const chart = `flowchart TB
    subgraph Browser/Client
      A --> B
    end
    subgraph Edge-Gateway [API Gateway (v2.0)]
      B --> C
    end
    subgraph "Cluster: US-East / Production"
      C --> D
    end`;

  const result = compileMermaid(chart);
  if (!result.isValid) throw new Error(result.error?.message);
  verifyWithNativeMermaid(result.code);
});

// 3. Node labels containing parentheses
runTest('Node labels containing parentheses', () => {
  const chart = `flowchart TD
    A[JavaScript Renderer (Lottie Web)]
    B(Round with (nested) info)
    C([Stadium (with notes)])
    D{"Decision (Yes / No)?"}
    A --> B --> C --> D`;

  const result = compileMermaid(chart);
  if (!result.isValid) throw new Error(result.error?.message);
  verifyWithNativeMermaid(result.code);
});

// 4. Node labels with slashes and commas
runTest('Node labels with slashes and commas', () => {
  const chart = `flowchart LR
    A[API / Paid Tasks]
    B[Client-side Export (JSON, GIF)]
    C[Canvas/WASM, WebGL & SIMD]
    A --> B --> C`;

  const result = compileMermaid(chart);
  if (!result.isValid) throw new Error(result.error?.message);
  verifyWithNativeMermaid(result.code);
});

// 5. Different node shapes
runTest('Different node shapes (14 distinct shapes)', () => {
  const chart = `flowchart TB
    sq[Rectangle]
    rd(Rounded)
    st([Stadium])
    sub[[Subroutine]]
    cyl[(Database / Cylinder)]
    circ((Circle))
    dc(((Double Circle)))
    dia{Diamond}
    hex{{Hexagon}}
    para[/Parallelogram/]
    ipara[\\Inv Parallelogram\\]
    trap[/Trapezoid\\]
    itrap[\\Inv Trapezoid/]
    asym>Asymmetric Flag]
    sq --> rd --> st --> sub --> cyl --> circ --> dc --> dia --> hex --> para --> ipara --> trap --> itrap --> asym`;

  const result = compileMermaid(chart);
  if (!result.isValid) throw new Error(result.error?.message);
  verifyWithNativeMermaid(result.code);
});

// 6. Different arrow types
runTest('Different arrow types', () => {
  const chart = `flowchart LR
    A --> B
    B --- C
    C -.-> D
    D -.- E
    E ==> F
    F === G
    G --o H
    H o--o I
    I --x J
    J x--x K
    K <--> L
    L <==> M`;

  const result = compileMermaid(chart);
  if (!result.isValid) throw new Error(result.error?.message);
  verifyWithNativeMermaid(result.code);
});

// 7. Edge labels (pipe labels & infix labels)
runTest('Edge labels (pipe labels & infix labels)', () => {
  const chart = `flowchart TD
    A --> |"Pipe with (parens, /slashes/)"| B
    B --> |Simple label| C
    C -- "Infix label" --> D
    D -. "Dotted label" .-> E
    E == "Thick label" ==> F`;

  const result = compileMermaid(chart);
  if (!result.isValid) throw new Error(result.error?.message);
  verifyWithNativeMermaid(result.code);
});

// 8. Nested subgraphs
runTest('Nested subgraphs with directions', () => {
  const chart = `flowchart TB
    subgraph Cloud [Cloud Infrastructure]
      direction TB
      subgraph VPC [Internal VPC]
        direction LR
        App[Application] --> DB[(Database)]
      end
      Gateway[API Gateway] --> App
    end`;

  const result = compileMermaid(chart);
  if (!result.isValid) throw new Error(result.error?.message);
  verifyWithNativeMermaid(result.code);
});

// 9. Multiline and complex diagrams with cross-subgraph connections and styling
runTest('Multiline and complex diagrams', () => {
  const chart = `flowchart TD
    %% Architecture diagram
    subgraph Frontend [Frontend SPA]
      UI[React UI] --> ClientCache[Local Storage]
    end

    subgraph Backend [Backend API]
      API[FastAPI Gateway]
      Worker[Async Celery Worker]
    end

    subgraph Storage [Persistent Storage]
      Postgres[(PostgreSQL)]
      Redis[(Redis Cache)]
    end

    UI --> API
    API --> Redis
    API --> Worker
    Worker --> Postgres
    ClientCache -.-> Redis

    style UI fill:#61dafb,stroke:#20232a
    style Postgres fill:#336791,stroke:#fff
    classDef default font-family:sans-serif`;

  const result = compileMermaid(chart);
  if (!result.isValid) throw new Error(result.error?.message);
  verifyWithNativeMermaid(result.code);
});

// 10. Invalid Mermaid syntax to verify error reporting
runTest('Invalid Mermaid syntax error reporting', () => {
  // Sub-test 10.1: Unclosed bracket
  const unclosedBracket = `flowchart TB
    A --> B[Unclosed Label
    B --> C`;
  const res1 = compileMermaid(unclosedBracket);
  if (res1.isValid) throw new Error('Expected unclosed bracket to fail compilation');
  if (res1.error?.line !== 2) throw new Error(`Expected error on line 2, got ${res1.error?.line}`);
  if (!res1.error?.snippet || !res1.error?.suggestion) {
    throw new Error('Expected error snippet and suggestion to be present');
  }

  // Sub-test 10.2: Unclosed subgraph
  const unclosedSubgraph = `flowchart TB
    subgraph MyCluster
      A --> B`;
  const res2 = compileMermaid(unclosedSubgraph);
  if (res2.isValid) throw new Error('Expected unclosed subgraph to fail compilation');
  if (!res2.error?.message.includes('Unclosed subgraph')) {
    throw new Error(`Unexpected message: ${res2.error?.message}`);
  }

  // Sub-test 10.3: Missing target node
  const missingTarget = `flowchart TB
    A --> `;
  const res3 = compileMermaid(missingTarget);
  if (res3.isValid) throw new Error('Expected missing target node to fail compilation');
  if (!res3.error?.message.includes('target node')) {
    throw new Error(`Unexpected message: ${res3.error?.message}`);
  }

  // Sub-test 10.4: Illegal character in identifier
  const illegalChar = `flowchart TB
    A@#$ --> B`;
  const res4 = compileMermaid(illegalChar);
  if (res4.isValid) throw new Error('Expected illegal character to fail compilation');
  if (!res4.error?.message.includes('Unexpected character')) {
    throw new Error(`Unexpected message: ${res4.error?.message}`);
  }
});

console.log('\n====================================================');
console.log(`Results: ${passedCount}/${totalCount} tests passed!`);
console.log('====================================================\n');

