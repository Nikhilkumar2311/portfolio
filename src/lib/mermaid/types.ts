/**
 * AST and Compiler Types for Mermaid Flowchart Compatibility Engine
 */

export type NodeShape =
  | 'rect'             // [text]
  | 'round'            // (text)
  | 'stadium'          // ([text])
  | 'subroutine'       // [[text]]
  | 'cylinder'         // [(text)]
  | 'circle'           // ((text))
  | 'double_circle'    // (((text)))
  | 'diamond'          // {text}
  | 'hexagon'          // {{text}}
  | 'parallelogram'    // [/text/]
  | 'inv_parallelogram'// [\text\]
  | 'trapezoid'        // [/text\]
  | 'inv_trapezoid'    // [\text/]
  | 'asymmetric';      // >text]

export type EdgeStyle =
  | 'arrow'            // -->
  | 'open'             // ---
  | 'dotted_arrow'     // -.->
  | 'dotted_open'      // -.-
  | 'thick_arrow'      // ==>
  | 'thick_open'       // ===
  | 'circle_arrow'     // o--> or --o
  | 'circle_bidirectional' // o--o
  | 'cross_arrow'      // x--> or --x
  | 'cross_bidirectional'  // x--x
  | 'bidirectional';   // <--> or <==> or <-.->

export interface SourceLocation {
  line: number;
  column: number;
  offset: number;
}

export interface NodeDefAST {
  kind: 'node';
  id: string;
  shape: NodeShape;
  label: string;
  hasExplicitShape: boolean;
  isQuoted: boolean;
  loc: SourceLocation;
}

export interface NodeGroupAST {
  kind: 'node_group';
  nodes: NodeDefAST[];
  loc: SourceLocation;
}

export interface ArrowAST {
  type: EdgeStyle;
  raw: string;
  label?: string;
  length?: number;
  loc: SourceLocation;
}

export interface EdgeChainSegment {
  nodes: NodeDefAST[];
  arrow?: ArrowAST;
}

export interface EdgeChainAST {
  kind: 'edge_chain';
  chain: EdgeChainSegment[];
  loc: SourceLocation;
}

export interface SubgraphAST {
  kind: 'subgraph';
  id: string;
  title: string;
  direction?: string;
  statements: FlowchartStatement[];
  loc: SourceLocation;
}

export interface DirectionStatementAST {
  kind: 'direction';
  direction: string;
  loc: SourceLocation;
}

export interface SpecialStatementAST {
  kind: 'special';
  keyword: string;
  raw: string;
  loc: SourceLocation;
}

export type FlowchartStatement =
  | NodeDefAST
  | NodeGroupAST
  | EdgeChainAST
  | SubgraphAST
  | DirectionStatementAST
  | SpecialStatementAST;

export interface FlowchartAST {
  type: 'flowchart' | 'graph';
  direction: string;
  statements: FlowchartStatement[];
  isPassThrough?: boolean;
  diagramType?: string;
  source?: string;
}

export interface DiagnosticError {
  line: number;
  column: number;
  message: string;
  unexpected?: string;
  expected?: string;
  snippet?: string;
  suggestion?: string;
}

export interface CompileResult {
  isValid: boolean;
  code: string;
  ast?: FlowchartAST;
  error?: DiagnosticError;
  warnings?: string[];
  isPassThrough?: boolean;
}

