// Formula notation: plain text with `_{…}` subscripts; a [numerator, denominator] tuple is a stacked fraction.

export type Seg = { b: string; s: string };
export type Part = { kind: 'text'; segs: Seg[] } | { kind: 'frac'; num: Seg[]; den: Seg[] };
export type FormulaLine = { lhs: Seg[]; parts: Part[] };

export function segs(text: string): Seg[] {
  const p = text.split(/_\{([^}]*)\}/), out: Seg[] = [];
  for (let i = 0; i < p.length; i += 2) {
    const b = p[i], s = p[i + 1] ?? '';
    if (b || s) out.push({ b, s });
  }
  return out;
}

export function line(lhs: string, ...parts: (string | [string, string])[]): FormulaLine {
  return {
    lhs: segs(lhs),
    parts: parts.map(p => (typeof p === 'string' ? { kind: 'text', segs: segs(p) } : { kind: 'frac', num: segs(p[0]), den: segs(p[1]) })),
  };
}
