// CZ-R4 crystal-growth furnace case study. Every number here is client-supplied.
// Never surface 412.4 MPa as a headline — it is a mesh-sensitive singularity and belongs under Limitations only.

const A = '/assets/cz-r4/';

export const CZ = {
  title: 'CZ-R4 crystal-growth furnace',
  summary: 'Concept design of a Czochralski-type furnace, from 2D drafting to a verified finite-element model: vessel sizing, vacuum buckling, hot-zone thermal analysis and coupled thermal expansion.',
  teaser: 'Concept design of a Czochralski-type furnace: ASME VIII-1 vessel sizing, vacuum buckling, hot-zone thermal analysis with cavity radiation, and coupled thermal expansion — every FE result checked against hand calculations.',
  meta: [
    { k: 'TYPE', v: 'Concept design & analysis' },
    { k: 'CONTEXT', v: 'Self-initiated engineering study' },
    { k: 'TOOLS', v: 'AutoCAD · Autodesk Fusion · PrePoMax / CalculiX 2.22 · C++17 / CMake' },
    { k: 'STATUS', v: 'Not built or experimentally validated · C++ control model in progress' },
  ],
};

export const CHAPTERS = [
  ['cz-overview', 'Overview'], ['cz-cad', 'CAD assembly'], ['cz-params', 'Assumptions & parameters'], ['cz-thermal', 'Thermal model'],
  ['cz-fea', 'FEA methodology'], ['cz-verify', 'Verification'], ['cz-results', 'Results & limitations'], ['cz-conclusions', 'Conclusions'],
  ['cz-model', '3D model'], ['cz-docs', 'Documentation'],
] as const;

export const CZ_PARTS = [
  { n: '01', t: 'Pressure-vessel design and sizing to ASME VIII-1' },
  { n: '02', t: 'Static stress and linear buckling under full vacuum' },
  { n: '03', t: 'Hot-zone thermal analysis with cavity radiation, plus coupled thermal expansion' },
  { n: '04', t: 'C++ furnace energy model and control software, built stage by stage' },
];

export const IMAGES = {
  assembly: { src: A + '01-assembly-overview.webp', alt: 'CZ-R4 vessel body assembly modeled in Autodesk Fusion.', caption: 'Assembly overview · vessel body in Autodesk Fusion' },
  section: { src: A + '02-section-hot-zone.webp', alt: 'Section through the CZ-R4 hot zone showing internals and the induction coil.', caption: 'Section through hot zone · internals and induction coil' },
  gaPreview: { src: A + '07-ga-drawing.webp', alt: 'General arrangement drawing MPE-CZR4-GA-001: section A–A, top view C and hot-zone detail B.' },
  thermalField: { src: A + '03-temperature-distribution.webp', alt: 'Simulated temperature distribution through the hot zone, 25–1500 °C.', caption: 'Temperature distribution · 25–1500 °C' },
  thermalRun1: { src: A + 'thermal-run1-conduction-only.webp', alt: 'Thermal run 1 temperature field with conduction only.', caption: 'Run 1 · conduction only' },
  thermalRun2: { src: A + 'thermal-run2-with-radiation.webp', alt: 'Thermal run 2 temperature field including cavity radiation.', caption: 'Run 2 · with cavity radiation' },
  mesh: { src: A + '04-mesh-global.webp', alt: 'Global 3D mesh of the half vessel model with second-order tetrahedra.', caption: 'Global 3D mesh · second-order tetrahedra' },
  verifyRun1: { src: A + 'verification-run1-missing-load.webp', alt: 'First static run displacement plot with a load missing, max 0.073 mm.', caption: 'Run 1 · load missing, max 0.073 mm' },
  // NOTE: the same deformation plot is used for the corrected verification run and the results section.
  // Swap in a dedicated figure here if the client supplies one (see REVIEW.md).
  verifyFinal: { src: A + '06-deformation.webp', alt: 'Corrected static run displacement plot, max 0.434 mm.', caption: 'Corrected · max 0.434 mm' },
  stress: { src: A + '05-stress-von-mises.webp', alt: 'Von Mises stress plot at 1 MPa internal pressure with a local peak at the bottom port.', caption: 'Von Mises stress at 1 MPa · local peak at bottom port (see limitations)' },
  displacement: { src: A + '06-deformation.webp', alt: 'Displacement plot at 1 MPa internal pressure, max 0.434 mm.', caption: 'Displacement · max 0.434 mm at 1 MPa' },
  buckle1: { src: A + '00-buckling-mode1.webp', alt: 'Linear buckling mode 1 under full vacuum, factor 144.8.', caption: 'Mode 1 · factor 144.8' },
  buckle2: { src: A + 'buckling-mode2.webp', alt: 'Linear buckling mode 2 under full vacuum.', caption: 'Mode 2' },
  buckle3: { src: A + 'buckling-mode3.webp', alt: 'Linear buckling mode 3 under full vacuum.', caption: 'Mode 3' },
};

export const SUBSYSTEMS = [
  { name: 'Vessel', note: 'SS304, Ø500 mm ID, 8 mm shell, 30 mm flange & bottom plate, water-cooled' },
  { name: 'Ports', note: 'Viewport, pyrometer port, bottom vacuum-pump port' },
  { name: 'Refractory insulation', note: 'Graphite felt, bore r 150 mm' },
  { name: 'Induction coil (heater)', note: 'Graphite IG-110 ring, r 125–135 mm' },
  { name: 'Susceptor & crucible', note: 'Graphite IG-110 holder, fused-silica crucible' },
  { name: 'Charge', note: 'Si melt, r 95 mm, about 2.8 L' },
];

export const PARAMS = [
  { name: 'Chamber inner diameter', value: '500 mm', basis: 'Design' },
  { name: 'Crucible diameter / height', value: '202 / 147 mm', basis: 'Design' },
  { name: 'Internal design pressure', value: '1.0 MPa', basis: 'Design basis' },
  { name: 'External pressure', value: '0.101 MPa (full vacuum)', basis: 'Design basis' },
  { name: 'Heater temperature', value: '1500 °C (prescribed)', basis: 'Assumed' },
  { name: 'Melt temperature', value: '1420 °C (Si)', basis: 'Literature' },
  { name: 'Cooling', value: 'Water jacket h = 1000 W/m²K, 25 °C', basis: 'Assumed' },
  { name: 'Materials', value: 'SS304 / graphite felt / IG-110 / fused silica', basis: 'Literature' },
];

export const BCS = [
  { k: 'Heater coil', v: 'Fixed T · 1500 °C', n: '' },
  { k: 'Melt / crystal', v: 'Fixed T · 1420 °C', n: '' },
  { k: 'Cavity radiation', v: 'ε = 0.85 / 0.85 / 0.80 / 0.30 / 0.85 / 0.35', n: 'Heater, susceptor, crucible rim, melt top, insulator, vessel inner wall. Open top radiates to a 25 °C sink.' },
  { k: 'Vessel wall', v: 'Water film · h = 1000 W/m²K, 25 °C', n: 'Shell outer wall and bottom plate' },
  { k: 'Top flange', v: 'Air film · h = 10 W/m²K, 25 °C', n: '' },
  { k: 'Gas convection', v: 'Not modeled', n: '' },
];

export const FEA_STEPS = [
  { k: 'STRUCTURAL MESH', v: '3D half model with a symmetry BC, second-order tetrahedra, 99,763 nodes / 58,249 elements, local refinement at the ports and the wall–bottom joint.' },
  { k: 'STRUCTURAL ANALYSIS', v: 'Static solve at 1 MPa internal pressure, then linear buckling under full vacuum.' },
  { k: 'THERMAL ANALYSIS', v: '2D axisymmetric CAX6, 22,954 nodes, 6 parts tied, steady-state with cavity radiation, then an uncoupled temperature–displacement step with contact and gravity.' },
];

export const VERIFY = [
  { q: 'Hoop stress', h: '31.3 MPa', f: '0–46 MPa band' },
  { q: 'Radial growth', h: '0.036 mm', f: '≈0.04 mm' },
  { q: 'Bottom deflection', h: '0.13–0.53 mm', f: '0.434 mm' },
  { q: 'vs reference study', h: '0.414 mm', f: '+4.8 %' },
  { q: 'Vessel inner wall T', h: '≈68 °C', f: '66.9 °C' },
];

export const RESULTS = [
  { label: 'SUSCEPTOR TEMPERATURE', value: '1459 °C', sub: 'Matches reference study' },
  { label: 'SHELL MEMBRANE STRESS', value: '≈31 MPa', sub: 'SS304 yield ≈205 MPa' },
  { label: 'MAX DISPLACEMENT', value: '0.434 mm', sub: 'At 1 MPa internal pressure' },
  { label: 'LOWEST BUCKLING FACTOR', value: '144.8', sub: 'Pcr ≈ 14.6 MPa' },
];

export const LIMITATIONS = [
  'Peak 412.4 MPa at the bottom-port junction is a mesh-sensitive singularity at a sharp re-entrant corner.',
  'Linear buckling ignores imperfections and plasticity.',
  'Insulator is open at the top.',
  'FE radiative flux at the vessel is about 1.8× the hand estimate, which is conservative.',
  'Ties assume perfect thermal contact.',
  'Material k(T) is temperature-dependent; melt convection is not modeled.',
];

export const FINDINGS = [
  'AutoCAD → Fusion → STEP → PrePoMax workflow produced a consistent half model.',
  'Static deflection 0.434 mm, within 4.8 % of the reference and bounded by plate theory.',
  'Shell membrane stress ≈31 MPa, well below SS304 yield (≈205 MPa).',
  'Lowest buckling factor 144.8 under full vacuum — stability is not critical.',
  'Hot-zone temperatures match the reference (susceptor 1459 °C).',
  'Felt insulation carries a ~700 K drop; the vessel stays below 70 °C.',
  'Thermal expansion reproduces the reference trend: susceptor ≈1.4 mm, crucible ≈0.14 mm, side gap opens.',
];

export const NEXT_STEPS = [
  'Add a fillet / reinforcing pad at the bottom port and re-run.',
  'Linearise stresses through the thickness (ASME VIII-2 Part 5) to separate membrane, bending and peak.',
  'Mesh-convergence check at the hotspot; compare wall-thickness variants.',
  'Combined load case: hydrostatic melt pressure + 0.101 MPa vacuum → stress and safety factor.',
  'Contact-layer model for h_c sensitivity.',
];

export const DOCS = [
  { kind: 'PDF', name: 'Analysis report — CZ-R4', href: '/docs/cz-r4-analysis-report.pdf', size: 'PDF · 4.4 MB' },
  { kind: 'PDF', name: 'General arrangement drawing', href: '/docs/cz-r4-general-arrangement.pdf', size: 'PDF · 63 KB' },
  { kind: 'STEP', name: 'Simplified assembly geometry', href: '/docs/cz-r4-simplified-assembly.step', size: 'STEP · 30 KB' },
];

export const MODEL = { src: '/models/cz-r4-furnace.glb', poster: IMAGES.assembly.src, sizeLabel: '240 KB', alt: 'Interactive 3D model of the CZ-R4 crystal-growth furnace' };
export const GA_PDF = '/docs/cz-r4-general-arrangement.pdf';
