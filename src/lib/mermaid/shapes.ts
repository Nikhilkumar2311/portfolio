import type { NodeShape } from './types';

export interface ShapeDefinition {
  open: string;
  close: string | string[];
  shape: NodeShape;
  resolveShape?: (closer: string) => NodeShape;
}

export const SHAPE_DEFINITIONS: ShapeDefinition[] = [
  // 3-character delimiters
  { open: '(((', close: ')))', shape: 'double_circle' },

  // 2-character delimiters
  { open: '((', close: '))', shape: 'circle' },
  { open: '([', close: '])', shape: 'stadium' },
  { open: '[[', close: ']]', shape: 'subroutine' },
  { open: '[(', close: ')]', shape: 'cylinder' },
  { open: '{{', close: '}}', shape: 'hexagon' },

  // Parallelograms & Trapezoids with dynamic closer resolution
  {
    open: '[/',
    close: ['/]', '\\]'],
    shape: 'parallelogram',
    resolveShape: (closer: string) => (closer === '\\]' ? 'trapezoid' : 'parallelogram'),
  },
  {
    open: '[\\',
    close: ['\\]', '/]'],
    shape: 'inv_parallelogram',
    resolveShape: (closer: string) => (closer === '/]' ? 'inv_trapezoid' : 'inv_parallelogram'),
  },

  // 1-character delimiters
  { open: '>', close: ']', shape: 'asymmetric' },
  { open: '[', close: ']', shape: 'rect' },
  { open: '(', close: ')', shape: 'round' },
  { open: '{', close: '}', shape: 'diamond' },
];

/**
 * Finds if a shape opener matches at position in text
 */
export function matchShapeOpener(text: string, pos: number): ShapeDefinition | null {
  for (const def of SHAPE_DEFINITIONS) {
    if (text.startsWith(def.open, pos)) {
      return def;
    }
  }
  return null;
}
