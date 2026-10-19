// Cold-gas thruster tank & nozzle case study. All dimensions, materials and loads are MPrep's own
// assumptions built around press-reported figures (600 L, ~250 kg of air). None are Tesla specifications.

const A = '/assets/cold-gas/';

export const CG = {
  title: 'Cold-gas thruster: air tank & nozzle',
  summary: 'A compressed-air thruster system sized from the figures reported for the new Roadster: a 450-bar composite tank and a 5 kN supersonic nozzle, sized by hand and checked with axisymmetric FEA and compressible CFD.',
  meta: [
    { k: 'TYPE', v: 'Concept design & analysis' },
    { k: 'CONTEXT', v: 'Self-initiated engineering study' },
    { k: 'TOOLS', v: 'FreeCAD · CadQuery · PrePoMax / CalculiX · SimFlow / OpenFOAM v2512' },
    { k: 'STATUS', v: 'Not built or experimentally validated · not a Tesla design' },
  ],
};

export const CHAPTERS = [
  ['cg-overview', 'Overview'], ['cg-brief', 'Design brief'], ['cg-cad', 'CAD geometry'], ['cg-params', 'Assumptions & parameters'],
  ['cg-fea', 'Tank FEA'], ['cg-verify', 'Verification'], ['cg-nozzle', 'Nozzle sizing'], ['cg-cfd', 'Nozzle CFD'],
  ['cg-conclusions', 'Conclusions'], ['cg-docs', 'Documentation'], ['cg-refs', 'References'],
] as const;

export const CG_PARTS = [
  { n: '01', t: 'Gas budget with a real-gas equation of state' },
  { n: '02', t: 'Type III COPV sizing and axisymmetric FEA of the polar boss' },
  { n: '03', t: 'Isentropic sizing of a 5 kN convergent–divergent nozzle' },
  { n: '04', t: 'Compressible CFD of the nozzle and near-field plume' },
];

export const IMAGES = {
  tank: { src: A + 'copv-cutaway.webp', alt: 'Cut-away CAD model of the spherical tank: black carbon overwrap, grey aluminium liner and titanium boss at the pole.', caption: 'Tank cut-away · overwrap, liner and polar boss' },
  nozzle: { src: A + 'nozzle-cad.webp', alt: 'CAD model of the conical convergent–divergent nozzle with mounting flange.', caption: '5 kN nozzle · 30° convergent, 15° divergent' },
  cfd: { src: A + 'cfd-nozzle.webp', alt: 'Mach number and static temperature in the nozzle and starting plume at 0.3 ms, axisymmetric section mirrored about the axis.', caption: 'Mach number (top) and static temperature (bottom) at t = 0.3 ms · section mirrored about the axis' },
  cfdAxis: { src: A + 'cfd-axis.webp', alt: 'Mach number along the nozzle axis from CFD compared with one-dimensional isentropic theory.', caption: 'Mach number on the axis · CFD vs 1D isentropic theory' },
  vonMises: { src: A + 'copv-vonmises.webp', alt: 'Von Mises stress on the axisymmetric tank section at 450 bar, with a zoomed view of the polar boss.', caption: 'Von Mises stress at 450 bar · full section and polar boss' },
};

export const BRIEF = [
  { k: 'Stored gas', v: '≈600 L of air', n: 'Two COPVs combined; stated on the livestream by Tesla VP of vehicle engineering Lars Moravy.' },
  { k: 'Gas mass', v: '≈250 kg, ten nozzles', n: 'Same statement, as reported.' },
  { k: 'Pressure on screen', v: '5,500 psi ≈ 379 bar', n: '“Thruster” readout in an official interior photo; Tesla gave no storage pressure.' },
  { k: 'Consistency check', v: '600 L @ 379 bar, 27 °C → ≈223 kg', n: 'Real-gas (Z ≈ 1.2). 250 kg needs ≈454 bar, so the design point here is 450 bar.' },
  { k: 'Minimum refill work', v: '≈37 kWh', n: 'Reversible isothermal limit (exergy) for 250 kg at 450 bar.' },
];

export const PARAMS = [
  { name: 'Tanks', value: '2 spheres × 0.30 m³, ID 830 mm, OD 888 mm', basis: 'Design' },
  { name: 'Working / burst pressure', value: '45 / 101 MPa (×2.25)', basis: 'Assumed; between FMVSS 308 (×2) and the ×3 of EN 12245' },
  { name: 'Liner', value: 'Al 6061-T6, 3 mm, E = 69 GPa', basis: 'Assumed; properties as in Rocha et al.' },
  { name: 'Overwrap', value: 'Carbon/epoxy, quasi-isotropic, 26 mm, E = 50 GPa', basis: 'Assumed; sized to 800 MPa at burst (laminate check below)' },
  { name: 'Polar boss', value: 'Ti-6Al-4V, Ø70 mm neck, Ø24 mm port', basis: 'Assumed' },
  { name: 'Shell mass, two tanks', value: '≈224 kg (188 composite, 35 liner)', basis: 'Calculated' },
  { name: 'Nozzle chamber pressure', value: '100 bar regulated, 300 K', basis: 'Design' },
  { name: 'Nozzle thrust', value: '5 kN, exit matched to 1 atm', basis: 'Design' },
];

export const FEA_STEPS = [
  { k: 'MODEL', v: '2D axisymmetric section with liner, overwrap and boss sharing nodes (perfect bond). Second-order CAX6 triangles, ≈40,600 elements, ≈2 mm edges in the 3 mm liner.' },
  { k: 'LOADS & SUPPORTS', v: '45 MPa on the inner surface and inside the port. One axis node at the bottom pole held axially against rigid-body motion.' },
  { k: 'SOLVER', v: 'Linear static, CalculiX through PrePoMax. Results read from the .frd file and plotted from the nodal stresses.' },
];

export const VERIFY = [
  { q: 'Overwrap membrane stress, equator', h: '298 MPa', f: '298 MPa' },
  { q: 'Liner membrane stress, equator', h: '430 MPa', f: '434 MPa' },
  { q: 'Radial growth at the outer surface, equator', h: '1.85 mm', f: '1.78 mm' },
];

export const FEA_RESULTS = [
  { label: 'OVERWRAP AT BURST', value: '≈670 MPa', sub: 'vs 800 MPa assumed; ≈1,110 MPa laminate estimate' },
  { label: 'LINER, EQUATOR', value: '434 MPa', sub: 'Above 6061-T6 liner yield (256 MPa)' },
  { label: 'BOSS, PORT SIDE', value: '≈775 MPa', sub: 'Ti-6Al-4V typical yield ≈880 MPa' },
  { label: 'MAX DISPLACEMENT', value: '3.6 mm', sub: 'At 450 bar' },
];

export const NOZZLE = [
  { name: 'Throat / exit diameter', value: '20.3 / 57.5 mm' },
  { name: 'Area ratio Ae/A*', value: '8.05' },
  { name: 'Exit Mach number', value: '3.68' },
  { name: 'Exit velocity / Isp', value: '664 m/s / 68 s' },
  { name: 'Mass flow per nozzle', value: '7.5 kg/s' },
  { name: 'Exit static temperature', value: '≈81 K (dew point of air at 1 atm ≈82 K)' },
];

export const CFD_VERIFY = [
  { q: 'Exit Mach number (area-averaged)', h: '3.68', f: '3.61' },
  { q: 'Exit static temperature', h: '81 K', f: '83 K' },
  { q: 'Exit static pressure', h: '1.01 bar', f: '1.07 bar' },
  { q: 'Mass flow', h: '7.53 kg/s', f: '7.47 kg/s' },
  { q: 'Effective exhaust velocity', h: '664 m/s', f: '651 m/s' },
  { q: 'Thrust', h: '5.00 kN', f: '4.86 kN' },
];

export const CFD_STEPS = [
  { k: 'SOLVER', v: 'rhoCentralFoam (density-based, Kurganov central scheme with van Leer reconstruction), set up in SimFlow 5.1 and run on its bundled OpenFOAM v2512 with an internal-energy formulation.' },
  { k: 'DOMAIN & MESH', v: '5° axisymmetric wedge: 40 mm plenum, nozzle and 400 mm of plume, out to r = 160 mm. Structured mesh, 25,360 cells.' },
  { k: 'BOUNDARIES', v: 'Inlet at 100 bar total pressure, 300 K. Ambient at 1 atm; the nozzle base outside the lip is a slip wall. Perfect-gas air with constant viscosity, slip walls (no boundary layer). Run to 0.3 ms of physical time from rest, by which the flow inside the nozzle has started and is quasi-steady.' },
];

export const LIMITATIONS = [
  'Composite modelled as an isotropic solid; a ply-by-ply laminate with a failure criterion is needed for a design check.',
  'Linear-elastic liner: it yields at working pressure. A real vessel is autofrettaged, which needs an elastic–plastic load–unload analysis.',
  'No mesh-convergence study; the liner is about two elements thick. Membrane stresses are reliable, local peaks indicative only.',
  'The peak at the boss re-entrant corner is a mesh-dependent singularity and is not used for assessment.',
  'No fatigue or composite stress-rupture assessment.',
  'CFD uses perfect-gas air with slip walls (no boundary layer); real-gas effects and condensation are not modelled.',
  'Only the start-up is simulated (0.3 ms): the nozzle flow is quasi-steady, the plume and the small plenum are not.',
  'Matrix cracking: at working strain (≈0.4 %) the transverse plies of a real laminate would micro-crack; the isotropic model cannot show this.',
];

export const FINDINGS = [
  '250 kg in 600 L needs ≈450 bar once real-gas behaviour is included; the reported 5,500 psi holds ≈223 kg.',
  'Two 888 mm spheres: shells ≈224 kg, close to the mass of air they store.',
  'FEA matches membrane theory within 4 % away from the boss.',
  'The liner yields at working pressure, so autofrettage is part of the design, not an option.',
  'The titanium boss is the critical detail: ≈775 MPa near the port at working pressure.',
  'CFD confirms the nozzle: 4.86 kN and 7.47 kg/s, within 3 % of the 1D design; the gap is the expected divergence loss of a 15° cone.',
  'The sharp throat sends a shock onto the axis; from mid-nozzle on, the gas is colder than the dew point of air at its local pressure (down to 48 K in the plume).',
  'At Isp ≈ 68 s, 250 kg of air carries ≈166 kN·s of impulse: four 5 kN nozzles would empty it in about 8 s — enough for hops, not sustained flight.',
];

export const NEXT_STEPS = [
  'Redesign the boss flange (wider, tapered) and re-run.',
  'Laminate model with helical and hoop layers; Tsai–Wu or Hashin ply failure.',
  'Elastic–plastic autofrettage cycle for the liner.',
  'Mesh-convergence study at the boss.',
  'Blow-down model: tank pressure and temperature during a firing.',
  'Contoured (bell) nozzle with a rounded throat to remove the axis shock; longer CFD run for a fully developed plume.',
];

export const DOCS = [
  { kind: 'ZIP', name: 'CAD — STEP (tank, FEA section, nozzle), STL, FreeCAD file, FreeCAD macro and CadQuery script', href: '/docs/coldgas-cad.zip', size: 'ZIP · 115 KB' },
  { kind: 'ZIP', name: 'FEA — CalculiX input deck, results (.frd), PrePoMax model, deck builder and plotting scripts', href: '/docs/coldgas-fea-calculix.zip', size: 'ZIP · 13.8 MB' },
  { kind: 'ZIP', name: 'CFD — complete OpenFOAM rhoCentralFoam case with mesh, results at 0.3 ms, log and post-processing', href: '/docs/coldgas-cfd-openfoam.zip', size: 'ZIP · 2.6 MB' },
  { kind: 'ZIP', name: 'Hand calculations — real-gas budget, tank, laminate check and nozzle sizing (Python)', href: '/docs/coldgas-hand-calcs.zip', size: 'ZIP · 3 KB' },
];

export const REFS = [
  { id: 'techcrunch', text: 'S. O\'Kane, "Tesla reveals SpaceX-powered Roadster that flies and falls with style," TechCrunch, 15 October 2026.', url: 'https://techcrunch.com/2026/10/15/tesla-reveals-spacex-powered-roadster-that-flies-and-falls-with-style/' },
  { id: 'paultan', text: 'H. Sidhu, "Tesla Roadster revealed – flies on SpaceX air thrusters, 0-96 km/h in 0.81s, production 2028," Paul Tan\'s Automotive News, 16 October 2026.', url: 'https://paultan.org/2026/10/16/tesla-roadster-revealed-flies-on-spacex-air-thrusters-0-96-km-h-in-0-81s-production-2028/' },
  { id: 'lemmon', text: 'E. W. Lemmon, R. T. Jacobsen, S. G. Penoncello and D. G. Friend, "Thermodynamic properties of air and mixtures of nitrogen, argon, and oxygen from 60 to 2000 K at pressures to 2000 MPa," J. Phys. Chem. Ref. Data, vol. 29, no. 3, pp. 331–385, 2000.', url: 'https://doi.org/10.1063/1.1285884' },
  { id: 'coolprop', text: 'I. H. Bell, J. Wronski, S. Quoilin and V. Lemort, "Pure and pseudo-pure fluid thermophysical property evaluation and the open-source thermophysical property library CoolProp," Ind. Eng. Chem. Res., vol. 53, no. 6, pp. 2498–2508, 2014.', url: 'https://doi.org/10.1021/ie4033999' },
  { id: 'fmvss308', text: '49 CFR § 571.308, FMVSS No. 308 — Compressed hydrogen fuel container integrity, paragraph S5.1.1.1.', url: 'https://www.law.cornell.edu/cfr/text/49/571.308' },
  { id: 'rocha', text: 'H. Rocha, P. Antunes, U. Lafont and J. P. Nunes, "Processing and structural health monitoring of a composite overwrapped pressure vessel for hydrogen storage," Structural Health Monitoring, vol. 23, no. 4, pp. 2391–2406, 2024.', url: 'https://doi.org/10.1177/14759217231204242' },
  { id: 'ti64', text: 'Ulbrich Stainless Steels & Special Metals, "Grade 5 Titanium (Ti-6Al-4V), UNS R56400" — typical annealed properties (yield 880 MPa, E 113.8 GPa).', url: 'https://www.ulbrich.com/alloys/ti-6-al-4-v-uns-r56400/' },
  { id: 'sutton', text: 'G. P. Sutton and O. Biblarz, Rocket Propulsion Elements, 9th ed. Hoboken, NJ: Wiley, 2017. ISBN 978-1-118-75365-1. Chapter 3, nozzle theory.' },
  { id: 'greenshields', text: 'C. J. Greenshields, H. G. Weller, L. Gasparini and J. M. Reese, "Implementation of semi-discrete, non-staggered central schemes in a colocated, polyhedral, finite volume framework, for high-speed viscous flows," Int. J. Numer. Methods Fluids, vol. 63, no. 1, pp. 1–21, 2010.', url: 'https://doi.org/10.1002/fld.2069' },
] as const;
