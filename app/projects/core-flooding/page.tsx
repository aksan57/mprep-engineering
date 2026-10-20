import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import { Figure } from '@/components/Img';
import {
  BASIS, CF, CF_PARTS, CHAPTERS, CHECKS, DOCS, FINDINGS, IMAGES, KPIS, LIMITATIONS, NEXT_STEPS, REFS, SYSTEM, VERIFY,
} from '@/data/coreflood';
import { pageMeta } from '@/lib/meta';
import s from '../cz-r4/case.module.css';

export const metadata = pageMeta('/projects/core-flooding/', {
  title: 'Core-flooding apparatus for EOR — case study',
  description: CF.summary,
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

        <article aria-labelledby="cf-title" className={s.article}>
          <header className={s.header}>
            <div className={s.headerText}>
              <span className={s.kicker}>CASE STUDY 04</span>
              <h1 id="cf-title" className={s.title}>{CF.title}</h1>
              <p className={s.summary}>{CF.summary}</p>
            </div>
            <dl className={s.meta}>
              {CF.meta.map(m => <div key={m.k}><dt>{m.k}</dt><dd>{m.v}</dd></div>)}
            </dl>
          </header>

          <div className={s.body}>
            <nav aria-label="Case study contents" className={s.toc}>
              <ol>
                {CHAPTERS.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
              </ol>
            </nav>

            <div className={s.chapters}>
              <section id="cf-overview" className={s.chapter} aria-labelledby="h-overview">
                <h2 id="h-overview" className="chapter-label">Overview</h2>
                <p className={s.p17}>A core flood pushes brine, polymer, surfactant or CO₂ through a rock plug at reservoir pressure and temperature, then measures what comes out and how hard it was to push. The rig has to hold 10,000 psi around a rubber sleeve, deliver flow rates as low as 0.01 mL/min without pulsing, read pressure drops from a fraction of a psi to over a thousand, and stay safe with dense CO₂ at 150 °C. This study designs that rig at system level and then looks closely at its most critical part, the core holder. It has four parts:</p>
                <ol className={`hairline hairline--sm ${s.parts}`}>
                  {CF_PARTS.map(pt => <li key={pt.n}><span className={s.partNum}>{pt.n}</span><span>{pt.t}</span></li>)}
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
                <p className={s.p15muted}>The rig is MPrep&apos;s own generic design. The design basis uses typical industry values, not a client specification, and the components are generic specifications; no vendor is endorsed.</p>
              </section>

              <section id="cf-basis" className={s.chapter} style={{ gap: 16 }} aria-labelledby="h-basis">
                <h2 id="h-basis" className="chapter-label">Design basis</h2>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 560 }}>
                    <thead><tr><th scope="col">Parameter</th><th scope="col">Value</th><th scope="col">Note</th></tr></thead>
                    <tbody>
                      {BASIS.map(p => <tr key={p.name}><td>{p.name}</td><td className="mono" style={{ color: 'var(--ink)' }}>{p.value}</td><td style={{ color: 'var(--t4)' }}>{p.basis}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="cf-system" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-system">
                <h2 id="h-system" className="chapter-label">System design &amp; P&amp;ID</h2>
                <Figure {...IMAGES.pid} ratio="2977/2104" />
                <ul className={s.ruled}>
                  {SYSTEM.map(m => <li key={m.k} style={{ gap: 4, padding: '12px 0' }}><span className={s.stepKey}>{m.k}</span><span className={s.stepVal}>{m.v}</span></li>)}
                </ul>
                <Figure {...IMAGES.dp} ratio="1152/672" />
                <p className={s.p14muted}>Tube ratings follow ASME B31.3;<Cite r={['b313']} /> CO₂ properties and stored energy use the Span–Wagner equation of state.<Cite r={['span']} /></p>
              </section>

              <section id="cf-holder" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-holder">
                <h2 id="h-holder" className="chapter-label">Core holder · design &amp; hand calculations</h2>
                <div className="grid-fit" style={{ ['--min' as string]: '300px' }}>
                  <Figure {...IMAGES.cutaway} ratio="1120/780" />
                  <Figure {...IMAGES.drawing} ratio="1819/1285" />
                </div>
                <p className={s.p15}>In a Hassler holder, the confining fluid squeezes a rubber sleeve onto the core, and the inlet end piece floats, so the rock sees the same net stress from every side. A 4.5 in OD body with a 2.25 in bore gives a wall ratio of 2.0. In annealed 316 at 177 °C, the VIII-2 design-by-rule wall is 27.4 mm against the 28.6 mm provided. The 3-8 UN end plugs carry 177 kN on twelve threads, with a stripping safety factor of 1.97.<Cite r={['asme2']} /> At 10,000 psi Division 2 still gives a sensible wall; Division 3 becomes the better route above roughly 10–15 ksi. Steel and nickel bodies are opaque to lab CT, so an imaging variant needs titanium or carbon fibre.</p>
              </section>

              <section id="cf-fea" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-fea">
                <h2 id="h-fea" className="chapter-label">Stress &amp; fatigue · CalculiX</h2>
                <p className={s.p15}>The axisymmetric model includes the actual thread teeth in contact, refined to 0.03 mm at the roots. A 3D quarter model covers the confining port with its medium-pressure gland. Stresses are linearised on classification lines per VIII-2 Annex 5-A.<Cite r={['asme2', 'ccx']} /></p>
                <div className="grid-fit" style={{ ['--min' as string]: '300px' }}>
                  <Figure {...IMAGES.threadFea} ratio="2518/1306" />
                  <Figure {...IMAGES.portFea} ratio="2518/1306" />
                </div>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 560 }}>
                    <thead><tr><th scope="col">Check</th><th scope="col">Criterion</th><th scope="col">Result</th></tr></thead>
                    <tbody>
                      {CHECKS.map(c => <tr key={c.q}><td>{c.q}</td><td style={{ color: 'var(--t4)' }}>{c.c}</td><td className="mono" style={{ color: 'var(--ink)', fontWeight: 500 }}>{c.r}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <div className="grid-fit" style={{ ['--min' as string]: '300px' }}>
                  <Figure {...IMAGES.toothLoad} ratio="1024/544" />
                  <Figure {...IMAGES.fatigue} ratio="1088/640" />
                </div>
                <p className={s.p15}>The plug load is far from evenly shared. The innermost tooth carries about 21 %, roughly 2.5 times a uniform share, so fatigue at the thread is set by its root radius. The cross-bore governs overall: in 316 the ligament next to the gland uses 153.4 of the 154 MPa allowed. Together with local bore yielding at hydrotest and the corrosive fluids, that makes C-276 the recommended body material. Fatigue uses the strain-life basis of the austenitic design curve with the classic 2/20 margins,<Cite r={['chopra']} /> and its usage stays below 0.5 at 20,000 cycles.</p>
              </section>

              <section id="cf-seal" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-seal">
                <h2 id="h-seal" className="chapter-label">Sleeve sealing · minimum net confining stress</h2>
                <p className={s.p15}>Fluid bypasses along the core when the sleeve fails to fill the gaps of the rock surface. A Mooney–Rivlin FKM sleeve (75 Shore A, constants from Gent&apos;s hardness relation)<Cite r={['gent']} /> pressed onto 20 µm surface waviness closes every gap at 0.54 MPa (≈ 80 psi). Johnson&apos;s complete-contact solution gives 0.59 MPa.<Cite r={['johnson']} /> Along the core the contact pressure averages 1.04× the net stress and dips to 0.83× just past the chamfered joint, so sealing needs about 95 psi net at 20 µm and 280 psi at 50 µm. The familiar ≥ 500 psi rule is that requirement plus margin for vuggy faces, harder sleeves and the inlet pore pressure, and it has to be held at the inlet.</p>
                <div className="grid-fit" style={{ ['--min' as string]: '300px' }}>
                  <Figure {...IMAGES.micro} ratio="1024/576" />
                  <Figure {...IMAGES.contact} ratio="1120/576" />
                </div>
                <p className={s.p14muted}>Elastomers: FKM is the baseline; FEPM (Aflas) suits alkaline–surfactant–polymer floods and amines; FFKM covers everything at a cost. After CO₂ exposure, depressurise at ≤ 2 MPa/min, the rate used in RGD qualification.<Cite r={['iso23936']} /></p>
              </section>

              <section id="cf-thermal" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-thermal">
                <h2 id="h-thermal" className="chapter-label">Heat-up · oven vs heating jacket</h2>
                <Figure {...IMAGES.heatup} ratio="1760/608" />
                <p className={s.p15} id="cf-thermal-text">An oven heats holder, transfer vessels and lines together and leaves the core uniform to a fraction of a degree, but the ~40 kg holder needs about 10 hours to come within ±1 °C of 150 °C. A heating jacket gets there in about 1.8 hours. With bare end caps the core ends sit 0.3 °C cooler and the heater loses 26 W; insulating the caps cuts that to 4 W and 0.05 °C. In jacket mode the injected fluid needs a pre-heater: 20 mL/min of water from 20 °C needs about 180 W. The wall sees up to 9.5 °C through-thickness during jacket heat-up, about 21 MPa of secondary stress, small and reached before pressurisation.</p>
              </section>

              <section id="cf-cfd" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-cfd">
                <h2 id="h-cfd" className="chapter-label">Inlet distributor · OpenFOAM</h2>
                <Figure {...IMAGES.cfdMaps} ratio="1600/1300" />
                <div className="grid-fit" style={{ ['--min' as string]: '300px' }}>
                  <Figure {...IMAGES.ui} ratio="1024/608" />
                  <p className={s.p15} style={{ alignSelf: 'center' }}>Fluid enters the core only under the grooves of the end-piece face and spreads inside the rock. The core is modelled as a Darcy porous zone,<Cite r={['of']} /> and four face patterns are compared with a uniformity index. In a 100 mD core the groove pressure drop is negligible, so the pattern matters through coverage and the distance from any point of the face to the nearest groove. A two-start spiral comes out best (UI 0.86 at 1 mm, against 0.76 for the rings-plus-radial baseline and 0.66 for radial grooves), partly because it opens more of the face. A face with only a centre hole starves the outer core and adds the equivalent of ~12 cm of rock to the inlet pressure drop.</p>
                </div>
              </section>

              <section id="cf-process" className={s.chapter} style={{ gap: 20 }} aria-labelledby="h-process">
                <h2 id="h-process" className="chapter-label">Process model · why the specification</h2>
                <Figure {...IMAGES.bl} ratio="2160/640" />
                <p className={s.p15}>A 1D Buckley–Leverett model<Cite r={['bl', 'lake']} /> with generic sandstone curves gives the following. A polymer that lowers the mobility ratio from 6.7 to 0.3 delays breakthrough from 0.32 to 0.47 PV and lifts recovery after 3 PV from 54 % to 62 %. A qualitative surfactant–polymer case, with lower residual oil, reaches about 90 %. The cost is pressure drop, which rises several-fold at the same rate and scales with rate over permeability. That sets the dP ranges and the rate limits. Reservoir pressure, CO₂ miscibility<Cite r={['yellig']} /> and a net confining stress on top set the 9,000 / 10,000 psi rating. Chemical stability testing sets 150 °C.</p>
              </section>

              <section id="cf-verify" className={s.chapter} style={{ gap: 16 }} aria-labelledby="h-verify">
                <h2 id="h-verify" className="chapter-label">Verification</h2>
                <ul className={s.ruled}>
                  {VERIFY.map(m => <li key={m.k} style={{ gap: 4, padding: '12px 0' }}><span className={s.stepKey}>{m.k}</span><span className={s.stepVal}>{m.v}</span></li>)}
                </ul>
                <Figure {...IMAGES.lame} ratio="1024/576" />
              </section>

              <section id="cf-conclusions" className={s.chapter} aria-labelledby="h-conc">
                <h2 id="h-conc" className="chapter-label">Conclusions &amp; next steps</h2>
                <div className="grid-fit" style={{ ['--min' as string]: '300px', gap: 24 }}>
                  <div className={s.concl}><h3 className={s.conclTitle}>Findings</h3><ul>{FINDINGS.map(x => <li key={x}>{x}</li>)}</ul></div>
                  <div className={`${s.concl} ${s.conclNext}`}><h3 className={s.conclTitle}>Next steps</h3><ul>{NEXT_STEPS.map(x => <li key={x}>{x}</li>)}</ul></div>
                </div>
                <div className={s.limits}>
                  <h3 className={s.limitsLabel}>LIMITATIONS</h3>
                  <ul>{LIMITATIONS.map(l => <li key={l}>{l}</li>)}</ul>
                </div>
              </section>

              <section id="cf-docs" className={s.chapter} aria-labelledby="h-docs">
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

              <section id="cf-refs" className={s.chapter} aria-labelledby="h-refs">
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
