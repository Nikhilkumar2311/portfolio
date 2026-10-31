import type { CompileResult } from './types';
import { FlowchartParser } from './parser';
import { FlowchartGenerator } from './generator';
import { MermaidParseError, formatExternalError } from './errors';

/**
 * Compiles and validates Mermaid syntax.
 * For flowcharts and graphs: parses into a typed AST and generates canonical, fully-compatible Mermaid syntax.
 * For other diagrams (sequenceDiagram, classDiagram, stateDiagram, gitGraph, erDiagram):
 * safely passes through to Mermaid's native renderer while providing enriched error diagnostics if rendering fails.
 */
export function compileMermaid(source: string): CompileResult {
  const trimmed = source.trim();
  if (!trimmed) {
    return {
      isValid: true,
      code: '',
    };
  }

  // Detect diagram type
  const firstNonCommentLine = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('%%'));

  if (!firstNonCommentLine) {
    return {
      isValid: true,
      code: trimmed,
    };
  }

  const isFlowchart = /^(flowchart|graph)\b/i.test(firstNonCommentLine);

  if (isFlowchart) {
    try {
      const parser = new FlowchartParser(trimmed);
      const ast = parser.parse();
      const canonicalCode = FlowchartGenerator.generate(ast);

      return {
        isValid: true,
        code: canonicalCode,
        ast,
      };
    } catch (err) {
      if (err instanceof MermaidParseError) {
        return {
          isValid: false,
          code: trimmed,
          error: err.toDiagnostic(),
        };
      }
      return {
        isValid: false,
        code: trimmed,
        error: formatExternalError(err, trimmed),
      };
    }
  }

  // Pass-through for other diagram types
  return {
    isValid: true,
    code: trimmed,
    isPassThrough: true,
  };
}

export { formatExternalError };
