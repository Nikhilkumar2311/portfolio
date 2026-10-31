import type { FlowchartAST, FlowchartStatement, NodeDefAST, ArrowAST } from './types';

export class FlowchartGenerator {
  public static generate(ast: FlowchartAST): string {
    if (ast.isPassThrough && ast.source) {
      return ast.source;
    }

    const lines: string[] = [];
    lines.push(`${ast.type} ${ast.direction}`);

    function escapeLabel(label: string): string {
      return label.replace(/"/g, '#quot;');
    }

    function formatNode(node: NodeDefAST): string {
      if (!node.hasExplicitShape) {
        return node.id;
      }

      const quoted = `"${escapeLabel(node.label)}"`;

      switch (node.shape) {
        case 'rect':
          return `${node.id}[${quoted}]`;
        case 'round':
          return `${node.id}(${quoted})`;
        case 'stadium':
          return `${node.id}([${quoted}])`;
        case 'subroutine':
          return `${node.id}[[${quoted}]]`;
        case 'cylinder':
          return `${node.id}[(${quoted})]`;
        case 'circle':
          return `${node.id}((${quoted}))`;
        case 'double_circle':
          return `${node.id}((( ${escapeLabel(node.label)} )))`;
        case 'diamond':
          return `${node.id}{${quoted}}`;
        case 'hexagon':
          return `${node.id}{{${quoted}}}`;
        case 'parallelogram':
          return `${node.id}[/${quoted}/]`;
        case 'inv_parallelogram':
          return `${node.id}[\\${quoted}\\]`;
        case 'trapezoid':
          return `${node.id}[/${quoted}\\]`;
        case 'inv_trapezoid':
          return `${node.id}[\\${quoted}/]`;
        case 'asymmetric':
          return `${node.id}>${quoted}]`;
        default:
          return `${node.id}[${quoted}]`;
      }
    }

    function formatArrow(arrow: ArrowAST): string {
      if (arrow.label) {
        return `${arrow.raw} |"${escapeLabel(arrow.label)}"|`;
      }
      return arrow.raw;
    }

    function formatStatement(stmt: FlowchartStatement, indent: string = '  '): void {
      if (!stmt) return;

      if (stmt.kind === 'subgraph') {
        const safeTitle = escapeLabel(stmt.title);
        const safeId = stmt.id.replace(/[^\w]/g, '_');
        lines.push(`${indent}subgraph ${safeId} ["${safeTitle}"]`);
        for (const s of stmt.statements) {
          formatStatement(s, indent + '  ');
        }
        lines.push(`${indent}end`);
      } else if (stmt.kind === 'node') {
        lines.push(`${indent}${formatNode(stmt)}`);
      } else if (stmt.kind === 'node_group') {
        lines.push(`${indent}${stmt.nodes.map(formatNode).join(' & ')}`);
      } else if (stmt.kind === 'edge_chain') {
        let edgeStr = indent;
        const chain = stmt.chain;
        edgeStr += chain[0].nodes.map(formatNode).join(' & ');
        for (let i = 1; i < chain.length; i++) {
          const seg = chain[i];
          if (seg.arrow) {
            edgeStr += ` ${formatArrow(seg.arrow)} `;
          }
          edgeStr += seg.nodes.map(formatNode).join(' & ');
        }
        lines.push(edgeStr);
      } else if (stmt.kind === 'direction') {
        lines.push(`${indent}direction ${stmt.direction}`);
      } else if (stmt.kind === 'special') {
        lines.push(`${indent}${stmt.raw}`);
      }
    }

    for (const stmt of ast.statements) {
      formatStatement(stmt, '  ');
    }

    return lines.join('\n');
  }
}
