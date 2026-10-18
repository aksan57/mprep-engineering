import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import { postBySlug } from '@/data/posts';
import { pageMeta } from '@/lib/meta';
import s from '../article.module.css';

const POST = postBySlug('cold-gas-thruster-tank-nozzle');

export const metadata = pageMeta(`/blog/${POST.slug}/`, { title: POST.title, description: POST.summary });

const CHAPTERS: [string, string][] = [
  ['known', 'What has been reported'],
  ['budget', 'How much air, at what pressure'],
  ['tank', 'Sizing the tank by hand'],
  ['fea', 'FEA of the tank section'],
  ['nozzle', 'Sizing the nozzle'],
  ['cfd', 'CFD of the nozzle and plume'],
  ['system', 'What the numbers add up to'],
  ['limits', 'Limitations'],
  ['files', 'Model files'],
  ['references', 'References'],
];

const REFS = [
  { id: 'evxl', text: 'H. Kesteloo, "Tesla Roadster thrusters up close: a tank of air and four nozzles," EVXL, 16 October 2026. Press report summarising the reveal livestream; tank volume attributed to Tesla VP of vehicle engineering Lars Moravy.', url: 'https://evxl.co/2026/10/16/tesla-roadster-thrusters-compressed-air-tank/' },
  { id: 'techcrunch', text: 'TechCrunch, "Tesla reveals SpaceX-powered Roadster that flies and falls with style," 15 October 2026.', url: 'https://techcrunch.com/2026/10/15/tesla-reveals-spacex-powered-roadster-that-flies-and-falls-with-style/' },
  { id: 'lemmon', text: 'E. W. Lemmon, R. T. Jacobsen, S. G. Penoncello and D. G. Friend, "Thermodynamic properties of air and mixtures of nitrogen, argon, and oxygen from 60 to 2000 K at pressures to 2000 MPa," Journal of Physical and Chemical Reference Data, vol. 29, no. 3, pp. 331–385, 2000.', url: 'https://doi.org/10.1063/1.1285884' },
  { id: 'coolprop', text: 'I. H. Bell, J. Wronski, S. Quoilin and V. Lemort, "Pure and pseudo-pure fluid thermophysical property evaluation and the open-source thermophysical property library CoolProp," Industrial & Engineering Chemistry Research, vol. 53, no. 6, pp. 2498–2508, 2014.', url: 'https://doi.org/10.1021/ie4033999' },
  { id: 'fmvss308', text: 'U.S. Code of Federal Regulations, 49 CFR § 571.308, Federal Motor Vehicle Safety Standard No. 308 — Compressed hydrogen fuel container integrity, paragraph S5.1.1.1.', url: 'https://www.law.cornell.edu/cfr/text/49/571.308' },
  { id: 'rocha', text: 'H. Rocha, P. Antunes, U. Lafont and J. P. Nunes, "Processing and structural health monitoring of a composite overwrapped pressure vessel for hydrogen storage," Structural Health Monitoring, 2024 (online 2023).', url: 'https://doi.org/10.1177/14759217231204242' },
  { id: 'sutton', text: 'G. P. Sutton and O. Biblarz, Rocket Propulsion Elements, 9th ed. Hoboken, NJ: Wiley, 2017. ISBN 978-1-118-75365-1. Chapter 3, nozzle theory and thermodynamic relations.' },
  { id: 'greenshields', text: 'C. J. Greenshields, H. G. Weller, L. Gasparini and J. M. Reese, "Implementation of semi-discrete, non-staggered central schemes in a colocated, polyhedral, finite volume framework, for high-speed viscous flows," International Journal for Numerical Methods in Fluids, vol. 63, no. 1, pp. 1–21, 2010.', url: 'https://doi.org/10.1002/fld.2069' },
] as const;
type RefId = (typeof REFS)[number]['id'];
const refNum = (id: RefId) => REFS.findIndex(r => r.id === id) + 1;

function Cite({ r }: { r: readonly RefId[] }) {
  return <sup className={s.cite}>[{r.map((id, i) => <span key={id}>{i > 0 && ', '}<a href={`#ref-${id}`} aria-label={`Reference ${refNum(id)}`}>{refNum(id)}</a></span>)}]</sup>;
}

const BUDGET = [
  ['Storage pressure needed for 250 kg in 600 L at 27 °C', '≈ 454 bar', 'Real-gas (Z ≈ 1.25)'],
  ['Mass that 600 L holds at 5,500 psi (379 bar), 27 °C', '≈ 223 kg', 'Real-gas'],
  ['Same, if air were treated as an ideal gas', '≈ 264 kg', 'Over-estimates by ~18 %'],
  ['Minimum work to store 250 kg at 450 bar (exergy)', '≈ 37 kWh', 'Reversible, isothermal limit'],
];

const TANK = [
  ['Inner radius / volume per sphere', '415 mm / 0.30 m³'],
  ['Working pressure / burst pressure (×2.25)', '45 MPa / 101 MPa'],
  ['Liner', 'Al 6061-T6, 3 mm'],
  ['Overwrap', 'Carbon/epoxy, quasi-isotropic, 26 mm'],
  ['Polar boss', 'Ti-6Al-4V, Ø70 mm neck, Ø24 mm port'],
  ['Shell mass, two spheres', '≈ 208 kg (172 kg composite, 35 kg liner)'],
];

const FEA_CMP = [
  ['Overwrap, equator (membrane)', '313', '298', 'OK — 670 MPa at burst vs. ≈800 MPa assumed strength'],
  ['Liner, equator (membrane)', '451', '434', 'Above Al 6061-T6 yield (≈276 MPa)'],
  ['Liner beside boss', '—', '≈530', 'Local peak where the liner meets the stiffer boss'],
  ['Boss, bore side of flange', '—', '≈775', 'Close to Ti-6Al-4V yield; flange bending governs'],
];

const NOZZLE = [
  ['Regulated chamber pressure, p₀', '100 bar'],
  ['Chamber temperature, T₀', '300 K'],
  ['Design thrust (sea level, matched exit)', '5 kN'],
  ['Throat / exit diameter', '20.3 mm / 57.5 mm'],
  ['Area ratio Aₑ/A*', '8.05'],
  ['Exit Mach number', '3.68'],
  ['Exit velocity / specific impulse', '664 m/s / 68 s'],
  ['Mass flow per nozzle', '7.5 kg/s'],
  ['Exit static temperature (ideal gas)', '≈ 81 K'],
];

const LIMITS = [
  ['Composite as an isotropic solid', 'A real overwrap is a stack of helical and hoop layers with very different stiffness along and across the fibre. A laminate model, and a failure criterion per ply, are needed for a design check.'],
  ['Linear-elastic liner', 'The liner yields at working pressure in this model. A real vessel is autofrettaged, so the liner sits in residual compression at zero pressure. That needs an elastic–plastic, load–unload analysis.'],
  ['No mesh-convergence study', 'The liner is only about two elements thick, and the peaks at the boss were not checked on a refined mesh. Membrane stresses are reliable; the local peaks are indicative only.'],
  ['No fatigue or stress rupture', 'A car tank sees thousands of fills and thruster blow-downs. Composite stress rupture and liner fatigue usually size the vessel, not the static burst case alone.'],
  ['Steady chamber pressure', 'In a real firing the regulator holds p₀ only while the tank stays above it. As the tank empties, the gas in it cools and its pressure falls faster than the simple estimate.'],
  ['Inviscid, ideal-gas CFD', 'Wall friction, boundary layers and real-gas effects at 100 bar are left out. Condensation of air in the plume, which the exit temperature suggests is possible, is not modelled at all.'],
  ['Thrust and tank figures are illustrative', 'Tesla has not published a thrust, a storage pressure or a nozzle drawing. The numbers here are a self-consistent design built around the reported volume and mass, not a description of the car.'],
];

const FILES = [
  ['copv_tank_450bar.step', 'Two-material-plus-boss tank, 3D (liner, overwrap, boss as separate bodies)'],
  ['copv_axisym_section.step', 'The 2D axisymmetric section used for the FEA, with shared edges between materials'],
  ['coldgas_nozzle_5kN.step', 'Conical convergent–divergent nozzle with mounting flange'],
];

export default function Post() {
  return (
    <section className="section section--paper">
      <div className="container">
        <Link href="/blog/" className={s.back}><span aria-hidden="true">←</span> All articles</Link>

        <article aria-labelledby="post-title" className={s.article}>
          <header className={s.header}>
            <div className={s.headerText}>
              <span className={s.kicker}>{POST.label.toUpperCase()} · {POST.num}</span>
              <h1 id="post-title" className={s.title}>{POST.title}</h1>
              <p className={s.summary}>{POST.summary}</p>
            </div>
            <dl className={s.meta}>
              <div><dt>PUBLISHED</dt><dd><time dateTime={POST.date}>19 October 2026</time></dd></div>
              <div><dt>READING TIME</dt><dd>{POST.readTime}</dd></div>
              <div><dt>TOOLS</dt><dd>CAD, PrePoMax / CalculiX, SimFlow / OpenFOAM</dd></div>
              <div><dt>LEVEL</dt><dd>Practitioner</dd></div>
            </dl>
          </header>

          <div className={s.body}>
            <nav aria-label="Article contents" className={s.toc}>
              <ol>
                {CHAPTERS.map(([id, label], i) => <li key={id}><a href={`#${id}`}><span className={s.tocNum}>{String(i + 1).padStart(2, '0')}</span>{label}</a></li>)}
              </ol>
            </nav>

            <div className={s.chapters}>
              {/* 01 */}
              <section id="known" className={s.chapter} aria-labelledby="h-known">
                <span className="chapter-label">01 · Context</span>
                <h2 id="h-known" className={s.h2}>What has been reported</h2>
                <p className={s.lead}>A road car that hops over other cars on jets of compressed air is a good excuse to work through two classic pieces of hardware: a high-pressure composite tank and a supersonic nozzle.</p>
                <p className={s.p}>The second-generation Tesla Roadster, shown on 15 October 2026, uses cold-gas thrusters to jump and to hold itself through an inverted ramp manoeuvre.<Cite r={['techcrunch']} /> Very little engineering detail has been published. Press reports of the livestream give two numbers: about 600 litres of stored gas, described as air, in composite overwrapped pressure vessels (COPVs), and about 250 kg of it. A screen in one photo reads 5,500 psi, roughly 380 bar.<Cite r={['evxl']} /></p>
                <p className={s.p}>This article does not try to reverse-engineer the car. It treats those reported figures as a design brief and asks what an engineer would have to solve to meet it, using the same workflow MPrep uses on client equipment: hand calculations first, then CAD, FEA and CFD to check what the hand calculations cannot see.</p>
                <div className={`${s.callout} ${s.calloutTeal}`}>
                  <span className={s.calloutLabel}>SCOPE</span>
                  <p>Every dimension, material and load below is the author&apos;s own assumption, chosen to be self-consistent with the reported volume and mass. None of it is a Tesla specification.</p>
                </div>
              </section>

              {/* 02 */}
              <section id="budget" className={s.chapter} aria-labelledby="h-budget">
                <span className="chapter-label">02 · Gas budget</span>
                <h2 id="h-budget" className={s.h2}>How much air, at what pressure</h2>
                <p className={s.p}>The first check is whether 250 kg of air fits in 600 litres at the reported pressure. That is a density of about 417 kg/m³ — a third of the density of water — and at this point air is no longer an ideal gas. Using the reference equation of state for air<Cite r={['lemmon']} /> (evaluated with CoolProp<Cite r={['coolprop']} />), the compressibility factor at 27 °C and 450 bar is about 1.25: the gas is 25 % less dense than the ideal-gas law predicts.</p>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 640 }}>
                    <thead><tr><th scope="col">Quantity</th><th scope="col">Value</th><th scope="col">Basis</th></tr></thead>
                    <tbody>{BUDGET.map(r => <tr key={r[0]}><td className={s.td}>{r[0]}</td><td className="mono" style={{ color: 'var(--ink)' }}>{r[1]}</td><td className={s.td}>{r[2]}</td></tr>)}</tbody>
                  </table>
                </div>
                <p className={s.p}>The reported figures do not quite agree with each other: 600 L at 380 bar holds about 223 kg, not 250 kg. Either the volume, the mass or the pressure is rounded, or the tanks are filled cold. For the rest of this study the design point is <strong>two 300-litre spheres at 450 bar</strong>, which carries the full 250 kg.</p>
                <p className={s.p}>The last row matters for the &quot;refills itself&quot; claim. Even a perfect, isothermal compressor needs about 37 kWh to store that air; a real multi-stage compressor with intercooling needs noticeably more. Against the roughly 200 kWh battery that has been quoted for the car, a full refill is a significant draw, not a free extra.</p>
              </section>

              {/* 03 */}
              <section id="tank" className={s.chapter} aria-labelledby="h-tank">
                <span className="chapter-label">03 · Hand calculation</span>
                <h2 id="h-tank" className={s.h2}>Sizing the tank by hand</h2>
                <p className={s.p}>A sphere is the most mass-efficient pressure vessel because the membrane stress is the same in every direction:</p>
                <div className={s.eq}>σ = p r / (2 t)</div>
                <p className={s.eqWhere}>where p is the internal pressure, r the mean radius and t the wall thickness.</p>
                <p className={s.p}>The tank is a Type III COPV: a thin metal liner that keeps the gas in, wrapped in carbon fibre that carries the load. US rules for compressed-hydrogen vehicle tanks require a burst pressure of at least twice the nominal working pressure (3.5 times for glass-fibre containers).<Cite r={['fmvss308']} /> This study uses a slightly more conservative factor of 2.25. Sizing the overwrap so that it reaches an assumed 800 MPa biaxial strength at 101 MPa gives about 26 mm of carbon on a 3 mm aluminium liner.</p>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 560 }}>
                    <thead><tr><th scope="col">Design parameter</th><th scope="col">Value</th></tr></thead>
                    <tbody>{TANK.map(r => <tr key={r[0]}><td className={s.td}>{r[0]}</td><td className="mono" style={{ color: 'var(--ink)' }}>{r[1]}</td></tr>)}</tbody>
                  </table>
                </div>
                <p className={s.p}>The result is two spheres 888 mm across, each about the size of an exercise ball. Together the shells weigh about 208 kg, close to the mass of the air they hold. That is the first real design pressure on the concept: on a 2-tonne car, every kilogram of tank is a kilogram the thrusters have to lift.</p>
                <figure className="figure">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    <img src="/assets/blog/cold-gas/copv-cutaway.webp" alt="Cut-away CAD model of the spherical tank showing the black carbon overwrap, the grey aluminium liner and the titanium boss at the pole" width={801} height={800} loading="lazy" />
                    <img src="/assets/blog/cold-gas/nozzle-cad.webp" alt="CAD model of the conical convergent-divergent nozzle with its mounting flange" width={845} height={957} loading="lazy" />
                  </div>
                  <figcaption className="figcaption">Fig. 1 · Left: tank cut-away, with the carbon overwrap (black), aluminium liner (grey) and titanium boss at the pole. Right: the 5 kN nozzle. Both models are available as STEP files below.</figcaption>
                </figure>
              </section>

              {/* 04 */}
              <section id="fea" className={s.chapter} aria-labelledby="h-fea">
                <span className="chapter-label">04 · Structural analysis</span>
                <h2 id="h-fea" className={s.h2}>FEA of the tank section</h2>
                <p className={s.p}>The membrane formula says nothing about the place where the tank is most likely to fail: the polar boss, where a stiff metal fitting meets a thin liner and a thick composite. That needs a finite-element model.</p>
                <h3 className={s.h3}>Model</h3>
                <p className={s.p}>Because the tank, the boss and the load are all symmetric about the polar axis, a 2D axisymmetric model captures the full 3D stress state at a fraction of the cost. The section was meshed with second-order six-node axisymmetric triangles (CAX6) — about 40,000 elements, with edges of about 2 mm in the 3 mm liner — and solved in CalculiX through PrePoMax. The three materials share nodes along their interfaces (perfect bond). A pressure of 45 MPa acts on the inner surface and inside the port; one node on the axis at the bottom pole is held axially to stop rigid-body motion.</p>
                <figure className="figure">
                  <img src="/assets/blog/cold-gas/copv-vonmises.webp" alt="Von Mises stress contour on the axisymmetric tank section at 450 bar, with a zoomed view of the polar boss showing a stress concentration in the liner next to the boss and in the boss flange near the port" width={1418} height={952} loading="lazy" />
                  <figcaption className="figcaption">Fig. 2 · Von Mises stress at 450 bar. Left: full section, axis at r = 0. Right: the polar boss region. The peak at the re-entrant corner is a mesh-dependent singularity and is not used for assessment.</figcaption>
                </figure>
                <h3 className={s.h3}>Results</h3>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 720 }}>
                    <thead><tr><th scope="col">Location</th><th scope="col">Hand calc (MPa)</th><th scope="col">FEA (MPa)</th><th scope="col">Comment</th></tr></thead>
                    <tbody>{FEA_CMP.map(r => <tr key={r[0]}><td className={s.tdStrong}>{r[0]}</td><td className="mono">{r[1]}</td><td className="mono" style={{ color: 'var(--ink)' }}>{r[2]}</td><td className={s.td}>{r[3]}</td></tr>)}</tbody>
                  </table>
                </div>
                <p className={s.p}>Away from the boss, FEA and hand calculation agree within 5 %. The small difference is the thick-wall effect: with a radius-to-thickness ratio of about 14, the inner fibres carry slightly more than the mean. That agreement is the reason to run the hand calculation first. It tells you the model is loaded and restrained correctly before you start trusting its peaks.</p>
                <p className={s.p}>Two findings matter more than the burst margin.</p>
                <ul className={s.list}>
                  <li><strong>The liner yields at working pressure.</strong> Aluminium and carbon are strained together, and at the strain the carbon needs to carry its load, aluminium is past yield. This is normal for Type III vessels. Manufacturers deliberately over-pressurise the finished vessel once (autofrettage) so that the liner yields, then springs back into compression when the composite unloads. One published hydrogen COPV with an aluminium liner was autofrettaged at 600 bar for two minutes before pressure cycling.<Cite r={['rocha']} /> Showing this properly needs an elastic–plastic analysis with a load–unload cycle, not a single linear step.</li>
                  <li><strong>The boss is the weak point.</strong> The pressure acting on the polar opening pushes the boss outward, and its flange bends against the composite. Next to the port the stress reaches about 775 MPa, close to titanium&apos;s yield at <em>working</em> pressure, let alone burst. A wider, thicker or tapered flange, a smaller port, or a different load path into the overwrap would be the next design iteration.</li>
                </ul>
              </section>

              {/* 05 */}
              <section id="nozzle" className={s.chapter} aria-labelledby="h-nozzle">
                <span className="chapter-label">05 · Hand calculation</span>
                <h2 id="h-nozzle" className={s.h2}>Sizing the nozzle</h2>
                <p className={s.p}>Firing straight from 450 bar would waste most of the stored pressure and make thrust fall steadily as the tank empties, so cold-gas systems normally regulate the gas down to a constant chamber pressure. Here the chamber is set at 100 bar and the nozzle is sized for 5 kN of thrust with its exit pressure matched to the atmosphere. The relations are the standard one-dimensional isentropic nozzle equations:<Cite r={['sutton']} /></p>
                <div className={s.eq}>p₀ / pₑ = (1 + (γ−1)/2 · Mₑ²)<sup>γ/(γ−1)</sup> &nbsp;·&nbsp; F = C<sub>F</sub> p₀ A*</div>
                <p className={s.eqWhere}>where γ = 1.4 for air, Mₑ is the exit Mach number, C<sub>F</sub> the thrust coefficient (1.55 here) and A* the throat area.</p>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 480 }}>
                    <thead><tr><th scope="col">Nozzle parameter</th><th scope="col">Value</th></tr></thead>
                    <tbody>{NOZZLE.map(r => <tr key={r[0]}><td className={s.td}>{r[0]}</td><td className="mono" style={{ color: 'var(--ink)' }}>{r[1]}</td></tr>)}</tbody>
                  </table>
                </div>
                <p className={s.p}>The geometry is a simple conical nozzle: a 30° convergent section and a 15° divergent cone, 104 mm from inlet to exit.</p>
                <div className={`${s.callout} ${s.calloutTeal}`}>
                  <span className={s.calloutLabel}>THE COLD IN COLD GAS</span>
                  <p>Expanding air from 100 bar to 1 bar drops its static temperature to about 81 K. Air at atmospheric pressure begins to condense at about 79 K.<Cite r={['lemmon']} /> This nozzle is designed right at the edge of liquefying its own exhaust, and any moisture in the air would have frozen long before. Dry feed air, or a less aggressive expansion, is part of the design.</p>
                </div>
              </section>

              {/* 06 */}
              <section id="cfd" className={s.chapter} aria-labelledby="h-cfd">
                <span className="chapter-label">06 · Fluid dynamics</span>
                <h2 id="h-cfd" className={s.h2}>CFD of the nozzle and plume</h2>
                <p className={s.p}>The isentropic equations assume flow that is uniform across every section and leaves the nozzle parallel to the axis. A conical nozzle breaks both assumptions, and the plume outside the nozzle is not covered at all. A CFD model checks how far the real flow departs from the hand calculation.</p>
                <h3 className={s.h3}>Model</h3>
                <p className={s.p}>The flow was solved with rhoCentralFoam, OpenFOAM&apos;s density-based solver for high-speed compressible flow,<Cite r={['greenshields']} /> set up and run in SimFlow. The domain is a 5° axisymmetric wedge that includes a short plenum upstream of the nozzle and the plume up to 250 mm downstream, on a structured mesh of about 25,000 cells. The inlet is held at 100 bar total pressure and 300 K; the surroundings are at 1 atm. Walls are slip walls (inviscid flow), and the run is continued until the flow inside the nozzle no longer changes.</p>
                {/* CFD_RESULTS */}
              </section>

              {/* 07 */}
              <section id="system" className={s.chapter} aria-labelledby="h-system">
                <span className="chapter-label">07 · System view</span>
                <h2 id="h-system" className={s.h2}>What the numbers add up to</h2>
                <p className={s.p}>With four nozzles of this size, the system would produce 20 kN, about the weight of a 2-tonne car, and use 30 kg of air per second. At that rate the full 250 kg lasts about eight seconds of firing. The total impulse is roughly 250 kg × 664 m/s ≈ 170 kN·s: enough for a few short hops or a series of brief stabilising pulses, not for sustained flight.</p>
                <p className={s.p}>That conclusion follows from the specific impulse. At about 70 s, cold air has roughly a quarter of the specific impulse of a chemical rocket, so the only way to get more impulse is more gas, which means more tank. In this design the tank shells already weigh almost as much as the air they hold.</p>
              </section>

              {/* 08 */}
              <section id="limits" className={s.chapter} aria-labelledby="h-limits">
                <span className="chapter-label">08 · Limitations</span>
                <h2 id="h-limits" className={s.h2}>Limitations</h2>
                <p className={s.p}>This is a first-pass study meant to show the method. Before any of it could be used as a design, these simplifications would have to be removed:</p>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 720 }}>
                    <thead><tr><th scope="col">Simplification</th><th scope="col">Why it matters</th></tr></thead>
                    <tbody>{LIMITS.map(r => <tr key={r[0]}><td className={s.tdStrong}>{r[0]}</td><td className={s.td}>{r[1]}</td></tr>)}</tbody>
                  </table>
                </div>
              </section>

              {/* 09 */}
              <section id="files" className={s.chapter} aria-labelledby="h-files">
                <span className="chapter-label">09 · Downloads</span>
                <h2 id="h-files" className={s.h2}>Model files</h2>
                <p className={s.p}>The CAD geometry used in this article is free to download and reuse. Dimensions are in millimetres; the tank axis is the y-axis.</p>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 560 }}>
                    <thead><tr><th scope="col">File</th><th scope="col">Contents</th></tr></thead>
                    <tbody>{FILES.map(r => <tr key={r[0]}><td className="mono"><a href={`/assets/blog/cold-gas/${r[0]}`} download>{r[0]}</a></td><td className={s.td}>{r[1]}</td></tr>)}</tbody>
                  </table>
                </div>
                <div className={s.related}>
                  <span className="chapter-label">Related in this series</span>
                  <ul>
                    <li><span className={s.relatedNum}>02</span>FEA Mesh Convergence: How to Determine Whether Your Mesh Is Fine Enough</li>
                    <li><span className={s.relatedNum}>08</span>Pressure Vessel Design Basics: Hoop Stress, Wall Thickness, and FEA Considerations</li>
                  </ul>
                </div>
              </section>

              <section id="references" className={s.chapter} aria-labelledby="h-references">
                <span className="chapter-label">References</span>
                <h2 id="h-references" className={s.h2}>References</h2>
                <ol className={s.refs}>
                  {REFS.map((r, i) => (
                    <li key={r.id} id={`ref-${r.id}`}>
                      <span className={s.refNum}>[{i + 1}]</span>
                      <span>{r.text}{'url' in r && <> <a href={r.url} target="_blank" rel="noopener noreferrer" className={s.refLink}>{r.url.replace(/^https:\/\//, '')}</a></>}</span>
                    </li>
                  ))}
                </ol>
                <p className={s.note}>Design dimensions, material choices, FEA and CFD models and results are the author&apos;s own and are illustrative. Tesla has not published engineering data for this system.</p>
              </section>
            </div>
          </div>
        </article>

        <CtaBand />
      </div>
    </section>
  );
}
