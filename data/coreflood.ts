// Core-flooding apparatus for EOR case study. MPrep's own generic design: the design basis is typical industry values,
// not a client specification, and no vendor is endorsed. Numbers come from Projects/coreflood (scripts + result JSON).

const A = '/assets/core-flooding/';

export const CF = {
  title: 'Core-flooding apparatus for EOR',
  summary: 'A 10,000 psi / 150 °C core-flooding rig for chemical (surfactant–polymer) and CO₂ EOR: system design and P&ID, a parametric Hassler core holder checked to ASME VIII-2 with CalculiX, sleeve sealing with a hyperelastic contact model, heat-up, inlet-distributor CFD and a Buckley–Leverett model that explains the specification.',
  meta: [
    { k: 'TYPE', v: 'Laboratory equipment design & analysis' },
    { k: 'CONTEXT', v: 'Self-initiated engineering study' },
    { k: 'TOOLS', v: 'Python · FreeCAD · CalculiX / PrePoMax · OpenFOAM v2512 / ParaView' },
    { k: 'STATUS', v: 'Generic design · typical industry values, not a client specification' },
  ],
};

export const CHAPTERS = [
  ['cf-overview', 'Overview'], ['cf-basis', 'Design basis'], ['cf-system', 'System & P&ID'], ['cf-holder', 'Core holder'],
  ['cf-fea', 'Stress & fatigue'], ['cf-seal', 'Sleeve sealing'], ['cf-thermal', 'Heat-up'], ['cf-cfd', 'Inlet distributor'],
  ['cf-process', 'Process model'], ['cf-verify', 'Verification'], ['cf-conclusions', 'Conclusions'], ['cf-docs', 'Documentation'], ['cf-refs', 'References'],
] as const;

export const CF_PARTS = [
  { n: '01', t: 'Rig architecture, P&ID, instrument and tubing sizing, relief philosophy and CO₂ safety' },
  { n: '02', t: 'Parametric Hassler core holder: hand calculations and ASME VIII-2 design-by-analysis in CalculiX' },
  { n: '03', t: 'Thread-root and cross-bore fatigue; hyperelastic sleeve contact and the minimum net confining stress' },
  { n: '04', t: 'Heat-up (oven vs jacket), inlet-distributor CFD, and a Buckley–Leverett model that explains the rig specification' },
];

export const IMAGES = {
  pid: { src: A + 'pid.webp', alt: 'Simplified P&ID of the core-flooding rig: syringe pumps, four transfer vessels in an oven, core holder with confining pump, dP transducers, back-pressure regulator and effluent collection; relief devices in red.', caption: 'Simplified P&ID · scripted from the design basis' },
  dp: { src: A + 'dp-envelope.webp', alt: 'Chart of Darcy pressure drop over a 12 inch core against permeability for several viscosities and rates, with the four dP transducer ranges and the net-confining ceiling.', caption: 'Darcy dP envelope vs transducer ranges and the usable ceiling' },
  cutaway: { src: A + 'cad-cutaway.webp', alt: 'Quarter cut-away of the Hassler core holder STEP model showing body, threaded end plugs, floating inlet end piece, sleeve and the core.', caption: 'Hassler core holder, quarter cut-away · FreeCAD STEP model in PrePoMax' },
  drawing: { src: A + 'ga-drawing.webp', alt: 'General arrangement drawing of the core holder in axial section with key dimensions.', caption: 'General arrangement · generated from the FreeCAD model' },
  threadFea: { src: A + 'ppm-thread.webp', alt: 'PrePoMax plot of von Mises stress in the end-plug threads, highest at the innermost engaged tooth of the body.', caption: 'Von Mises stress at the end-plug threads, 10,000 psi · PrePoMax' },
  portFea: { src: A + 'ppm-port.webp', alt: 'PrePoMax plot of von Mises stress around the confining-port cross-bore in the body.', caption: 'Confining-port cross-bore, 3D quarter model · PrePoMax' },
  toothLoad: { src: A + 'tooth-load.webp', alt: 'Bar chart of the share of plug load per engaged thread tooth, rising to about 21 percent at the innermost tooth.', caption: 'Load share per engaged tooth' },
  lame: { src: A + 'lame-vs-fea.webp', alt: 'Hoop and radial stress through the body wall from CalculiX compared with the Lame solution.', caption: 'FEA vs Lamé through the wall' },
  fatigue: { src: A + 'fatigue-sn.webp', alt: 'Fatigue design curve with the assessed locations plotted at 20,000 cycles.', caption: 'Pressure-cycle fatigue at 20,000 cycles' },
  micro: { src: A + 'micro-closure.webp', alt: 'Largest gap between sleeve and wavy core surface against net confining stress for several roughness cases, with the Johnson closure pressure marked.', caption: 'Sleeve pressed into core roughness · FEA vs Johnson' },
  contact: { src: A + 'contact-profile.webp', alt: 'Sleeve contact pressure along the core normalised by net confining stress, close to one away from the core and end-piece joint.', caption: 'Contact pressure along the core' },
  heatup: { src: A + 'heatup.webp', alt: 'Core temperature during heat-up for oven, jacket with bare ends and jacket with insulated ends, and the axial temperature profile at the end.', caption: 'Heat-up: oven vs jacket' },
  cfdMaps: { src: A + 'pv-spiral.webp', alt: 'Axial velocity 0.25 mm inside the core face under the two-start spiral distributor, high under the grooves and lower between them.', caption: 'Axial velocity 0.25 mm into the core, spiral distributor · OpenFOAM in ParaView' },
  ui: { src: A + 'cfd-ui.webp', alt: 'Uniformity index against depth into the core for the four distributor patterns.', caption: 'Uniformity index vs depth' },
  bl: { src: A + 'bl-recovery.webp', alt: 'Fractional flow, oil recovery and water cut against pore volumes injected for waterflood, polymer floods and a surfactant-polymer case.', caption: 'Buckley–Leverett: waterflood vs polymer vs surfactant–polymer' },
};

export const BASIS = [
  { name: 'Core plug', value: '1.5 in × up to 12 in (38.1 × 305 mm)', basis: '1 in cores via adapters (note only)' },
  { name: 'Confining / pore pressure', value: '10,000 / 9,000 psi', basis: 'Net confining 500–1,000 psi in operation' },
  { name: 'Temperature', value: '150 °C operating, 177 °C design', basis: 'Allowables taken at 177 °C (350 °F)' },
  { name: 'Flow rate', value: '0.01–20 mL/min', basis: '1 ft/day frontal velocity = 0.048 mL/min (φ = 0.20)' },
  { name: 'Fluids', value: 'High-chloride brine, crude, HPAM, surfactant, CO₂', basis: 'Traces of H₂S as a sour-service note' },
  { name: 'Fatigue', value: '20,000 pressure cycles', basis: 'Assumed: 8 tests a day, 250 days, 10 years' },
];

export const SYSTEM = [
  { k: 'PUMPS', v: 'Dual-cylinder syringe pump (0.01–20 mL/min, pulse-free) drives water under the floating pistons of four 1,000 mL transfer vessels (10 PV of the longest core plus 30 %). A second syringe pump holds the confining pressure and follows the inlet pressure plus a net set point.' },
  { k: 'INSTRUMENTS', v: 'Four dP transducers, 5 / 50 / 500 / 1,500 psid on a 10,000 psi manifold. Together they cover every runnable Darcy case between 0.5 and 1,500 psi at ≤ 1 % of reading. Above roughly the net confining stress, dP lifts the sleeve, so higher ranges are pointless.' },
  { k: 'RELIEF', v: 'PSV-102 at MAWP on the confining circuit, plus a 10,500 psi rupture disc on the holder for trapped-liquid expansion (multiple-device rule). PSV-101 at 9,500 psi on the pore side keeps pore pressure ≥ 500 psi below the maximum confining pressure. Interlock: net confining < 500 psi stops injection.' },
  { k: 'TUBING', v: 'ASME B31.3 eq. (3a) at 177 °C with −15 % wall tolerance: 1/8 × 0.035 in for the pore circuit (~11,800 psi on the 0.9 Sy basis allowed for austenitic tube) and 1/4 × 0.083 in for the confining circuit (~14,600 psi). 1/8 × 0.028 in reaches only ~9,000 psi on the same basis, below the 9,500 psi PSV set point, and is not adequate.' },
  { k: 'CO₂', v: 'A 1 L vessel at 9,000 psi and 150 °C stores ~69 kJ, about 80× the same vessel of water. CO₂ cools to about −29 °C across the BPR (outlet at 6 bar), so the BPR is heat-traced. After CO₂ exposure, depressurise at ≤ 2 MPa/min to avoid rapid gas decompression damage to the sleeve.' },
];

export const KPIS = [
  { label: 'BODY MEMBRANE', value: '0.78 S', sub: 'SA-479 316 at 177 °C · ASME VIII-2' },
  { label: 'PORT CROSS-BORE', value: '153 / 154 MPa', sub: 'PL+Pb in 316: passes with no margin → C-276' },
  { label: 'FATIGUE USAGE', value: '0.47', sub: '20,000 cycles · governed by the cross-bore' },
  { label: 'SEALING NET STRESS', value: '≈ 95 psi', sub: '20 µm roughness (280 psi at 50 µm) · run 500 psi net' },
];

export const CHECKS = [
  { q: 'Body general membrane (316, 177 °C)', c: '≤ S = 103 MPa', r: '79.6 MPa · pass' },
  { q: 'Thread roots, bore-step fillets (PL+Pb)', c: '≤ 1.5 S = 154 MPa', r: '≤ 78 MPa · pass' },
  { q: 'Confining-port ligament, 316 (PL+Pb)', c: '≤ 154 MPa', r: '153.4 MPa · pass, no margin' },
  { q: 'Hydrotest 16,640 psi, 316 (Pm)', c: '≤ 0.95 Sy = 195 MPa', r: '132 MPa · pass (local bore yield)' },
  { q: 'Hydrotest, 316 port ligament (PL)', c: '≤ 0.95 Sy = 195 MPa', r: '223 MPa · exceeded → C-276' },
  { q: 'Confining-port ligament, C-276 (PL+Pb)', c: '≤ 1.5 S = 241 MPa', r: '153 MPa · pass' },
  { q: 'End-plug thread stripping, 3-8 UN × 12', c: '≤ 0.6 S', r: 'SF 1.97 (plug) · pass' },
  { q: 'Fatigue, 0 → 10,000 psi × 20,000', c: 'usage ≤ 1', r: '0.47 cross-bore · 0.34 thread root' },
];

export const VERIFY = [
  { k: 'LAMÉ', v: 'Bore hoop stress at mid-body 114.98 MPa (FEA) against 114.91 MPa (Lamé), +0.05 %. The axial reaction at the symmetry plane is 175.9 kN against 176.9 kN from the hand calculation.' },
  { k: 'MESH CONVERGENCE', v: 'Thread-root peak 454 / 457 / 459 MPa at 0.10 / 0.05 / 0.03 mm. Port ligament PL+Pb 153.6 / 153.4 MPa at 0.3 / 0.2 mm, and the cross-bore hoop stress matches a Kt = 2.5 + P hand estimate. The sleeve micro model gives the same closure pressure at twice the mesh density.' },
  { k: 'INDEPENDENT CHECKS', v: 'Sleeve closure 0.54 MPa (FEA) against Johnson’s complete-contact pressure of 0.59 MPa. CFD inflow equals outflow, and the dP is the Darcy value plus the spreading resistance. Welge and a separate numerical Buckley–Leverett solver agree within 0.1 %.' },
];

export const FINDINGS = [
  'Annealed 316 passes VIII-2 at 10,000 psi and 177 °C with a 4.5 in OD (Pm = 0.78 S), but the confining-port ligament is right at its limit and the bore yields locally at hydrotest.',
  'C-276 removes both issues and is the right wetted alloy for hot chloride brine, CO₂ and trace H₂S, so it is the recommendation; 316 remains fine for sweet, low-chloride work.',
  'At the 16,640 psi hydrotest the 316 port ligament exceeds the test limits applied to its local SCL (223 vs 195 MPa): another reason for C-276.',
  'The innermost thread tooth carries ~21 % of the 177 kN plug load. A longer thread adds galling margin, not strength; fatigue is set by the root radius at the first loaded tooth.',
  'Under uniform net stress the sleeve closes 20 µm surface waviness at ~80 psi; with the 0.83× dip at the joint it needs ~95 psi net (280 psi at 50 µm). The usual ≥ 500 psi rule is that figure plus margin for rougher faces, harder sleeves and inlet pore pressure, and it must be applied at the inlet.',
  'The usable dP is capped by the net confining stress, which sets both the transducer ranges and the flood rate for tight cores and viscous polymer.',
  'A heating jacket with insulated end caps reaches ±1 °C in ~1.8 h, against ~10 h in an oven; the oven still heats the transfer vessels and lines.',
  'A two-start spiral distributor gives the most uniform inflow (UI 0.86 at 1 mm, against 0.76 for the rings-plus-radial baseline); a centre hole alone is unacceptable.',
];

export const NEXT_STEPS = [
  'Check allowables against ASME II-D / B31.3 Table A-1 and the fatigue curve against VIII-2 Annex 3-F.',
  'Measured hyperelastic data for the actual FKM / FEPM compound at 150 °C.',
  'HAZOP and pressure-systems review; C-276 drawing set.',
  'RGD qualification of the sleeve at the real CO₂ conditions.',
  'Change the CAD distributor face to the spiral, and compare patterns at equal open area.',
  'Finish the sleeve macro run beyond 381 psi net (it stopped on the increment limit).',
  'Commissioning against a reference core of known permeability.',
];

export const LIMITATIONS = [
  'Generic rig: the design basis is typical industry values, not a client specification; no vendor is endorsed.',
  'Allowables and tube S values were reconstructed from ASTM minima and published temperature trends, not read from the code tables.',
  'The fatigue curve is the strain-life basis of the austenitic design curve (Chopra & Smith), not VIII-2 Table 3-F.10.',
  'Mooney–Rivlin constants come from hardness (Gent), with frictionless contact. Threads are axisymmetric (no helix).',
  'Relative permeability curves are generic; the surfactant case is qualitative; no CO₂ recovery is claimed.',
  'Sleeve macro model converged to 381 psi net only; CFD patterns compared on a 0.5 mm mesh (0.25 mm check on two patterns, within 0.003 UI).',
  'CAD is parametric through the script and design-basis file, not through FreeCAD Sketch / Spreadsheet features.',
];

export const DOCS = [
  { kind: 'PDF', name: 'Full report: system design, hand calculations, FEA, fatigue, sealing, thermal, CFD, process model and verification', href: '/docs/core-flooding-eor-report.pdf', size: 'PDF · 4.6 MB' },
  { kind: 'PDF', name: 'P&ID and core-holder drawings (generated from the scripts)', href: '/docs/core-flooding-drawings.pdf', size: 'PDF · 0.1 MB' },
  { kind: 'STEP', name: 'Core holder assembly (STEP)', href: '/docs/core-holder-assembly.step', size: 'STEP · 0.6 MB' },
];

export const REFS = [
  { id: 'asme2', text: 'ASME Boiler and Pressure Vessel Code, Section VIII, Division 2: Alternative Rules, 2023 (Parts 4, 5, 8, 9).' },
  { id: 'b313', text: 'ASME B31.3-2022, Process Piping (304.1.2, Table A-1, Chapter IX).' },
  { id: 'chopra', text: 'O. K. Chopra and J. L. Smith, "Estimation of fatigue strain-life curves for austenitic stainless steels in light water reactor environments," ASME PVP 1998.', url: 'https://www.osti.gov/servlets/purl/8875' },
  { id: 'gent', text: 'A. N. Gent, "On the relation between indentation hardness and Young\'s modulus," Rubber Chem. Technol. 31 (1958) 896–906.', url: 'https://doi.org/10.5254/1.3542351' },
  { id: 'johnson', text: 'K. L. Johnson, Contact Mechanics. Cambridge University Press, 1985 (sinusoidal surface, complete-contact pressure).' },
  { id: 'iso23936', text: 'ISO 23936-2:2011, Non-metallic materials in contact with media related to oil and gas production — Part 2: Elastomers (RGD, Annex B).' },
  { id: 'span', text: 'R. Span and W. Wagner, "A new equation of state for carbon dioxide…," J. Phys. Chem. Ref. Data 25 (1996) 1509–1596.', url: 'https://doi.org/10.1063/1.555991' },
  { id: 'bl', text: 'S. E. Buckley and M. C. Leverett, "Mechanism of fluid displacement in sands," Trans. AIME 146 (1942) 107–116.', url: 'https://doi.org/10.2118/942107-G' },
  { id: 'lake', text: 'L. W. Lake, R. T. Johns, W. R. Rossen and G. A. Pope, Fundamentals of Enhanced Oil Recovery, 2nd ed. SPE, 2014.' },
  { id: 'yellig', text: 'W. F. Yellig and R. S. Metcalfe, "Determination and prediction of CO₂ minimum miscibility pressures," J. Pet. Technol. 32 (1980) 160–168.', url: 'https://doi.org/10.2118/7477-PA' },
  { id: 'ccx', text: 'G. Dhondt, CalculiX CrunchiX User\'s Manual, version 2.22.', url: 'http://www.dhondt.de/' },
  { id: 'of', text: 'OpenFOAM v2512 (porousSimpleFoam, Darcy–Forchheimer porosity), ESI-OpenCFD.', url: 'https://www.openfoam.com' },
] as const;
