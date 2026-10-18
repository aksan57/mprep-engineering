'use client';

import { useId, useMemo, useState } from 'react';
import { CALC_GROUPS, defaultMode, defaultValues, evaluate, type Calc } from '@/data/calculators';
import Formula from './Formula';
import s from './Calculator.module.css';

const BY_ID = new Map<string, Calc>(CALC_GROUPS.flatMap(g => g.items.map(c => [c.id, c] as const)));

/**
 * One calculator card. Recalculates live; no result is shown while any field is invalid.
 * Takes an id rather than the spec: the spec holds functions, which can't cross the server→client boundary.
 */
export default function Calculator({ id }: { id: string }) {
  const calc = BY_ID.get(id)!;
  const uid = useId();
  const [values, setValues] = useState(() => defaultValues(calc));
  const [mode, setMode] = useState(() => defaultMode(calc));
  const r = useMemo(() => evaluate(calc, values, mode), [calc, values, mode]);

  return (
    <article className={s.card} aria-labelledby={`${uid}-t`}>
      <h3 id={`${uid}-t`} className={s.title}>{calc.title}</h3>
      <div className={s.formulas}>
        {r.formulas.map((ln, i) => <Formula key={i} line={ln} />)}
      </div>

      {calc.modes && (
        <div role="group" aria-label="Calculation mode" className={s.modes}>
          {calc.modes.map(([id, label]) => (
            <button key={id} type="button" className={s.mode} aria-pressed={id === mode} onClick={() => setMode(id)}>{label}</button>
          ))}
        </div>
      )}

      <div className={s.inputs}>
        {r.inputs.map(i => {
          const id = `${uid}-${i.k}`, errId = `${id}-err`, helpId = `${id}-help`;
          const described = [i.err && errId, i.help && helpId].filter(Boolean).join(' ') || undefined;
          return (
            <div key={i.k} className={s.field}>
              <label htmlFor={id}>{i.label}</label>
              <input
                id={id} type="number" step="any" inputMode="decimal"
                value={values[i.k] ?? ''} onChange={e => setValues(v => ({ ...v, [i.k]: e.target.value }))}
                aria-invalid={i.err ? true : undefined} aria-describedby={described}
              />
              {i.err && <span id={errId} role="alert" className={s.err}>{i.err}</span>}
              {i.help && <span id={helpId} className={s.help}>{i.help}</span>}
            </div>
          );
        })}
      </div>

      <div aria-live="polite" className={s.outputs}>
        {r.outputs.map(([label, val]) => (
          <div key={label} className={s.output}><span className={s.outLabel}>{label}</span><span className={s.outVal}>{val}</span></div>
        ))}
      </div>
      {r.warns.map(([lvl, text]) => <div key={text} role="status" className={`note note--${lvl}`}>{text}</div>)}
      <p className={s.note}>{calc.note}</p>
    </article>
  );
}
