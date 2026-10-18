import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import { postBySlug } from '@/data/posts';
import { pageMeta } from '@/lib/meta';
import s from '../article.module.css';
import FurnaceBcDiagram, { FurnaceBcLegend } from './FurnaceBcDiagram';

const POST = postBySlug('furnace-thermal-boundary-conditions');

export const metadata = pageMeta(`/blog/${POST.slug}/`, { title: POST.title, description: POST.summary });

const CHAPTERS: [string, string][] = [
  ['why', 'Why boundary conditions decide the answer'],
  ['heaters', 'Heaters: temperature, power or control'],
  ['insulation', 'Insulation and conduction'],
  ['radiation', 'Surface emissivity and radiation'],
  ['cooled', 'Shell, cooled and leaky boundaries'],
  ['example', 'Worked example: one wall, four answers'],
  ['sensitivity', 'How assumptions shift predictions'],
  ['checks', 'Checking the model'],
  ['documenting', 'Documenting the assumptions'],
  ['checklist', 'Checklist'],
  ['references', 'References'],
];

const REFS = [
  { n: 1, text: 'T. L. Bergman, A. S. Lavine, F. P. Incropera and D. P. DeWitt, Fundamentals of Heat and Mass Transfer, 7th ed. Hoboken, NJ: Wiley, 2011. ISBN 978-0-470-50197-9.' },
  { n: 2, text: 'S. W. Churchill and H. H. S. Chu, "Correlating equations for laminar and turbulent free convection from a horizontal cylinder," International Journal of Heat and Mass Transfer, vol. 18, no. 9, pp. 1049–1053, 1975.', url: 'https://doi.org/10.1016/0017-9310(75)90222-7' },
  { n: 3, text: 'R. H. S. Winterton, "Where did the Dittus and Boelter equation come from?" International Journal of Heat and Mass Transfer, vol. 41, no. 4–5, pp. 809–810, 1998.', url: 'https://doi.org/10.1016/S0017-9310(97)00177-4' },
  { n: 4, text: 'M. F. Modest and S. Mazumder, Radiative Heat Transfer, 4th ed. London: Academic Press (Elsevier), 2022. ISBN 978-0-12-818143-0.', url: 'https://shop.elsevier.com/books/radiative-heat-transfer/modest/978-0-12-818143-0' },
  { n: 5, text: 'Kanthal, "Globar® SG and SR silicon carbide heating elements," product page, accessed 18 October 2026.', url: 'https://www.kanthal.com/en/products/furnace-products/electric-heating-elements/silicon-carbide-heating-elements/element-grades/globar-sg-and-sr/' },
  { n: 6, text: 'Morgan Thermal Ceramics, "Kaowool® Organic Boards," product data sheet SH.03 (Americas), January 2025. Thermal conductivity per ASTM C201.', url: 'https://www.morganthermalceramics.com/media/8981/kaowool-boards_americas-region_eng.pdf' },
  { n: 7, text: 'Neutrium, "Total normal emissivities of selected materials," accessed 18 October 2026.', url: 'https://neutrium.net/heat-transfer/total-normal-emissivities-of-selected-materials/' },
  { n: 8, text: 'The Engineering ToolBox, "Emissivity coefficients of common materials," accessed 18 October 2026.', url: 'https://www.engineeringtoolbox.com/emissivity-coefficients-d_447.html' },
  { n: 9, text: 'ISO 13732-1:2006, Ergonomics of the thermal environment — Methods for the assessment of human responses to contact with surfaces — Part 1: Hot surfaces. Geneva: ISO, 2006.', url: 'https://www.iso.org/standard/43558.html' },
];

/** Numbered citation linking to the reference list. */
function Cite({ n }: { n: number[] }) {
  return <sup className={s.cite}>[{n.map((x, i) => <span key={x}>{i > 0 && ', '}<a href={`#ref-${x}`} aria-label={`Reference ${x}`}>{x}</a></span>)}]</sup>;
}

const HEATER_OPTIONS = [
  { k: 'OPTION A', t: 'Fixed temperature', b: 'The heater surface is held at a set temperature. The solver returns whatever power is needed to keep it there.', u: 'Use for a quick look at temperature distribution, or when heater temperature is genuinely known. It cannot tell you whether the heater can deliver that power.' },
  { k: 'OPTION B', t: 'Fixed power', b: 'Heat is applied as a volumetric source (W/m³) in the element body or a flux (W/m²) on its surface. Temperatures are an output.', u: 'Use to check whether the installed power reaches the setpoint and how hot the elements run. The usual choice for design checks.' },
  { k: 'OPTION C', t: 'Controlled power', b: 'Power is adjusted, by the solver or by iteration, until a probe point at the thermocouple location sits at the setpoint.', u: 'Closest to a real furnace with a controller. The result is the power the furnace needs, which you compare with the rating.' },
];

const EMISSIVITY: [string, string, string, number[]][] = [
  ['Polished stainless steel', '≈ 0.07 – 0.2', 'Rises sharply once the surface oxidises or weathers', [7, 8]],
  ['Oxidised steel, weathered stainless steel', '0.65 – 0.85', 'Typical for a shell or hot-zone part after some service', [7, 8]],
  ['Oil, enamel and black paints', '0.8 – 0.97', 'Most paints are close to black in the infrared', [7, 8]],
  ['Aluminium paint', '0.27 – 0.67', 'The exception: metallic paints are much lower', [7, 8]],
  ['Graphite and carbon', '0.7 – 0.8', 'Rough pressed graphite can reach about 0.98', [7, 8]],
  ['Silicon carbide', '0.83 – 0.96', 'Relevant for SiC heating elements and kiln furniture', [8]],
  ['Alumina (flame-sprayed)', '≈ 0.8', 'Room-temperature value; for dense alumina at temperature, use supplier or measured data', [7, 8]],
  ['Molybdenum and tungsten', '≈ 0.05 – 0.3', 'Low ε is why these are used as radiation shields; rises with temperature', [7, 8]],
];

const CASES = [
  { c: 'Base case', k: '0.15', e: '0.9', q: '742', ts: '108' },
  { c: 'Bright shell', k: '0.15', e: '0.3', q: '715', ts: '148' },
  { c: 'Low k (low-temperature value)', k: '0.06', e: '0.9', q: '309', ts: '64' },
  { c: 'High k (value near 1100 °C)', k: '0.25', e: '0.9', q: '1194', ts: '146' },
];

const SENSITIVITY = [
  ['Heater modelled as a fixed temperature', 'Hides a power shortfall. The model always "reaches" setpoint, even if the installed heaters could not.'],
  ['Insulation k taken at a low temperature', 'Under-predicts heat loss — for fibre board, k can triple between 260 °C and 1100 °C mean temperature. Predicted temperatures for a given power come out too high.'],
  ['Internal radiation switched off', 'Heat can only cross gaps by conduction through gas, so the heater runs far hotter and the load far colder than they would. Gradients are exaggerated.'],
  ['Shell emissivity too low', 'Over-predicts shell temperature. A conservative choice for touch-safety checks, not for heat-loss estimates.'],
  ['Shell emissivity too high', 'Under-predicts shell temperature — the unsafe direction for a guarding or touch-temperature assessment.'],
  ['Perfect contact between layers', 'Removes the temperature drop at gaps and joints. Hot faces run slightly cooler than reality; outer layers slightly hotter.'],
  ['Cooled wall at a fixed coolant temperature', 'Assumes an infinite film coefficient. Over-predicts heat extraction and under-predicts flange and seal temperatures.'],
  ['End losses, ports and supports neglected', 'Under-predicts required power, and misses local hot spots around penetrations.'],
];

const REGISTER = [
  ['Heater elements', 'Volumetric heat source', '1.8 kW total, uniform', 'Element datasheet × 0.8 derating', '±15 %', 'Yes'],
  ['Insulation, inner layer', 'Material, k(T)', 'Datasheet curve, 200–1200 °C', 'Supplier datasheet, rev. 2024', 'k ±20 %', 'Yes'],
  ['Hot-zone surfaces', 'Surface-to-surface radiation', 'ε = 0.8, grey-diffuse', 'Literature range 0.7–0.9', '±0.1', 'Yes'],
  ['Outer shell', 'Convection + radiation', 'h = 6 W/m²K, ε = 0.9, T∞ = 25 °C', 'Natural-convection correlation; painted shell', 'h ±30 %', 'Yes'],
  ['End flanges', 'Convection to coolant', 'h = 2000 W/m²K, T = 25 °C', 'Dittus–Boelter at 2 L/min', 'h ±25 %', 'No'],
  ['Thermocouple port, feet', 'Not modelled', '—', 'Judged small; to be checked', 'Unknown', 'No'],
];

const CHECKLIST = [
  'State what the heater boundary is — temperature, power or controlled power — and why.',
  'Use k(T) curves for insulation, not single room-temperature values.',
  'Include surface-to-surface radiation inside the hot zone above roughly 500 °C.',
  'Pick emissivities for the surface condition after service, and note the source.',
  'Model the outer shell with both convection and radiation to the surroundings.',
  'Treat water-cooled parts with a film coefficient, and check the coolant temperature rise.',
  'List penetrations, supports and seals, and whether each is modelled.',
  'Close the global energy balance and report the imbalance.',
  'Run a sensitivity study on the two or three least certain inputs.',
  'Record every boundary condition in a register that travels with the results.',
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
              <div><dt>PUBLISHED</dt><dd><time dateTime={POST.date}>18 October 2026</time></dd></div>
              <div><dt>READING TIME</dt><dd>{POST.readTime}</dd></div>
              <div><dt>TOPICS</dt><dd>Heat transfer, radiation, insulation</dd></div>
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
              <section id="why" className={s.chapter} aria-labelledby="h-why">
                <span className="chapter-label">01 · Introduction</span>
                <h2 id="h-why" className={s.h2}>Why boundary conditions decide the answer</h2>
                <p className={s.lead}>In a furnace thermal model, geometry and mesh get most of the attention, but the temperatures you report are set mainly by the boundary conditions: how heat enters the model and every route by which it leaves.</p>
                <p className={s.p}>At steady state, a furnace is an energy balance. The heaters put power in, and that same power leaves through the insulation, the shell, the cooled flanges, the door, the thermocouple ports and the supports. If any of those routes is wrong, the solver will still converge, the contour plot will still look smooth, and the temperatures will still be wrong. A numerically perfect model with poor boundary conditions answers a different furnace than the one on the bench.</p>
                <figure className="figure">
                  <div className={s.diagramFrame}><FurnaceBcDiagram /><FurnaceBcLegend /></div>
                  <figcaption className="figcaption">Fig. 1 · The six groups of boundary conditions covered in this article, shown on a horizontal tube furnace.</figcaption>
                </figure>
                <p className={s.p}>This article walks through each group in turn — heaters, insulation, radiation, and outer and cooled boundaries — and then shows, with a first-order calculation, how much the choices move the answer. It closes with the checks and documentation that make a furnace model defensible.</p>
              </section>

              {/* 02 */}
              <section id="heaters" className={s.chapter} aria-labelledby="h-heaters">
                <span className="chapter-label">02 · Heat input</span>
                <h2 id="h-heaters" className={s.h2}>Heaters: temperature, power or control</h2>
                <p className={s.p}>The first decision is how the heat goes in. There are three common ways to represent a heater, and they answer different questions.</p>
                <div className={`hairline hairline--sm ${s.cards}`}>
                  {HEATER_OPTIONS.map(o => (
                    <div key={o.k} className={s.card}>
                      <span className={s.cardKicker}>{o.k}</span>
                      <span className={s.cardTitle}>{o.t}</span>
                      <span className={s.cardBody}>{o.b}</span>
                      <span className={s.cardUse}>{o.u}</span>
                    </div>
                  ))}
                </div>
                <h3 className={s.h3}>Use effective power, not nameplate power</h3>
                <p className={s.p}>If you apply power, apply the power the elements actually deliver. Nameplate ratings assume nominal voltage and new elements. In practice, supply voltage varies, the controller may limit duty, and element resistance changes with temperature and age — silicon carbide elements, for example, slowly rise in resistance with use (one manufacturer quotes about 3 % per 1,000 hours for a grade in clean air at 1,400 °C<Cite n={[5]} />), so the same voltage delivers less power. A derated value with a stated basis is more honest than the catalogue figure.</p>
                <h3 className={s.h3}>Represent the element geometry sensibly</h3>
                <p className={s.p}>A wound coil or a row of rod elements is rarely meshed wire by wire. It is usually smeared into an equivalent cylinder, annulus or panel. That is fine, but the equivalent body needs an effective emissivity and a sensible surface area, because a smeared coil radiates from a smooth surface it does not really have. Note the simplification, and check element surface temperature against the element's maximum rated temperature — not just the hot-zone setpoint.</p>
                <div className={`${s.callout} ${s.calloutTeal}`}>
                  <span className={s.calloutLabel}>PRACTICAL TIP</span>
                  <p>Run the model once with fixed power. If the hot zone does not reach setpoint, the furnace is under-powered for that configuration. A fixed-temperature heater would have hidden that.</p>
                </div>
              </section>

              {/* 03 */}
              <section id="insulation" className={s.chapter} aria-labelledby="h-insulation">
                <span className="chapter-label">03 · Conduction</span>
                <h2 id="h-insulation" className={s.h2}>Insulation and conduction</h2>
                <p className={s.p}>Insulation usually provides most of the furnace's thermal resistance, so its conductivity carries most of the uncertainty in the heat-loss prediction.</p>
                <h3 className={s.h3}>Conductivity depends on temperature</h3>
                <p className={s.p}>Fibrous and porous insulations conduct heat through the solid, through the gas in the pores, and by radiation across the pores. The radiative part grows rapidly with temperature, so effective conductivity climbs steeply: one commercial fibre board is listed at 0.072 W/m·K at 260 °C mean temperature and 0.216 W/m·K at 1093 °C — three times higher.<Cite n={[6]} /> A single low-temperature k will under-predict heat loss. Use the supplier's k(T) curve, entered as a temperature-dependent property, or at least evaluate k at the mean temperature of each layer.</p>
                <h3 className={s.h3}>Layers, gaps and contacts</h3>
                <p className={s.p}>Most furnaces use several layers: a dense refractory or high-temperature board on the hot face, then lighter, lower-conductivity insulation, then the shell. Each interface adds a small contact resistance, and fibre insulation shrinks after its first heating, opening gaps at joints. A perfect-contact assumption is common and usually acceptable for an overall loss estimate, but it should be stated, and it matters more where layers are thin or joints run straight through the wall.</p>
                <p className={s.p}>For a cylindrical wall, the conduction resistance of one layer is:<Cite n={[1]} /></p>
                <div className={s.eq}>R<sub>ins</sub> = ln(r<sub>2</sub> / r<sub>1</sub>) / (2π k L)</div>
                <p className={s.eqWhere}>where r<sub>1</sub> and r<sub>2</sub> are the inner and outer radii of the layer, k is the conductivity at the layer's mean temperature and L is the heated length. Layers add in series.</p>
                <p className={s.note}>Designing the insulation itself — thickness, layer selection and energy requirements — is the subject of article 07 in this series.</p>
              </section>

              {/* 04 */}
              <section id="radiation" className={s.chapter} aria-labelledby="h-radiation">
                <span className="chapter-label">04 · Radiation</span>
                <h2 id="h-radiation" className={s.h2}>Surface emissivity and radiation</h2>
                <p className={s.p}>Radiation grows with the fourth power of absolute temperature.<Cite n={[1]} /> At typical furnace operating temperatures — as a rule of thumb, from roughly 500–600 °C upward — it is usually the dominant way heat moves across open space inside a furnace: from element to work tube, from tube to sample, and from hot surfaces to the insulation. Leaving it out is the single largest error a furnace model can make.</p>
                <h3 className={s.h3}>Two different radiation boundaries</h3>
                <ul className={s.list}>
                  <li><strong>Internal surface-to-surface radiation.</strong> Surfaces inside the hot zone exchange heat with each other through view factors. This needs a radiation model (radiosity, view-factor or discrete-ordinates, depending on the software) and an emissivity on every participating surface.<Cite n={[4]} /></li>
                  <li><strong>External radiation to the surroundings.</strong> The outer shell radiates to the room. This is usually a simple boundary: an emissivity and a surroundings temperature on the shell faces.</li>
                </ul>
                <h3 className={s.h3}>Choosing emissivity</h3>
                <p className={s.p}>Emissivity is a surface property, not a bulk material property. It depends on temperature, roughness and especially oxidation, so the same stainless steel can be below 0.1 when polished and around 0.85 once weathered or oxidised.<Cite n={[7, 8]} /> Pick values for the condition the surface will be in during service, and record where they came from. Indicative ranges:</p>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 560 }}>
                    <thead><tr><th scope="col">Surface</th><th scope="col">Typical ε</th><th scope="col">Note</th><th scope="col">Source</th></tr></thead>
                    <tbody>
                      {EMISSIVITY.map(([m, e, n, r]) => <tr key={m}><td className={s.tdStrong}>{m}</td><td className="mono" style={{ color: 'var(--ink)', whiteSpace: 'nowrap' }}>{e}</td><td className={s.td}>{n}</td><td className={s.td}><Cite n={r} /></td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className={s.note}>Ranges summarise total emissivity values from the cited compilations, mostly measured near room temperature or a few hundred °C. Published values vary between sources, and some compilations disagree for the same surface. Use measured or supplier values where they exist, and treat ε as an uncertain input in the sensitivity study.</p>
                <h3 className={s.h3}>Common radiation assumptions to state</h3>
                <ul className={s.list}>
                  <li><strong>Grey and diffuse surfaces.</strong> Emissivity does not vary with wavelength or direction. Standard and usually adequate, but weaker for glass, quartz tubes and polished metals.<Cite n={[4]} /></li>
                  <li><strong>Non-participating gas.</strong> Air, nitrogen and argon are essentially transparent. Gases containing significant CO<sub>2</sub> or H<sub>2</sub>O absorb and emit, and may need a participating-media model.<Cite n={[4]} /></li>
                  <li><strong>Semi-transparent tubes.</strong> A quartz work tube transmits part of the spectrum. Modelling it as opaque is a simplification that should be noted.</li>
                  <li><strong>Symmetry with radiation.</strong> Not every solver treats a symmetry plane correctly in a view-factor calculation. Check that the cut model and the full model agree, or model the full enclosure.</li>
                </ul>
              </section>

              {/* 05 */}
              <section id="cooled" className={s.chapter} aria-labelledby="h-cooled">
                <span className="chapter-label">05 · Heat losses</span>
                <h2 id="h-cooled" className={s.h2}>Shell, cooled and leaky boundaries</h2>
                <h3 className={s.h3}>The outer shell</h3>
                <p className={s.p}>The shell loses heat by natural convection and by radiation, in parallel. Both belong on the boundary. Textbook ranges for free convection in gases span roughly 2–25 W/m²K,<Cite n={[1]} /> which is too wide to pick from. Better than guessing is to use a correlation for the shell orientation — for example the Churchill–Chu correlations for a horizontal cylinder<Cite n={[2]} /> or a vertical plate<Cite n={[1]} /> — at the expected shell temperature. Radiation can be expressed as an equivalent coefficient so the two can be compared:<Cite n={[1]} /></p>
                <div className={s.eq}>h<sub>rad</sub> = ε σ (T<sub>s</sub><sup>2</sup> + T<sub>∞</sub><sup>2</sup>)(T<sub>s</sub> + T<sub>∞</sub>)</div>
                <p className={s.eqWhere}>with temperatures in kelvin and σ = 5.67 × 10<sup>−8</sup> W/m²K⁴. For a painted shell at around 100 °C, h<sub>rad</sub> is of the same order as the convection coefficient — radiation is not negligible even at modest shell temperatures.</p>
                <h3 className={s.h3}>Water-cooled parts</h3>
                <p className={s.p}>Flanges, jackets and electrode feedthroughs are often given a fixed temperature equal to the coolant inlet. That assumes an infinite film coefficient and no coolant temperature rise. A convective boundary is better: a coolant bulk temperature plus a film coefficient from a pipe-flow correlation such as Dittus–Boelter (Nu = 0.023 Re<sup>0.8</sup> Pr<sup>0.4</sup>, for fully developed turbulent flow when the fluid is heated).<Cite n={[1, 3]} /> Then check the coolant temperature rise:</p>
                <div className={s.eq}>ΔT<sub>coolant</sub> = Q / (ṁ c<sub>p</sub>)</div>
                <p className={s.eqWhere}>For example, 1.5 kW removed by water at 2 L/min (ṁ ≈ 0.033 kg/s, c<sub>p</sub> ≈ 4180 J/kgK) gives a rise of about 11 K. If the rise is large, use the mean coolant temperature, not the inlet. Seal and O-ring temperatures near cooled flanges are often the real design limit, and a fixed-temperature boundary will under-predict them.</p>
                <h3 className={s.h3}>The routes that get forgotten</h3>
                <ul className={s.list}>
                  <li><strong>End and door losses.</strong> A tube furnace loses heat axially along the tube and through end plugs; a box furnace loses it through the door and its seal.</li>
                  <li><strong>Penetrations.</strong> Thermocouple sheaths, element terminals and gas ports are metal paths straight through the insulation.</li>
                  <li><strong>Supports and feet.</strong> Conduction to a bench or frame, often ignored and occasionally significant.</li>
                  <li><strong>Gas flow.</strong> Process gas carries heat out of a tube. Whether it is forced or buoyancy-driven is the topic of article 06.</li>
                  <li><strong>Vacuum.</strong> Under vacuum, gas convection disappears and contact conductance between parts drops, so radiation and solid conduction carry nearly everything.</li>
                </ul>
                <h3 className={s.h3}>Ambient and initial conditions</h3>
                <p className={s.p}>Set the ambient air temperature and the radiation surroundings temperature explicitly; they are not always the same, for example inside a cabinet or a hot lab. For transient models of heat-up, the initial temperature and the heat capacity of the insulation matter as much as the boundary conditions — the insulation's thermal mass often controls how fast the furnace can ramp.</p>
              </section>

              {/* 06 */}
              <section id="example" className={s.chapter} aria-labelledby="h-example">
                <span className="chapter-label">06 · Worked example</span>
                <h2 id="h-example" className={s.h2}>Worked example: one wall, four answers</h2>
                <p className={s.p}>A first-order calculation shows which inputs matter before you build the full model. Take the cylindrical wall of an illustrative tube furnace: hot-face radius 100 mm, 100 mm of fibre insulation, 500 mm heated length, hot face held at 1200 °C, still air and surroundings at 25 °C, and a natural-convection coefficient of 6 W/m²K on the shell. The heat loss through the wall is:</p>
                <div className={s.eq}>Q = (T<sub>hot</sub> − T<sub>∞</sub>) / (R<sub>ins</sub> + R<sub>out</sub>),&nbsp;&nbsp; R<sub>out</sub> = 1 / [(h<sub>conv</sub> + h<sub>rad</sub>) A<sub>shell</sub>]</div>
                <p className={s.eqWhere}>Shell temperature and h<sub>rad</sub> depend on each other, so the calculation is iterated until both settle. End losses, penetrations and the shell's own conduction resistance are neglected.</p>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 560 }}>
                    <thead><tr><th scope="col">Case</th><th scope="col">k (W/m·K)</th><th scope="col">Shell ε</th><th scope="col">Wall heat loss (W)</th><th scope="col">Shell temp. (°C)</th></tr></thead>
                    <tbody>
                      {CASES.map(r => <tr key={r.c}><td className={s.tdStrong}>{r.c}</td><td className="mono">{r.k}</td><td className="mono">{r.e}</td><td className="mono" style={{ color: 'var(--ink)', fontWeight: 500 }}>{r.q}</td><td className="mono" style={{ color: 'var(--ink)', fontWeight: 500 }}>{r.ts}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className={s.note}>Illustrative values chosen to show trends, not data for a specific furnace. The k values bracket the published curve for one fibre board<Cite n={[6]} />; σ and the radiation coefficient follow standard relations.<Cite n={[1]} /></p>
                <h3 className={s.h3}>What the numbers say</h3>
                <ul className={s.list}>
                  <li><strong>The insulation controls the heat loss.</strong> In the base case the insulation resistance is about 1.47 K/W and the shell-to-room resistance about 0.11 K/W, so roughly 93 % of the temperature drop happens inside the insulation.</li>
                  <li><strong>Conductivity is the input to get right.</strong> Changing k from 0.06 to 0.25 W/m·K — close to the spread across one commercial board's datasheet between 260 °C and 1093 °C mean temperature<Cite n={[6]} /> — changes the heat loss by a factor of almost four.</li>
                  <li><strong>Shell emissivity barely changes the loss, but it changes the shell temperature.</strong> Going from ε = 0.9 to 0.3 cuts the heat loss by only 4 %, yet raises the shell by about 40 K. For a touch-temperature or guarding check, emissivity matters a great deal.</li>
                  <li><strong>Radiation is a large share of shell loss.</strong> In the base case, about 427 W of the 742 W leaves the shell by radiation and 315 W by convection.</li>
                </ul>
                <div className={s.callout}>
                  <span className={s.calloutLabel}>ONE MODEL, TWO QUESTIONS</span>
                  <p>The same model can be conservative for one question and unconservative for another. A low shell emissivity gives a safe (high) shell temperature but a slightly low heat-loss estimate. Decide which question each run is answering, and choose the bounding values for that question.</p>
                </div>
              </section>

              {/* 07 */}
              <section id="sensitivity" className={s.chapter} aria-labelledby="h-sensitivity">
                <span className="chapter-label">07 · Sensitivity</span>
                <h2 id="h-sensitivity" className={s.h2}>How assumptions shift predictions</h2>
                <p className={s.p}>Every simplification pushes the result in a known direction. Knowing the direction lets you state whether a result is likely to be high or low, and choose assumptions that bound the answer.</p>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 560 }}>
                    <thead><tr><th scope="col" style={{ width: '38%' }}>Assumption</th><th scope="col">Typical effect on the prediction</th></tr></thead>
                    <tbody>
                      {SENSITIVITY.map(([a, e]) => <tr key={a}><td className={s.tdStrong}>{a}</td><td className={s.td}>{e}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className={s.p}>Rather than defend one "best" value for each uncertain input, run a short sensitivity study. Vary the two or three least certain inputs — usually insulation k, heater power and one or two emissivities — across their plausible range, one at a time, and report how far the key outputs move. If a ±20 % change in k moves the sample temperature by 5 K, the model is robust to it. If it moves it by 80 K, that input needs better data before the result can be relied on.</p>
              </section>

              {/* 08 */}
              <section id="checks" className={s.chapter} aria-labelledby="h-checks">
                <span className="chapter-label">08 · Verification</span>
                <h2 id="h-checks" className={s.h2}>Checking the model</h2>
                <ul className={s.list}>
                  <li><strong>Close the energy balance.</strong> At steady state, the sum of heat leaving through every boundary should equal the heater input. Most solvers can report boundary heat flows; report the imbalance as a percentage. A large imbalance points to an unconverged solution or a boundary applied to the wrong faces.</li>
                  <li><strong>Compare with a hand calculation.</strong> A resistance network like the worked example should land in the same range as the simulated wall loss. If it does not, find out why before trusting either.</li>
                  <li><strong>Check where each route goes.</strong> Break the total loss down by boundary — shell, ends, flanges, ports. A surprising split often reveals a boundary that was missed or doubled.</li>
                  <li><strong>Check the controller location.</strong> Real furnaces control on one thermocouple. If the model reports a hot-zone average but the controller sits near an element, the two will not match.</li>
                  <li><strong>Compare with measurements where you can.</strong> Shell temperatures with a contact probe, a heat-up curve, or steady-state power drawn at setpoint are inexpensive checks against a real furnace.</li>
                  <li><strong>Check against limits.</strong> Element maximum temperature, insulation classification temperature, seal temperatures near cooled flanges and accessible-surface temperatures — for example the burn thresholds for hot surfaces in ISO 13732-1.<Cite n={[9]} /></li>
                </ul>
              </section>

              {/* 09 */}
              <section id="documenting" className={s.chapter} aria-labelledby="h-documenting">
                <span className="chapter-label">09 · Documentation</span>
                <h2 id="h-documenting" className={s.h2}>Documenting the assumptions</h2>
                <p className={s.p}>A temperature contour without its boundary conditions cannot be reviewed, reproduced or compared with a later run. The simplest fix is a boundary-condition register: one row per boundary, kept with the model and copied into the report.</p>
                <div className="table-wrap">
                  <table className="table" style={{ minWidth: 820 }}>
                    <thead><tr><th scope="col">Boundary</th><th scope="col">Type</th><th scope="col">Value</th><th scope="col">Source / basis</th><th scope="col">Uncertainty</th><th scope="col">Sensitivity run?</th></tr></thead>
                    <tbody>
                      {REGISTER.map(r => <tr key={r[0]}><td className={s.tdStrong}>{r[0]}</td><td className={s.td}>{r[1]}</td><td className="mono" style={{ color: 'var(--ink)' }}>{r[2]}</td><td className={s.td}>{r[3]}</td><td className="mono">{r[4]}</td><td className={s.td}>{r[5]}</td></tr>)}
                    </tbody>
                  </table>
                </div>
                <p className={s.note}>Example register layout. Values are placeholders showing the level of detail to record, not recommendations.</p>
                <p className={s.p}>Alongside the register, the report should state the analysis type (steady or transient), the radiation model, the material property sources, the energy-balance imbalance, the sensitivity results, and a short list of what was not modelled. That list is not a weakness of the study; it tells the reader where the limits of the result are.</p>
              </section>

              {/* 10 */}
              <section id="checklist" className={s.chapter} aria-labelledby="h-checklist">
                <span className="chapter-label">10 · Summary</span>
                <h2 id="h-checklist" className={s.h2}>Checklist</h2>
                <ol className={s.checklist}>
                  {CHECKLIST.map((c, i) => <li key={c}><span className={s.checkNum}>{String(i + 1).padStart(2, '0')}</span><span>{c}</span></li>)}
                </ol>
                <div className={s.related}>
                  <span className="chapter-label">Related in this series</span>
                  <ul>
                    <li><span className={s.relatedNum}>06</span>Gas Flow in a Tube Furnace: Evaluating Reynolds and Richardson Numbers</li>
                    <li><span className={s.relatedNum}>07</span>Designing High-Temperature Furnace Insulation: Heat Loss, Wall Temperature, and Energy Requirements</li>
                    <li><span className={s.relatedNum}>10</span>From Design Requirements to Simulation: A Practical Workflow for Equipment Development</li>
                  </ul>
                  <p className={s.note}>A furnace thermal model in practice: see the <Link href="/projects/cz-r4/" style={{ color: 'var(--teal-text)' }}>CZ-R4 crystal-growth furnace case study</Link>, which uses surface-to-surface cavity radiation in the hot zone.</p>
                </div>
              </section>

              <section id="references" className={s.chapter} aria-labelledby="h-references">
                <span className="chapter-label">References</span>
                <h2 id="h-references" className={s.h2}>References</h2>
                <ol className={s.refs}>
                  {REFS.map(r => (
                    <li key={r.n} id={`ref-${r.n}`}>
                      <span className={s.refNum}>[{r.n}]</span>
                      <span>{r.text}{r.url && <> <a href={r.url} target="_blank" rel="noopener noreferrer" className={s.refLink}>{r.url.replace(/^https:\/\//, '')}</a></>}</span>
                    </li>
                  ))}
                </ol>
                <p className={s.note}>Worked-example figures, heater-option comparison, sensitivity table and the boundary-condition register are the author&apos;s own and are illustrative.</p>
              </section>
            </div>
          </div>
        </article>

        <CtaBand />
      </div>
    </section>
  );
}
