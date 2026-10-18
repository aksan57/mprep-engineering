/**
 * 4 significant figures. ≥1e4 gets thousands separators; non-zero values <1e-3 use exponent notation.
 */
export function f4(x: number): string {
  if (!isFinite(x)) return '—';
  const a = Math.abs(x);
  if (a >= 1e4) return Number(x.toPrecision(4)).toLocaleString('en-US');
  if (a !== 0 && a < 1e-3) return x.toExponential(3);
  return x.toPrecision(4);
}

type Unit = readonly [label: string, factor: number];

/** Picks the largest unit whose factor the magnitude reaches, then formats with f4. */
export const scaled = (units: readonly Unit[]) => (x: number): string => {
  if (!isFinite(x)) return '—';
  let u = units[0];
  for (const c of units) if (Math.abs(x) >= c[1]) u = c;
  return f4(x / u[1]) + ' ' + u[0];
};

export const fW = scaled([['W', 1], ['kW', 1e3], ['MW', 1e6]]);
export const fJ = scaled([['J', 1], ['kJ', 1e3], ['MJ', 1e6], ['GJ', 1e9]]);
export const fN = scaled([['N', 1], ['kN', 1e3], ['MN', 1e6]]);
export const fPa = scaled([['Pa', 1], ['kPa', 1e3], ['MPa', 1e6]]);
