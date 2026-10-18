'use client';

type Props<T extends string> = { label: string; options: readonly T[]; value: T; onChange: (v: T) => void; scroll?: boolean };

/** Toggle-button filter row. Active pill is navy-filled; scrolls horizontally on narrow screens when `scroll`. */
export default function FilterPills<T extends string>({ label, options, value, onChange, scroll }: Props<T>) {
  return (
    <div role="toolbar" aria-label={label} className={`filter-row ${scroll ? 'filter-row--scroll' : 'filter-row--wrap'}`}>
      {options.map(o => (
        <button key={o} type="button" className="filter-pill" aria-pressed={o === value} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}
