import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import { Figure } from '@/components/Img';
import {
  BRIEF, CFD_STEPS, CFD_VERIFY, CG, CG_PARTS, CHAPTERS, DOCS, FEA_RESULTS, FEA_STEPS, FINDINGS, IMAGES, LIMITATIONS, NEXT_STEPS, NOZZLE, PARAMS, REFS, VERIFY,
} from '@/data/coldgas';
import { pageMeta } from '@/lib/meta';
import s from '../cz-r4/case.module.css';

export const metadata = pageMeta('/projects/cold-gas-thruster/', {
  title: 'Cold-gas thruster tank & nozzle — case study',
  description: CG.summary,
});

type RefId = (typeof REFS)[number]['id'];
const refNum = (id: RefId) => REFS.findIndex(r => r.id === id) + 1;
function Cite({ r }: { r: readonly RefId[] }) {
  return <sup style={{ fontSize: 11 }}>[{r.map((id, i) => <span key={id}>{i > 0 && ', '}<a href={`#ref-${id}`}>{refNum(id)}</a></span>)}]</sup>;
}

export default function CaseStudyPage() {
  return (
    <section className="section section--paper">
      <div className="container">
        <Link href="/projects/" className={s.back}><span aria-hidden="true">←</span> All projects</Link>

        <article aria-labelledby="cg-title" className={s.article}>
          <header className={s.header}>
            <div className={s.headerText}>
              <span className={s.kicker}>CASE STUDY 02</span>
              <h1 id="cg-title" className={s.title}>{CG.title}</h1>
              <p className={s.summary}>{CG.summary}</p>
            </div>
            <dl className={s.meta}>
              {CG.meta.map(m => <div key={m.k}><dt>{m.k}</dt><dd>{m.v}</dd></div>)}
            </dl>
          </header>

          <div className={s.body}>
            <nav aria-label="Case study contents" className={s.toc}>
              <ol>
                {CHAPTERS.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
              </ol>
            </nav>

            <div className={s.chapters}>
              <section id="cg-overview" className={s.chapter} aria-labelledby="h-overview">
                <h2 id="h-overview" className="chapter-label">Overview</h2>
                <p className={s.p17}>The second-generation Tesla Roadster, shown in mid-October 2026 at SpaceX&apos;s test site near Waco, Texas, used cold-gas thrusters to jump over a row of other Tesla vehicles and to climb an inverted ramp.<Cite r={['techcrunch', 'paultan']} /> Almost no engineering data has been published. This study treats the few reported figures as a design brief and works out what the two key parts would need to be. It has four parts:</p>
                <ol className={`hairline hairline--sm ${s.parts}`}>
                  {CG_PARTS.map(pt => <li key={pt.n}><span className={s.partNum}>{pt.n}</span><span>{pt.t}</span></li>)}
                </ol>
                <p className={s.p15muted}>Every dimension, material and load is MPrep&apos;s own assumption. Nothing here describes the actual car.</p>
              </section>

              <section id="cg-brief" className={s.chapter} style={{ gap: 16 }} aria-labelledby="h-brief">
                <h2 id="h-brief" className="chapter-label">Design brief · what has been reported</h2>
                <p className={s.p15}>Reports of the livestream give a stored volume, a gas mass and one pressure reading.<Cite r={['paultan']} /> At these densities air is far from an ideal gas, so the figures were checked with the reference equation of state for air<Cite r={['lemmon']} /> through CoolProp.<Cite r={['coolprop']} /></p>
                <ul className={s.ruled}>
                  {BRIEF.map(b => (
                    <li key={b.k}>
                      <div className={s.bcRow}><span style={{ fontWeight: 500 }}>{b.k}</span><span className={s.bcVal}>{b.v}</span></div>
                      <span className={s.bcNote}>{b.n}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="cg-cad" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-cad">
                <h2 id="h-cad" className="chapter-label">CAD geometry</h2>
                <div className="grid-fit" style={{ ['--min' as string]: '280px' }}>
                  <Figure {...IMAGES.tank} ratio="1/1" />
                  <Figure {...IMAGES.nozzle} ratio="1/1" />
                </div>
                <p className={s.p14muted}>A Type III vessel: a thin metal liner keeps the gas in, a carbon overwrap carries the load, and a titanium boss at the pole carries the port. Geometry was built parametrically (FreeCAD macro and CadQuery) and exported as STEP.</p>
              </section>

              <section id="cg-params" className={s.chapter} style={{ gap: 16 }} aria-labelledby="h-params">
                <h2 id="h-params" className="chapter-label">Design assumptions &amp; parameters</h2>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 520 }}>
                    <thead><tr><th scope="col">Parameter</th><th scope="col">Value</th><th scope="col">Basis</th></tr></thead>
                    <tbody>
                      {PARAMS.map(p => <tr key={p.name}><td>{p.name}</td><td className="mono" style={{ color: 'var(--ink)' }}>{p.value}</td><td style={{ color: 'var(--t4)' }}>{p.basis}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className={s.p14muted}>US rules for compressed-hydrogen vehicle tanks require a burst pressure of at least twice the nominal working pressure;<Cite r={['fmvss308']} /> a published aluminium-lined COPV was designed to a factor of three following EN 12245.<Cite r={['rocha']} /> This study uses 2.25. The overwrap is sized with the thin-wall sphere formula σ = p r / 2t. As a check on the assumed laminate, a [0/±45/90] stack built from the published ITS50/epoxy ply data of the same study gives E ≈ 52 GPa and fibre failure at ≈1,110 MPa under equal biaxial stress, so 50 GPa and 800 MPa are on the conservative side.</p>
              </section>

              <section id="cg-fea" className={`${s.chapter} grid-fit`} style={{ ['--min' as string]: '320px', gap: '24px 32px', display: 'grid' }} aria-labelledby="h-fea">
                <div className={s.stack14}>
                  <h2 id="h-fea" className="chapter-label">Tank FEA · methodology</h2>
                  <ul className={s.ruled}>
                    {FEA_STEPS.map(m => <li key={m.k} style={{ gap: 4, padding: '12px 0' }}><span className={s.stepKey}>{m.k}</span><span className={s.stepVal}>{m.v}</span></li>)}
                  </ul>
                </div>
                <Figure {...IMAGES.vonMises} ratio="1418/952" />
              </section>

              <section id="cg-verify" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-verify">
                <h2 id="h-verify" className="chapter-label">Verification · hand calculation vs FEA</h2>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 480 }}>
                    <thead><tr><th scope="col">Quantity</th><th scope="col">Hand calc</th><th scope="col">FEA</th></tr></thead>
                    <tbody>
                      {VERIFY.map(v => <tr key={v.q}><td>{v.q}</td><td className="mono">{v.h}</td><td className="mono" style={{ color: 'var(--ink)', fontWeight: 500 }}>{v.f}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className={s.p14muted}>Hand values come from force equilibrium across the equator, with liner and overwrap strained equally. Agreement is within 4 %; the growth differs most because the radial stress, ignored by membrane theory, compresses the wall. With the model confirmed against theory, its local results at the boss can be read with more confidence.</p>
                <div className="hairline hairline--sm" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,190px),1fr))' }}>
                  {FEA_RESULTS.map(r => (
                    <div key={r.label} className={s.kpi}>
                      <span className={s.kpiLabel}>{r.label}</span>
                      <span className={s.kpiValue}>{r.value}</span>
                      <span className={s.kpiSub}>{r.sub}</span>
                    </div>
                  ))}
                </div>
                <p className={s.p15}>The liner yields at working pressure. That is normal for Type III vessels: the finished tank is over-pressurised once (autofrettage) so the liner springs back into compression; one published COPV with a 6061-T6 liner (yield 256 MPa) for 350 bar service was autofrettaged at 600 bar for two minutes.<Cite r={['rocha']} /> The boss is the real weak point. Pressure on the polar opening pushes it outward and its flange bends against the composite, reaching about 775 MPa beside the port at working pressure, against a typical yield of about 880 MPa for annealed Ti-6Al-4V.<Cite r={['ti64']} /></p>
              </section>

              <section id="cg-nozzle" className={s.chapter} style={{ gap: 16 }} aria-labelledby="h-nozzle">
                <h2 id="h-nozzle" className="chapter-label">Nozzle sizing · isentropic flow</h2>
                <p className={s.p15}>Gas is regulated from the tank to a constant 100 bar chamber, and the nozzle is sized for 5 kN with its exit matched to 1 atm, using the one-dimensional isentropic relations.<Cite r={['sutton']} /></p>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 420 }}>
                    <thead><tr><th scope="col">Parameter</th><th scope="col">Value</th></tr></thead>
                    <tbody>
                      {NOZZLE.map(p => <tr key={p.name}><td>{p.name}</td><td className="mono" style={{ color: 'var(--ink)' }}>{p.value}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className={s.p14muted}>The exit temperature sits right at the dew point of air at 1 atm (≈82 K), where liquid would first start to form.<Cite r={['lemmon']} /> Any moisture in the feed would freeze long before, so the air must be dry.</p>
              </section>

              <section id="cg-cfd" className={s.chapter} style={{ gap: 16 }} aria-labelledby="h-cfd">
                <h2 id="h-cfd" className="chapter-label">Nozzle CFD · methodology</h2>
                <ul className={s.ruled}>
                  {CFD_STEPS.map(m => <li key={m.k} style={{ gap: 4, padding: '12px 0' }}><span className={s.stepKey}>{m.k}</span><span className={s.stepVal}>{m.v}</span></li>)}
                </ul>
                <p className={s.p14muted}>Solver reference: Greenshields et al.<Cite r={['greenshields']} /></p>
                <Figure {...IMAGES.cfd} ratio="1131/1124" />
                <h3 className={s.h3}>Verification · 1D theory vs CFD at the nozzle exit</h3>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 480 }}>
                    <thead><tr><th scope="col">Quantity</th><th scope="col">1D theory</th><th scope="col">CFD</th></tr></thead>
                    <tbody>
                      {CFD_VERIFY.map(v => <tr key={v.q}><td>{v.q}</td><td className="mono">{v.h}</td><td className="mono" style={{ color: 'var(--ink)', fontWeight: 500 }}>{v.f}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className={s.p15}>Thrust and mass flow land within 3 % of the hand calculation. Most of the gap is expected: a 15° conical nozzle throws part of its momentum sideways, and the classic divergence factor (1 + cos 15°)/2 = 0.983 alone takes the exhaust velocity from 664 to about 652 m/s, against 651 m/s from CFD.<Cite r={['sutton']} /> Exit pressure ends close to ambient, as designed.</p>
                <Figure {...IMAGES.cfdAxis} ratio="1088/550" />
                <p className={s.p15}>What the 1D model cannot show is the shock structure. The sharp corner at the throat turns the flow abruptly; the resulting waves focus on the axis about 40 mm downstream, where the Mach number drops suddenly before recovering. The core of the jet therefore leaves slightly slower and warmer (Mach 3.3, 94 K) than the flow near the wall (Mach 3.7, 82 K). From about the middle of the divergent section, the gas is colder than the dew point of air at its local pressure, and outside the nozzle it over-expands to 48 K. Whether droplets actually form depends on how far the gas supercools before nucleating, which needs a condensation model. A rounded throat and a contoured bell would remove the axis shock and shorten the nozzle.</p>
                <p className={s.p14muted}>The plume in the figure is the starting jet 0.3 ms after the valve opens, with its head and starting vortex still moving downstream. The flow inside the nozzle has settled; the plume has not.</p>
              </section>

              <section id="cg-conclusions" className={s.chapter} aria-labelledby="h-conc">
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

              <section id="cg-docs" className={s.chapter} aria-labelledby="h-docs">
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

              <section id="cg-refs" className={s.chapter} aria-labelledby="h-refs">
                <h2 id="h-refs" className="chapter-label">References</h2>
                <ol className={s.ruled}>
                  {REFS.map((r, i) => (
                    <li key={r.id} id={`ref-${r.id}`} style={{ flexDirection: 'row', gap: 10 }}>
                      <span className="mono" style={{ color: 'var(--teal-text)', fontSize: 12 }}>[{i + 1}]</span>
                      <span className={s.bcNote} style={{ fontSize: 13.5, color: 'var(--t2)' }}>{r.text}{'url' in r && <> <a href={r.url} target="_blank" rel="noopener noreferrer">{r.url.replace(/^https:\/\//, '')}</a></>}</span>
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
