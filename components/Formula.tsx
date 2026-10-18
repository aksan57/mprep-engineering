import type { FormulaLine, Seg } from '@/lib/calc/formula';
import s from './Calculator.module.css';

function Segs({ segs }: { segs: Seg[] }) {
  return <>{segs.map((g, i) => <span key={i}>{g.b}{g.s && <sub>{g.s}</sub>}</span>)}</>;
}

/** Stacked fraction: numerator over a 1.5px rule over denominator. */
export function Fraction({ num, den }: { num: Seg[]; den: Seg[] }) {
  return (
    <span className={s.frac}>
      <span className={s.num}><Segs segs={num} /></span>
      <span className={s.den}><Segs segs={den} /></span>
    </span>
  );
}

export default function Formula({ line }: { line: FormulaLine }) {
  return (
    <div className={s.formula}>
      <span><Segs segs={line.lhs} /></span>
      <span>=</span>
      {line.parts.map((p, i) => p.kind === 'frac'
        ? <Fraction key={i} num={p.num} den={p.den} />
        : <span key={i}><Segs segs={p.segs} /></span>)}
    </div>
  );
}
