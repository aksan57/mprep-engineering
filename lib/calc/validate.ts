export type Rule = 'pos' | 'nonneg' | 'eps' | 'eta' | 'tabs';

export const RULES: Record<Rule, (v: number) => string> = {
  pos: v => (v > 0 ? '' : 'Must be greater than 0'),
  nonneg: v => (v >= 0 ? '' : 'Must be 0 or greater'),
  eps: v => (v > 0 && v <= 1 ? '' : 'Must be between 0 and 1'),
  eta: v => (v > 0 && v <= 100 ? '' : 'Must be between 0 and 100'),
  tabs: v => (v + 273.15 > 0 ? '' : 'Must be above absolute zero (−273.15 °C)'),
};

/** Parses a raw field value and applies its rule. Returns [number, error message]. */
export function checkField(raw: string | undefined, rule?: Rule): [number, string] {
  const x = parseFloat(raw ?? '');
  if (raw == null || raw.trim() === '' || !isFinite(x)) return [x, 'Enter a number'];
  return [x, rule ? RULES[rule](x) : ''];
}
