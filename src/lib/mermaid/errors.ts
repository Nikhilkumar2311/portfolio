import type { DiagnosticError, SourceLocation } from './types';

export class MermaidParseError extends Error {
  public loc: SourceLocation;
  public unexpected?: string;
  public expected?: string;
  public snippet?: string;
  public suggestion?: string;

  constructor(
    message: string,
    loc: SourceLocation,
    unexpected?: string,
    expected?: string,
    suggestion?: string,
    source?: string
  ) {
    super(message);
    this.name = 'MermaidParseError';
    this.loc = loc;
    this.unexpected = unexpected;
    this.expected = expected;
    this.suggestion = suggestion;
    if (source && loc) {
      this.snippet = this.createSnippet(source, loc);
    }
  }

  private createSnippet(source: string, loc: SourceLocation): string {
    const lines = source.split(/\r?\n/);
    const lineIdx = loc.line - 1;
    if (lineIdx < 0 || lineIdx >= lines.length) return '';

    const startLine = Math.max(0, lineIdx - 1);
    const endLine = Math.min(lines.length - 1, lineIdx + 1);
    const snippetLines: string[] = [];

    for (let i = startLine; i <= endLine; i++) {
      const lineNum = String(i + 1).padStart(4, ' ');
      const prefix = i === lineIdx ? '> ' : '  ';
      snippetLines.push(`${prefix}${lineNum} | ${lines[i]}`);
      if (i === lineIdx) {
        const indent = ' '.repeat(7 + Math.max(0, loc.column - 1));
        snippetLines.push(`${indent}^`);
      }
    }
    return snippetLines.join('\n');
  }

  public toDiagnostic(): DiagnosticError {
    return {
      line: this.loc.line,
      column: this.loc.column,
      message: this.message,
      unexpected: this.unexpected,
      expected: this.expected,
      snippet: this.snippet,
      suggestion: this.suggestion,
    };
  }

  public toFormattedString(): string {
    let out = `Syntax Error at line ${this.loc.line}, column ${this.loc.column}:\n`;
    out += `Message: ${this.message}\n`;
    if (this.unexpected) out += `Unexpected: '${this.unexpected}'\n`;
    if (this.expected) out += `Expected: ${this.expected}\n`;
    if (this.snippet) out += `\n${this.snippet}\n`;
    if (this.suggestion) out += `\nSuggestion: ${this.suggestion}\n`;
    return out;
  }
}

/**
 * Normalizes any external or runtime Mermaid error into a structured DiagnosticError
 */
export function formatExternalError(rawError: unknown, sourceCode: string): DiagnosticError {
  if (rawError instanceof MermaidParseError) {
    return rawError.toDiagnostic();
  }

  const rawMessage = rawError instanceof Error ? rawError.message : String(rawError);
  const cleanMessage = rawMessage.replace(/Error: /g, '').trim();

  // Try extracting line number from Mermaid error message: "Parse error on line 4:"
  const lineMatch = /line\s+(\d+)/i.exec(cleanMessage);
  let line = 1;
  let column = 1;
  if (lineMatch) {
    line = parseInt(lineMatch[1], 10);
  }

  // Look for unexpected token in Mermaid error: "got 'PS'"
  let unexpected = '';
  const gotMatch = /got\s+'([^']+)'/i.exec(cleanMessage);
  if (gotMatch) {
    unexpected = gotMatch[1];
    // Map internal tokens to human-friendly terms
    if (unexpected === 'PS') unexpected = '(';
    if (unexpected === 'PE') unexpected = ')';
    if (unexpected === 'SQS') unexpected = '[';
    if (unexpected === 'SQE') unexpected = ']';
  }

  // Look for expected tokens: "Expecting 'SQE', ..."
  let expected = '';
  const expMatch = /Expecting\s+([^,]+(?:,\s*[^,]+)*)/i.exec(cleanMessage);
  if (expMatch) {
    expected = expMatch[1].replace(/got.*$/, '').trim();
  }

  // Build snippet around line
  const lines = sourceCode.split(/\r?\n/);
  const lineIdx = line - 1;
  let snippet = '';
  if (lineIdx >= 0 && lineIdx < lines.length) {
    const startLine = Math.max(0, lineIdx - 1);
    const endLine = Math.min(lines.length - 1, lineIdx + 1);
    const snippetLines: string[] = [];
    for (let i = startLine; i <= endLine; i++) {
      const lineNum = String(i + 1).padStart(4, ' ');
      const prefix = i === lineIdx ? '> ' : '  ';
      snippetLines.push(`${prefix}${lineNum} | ${lines[i]}`);
    }
    snippet = snippetLines.join('\n');
  }

  let suggestion = 'Check your Mermaid syntax (unclosed brackets, unquoted special characters, or invalid arrows).';
  if (unexpected === '(' || cleanMessage.includes("got 'PS'")) {
    suggestion = 'Parentheses inside unquoted node labels must be enclosed in quotes, e.g. ["Label (Info)"].';
  }

  return {
    line,
    column,
    message: cleanMessage.split('\n')[0],
    unexpected: unexpected || undefined,
    expected: expected || undefined,
    snippet: snippet || undefined,
    suggestion,
  };
}
