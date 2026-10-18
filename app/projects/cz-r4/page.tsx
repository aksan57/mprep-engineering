import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import DrawingViewer from '@/components/DrawingViewer';
import { Figure } from '@/components/Img';
import ModelHint, { TOUCH_HINT } from '@/components/ModelHint';
import ModelViewer from '@/components/ModelViewer';
import {
  BCS, CHAPTERS, CZ, CZ_PARTS, DOCS, FEA_STEPS, FINDINGS, GA_PDF, IMAGES, LIMITATIONS, MODEL, NEXT_STEPS, PARAMS, RESULTS, SUBSYSTEMS, VERIFY,
} from '@/data/czr4';
import { pageMeta } from '@/lib/meta';
import s from './case.module.css';

export const metadata = pageMeta('/projects/cz-r4/', {
  title: 'CZ-R4 crystal-growth furnace — case study',
  description: CZ.summary,
});

export default function CaseStudyPage() {
  return (
    <section className="section section--paper">
      <div className="container">
        <Link href="/projects/" className={s.back}><span aria-hidden="true">←</span> All projects</Link>

        <article aria-labelledby="cz-title" className={s.article}>
          <header className={s.header}>
            <div className={s.headerText}>
              <span className={s.kicker}>CASE STUDY 01</span>
              <h1 id="cz-title" className={s.title}>{CZ.title}</h1>
              <p className={s.summary}>{CZ.summary}</p>
            </div>
            <dl className={s.meta}>
              {CZ.meta.map(m => <div key={m.k}><dt>{m.k}</dt><dd>{m.v}</dd></div>)}
            </dl>
          </header>

          <div className={s.body}>
            <nav aria-label="Case study contents" className={s.toc}>
              <ol>
                {CHAPTERS.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
              </ol>
            </nav>

            <div className={s.chapters}>
              <section id="cz-overview" className={s.chapter} aria-labelledby="h-overview">
                <h2 id="h-overview" className="chapter-label">Overview</h2>
                <p className={s.p17}>Concept design of a Czochralski-type crystal-growth furnace, carried from 2D AutoCAD drafting to a verified finite-element model. The study has four parts:</p>
                <ol className={`hairline hairline--sm ${s.parts}`}>
                  {CZ_PARTS.map(pt => <li key={pt.n}><span className={s.partNum}>{pt.n}</span><span>{pt.t}</span></li>)}
                </ol>
                <p className={s.p15muted}>Every FE result is checked against hand calculations and a reference study.</p>
              </section>

              <section id="cz-cad" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-cad">
                <h2 id="h-cad" className="chapter-label">CAD assembly &amp; equipment geometry</h2>
                <div className="grid-fit" style={{ ['--min' as string]: '300px' }}>
                  <Figure {...IMAGES.assembly} ratio="4/3" />
                  <Figure {...IMAGES.section} ratio="4/3" dark />
                </div>
                <figure className="figure">
                  <div className={`frame ${s.drawingFrame}`}>
                    <DrawingViewer pdf={GA_PDF} preview={IMAGES.gaPreview} title="General arrangement drawing — CZ-R4" />
                  </div>
                  <figcaption className="figcaption">General arrangement drawing · AutoCAD export</figcaption>
                </figure>
                <div className="hairline hairline--sm" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))' }}>
                  {SUBSYSTEMS.map(ss => <div key={ss.name} className={s.cell}><span className={s.cellTitle}>{ss.name}</span><span className={s.cellNote}>{ss.note}</span></div>)}
                </div>
              </section>

              <section id="cz-params" className={s.chapter} style={{ gap: 16 }} aria-labelledby="h-params">
                <h2 id="h-params" className="chapter-label">Design assumptions &amp; parameters</h2>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 520 }}>
                    <thead><tr><th scope="col">Parameter</th><th scope="col">Value</th><th scope="col">Basis</th></tr></thead>
                    <tbody>
                      {PARAMS.map(p => <tr key={p.name}><td>{p.name}</td><td className="mono" style={{ color: 'var(--ink)' }}>{p.value}</td><td style={{ color: 'var(--t4)' }}>{p.basis}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="cz-thermal" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-thermal">
                <div className="grid-fit" style={{ ['--min' as string]: '320px', gap: '24px 32px' }}>
                  <div className={s.stack14}>
                    <h2 id="h-thermal" className="chapter-label">Thermal model &amp; boundary conditions</h2>
                    <p className={s.p15}>Steady-state heat transfer through the hot zone with surface-to-surface cavity radiation between heater, susceptor, crucible, melt, insulator and vessel wall.</p>
                    <ul className={s.ruled}>
                      {BCS.map(b => (
                        <li key={b.k}>
                          <div className={s.bcRow}><span style={{ fontWeight: 500 }}>{b.k}</span><span className={s.bcVal}>{b.v}</span></div>
                          {b.n && <span className={s.bcNote}>{b.n}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Figure {...IMAGES.thermalField} />
                </div>
                <div className={s.stack12}>
                  <h3 className={s.h3}>Why radiation matters</h3>
                  <div className="grid-fit" style={{ ['--min' as string]: '260px' }}>
                    <Figure {...IMAGES.thermalRun1} />
                    <Figure {...IMAGES.thermalRun2} />
                  </div>
                </div>
              </section>

              <section id="cz-fea" className={`${s.chapter} grid-fit`} style={{ ['--min' as string]: '320px', gap: '24px 32px', display: 'grid' }} aria-labelledby="h-fea">
                <Figure {...IMAGES.mesh} />
                <div className={s.stack14}>
                  <h2 id="h-fea" className="chapter-label">FEA methodology &amp; mesh</h2>
                  <ul className={s.ruled}>
                    {FEA_STEPS.map(m => <li key={m.k} style={{ gap: 4, padding: '12px 0' }}><span className={s.stepKey}>{m.k}</span><span className={s.stepVal}>{m.v}</span></li>)}
                  </ul>
                </div>
              </section>

              <section id="cz-verify" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-verify">
                <h2 id="h-verify" className="chapter-label">Verification · hand calculation vs FEA</h2>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 480 }}>
                    <thead><tr><th scope="col">Quantity</th><th scope="col">Hand calc</th><th scope="col">FEA</th></tr></thead>
                    <tbody>
                      {VERIFY.map(v => <tr key={v.q}><td>{v.q}</td><td className="mono">{v.h}</td><td className="mono" style={{ color: 'var(--ink)', fontWeight: 500 }}>{v.f}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className={s.p14muted}>The flat bottom behaves between the clamped and simply-supported limits — the flange-to-plate joint gives partial rotational restraint.</p>
                <div className={s.stack12}>
                  <h3 className={s.h3}>Catching a missing load</h3>
                  <p className={s.p14muted}>The first static run under-predicted displacement. The hand-calculation check flagged it, the missing load was found, and the corrected run landed within 4.8 % of the reference study.</p>
                  <div className="grid-fit" style={{ ['--min' as string]: '260px' }}>
                    <Figure {...IMAGES.verifyRun1} />
                    <Figure {...IMAGES.verifyFinal} />
                  </div>
                </div>
              </section>

              <section id="cz-results" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-results">
                <h2 id="h-results" className="chapter-label">Results &amp; limitations</h2>
                <div className="grid-fit" style={{ ['--min' as string]: '300px' }}>
                  <Figure {...IMAGES.stress} />
                  <Figure {...IMAGES.displacement} />
                </div>
                <div className="hairline hairline--sm" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,190px),1fr))' }}>
                  {RESULTS.map(r => (
                    <div key={r.label} className={s.kpi}>
                      <span className={s.kpiLabel}>{r.label}</span>
                      <span className={s.kpiValue}>{r.value}</span>
                      <span className={s.kpiSub}>{r.sub}</span>
                    </div>
                  ))}
                </div>
                <div className={s.stack12}>
                  <h3 className={s.h3}>Linear buckling under full vacuum · first three modes</h3>
                  <div className="grid-fit" style={{ ['--min' as string]: '200px' }}>
                    <Figure {...IMAGES.buckle1} ratio="4/5" />
                    <Figure {...IMAGES.buckle2} ratio="4/5" />
                    <Figure {...IMAGES.buckle3} ratio="4/5" />
                  </div>
                </div>
                <div className={s.limits}>
                  <h3 className={s.limitsLabel}>LIMITATIONS</h3>
                  <ul>{LIMITATIONS.map(l => <li key={l}>{l}</li>)}</ul>
                </div>
              </section>

              <section id="cz-conclusions" className={s.chapter} aria-labelledby="h-conc">
                <h2 id="h-conc" className="chapter-label">Conclusions &amp; design improvements</h2>
                <div className="grid-fit" style={{ ['--min' as string]: '300px', gap: 24 }}>
                  <div className={s.concl}><h3 className={s.conclTitle}>Findings</h3><ul>{FINDINGS.map(x => <li key={x}>{x}</li>)}</ul></div>
                  <div className={`${s.concl} ${s.conclNext}`}><h3 className={s.conclTitle}>Next steps</h3><ul>{NEXT_STEPS.map(x => <li key={x}>{x}</li>)}</ul></div>
                </div>
              </section>

              <section id="cz-model" className={s.chapter} aria-labelledby="h-model">
                <h2 id="h-model" className="chapter-label">Interactive 3D model</h2>
                <ModelViewer src={MODEL.src} poster={MODEL.poster} alt={MODEL.alt} sizeLabel={MODEL.sizeLabel} />
                <ModelHint
                  className={s.hint}
                  mouse={`Drag to rotate, scroll to zoom. Double-click or press Reset to recentre. The model loads when this section scrolls into view (${MODEL.sizeLabel}).`}
                  touch={`${TOUCH_HINT}. Press Reset to recentre. The model loads when this section scrolls into view (${MODEL.sizeLabel}).`}
                />
              </section>

              <section id="cz-docs" className={s.chapter} aria-labelledby="h-docs">
                <h2 id="h-docs" className="chapter-label">Project documentation</h2>
                <ul className={s.docs}>
                  {DOCS.map(d => (
                    <li key={d.href}>
                      <div className={s.docName}><span className={s.docKind}>{d.kind}</span><span>{d.name}</span></div>
                      <a href={d.href} download className={s.docLink}>Download · {d.size}</a>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </article>

        <CtaBand />
      </div>
    </section>
  );
}
