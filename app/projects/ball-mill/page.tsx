import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import { Figure } from '@/components/Img';
import {
  BASIS, BM, BM_PARTS, CHAPTERS, CHECKS, DOCS, FINDINGS, IMAGES, KPIS, LIMITATIONS, MODEL_STEPS, NEXT_STEPS, REFS, STUDY, VERIFY,
} from '@/data/ballmill';
import { pageMeta } from '@/lib/meta';
import s from '../cz-r4/case.module.css';

export const metadata = pageMeta('/projects/ball-mill/', {
  title: 'Industrial ball mill shell & trunnion fatigue — case study',
  description: BM.summary,
});

type RefId = (typeof REFS)[number]['id'];
const refNum = (id: RefId) => REFS.findIndex(r => r.id === id) + 1;
function Cite({ r }: { r: readonly RefId[] }) {
  return <sup style={{ fontSize: 11 }}>[{r.map((id, i) => <span key={id}>{i > 0 && ', '}<a href={`#ref-${id}`}>{refNum(id)}</a></span>)}]</sup>;
}

const PPM_RATIO = '1259/653';

export default function CaseStudyPage() {
  return (
    <section className="section section--paper">
      <div className="container">
        <Link href="/projects/" className={s.back}><span aria-hidden="true">←</span> All projects</Link>

        <article aria-labelledby="bm-title" className={s.article}>
          <header className={s.header}>
            <div className={s.headerText}>
              <span className={s.kicker}>CASE STUDY 03</span>
              <h1 id="bm-title" className={s.title}>{BM.title}</h1>
              <p className={s.summary}>{BM.summary}</p>
            </div>
            <dl className={s.meta}>
              {BM.meta.map(m => <div key={m.k}><dt>{m.k}</dt><dd>{m.v}</dd></div>)}
            </dl>
          </header>

          <div className={s.body}>
            <nav aria-label="Case study contents" className={s.toc}>
              <ol>
                {CHAPTERS.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
              </ol>
            </nav>

            <div className={s.chapters}>
              <section id="bm-overview" className={s.chapter} aria-labelledby="h-overview">
                <h2 id="h-overview" className="chapter-label">Overview</h2>
                <p className={s.p17}>A grinding mill turns about 16 times a minute, around the clock, for decades. Every revolution carries each point of the shell once under the charge and once over the top, so a mill that is barely stressed in a static sense can still run out of fatigue life. This study takes a generic overflow ball mill of a common size and checks whether its welded shell, heads and cast trunnions survive 25 years. It has four parts:</p>
                <ol className={`hairline hairline--sm ${s.parts}`}>
                  {BM_PARTS.map(pt => <li key={pt.n}><span className={s.partNum}>{pt.n}</span><span>{pt.t}</span></li>)}
                </ol>
                <div className="hairline hairline--sm" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,190px),1fr))' }}>
                  {KPIS.map(r => (
                    <div key={r.label} className={s.kpi}>
                      <span className={s.kpiLabel}>{r.label}</span>
                      <span className={s.kpiValue}>{r.value}</span>
                      <span className={s.kpiSub}>{r.sub}</span>
                    </div>
                  ))}
                </div>
                <p className={s.p15muted}>The mill is MPrep&apos;s own generic design. Dimensions, loads and materials are representative assumptions, not a specific vendor&apos;s machine.</p>
              </section>

              <section id="bm-basis" className={s.chapter} style={{ gap: 16 }} aria-labelledby="h-basis">
                <h2 id="h-basis" className="chapter-label">Design basis</h2>
                <p className={s.p15}>The charge and the power draw follow the Bond–Rowland method for overflow ball mills;<Cite r={['rowland']} /> the drive torque then sets the girth-gear mesh forces.</p>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 560 }}>
                    <thead><tr><th scope="col">Parameter</th><th scope="col">Value</th><th scope="col">Basis</th></tr></thead>
                    <tbody>
                      {BASIS.map(p => <tr key={p.name}><td>{p.name}</td><td className="mono" style={{ color: 'var(--ink)' }}>{p.value}</td><td style={{ color: 'var(--t4)' }}>{p.basis}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="bm-cad" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-cad">
                <h2 id="h-cad" className="chapter-label">CAD geometry</h2>
                <div className="grid-fit" style={{ ['--min' as string]: '240px' }}>
                  <Figure {...IMAGES.cadBase} ratio="727/1150" />
                  <Figure {...IMAGES.cadRec} ratio="727/1150" />
                  <Figure {...IMAGES.profile} ratio="810/709" />
                </div>
                <p className={s.p14muted}>Shell, conical heads, trunnions and the girth-gear mounting flange are generated from one parametric profile and exported as STEP; the views are the STEP files opened in FreeCAD. The recommended design differs only in the end courses: 70 mm plate for 250 mm next to each head, tapered 1:4 down to the 40 mm shell.</p>
              </section>

              <section id="bm-model" className={`${s.chapter} grid-fit`} style={{ ['--min' as string]: '320px', gap: '24px 32px', display: 'grid' }} aria-labelledby="h-model">
                <div className={s.stack14}>
                  <h2 id="h-model" className="chapter-label">FEA model · methodology</h2>
                  <ul className={s.ruled}>
                    {MODEL_STEPS.map(m => <li key={m.k} style={{ gap: 4, padding: '12px 0' }}><span className={s.stepKey}>{m.k}</span><span className={s.stepVal}>{m.v}</span></li>)}
                  </ul>
                  <p className={s.p14muted}>Solver: CalculiX.<Cite r={['ccx']} /> Weld assessment to the IIW recommendations;<Cite r={['iiw']} /> trunnion fillet to Goodman with Marin factors.<Cite r={['shigley']} /></p>
                </div>
                <Figure {...IMAGES.cutaway} ratio="843/733" />
              </section>

              <section id="bm-fea" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-fea">
                <h2 id="h-fea" className="chapter-label">Results in PrePoMax · axial stress S33</h2>
                <p className={s.p15}>S33 is the global axial stress, which on the shell surface is the meridional stress the weld assessment uses. Both designs are shown on the same section through the mill axis, with the same camera, undeformed geometry and a fixed −50 to +50 MPa legend, so the colours compare directly. The discharge end is on the left; the bottom of the section is the charge side.</p>
                <div className="grid-fit" style={{ ['--min' as string]: '300px' }}>
                  <Figure {...IMAGES.secBase} ratio={PPM_RATIO} />
                  <Figure {...IMAGES.secRec} ratio={PPM_RATIO} />
                </div>
                <p className={s.p15}>Away from the ends the shell is barely loaded. The stress gathers where the shell meets the heads. Zoomed onto the inner corner of the discharge-end junction on the charge side, the difference between the designs is clear:</p>
                <div className="grid-fit" style={{ ['--min' as string]: '300px' }}>
                  <Figure {...IMAGES.weldBase} ratio={PPM_RATIO} />
                  <Figure {...IMAGES.weldRec} ratio={PPM_RATIO} />
                </div>
              </section>

              <section id="bm-weld" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-weld">
                <h2 id="h-weld" className="chapter-label">Weld fatigue · one revolution</h2>
                <p className={s.p15}>Reading S33 at 0.4t and 1.0t from the weld toe all around the circumference and extrapolating gives the hot-spot stress each point sees as it turns. Tension peaks as the joint passes under the charge (θ = 0) and turns to compression near the top; the range between the two is the fatigue cycle.</p>
                <Figure {...IMAGES.theta} ratio="1400/720" />
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 560 }}>
                    <thead><tr><th scope="col">Check</th><th scope="col">Criterion</th><th scope="col">Baseline</th><th scope="col">Recommended</th></tr></thead>
                    <tbody>
                      {CHECKS.map(c => <tr key={c.q}><td>{c.q}</td><td style={{ color: 'var(--t4)' }}>{c.c}</td><td className="mono">{c.b}</td><td className="mono" style={{ color: 'var(--ink)', fontWeight: 500 }}>{c.r}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className={s.p15}>The baseline weld sees 58.5 MPa per revolution. With 1.95 × 10⁸ revolutions in 25 years, that is 1.64 times what FAT 100 allows after the thickness correction and γM = 1.30. The cause is ovalisation: the shell flattens slightly under the charge, but the stiff conical heads hold its ends round, so the junction is bent back and forth once per turn.</p>
              </section>

              <section id="bm-study" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-study">
                <h2 id="h-study" className="chapter-label">Design study · where to add steel</h2>
                <Figure {...IMAGES.thickness} ratio="1127/592" />
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 560 }}>
                    <thead><tr><th scope="col">Variant</th><th scope="col">Δσhs (MPa)</th><th scope="col">Utilisation</th><th scope="col">Added steel</th></tr></thead>
                    <tbody>
                      {STUDY.map(r => <tr key={r.v}><td>{r.v}</td><td className="mono">{r.d}</td><td className="mono" style={{ color: 'var(--ink)' }}>{r.u}</td><td className="mono" style={{ color: 'var(--t4)' }}>{r.m}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className={s.p15}>Stiffening the heads treats the wrong side of the joint. Thickening the shell works because a thicker shell resists the bending at the junction, but only the first few hundred millimetres matter: local end courses match a 70 mm whole shell at about one-eighth of the added steel.</p>
                <div className="grid-fit" style={{ ['--min' as string]: '300px' }}>
                  <Figure {...IMAGES.history} ratio="1164/582" />
                  <Figure {...IMAGES.fillet} ratio="1103/561" />
                </div>
              </section>

              <section id="bm-verify" className={s.chapter} style={{ gap: 16 }} aria-labelledby="h-verify">
                <h2 id="h-verify" className="chapter-label">Verification</h2>
                <ul className={s.ruled}>
                  {VERIFY.map(m => <li key={m.k} style={{ gap: 4, padding: '12px 0' }}><span className={s.stepKey}>{m.k}</span><span className={s.stepVal}>{m.v}</span></li>)}
                </ul>
              </section>

              <section id="bm-conclusions" className={s.chapter} aria-labelledby="h-conc">
                <h2 id="h-conc" className="chapter-label">Conclusions &amp; design improvements</h2>
                <div className="grid-fit" style={{ ['--min' as string]: '300px', gap: 24 }}>
                  <div className={s.concl}><h3 className={s.conclTitle}>Findings</h3><ul>{FINDINGS.map(x => <li key={x}>{x}</li>)}</ul></div>
                  <div className={`${s.concl} ${s.conclNext}`}><h3 className={s.conclTitle}>Next steps</h3><ul>{NEXT_STEPS.map(x => <li key={x}>{x}</li>)}</ul></div>
                </div>
                <div className={s.limits}>
                  <h3 className={s.limitsLabel}>LIMITATIONS</h3>
                  <ul>{LIMITATIONS.map(l => <li key={l}>{l}</li>)}</ul>
                </div>
              </section>

              <section id="bm-docs" className={s.chapter} aria-labelledby="h-docs">
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

              <section id="bm-refs" className={s.chapter} aria-labelledby="h-refs">
                <h2 id="h-refs" className="chapter-label">References</h2>
                <ol className={s.ruled}>
                  {REFS.map((r, i) => (
                    <li key={r.id} id={`ref-${r.id}`} style={{ flexDirection: 'row', gap: 10 }}>
                      <span className="mono" style={{ color: 'var(--teal-text)', fontSize: 12 }}>[{i + 1}]</span>
                      <span className={s.bcNote} style={{ fontSize: 13.5, color: 'var(--t2)' }}>{r.text}{'url' in r && <> <a href={r.url} target="_blank" rel="noopener noreferrer">{r.url.replace(/^https?:\/\//, '')}</a></>}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        </article>

        <CtaBand />
      </div>
    </section>
  );
}
