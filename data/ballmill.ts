// Industrial ball mill shell & trunnion fatigue case study. A generic overflow mill defined by MPrep;
// dimensions, loads and materials are representative assumptions, not a specific vendor's machine.

const A = '/assets/ball-mill/';

export const BM = {
  title: 'Industrial ball mill: shell & trunnion fatigue',
  summary: 'A generic Ø4.0 m × 6.0 m overflow ball mill (~1.3 MW) checked for 25 years of rotating-charge fatigue. The baseline fails at the shell-to-head weld; 70 mm end courses fix it for +2.2 t of steel.',
  meta: [
    { k: 'TYPE', v: 'Structural & fatigue assessment' },
    { k: 'CONTEXT', v: 'Self-initiated engineering study' },
    { k: 'TOOLS', v: 'Python · gmsh / OpenCASCADE · FreeCAD · CalculiX / PrePoMax' },
    { k: 'STATUS', v: 'Generic design · not built or experimentally validated' },
  ],
};

export const CHAPTERS = [
  ['bm-overview', 'Overview'], ['bm-basis', 'Design basis'], ['bm-cad', 'CAD geometry'], ['bm-model', 'FEA model'],
  ['bm-fea', 'Results in PrePoMax'], ['bm-weld', 'Weld fatigue'], ['bm-study', 'Design study'], ['bm-verify', 'Verification'],
  ['bm-conclusions', 'Conclusions'], ['bm-docs', 'Documentation'], ['bm-refs', 'References'],
] as const;

export const BM_PARTS = [
  { n: '01', t: 'Mill sizing, charge mass and power draw (Bond–Rowland)' },
  { n: '02', t: 'Parametric CAD and a hexahedral 3D FEA model of shell, heads, trunnions and gear flange' },
  { n: '03', t: 'IIW hot-spot fatigue at the welds, Goodman at the cast trunnion fillet' },
  { n: '04', t: 'Design study: heads vs whole shell vs local end courses' },
];

export const IMAGES = {
  cadBase: { src: A + 'cad-base-iso.webp', alt: 'FreeCAD isometric view of the baseline mill: 40 mm shell, conical heads, trunnions and girth-gear flange.', caption: 'Baseline · 40 mm shell to the head junction · FreeCAD' },
  cadRec: { src: A + 'cad-rec-iso.webp', alt: 'FreeCAD isometric view of the recommended mill, with thicker end courses visible as rings at each end of the shell.', caption: 'Recommended · 70 mm end courses, 1:4 taper · FreeCAD' },
  profile: { src: A + 'profile.webp', alt: 'Feed-end profile of the shell and head, baseline and recommended end course.', caption: 'Feed-end profile · baseline vs recommended end course' },
  cutaway: { src: A + 'vonmises-cutaway.webp', alt: 'Cut-away of the recommended mill coloured by von Mises stress under operating load.', caption: 'Recommended design · von Mises stress under charge, gear, self-weight and liners' },
  secBase: { src: A + 's33-base-section.webp', alt: 'PrePoMax section through the mill axis of the baseline design, coloured by axial stress S33 on a fixed −50 to +50 MPa legend.', caption: 'Baseline · S33 on the axial section · PrePoMax' },
  secRec: { src: A + 's33-rec-section.webp', alt: 'PrePoMax section through the mill axis of the recommended design, coloured by axial stress S33 on the same legend.', caption: 'Recommended · same section, camera and legend' },
  weldBase: { src: A + 's33-base-weld.webp', alt: 'PrePoMax close-up of the discharge-end inner shell-to-head weld, baseline: an orange-red tension spot at the weld toe.', caption: 'Baseline · discharge-end inner weld, charge side' },
  weldRec: { src: A + 's33-rec-weld.webp', alt: 'PrePoMax close-up of the same weld on the recommended design: only light yellow at the toe, thicker end course visible.', caption: 'Recommended · same view: the hot spot drops to light yellow' },
  theta: { src: A + 's33-theta.webp', alt: 'Chart of S33 around the circumference at the discharge-end inner weld for both designs: hot-spot stress and raw toe-node value.', caption: 'S33 around the circumference, discharge-end inner weld · independent re-read of the CalculiX results' },
  history: { src: A + 'hotspot-history.webp', alt: 'Hot-spot stress over one revolution at the discharge-end shell-to-head weld for both designs.', caption: 'Hot-spot stress over one revolution, discharge-end weld' },
  thickness: { src: A + 'thickness-study.webp', alt: 'Fatigue utilisation of the critical weld against plate thickness for thicker heads, thicker shell and local end courses.', caption: 'Utilisation vs plate thickness · three ways to stiffen the junction' },
  fillet: { src: A + 'fillet-study.webp', alt: 'Goodman safety factor of the trunnion fillet against fillet radius.', caption: 'Trunnion fillet · Goodman safety factor vs radius' },
};

export const BASIS = [
  { name: 'Shell ID / inside liners / EGL', value: '4.00 / 3.85 / 6.0 m', basis: '75 mm average liner + lifter' },
  { name: 'Critical / operating speed', value: '21.6 / 16.2 rpm (75 % Nc)', basis: 'Nc = 42.3 / √D' },
  { name: 'Ball filling / ball mass / slurry', value: '35 % / 114 t / 18 t', basis: 'Bulk 4.65 t/m³, slurry 1.8 t/m³ in voids' },
  { name: 'Pinion power', value: '1,293 kW (11.4 kW/t balls)', basis: 'Bond–Rowland; 1,500 kW motor' },
  { name: 'Drive torque / gear tangential / radial', value: '764 kNm / 263 kN / 96 kN', basis: 'Pitch radius 2.9 m, 20° pressure angle' },
  { name: 'Girth gear / liner mass', value: '25 t / 585 kg/m²', basis: 'Gear on the flange rim; liners smeared into the shell' },
  { name: 'Shell, heads, trunnions (baseline)', value: '40 mm shell; 70 mm heads, 15° cone; trunnion Ø1400/1600 × 800 mm', basis: 'S355 plate; cast-steel trunnion' },
  { name: 'Design life', value: '25 years = 1.95 × 10⁸ revolutions', basis: '92 % availability; one cycle per revolution' },
];

export const MODEL_STEPS = [
  { k: 'GEOMETRY & MESH', v: 'Axisymmetric profile defined in Python and revolved in gmsh into a conforming hexahedral mesh (C3D8I incompatible-mode bricks, a few wedges in the heads), structured through the thickness, 6 mm meridional size at the junctions, 48 divisions around, ≈75,000 nodes. The same script exports the STEP solids shown above.' },
  { k: 'LOADS', v: 'Self-weight with liner mass; charge traction over the toe-to-shoulder arc, with pressure and drag profiles solved so they reproduce the charge weight, zero net side force and the drive torque exactly (peak 0.086 MPa); lateral charge pressure on the heads (K = 0.4); girth-gear weight and pinion mesh forces.' },
  { k: 'SUPPORTS', v: 'Each trunnion on a 120° × 400 mm hydrodynamic pad (radial constraint). Feed end locates axially; discharge end is free to expand. One tangential constraint removes rigid-body spin with zero reaction.' },
  { k: 'FATIGUE', v: 'The mill turns through a stationary load field, so one static solve gives the full stress cycle of every point around the circumference. Welds: IIW type-a hot-spot stress σhs = 1.67 σ(0.4t) − 0.67 σ(1.0t), meridional, on FAT 100 / FAT 90 with thickness correction and γM = 1.30. Cast trunnion fillet: Goodman, Se = 83 MPa.' },
];

export const KPIS = [
  { label: 'BASELINE WELD Δσhs', value: '58.5 MPa', sub: 'Utilisation 1.64 · ≈0.4 years · FAIL' },
  { label: 'RECOMMENDED WELD Δσhs', value: '27.8 MPa', sub: 'Utilisation 0.87 · > 100 years · pass' },
  { label: 'ADDED STEEL', value: '+2.2 t', sub: '+5 % structural mass (whole shell at 70 mm: +18.6 t)' },
  { label: 'TRUNNION FILLET', value: 'SF 4.1', sub: 'Goodman, R100 cast steel · not life-limiting' },
];

export const CHECKS = [
  { q: 'Shell/head weld, hot-spot range', c: 'IIW FAT 100, γM 1.30', b: '58.5 MPa', r: '27.8 MPa' },
  { q: 'Shell/head weld, utilisation (25 y)', c: '≤ 1.0', b: '1.64 · fail', r: '0.87 · pass' },
  { q: 'End-course butt weld (taper end)', c: 'IIW FAT 100', b: '—', r: '0.44' },
  { q: 'Girth-gear flange weld', c: 'IIW FAT 90', b: '0.79', r: '0.78' },
  { q: 'Trunnion fillet R100', c: 'Goodman SF ≥ 2.0', b: '4.3', r: '4.1' },
  { q: 'Peak von Mises (excl. bearing pads)', c: '< Sy/1.5 = 167 MPa', b: '44 MPa', r: '38 MPa' },
  { q: 'Steel mass (shell + heads + trunnions)', c: '—', b: '44.5 t', r: '46.7 t' },
];

export const STUDY = [
  { v: 'Baseline 40 mm', d: '58.2', u: '1.63', m: '—' },
  { v: 'Heads 90 / 110 / 130 mm', d: '57.3 / 54.0 / 50.9', u: '1.60 / 1.51 / 1.42', m: '+3.8 / +7.5 / +11.3 t' },
  { v: 'Whole shell 50 / 60 / 70 mm', d: '44.0 / 33.7 / 26.3', u: '1.29 / 1.02 / 0.82', m: '+6.2 / +12.4 / +18.6 t' },
  { v: 'End courses 60 / 70 / 80 mm × 400 mm', d: '34.2 / 27.0 / 22.1', u: '1.04 / 0.84 / 0.71', m: '+2.0 / +3.2 / +4.4 t' },
  { v: 'End courses 70 mm × 250 mm (recommended)', d: '27.5', u: '0.86', m: '+2.2 t' },
];

export const VERIFY = [
  { k: 'EQUILIBRIUM', v: 'Vertical bearing reaction 2.28 MN = charge 1.29 MN + gear 0.25 MN + structure and liners 1.07 MN + head pressure 0.03 MN − pinion uplift 0.35 MN. Net horizontal charge force and net torque are zero by construction.' },
  { k: 'MESH CONVERGENCE', v: 'The weld hot-spot range converges within 0.5 % below 8 mm meridional size; 48 → 60 circumferential divisions changes it by < 0.1 %. A final 4 mm / 72-division mesh moves neither verdict.' },
  { k: 'SOLVER & POST-PROCESSING', v: 'CalculiX 2.17, 2.21 and 2.22 (PrePoMax build) agree within 1 %. An independent script re-reads the .frd results, confirms the stress component order (SZZ = S33) and reproduces the hot-spot ranges to 0.01 MPa (58.51 and 27.64 MPa at the discharge weld).' },
];

export const FINDINGS = [
  'The mill is statically very lightly loaded (peak von Mises 44 MPa) — fatigue, not strength, governs.',
  'The critical detail is the inner shell-to-head weld on the charge side: Δσhs 58.5 MPa per revolution, utilisation 1.64, so the baseline fails its 25-year life.',
  'The cause is ovalisation: the stiff heads stop the shell end from ovalising under the charge, forcing local meridional bending at the junction.',
  'Thicker heads barely help (70 → 130 mm cuts the range by only 13 %).',
  '70 mm end courses, 250 mm long with a 1:4 taper, halve the range to 27.8 MPa (utilisation 0.87) for +2.2 t; a 70 mm whole shell does the same for +18.6 t.',
  'On the recommended design the highest S33 in the model (32.4 MPa) sits in the trunnion bore near the bearing zone, not at the weld: the global maximum alone would point at the wrong detail, so welds are read at their IIW points.',
  'Trunnion fillet (SF 4.1) and girth-gear flange welds (utilisation 0.78) pass in both designs.',
];

export const NEXT_STEPS = [
  'DEM charge-motion run to replace the calibrated pressure profile.',
  'Start-up and inching torque cases (typically 1.5–2.0× running torque).',
  'Submodel of a manhole cut-out and liner bolt holes.',
  'Bolted head flange and gear-mesh misalignment.',
  'Thermal gradient from hot slurry.',
];

export const LIMITATIONS = [
  'Generic mill: dimensions, loads and materials are representative assumptions, not a specific machine.',
  'Charge pressure is a calibrated engineering distribution, not a DEM result.',
  'Welds are not modelled geometrically; the inner corner is sharp and the IIW read-out points (0.4t / 1.0t) sit outside the corner singularity.',
  'Manholes, bolted flanges, liner bolt holes, thermal gradients, start-up torque and gear misalignment are not included.',
  'Linear-elastic static analysis; no residual stress or weld-quality effects beyond the FAT class.',
];

export const DOCS = [
  { kind: 'PDF', name: 'Full report — design basis, model, results, design study, verification and native-tool views', href: '/docs/ball-mill-fatigue-report.pdf', size: 'PDF · 0.9 MB' },
];

export const REFS = [
  { id: 'iiw', text: 'A. F. Hobbacher, Recommendations for Fatigue Design of Welded Joints and Components, IIW doc. XIII-2460-13, 2nd ed. Cham: Springer, 2016.', url: 'https://doi.org/10.1007/978-3-319-23757-2' },
  { id: 'rowland', text: 'C. A. Rowland and D. M. Kjos, "Rod and ball mills," in Mineral Processing Plant Design, A. L. Mular and R. B. Bhappu, Eds. New York: SME-AIME, 1980.' },
  { id: 'shigley', text: 'R. G. Budynas and J. K. Nisbett, Shigley\'s Mechanical Engineering Design, 10th ed. New York: McGraw-Hill, 2015 (Marin factors, Goodman criterion).' },
  { id: 'ccx', text: 'G. Dhondt, CalculiX CrunchiX User\'s Manual, versions 2.17–2.22.', url: 'http://www.dhondt.de/' },
] as const;
