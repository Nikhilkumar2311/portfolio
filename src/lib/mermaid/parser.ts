import type {
  FlowchartAST,
  FlowchartStatement,
  NodeDefAST,
  SubgraphAST,
  ArrowAST,
  SourceLocation,
  EdgeStyle,
} from './types';
import { MermaidParseError } from './errors';
import { SHAPE_DEFINITIONS } from './shapes';
import type { ShapeDefinition } from './shapes';

export class FlowchartParser {
  private source: string;
  private pos: number = 0;
  private line: number = 1;
  private col: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  private get loc(): SourceLocation {
    return { line: this.line, column: this.col, offset: this.pos };
  }

  private peek(offset: number = 0): string {
    return this.source[this.pos + offset] || '';
  }

  private isEOF(): boolean {
    return this.pos >= this.source.length;
  }

  private advance(): string {
    const ch = this.source[this.pos++];
    if (ch === '\n') {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }
    return ch;
  }

  private match(str: string): boolean {
    if (this.source.startsWith(str, this.pos)) {
      for (let i = 0; i < str.length; i++) {
        this.advance();
      }
      return true;
    }
    return false;
  }

  private skipWhitespace(inlineOnly: boolean = false): void {
    while (!this.isEOF()) {
      const ch = this.peek();
      if (ch === ' ' || ch === '\t' || ch === '\r') {
        this.advance();
      } else if (!inlineOnly && ch === '\n') {
        this.advance();
      } else {
        break;
      }
    }
  }

  private skipComment(): boolean {
    if (this.peek() === '%' && this.peek(1) === '%') {
      while (!this.isEOF() && this.peek() !== '\n') {
        this.advance();
      }
      return true;
    }
    return false;
  }

  public parse(): FlowchartAST {
    while (!this.isEOF()) {
      this.skipWhitespace();
      if (!this.skipComment()) break;
    }

    if (this.isEOF()) {
      return { type: 'flowchart', direction: 'TB', statements: [] };
    }

    let headerType: 'flowchart' | 'graph' = 'flowchart';
    if (this.match('flowchart')) {
      headerType = 'flowchart';
    } else if (this.match('graph')) {
      headerType = 'graph';
    } else {
      const firstWord = this.source.trim().split(/\s+/)[0];
      return {
        type: 'flowchart',
        direction: 'TB',
        statements: [],
        isPassThrough: true,
        diagramType: firstWord,
        source: this.source,
      };
    }

    this.skipWhitespace(true);
    let direction = 'TB';
    const dirMatch = /^(TB|TD|BT|RL|LR)\b/i.exec(this.source.substring(this.pos));
    if (dirMatch) {
      direction = dirMatch[1].toUpperCase();
      for (let i = 0; i < dirMatch[0].length; i++) {
        this.advance();
      }
    }

    const statements = this.parseStatements(false);

    return {
      type: headerType,
      direction,
      statements,
      source: this.source,
    };
  }

  private parseStatements(isSubgraph: boolean = false): FlowchartStatement[] {
    const statements: FlowchartStatement[] = [];

    while (!this.isEOF()) {
      this.skipWhitespace();
      if (this.isEOF()) break;
      if (this.skipComment()) continue;

      if (isSubgraph) {
        const remaining = this.source.substring(this.pos).trimStart();
        if (/^end\b/.test(remaining)) {
          this.skipWhitespace();
          this.match('end');
          return statements;
        }
      }

      const stmt = this.parseStatement();
      if (stmt) {
        statements.push(stmt);
      }
    }

    if (isSubgraph) {
      throw new MermaidParseError(
        'Unclosed subgraph: Missing matching "end"',
        this.loc,
        'EOF',
        'end',
        'Add "end" to close the subgraph.',
        this.source
      );
    }

    return statements;
  }

  private parseStatement(): FlowchartStatement | null {
    this.skipWhitespace(true);
    if (this.peek() === '\n') {
      this.advance();
      return null;
    }

    const startLoc = this.loc;
    const rest = this.source.substring(this.pos);

    // 1. Subgraph
    if (/^subgraph\b/.test(rest)) {
      return this.parseSubgraph();
    }

    // 2. Direction inside subgraph / diagram
    const dirStmtMatch = /^direction\s+(TB|TD|BT|RL|LR)\b/i.exec(rest);
    if (dirStmtMatch) {
      this.match(dirStmtMatch[0]);
      return { kind: 'direction', direction: dirStmtMatch[1].toUpperCase(), loc: startLoc };
    }

    // 3. Special styling/directive statements
    const styleMatch = /^(style|classDef|class|click|linkStyle|accTitle|accDescr)\b/.exec(rest);
    if (styleMatch) {
      return this.parseSpecialStatement(styleMatch[1]);
    }

    // 4. Node chain or single node
    return this.parseNodeOrChain();
  }

  private parseSubgraph(): SubgraphAST {
    const startLoc = this.loc;
    this.match('subgraph');
    this.skipWhitespace(true);

    let id = '';
    let title = '';

    if (this.peek() === '"' || this.peek() === "'") {
      const q = this.advance();
      while (!this.isEOF() && this.peek() !== q) {
        title += this.advance();
      }
      if (this.peek() === q) this.advance();
      id = title.replace(/[^\w]/g, '_');
    } else {
      while (!this.isEOF() && !/[\s\[]/.test(this.peek())) {
        id += this.advance();
      }
      this.skipWhitespace(true);
      if (this.peek() === '[') {
        this.advance();
        this.skipWhitespace(true);
        if (this.peek() === '"' || this.peek() === "'") {
          const q = this.advance();
          while (!this.isEOF() && this.peek() !== q) title += this.advance();
          if (this.peek() === q) this.advance();
        } else {
          while (!this.isEOF() && this.peek() !== ']' && this.peek() !== '\n') {
            title += this.advance();
          }
        }
        this.skipWhitespace(true);
        if (this.peek() === ']') {
          this.advance();
        } else {
          throw new MermaidParseError(
            'Unclosed subgraph title: Expected closing "]"',
            this.loc,
            this.peek(),
            ']',
            'Close subgraph title with "]".',
            this.source
          );
        }
      }
    }

    if (!title) {
      title = id;
    }

    const statements = this.parseStatements(true);

    return {
      kind: 'subgraph',
      id,
      title,
      statements,
      loc: startLoc,
    };
  }

  private parseSpecialStatement(keyword: string): FlowchartStatement {
    const startLoc = this.loc;
    let lineContent = '';
    while (!this.isEOF() && this.peek() !== '\n') {
      lineContent += this.advance();
    }
    return {
      kind: 'special',
      keyword,
      raw: lineContent.trim(),
      loc: startLoc,
    };
  }

  private parseNodeRef(): NodeDefAST | null {
    this.skipWhitespace(true);
    const startLoc = this.loc;

    let id = '';
    while (!this.isEOF()) {
      const ch = this.peek();
      if (
        ch === '[' ||
        ch === '(' ||
        ch === '{' ||
        ch === '>' ||
        ch === ' ' ||
        ch === '\t' ||
        ch === '\n' ||
        ch === '&' ||
        ch === '|' ||
        ch === '-' ||
        ch === '=' ||
        ch === '<' ||
        ch === ';'
      ) {
        break;
      }

      if (!/[\w\-\.]/.test(ch)) {
        throw new MermaidParseError(
          `Unexpected character '${ch}' in node identifier`,
          this.loc,
          ch,
          'Valid identifier character [A-Za-z0-9_.-]',
          'Node identifiers should contain only letters, numbers, hyphens, and underscores.',
          this.source
        );
      }

      id += this.advance();
    }

    if (!id) {
      return null;
    }

    this.skipWhitespace(true);
    let shapeInfo: {
      shape: NodeDefAST['shape'];
      label: string;
      isQuoted: boolean;
    } | null = null;

    for (const def of SHAPE_DEFINITIONS) {
      if (this.source.startsWith(def.open, this.pos)) {
        for (let i = 0; i < def.open.length; i++) {
          this.advance();
        }
        const { label, isQuoted, resolvedShape } = this.scanShapeLabel(def, startLoc);
        shapeInfo = {
          shape: resolvedShape,
          label,
          isQuoted,
        };
        break;
      }
    }

    return {
      kind: 'node',
      id,
      shape: shapeInfo?.shape || 'rect',
      label: shapeInfo ? shapeInfo.label : id,
      hasExplicitShape: !!shapeInfo,
      isQuoted: shapeInfo?.isQuoted || false,
      loc: startLoc,
    };
  }

  private parseNodeGroup(): NodeDefAST[] | null {
    const nodes: NodeDefAST[] = [];
    const firstNode = this.parseNodeRef();
    if (!firstNode) return null;
    nodes.push(firstNode);

    while (!this.isEOF()) {
      this.skipWhitespace(true);
      if (this.peek() === '&') {
        this.advance();
        this.skipWhitespace(true);
        const nextNode = this.parseNodeRef();
        if (!nextNode) {
          throw new MermaidParseError(
            'Expected node after "&"',
            this.loc,
            this.peek() || 'EOF',
            'Node Identifier',
            'Specify a node identifier after "&".',
            this.source
          );
        }
        nodes.push(nextNode);
      } else {
        break;
      }
    }

    return nodes;
  }

  private scanArrow(): ArrowAST | null {
    const startLoc = this.loc;

    // 1. Explicit bidirectional arrows
    if (this.source.startsWith('<==>', this.pos)) {
      this.match('<==>');
      return { type: 'thick_arrow', raw: '<==>', loc: startLoc };
    }
    if (this.source.startsWith('<-.->', this.pos)) {
      this.match('<-.->');
      return { type: 'dotted_arrow', raw: '<-.->', loc: startLoc };
    }
    if (this.source.startsWith('<-->', this.pos)) {
      this.match('<-->');
      return { type: 'bidirectional', raw: '<-->', loc: startLoc };
    }

    // 2. Dotted arrow `-.->` or dotted link `-.-` or infix `-. label .->`
    if (this.peek() === '-' && this.peek(1) === '.') {
      this.advance(); // -
      this.advance(); // .

      if (this.peek() === '-' && this.peek(1) === '>') {
        this.advance();
        this.advance();
        return { type: 'dotted_arrow', raw: '-.->', loc: startLoc };
      }
      if (this.peek() === '-') {
        this.advance();
        return { type: 'dotted_open', raw: '-.-', loc: startLoc };
      }

      // Check if remainder of current line actually contains `.->` or `.-` before consuming infix
      const lineEnd = this.source.indexOf('\n', this.pos);
      const lineRest = this.source.substring(this.pos, lineEnd === -1 ? undefined : lineEnd);
      const closeIdx = lineRest.search(/\.->|\.-/);
      if (closeIdx !== -1) {
        let label = '';
        for (let i = 0; i < closeIdx; i++) {
          label += this.advance();
        }
        if (this.source.startsWith('.->', this.pos)) {
          this.advance();
          this.advance();
          this.advance();
          return { type: 'dotted_arrow', raw: '-.->', label: label.trim(), loc: startLoc };
        }
        if (this.source.startsWith('.-', this.pos)) {
          this.advance();
          this.advance();
          return { type: 'dotted_open', raw: '-.-', label: label.trim(), loc: startLoc };
        }
      }
    }

    // 3. Thick arrow `==>`, `===`, or `== text ==>`
    if (this.peek() === '=' && this.peek(1) === '=') {
      let eqCount = 0;
      while (this.peek() === '=') {
        eqCount++;
        this.advance();
      }
      if (this.peek() === '>') {
        this.advance();
        return { type: 'thick_arrow', raw: '==>', length: eqCount, loc: startLoc };
      }

      // Check infix: only if remainder of line contains `==>` or `===`
      const lineEnd = this.source.indexOf('\n', this.pos);
      const lineRest = this.source.substring(this.pos, lineEnd === -1 ? undefined : lineEnd);
      const closeIdx = lineRest.search(/==>|===/);
      if (closeIdx !== -1 && this.peek() === ' ') {
        let label = '';
        for (let i = 0; i < closeIdx; i++) {
          label += this.advance();
        }
        if (this.source.startsWith('==>', this.pos)) {
          this.advance();
          this.advance();
          this.advance();
          return { type: 'thick_arrow', raw: '==>', label: label.trim(), loc: startLoc };
        }
        if (this.source.startsWith('===', this.pos)) {
          this.advance();
          this.advance();
          this.advance();
          return { type: 'thick_open', raw: '===', label: label.trim(), loc: startLoc };
        }
      }

      return { type: 'thick_open', raw: '===', length: eqCount, loc: startLoc };
    }

    // 4. Normal / circle / cross / bidirectional arrows
    let startMarker = '';
    if (this.peek() === 'o' && this.peek(1) === '-') {
      startMarker = 'o';
      this.advance();
    } else if (this.peek() === 'x' && this.peek(1) === '-') {
      startMarker = 'x';
      this.advance();
    } else if (this.peek() === '<' && (this.peek(1) === '-' || this.peek(1) === '=')) {
      startMarker = '<';
      this.advance();
    }

    if (this.peek() === '-') {
      let dashCount = 0;
      while (this.peek() === '-') {
        dashCount++;
        this.advance();
      }

      // Check infix `-- text -->`: only if remainder of line contains closing `--+>` or `--+`
      const lineEnd = this.source.indexOf('\n', this.pos);
      const lineRest = this.source.substring(this.pos, lineEnd === -1 ? undefined : lineEnd);
      const arrowMatch = /(--+>|--+)/.exec(lineRest);
      if (arrowMatch && (this.peek() === ' ' || this.peek() === '"')) {
        const arrowIdx = arrowMatch.index;
        let label = lineRest.substring(0, arrowIdx).trim();
        if (
          (label.startsWith('"') && label.endsWith('"')) ||
          (label.startsWith("'") && label.endsWith("'"))
        ) {
          label = label.slice(1, -1);
        }
        for (let i = 0; i < arrowIdx; i++) this.advance();
        let endDashes = 0;
        while (this.peek() === '-') {
          endDashes++;
          this.advance();
        }
        let isDirected = false;
        if (this.peek() === '>') {
          isDirected = true;
          this.advance();
        }
        return {
          type: isDirected ? 'arrow' : 'open',
          raw: isDirected ? '-->' : '---',
          label,
          loc: startLoc,
        };
      }

      let endMarker = '';
      if (this.peek() === '>') {
        endMarker = '>';
        this.advance();
      } else if (this.peek() === 'o') {
        endMarker = 'o';
        this.advance();
      } else if (this.peek() === 'x') {
        endMarker = 'x';
        this.advance();
      }

      let type: EdgeStyle = 'open';
      if (startMarker === '<' && endMarker === '>') type = 'bidirectional';
      else if (endMarker === '>') type = 'arrow';
      else if (endMarker === 'o') type = startMarker === 'o' ? 'circle_bidirectional' : 'circle_arrow';
      else if (endMarker === 'x') type = startMarker === 'x' ? 'cross_bidirectional' : 'cross_arrow';

      return {
        type,
        raw: `${startMarker}${'-'.repeat(dashCount)}${endMarker}`,
        length: dashCount,
        loc: startLoc,
      };
    }

    return null;
  }

  private parseArrow(): ArrowAST | null {
    this.skipWhitespace(true);
    const arrow = this.scanArrow();
    if (!arrow) return null;

    this.skipWhitespace(true);
    // Parse pipe label: -->|Remove/Add images|
    if (this.peek() === '|') {
      this.advance();
      let pipeLabel = '';
      while (!this.isEOF() && this.peek() !== '|' && this.peek() !== '\n') {
        pipeLabel += this.advance();
      }
      if (this.peek() === '|') {
        this.advance();
      } else {
        throw new MermaidParseError(
          'Unclosed edge label: Expected closing "|"',
          this.loc,
          this.peek() || 'EOF',
          '|',
          'Close edge label with "|".',
          this.source
        );
      }
      arrow.label = pipeLabel.trim();
    }

    return arrow;
  }

  private parseNodeOrChain(): FlowchartStatement | null {
    const startLoc = this.loc;
    const firstGroup = this.parseNodeGroup();
    if (!firstGroup || firstGroup.length === 0) {
      if (!this.isEOF() && this.peek() !== '\n') {
        const unexpected = this.advance();
        throw new MermaidParseError(
          `Unexpected token '${unexpected}'`,
          startLoc,
          unexpected,
          'Node, Subgraph, or Statement',
          'Check for syntax errors or invalid characters.',
          this.source
        );
      }
      return null;
    }

    this.skipWhitespace(true);
    const arrow = this.parseArrow();
    if (!arrow) {
      if (firstGroup.length === 1) {
        return firstGroup[0];
      }
      return { kind: 'node_group', nodes: firstGroup, loc: startLoc };
    }

    const chain: { nodes: NodeDefAST[]; arrow?: ArrowAST }[] = [{ nodes: firstGroup }];
    let currentArrow: ArrowAST | null = arrow;

    while (currentArrow) {
      this.skipWhitespace(true);
      const nextGroup = this.parseNodeGroup();
      if (!nextGroup || nextGroup.length === 0) {
        throw new MermaidParseError(
          'Expected target node after arrow',
          this.loc,
          this.peek() || 'EOF',
          'Target Node',
          'Add a target node after the edge arrow.',
          this.source
        );
      }

      chain.push({ arrow: currentArrow, nodes: nextGroup });

      this.skipWhitespace(true);
      currentArrow = this.parseArrow();
    }

    return {
      kind: 'edge_chain',
      chain,
      loc: startLoc,
    };
  }

  private scanShapeLabel(
    shapeDef: ShapeDefinition,
    startLoc: SourceLocation
  ): { label: string; isQuoted: boolean; resolvedShape: NodeDefAST['shape'] } {
    let label = '';
    let isQuoted = false;
    let resolvedShape: NodeDefAST['shape'] = shapeDef.shape;
    const closers = Array.isArray(shapeDef.close) ? shapeDef.close : [shapeDef.close];

    this.skipWhitespace(true);

    if (this.peek() === '"' || this.peek() === "'") {
      isQuoted = true;
      const quoteChar = this.advance();
      while (!this.isEOF()) {
        const ch = this.peek();
        if (ch === '\\' && this.peek(1) === quoteChar) {
          this.advance();
          label += this.advance();
        } else if (ch === quoteChar) {
          this.advance();
          break;
        } else {
          label += this.advance();
        }
      }
      this.skipWhitespace(true);

      let matchedCloser = '';
      for (const closer of closers) {
        if (this.match(closer)) {
          matchedCloser = closer;
          break;
        }
      }

      if (!matchedCloser) {
        const primaryClose = closers[0];
        throw new MermaidParseError(
          `Expected '${primaryClose}' to close node shape after quoted label`,
          this.loc,
          this.peek() || 'EOF',
          primaryClose,
          `Add closing '${primaryClose}' at the end of the node definition.`,
          this.source
        );
      }

      if (shapeDef.resolveShape) {
        resolvedShape = shapeDef.resolveShape(matchedCloser);
      }
    } else {
      let depth = 1;
      let matchedCloser = '';

      while (!this.isEOF()) {
        if (this.peek() === '\n') {
          const primaryClose = closers[0];
          throw new MermaidParseError(
            `Unclosed node shape '${shapeDef.open}': newline encountered before closing '${primaryClose}'`,
            this.loc,
            'NEWLINE',
            primaryClose,
            `Close the shape with '${primaryClose}' before continuing on a new line.`,
            this.source
          );
        }

        // Check if any of the candidate closers matches
        let foundCloser = '';
        for (const closer of closers) {
          if (this.source.startsWith(closer, this.pos)) {
            foundCloser = closer;
            break;
          }
        }

        if (foundCloser) {
          depth--;
          if (depth === 0) {
            matchedCloser = foundCloser;
            for (let i = 0; i < foundCloser.length; i++) {
              this.advance();
            }
            break;
          }
        } else if (this.source.startsWith(shapeDef.open, this.pos)) {
          depth++;
        }

        label += this.advance();
      }

      if (depth > 0 || !matchedCloser) {
        const primaryClose = closers[0];
        throw new MermaidParseError(
          `Unclosed node shape opened at line ${startLoc.line}, column ${startLoc.column}`,
          this.loc,
          'EOF',
          primaryClose,
          `Add closing '${primaryClose}'.`,
          this.source
        );
      }

      if (shapeDef.resolveShape) {
        resolvedShape = shapeDef.resolveShape(matchedCloser);
      }
    }

    return { label: label.trim(), isQuoted, resolvedShape };
  }
}
