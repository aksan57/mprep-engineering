export const PROJECT_CATS = ['All', 'Thermal', 'Electrochemical', 'Process', 'Oil & Gas', 'Minerals & Metallurgy', 'Mechanical'] as const;
export type ProjectCat = (typeof PROJECT_CATS)[number];

/** Published case studies, shown as large cards above the in-development list. */
export type CaseStudy = { num: string; cat: Exclude<ProjectCat, 'All'>; title: string; desc: string; type: string; focus: string[]; image: { src: string; alt: string }; href: string };

export const CASE_STUDIES: CaseStudy[] = [
  {
    num: '01', cat: 'Thermal',
    title: 'CZ-R4 Crystal-Growth Furnace',
    desc: 'Conceptual design and engineering analysis of a Czochralski-type furnace: hot-zone thermal behaviour, heat shields, insulation layering, water-cooled shell, and structural FEA.',
    type: 'Concept Design & Engineering Analysis',
    focus: ['3D CAD', 'Thermal Analysis', 'Structural FEA', 'Insulation Study'],
    image: { src: '/assets/cz-r4/02-section-hot-zone.webp', alt: 'Sectional view of the CZ-R4 hot zone: crucible, susceptor, induction coil, insulation and cooled chamber wall.' },
    href: '/projects/cz-r4/',
  },
  {
    num: '03', cat: 'Minerals & Metallurgy',
    title: 'Industrial Ball Mill Shell & Trunnion Fatigue Study',
    desc: 'Structural and fatigue assessment of a generic Ø4.0 m × 6.0 m overflow ball mill (~1.3 MW): Bond–Rowland sizing, 3D FEA of shell, heads and trunnions under the rotating charge, and IIW hot-spot fatigue at the welds. The baseline fails at the shell-to-head weld; 70 mm end courses fix it for +2.2 t of steel.',
    type: 'Structural Analysis & Assessment',
    focus: ['3D CAD', 'Structural FEA', 'Weld Fatigue (IIW)', 'Design Study'],
    image: { src: '/assets/ball-mill/s33-base-weld.webp', alt: 'PrePoMax close-up of axial stress at the discharge-end shell-to-head weld of the baseline mill, with a tension hot spot at the weld toe.' },
    href: '/projects/ball-mill/',
  },
  {
    num: '04', cat: 'Oil & Gas',
    title: 'Core-Flooding Apparatus for Enhanced Oil Recovery (EOR)',
    desc: 'System design and analysis of a 10,000 psi / 150 °C core-flooding rig for surfactant–polymer and CO₂ EOR: P&ID and instrument sizing, a parametric Hassler core holder checked to ASME VIII-2 with CalculiX (threads, cross-bore, fatigue), hyperelastic sleeve sealing, heat-up, inlet-distributor CFD and a Buckley–Leverett model behind the specification.',
    type: 'Oil & Gas Laboratory Equipment',
    focus: ['System Design & P&ID', 'Pressure-Vessel FEA', 'Hyperelastic Contact', 'Thermal & CFD'],
    image: { src: '/assets/core-flooding/card.webp', alt: 'Quarter cut-away of the Hassler core holder: body, threaded end plugs, floating end piece, black sleeve and the rock core.' },
    href: '/projects/core-flooding/',
  },
  {
    num: '20', cat: 'Mechanical',
    title: 'Cold-Gas Thruster: Air Tank & Nozzle',
    desc: 'A compressed-air thruster system sized from the figures reported for the new Roadster: a 450-bar Type III composite tank and a 5 kN supersonic nozzle, checked with axisymmetric FEA and compressible CFD.',
    type: 'Concept Design & Engineering Analysis',
    focus: ['3D CAD', 'Pressure-Vessel FEA', 'Compressible CFD', 'Real-Gas Calculations'],
    image: { src: '/assets/cold-gas/card-tank.webp', alt: 'Cut-away of the spherical composite air tank showing the carbon overwrap, aluminium liner and titanium boss.' },
    href: '/projects/cold-gas-thruster/',
  },
];

/**
 * Projects 02 and 05–19 are in development. They are listed as compact text rows (no image slots)
 * until each is published. When one is published, give it `image` and a case-study page.
 */
export type Project = { num: string; cat: Exclude<ProjectCat, 'All'>; title: string; desc: string; type: string; focus: string; visual: string };

export const PROJECTS: Project[] = [
  { num: '02', cat: 'Electrochemical', title: 'Photoelectrochemical & Electrochemical Test Cells', desc: 'A family of laboratory cells for illuminated-electrode and electrolysis experiments: PEC cell with quartz optical window, membrane-separated H-cell, and compact flow cell. Designed around electrode positioning, optical access, sealing, gas evolution, and reference-electrode placement.', type: 'Laboratory Testing Equipment', focus: 'CAD · Experimental Design · Sealing & Materials Selection', visual: 'Cutaway PEC cell showing working, counter, and reference electrodes, electrolyte chamber, and illumination window.' },
  { num: '05', cat: 'Minerals & Metallurgy', title: 'Laboratory HPAL Autoclave for Nickel Laterite', desc: 'Bench-scale high-pressure acid leaching (HPAL) autoclave for nickel–cobalt extraction from laterite ore under high temperature, high pressure, and sulfuric-acid conditions. Study covers titanium-lined pressure vessel design, magnetically coupled agitator, acid-injection and sampling ports, heating and cooling arrangement, and corrosion-driven materials selection, referencing ASME Section VIII principles.', type: 'Hydrometallurgical Pressure Equipment', focus: '3D CAD · Pressure-Vessel FEA · Thermal Analysis · Materials Selection', visual: 'Sectional view of the lined autoclave showing agitator, liner, heating jacket, sampling dip tube, and pressure fittings.' },
  { num: '06', cat: 'Thermal', title: 'Hydrothermal Synthesis Autoclave', desc: 'Teflon-lined stainless-steel autoclave for hydrothermal and solvothermal synthesis of functional materials. Covers wall thickness, closure and thread design, liner fit, and pressure/temperature limits, referencing ASME Section VIII principles.', type: 'Pressure Equipment Design', focus: '3D CAD · Pressure-Vessel FEA · Thermal Calculations', visual: 'Exploded view of steel body, PTFE liner, lid, and closure, plus an FEA stress plot.' },
  { num: '07', cat: 'Process', title: 'Biomass-to-Adsorbent Process Line', desc: 'A connected series covering the full route from biomass feedstock to tested adsorbent: hopper and screw feeder, pyrolysis/activation reactor, and batch adsorption vessel for chromium (Cr) removal testing. Relevant to coconut-shell charcoal and activated-carbon producers.', type: 'Process Equipment Series', focus: 'CAD · Heat Transfer · Mechanical Sizing · Process Calculations', visual: 'Process-flow layout linking feeder → reactor → adsorption vessel, with a cutaway of the reactor.' },
  { num: '08', cat: 'Process', title: 'Bitumen Emulsion Preparation Unit', desc: 'Pilot-scale unit for preparing bitumen emulsions: heated bitumen tank, jacketed aqueous-phase vessel, and colloid mill arrangement. Examines heating requirements, mixing, shear zone, and shaft and support design. Informed by applied bitumen-emulsion research.', type: 'Process Equipment Design', focus: 'CAD · Thermal Calculations · Structural Analysis · CFD Development', visual: '3D layout of bitumen tank, aqueous-phase vessel, colloid mill, and piping.' },
  { num: '09', cat: 'Oil & Gas', title: 'Wax Deposition Test Rig', desc: 'Cold-finger and flow-loop apparatus for studying paraffin wax deposition from waxy crude oils and evaluating wax inhibitors. Covers jacketed oil bath design, controlled temperature differential at the deposition surface, coolant circuit, and heat-transfer calculations.', type: 'Oil & Gas Laboratory Equipment', focus: 'CAD · Heat-Transfer Calculations · Thermal Simulation', visual: 'Cutaway of the jacketed oil bath with the cooled cold finger and a schematic of heating and cooling circuits.' },
  { num: '10', cat: 'Minerals & Metallurgy', title: 'Co-Precipitation Reactor for Battery Cathode Precursors', desc: 'Laboratory continuous stirred-tank reactor for synthesising nickel-rich hydroxide precursors (NCM/NCA) by co-precipitation. Study covers vessel and baffle geometry, impeller selection, pH and dosing ports, inert-gas blanketing, jacket temperature control, and overflow arrangement.', type: 'Battery-Materials Process Equipment', focus: 'CAD · Mixing & CFD · Thermal Calculations · Process Sizing', visual: 'Sectional view of the reactor with impeller, baffles, dosing lines, pH probe port, N₂ inlet, and heating jacket.' },
  { num: '11', cat: 'Electrochemical', title: 'Lab-Scale Electrolyzer Stack (AEM/PEM)', desc: 'Compact multi-cell electrolyzer for green-hydrogen and electro-oxidation research. Covers bipolar-plate and flow-field geometry, membrane-electrode assembly compression, gasket sealing, current collection, and gas/liquid manifolding.', type: 'Electrochemical Equipment Design', focus: 'CAD · Flow-Field CFD · Compression FEA · Materials Selection', visual: 'Exploded stack showing end plates, bipolar plates with flow channels, MEAs, gaskets, and tie rods.' },
  { num: '12', cat: 'Thermal', title: 'Controlled-Atmosphere Tube & Calcination Furnace', desc: 'Furnace for thermal treatment and calcination under controlled gas atmosphere — relevant to catalyst, ceramic, and battery-material preparation. Covers heating-zone arrangement, process-tube support, gas connections, and temperature uniformity.', type: 'Thermal Processing Equipment', focus: 'CAD · Thermal Analysis · Heat-Transfer Calculations', visual: 'Isometric cutaway of housing, process tube, heating elements, insulation, and gas fittings.' },
  { num: '13', cat: 'Oil & Gas', title: 'Spinning-Drop Interfacial Tension (IFT) Cell', desc: 'Test cell for measuring ultra-low interfacial tension between crude oil and surfactant solutions, used to screen chemical EOR formulations. Covers rotating capillary support, drive and speed stability, temperature control, and optical access for drop imaging.', type: 'Oil & Gas Laboratory Equipment', focus: 'CAD · Mechanical Design · Thermal Control Requirements', visual: '3D model of the rotating capillary housing, drive motor, heating block, and camera viewing axis.' },
  { num: '14', cat: 'Minerals & Metallurgy', title: 'Atmospheric Leaching Reactor', desc: 'Jacketed, acid-resistant reactor for atmospheric leaching of nickel, cobalt, and other metals from ores, concentrates, or recycled battery black mass. Covers slurry agitation, reflux condenser, acid-dosing and sampling arrangement, lining selection, and jacket heat duty.', type: 'Hydrometallurgical Process Equipment', focus: 'CAD · Mixing Calculations · Heat Transfer · Materials Selection', visual: 'Cutaway of the jacketed reactor with slurry impeller, reflux condenser, dosing line, and bottom discharge valve.' },
  { num: '15', cat: 'Process', title: 'Fixed-Bed Adsorption Column', desc: 'Continuous-flow column for evaluating adsorbent performance through breakthrough-curve testing, extending batch adsorption studies to flow conditions. Covers column sizing, packing support, flow distribution, sampling points, and pressure-drop estimates.', type: 'Separation Equipment Design', focus: 'CAD · Process Calculations · Pressure-Drop Analysis', visual: 'Sectional column showing inlet distributor, packed adsorbent bed, support mesh, and sampling ports.' },
  { num: '16', cat: 'Electrochemical', title: 'Corrosion Flat Cell & Electrodeposition Cell', desc: 'Two complementary lab cells: a flat cell for electrochemical corrosion testing of coated and uncoated metal samples, and an electrodeposition cell for thin-film and coating preparation. Covers exposed-area definition, sealing, electrode alignment, and electrolyte circulation.', type: 'Laboratory Testing Equipment', focus: 'CAD · Experimental Design · Sealing & Materials Selection', visual: 'Exploded flat cell showing sample clamp, O-ring, reference electrode port, and counter-electrode mesh.' },
  { num: '17', cat: 'Mechanical', title: 'Spin & Dip Coater for Thin-Film Electrodes', desc: 'Benchtop coating system for preparing thin-film photoelectrodes and functional coatings on glass/FTO substrates. Covers substrate chuck design, speed and withdrawal-rate control, solvent containment, and vibration considerations.', type: 'Materials Processing Equipment', focus: 'CAD · Mechanical Design · Motion & Control Requirements', visual: 'Side-by-side 3D models of the spin-coater bowl with vacuum chuck and the dip-coater lift mechanism.' },
  { num: '18', cat: 'Mechanical', title: 'Hydraulic Pellet Press & Die Set', desc: 'Laboratory press and die set for preparing pellets for XRD, FTIR (KBr), and XRF analysis. Covers die geometry, punch and sleeve stresses, frame stiffness, hydraulic loading, and pellet ejection.', type: 'Mechanical Equipment Design', focus: '3D CAD · Structural FEA · Mechanical Calculations', visual: 'Exploded die set beside the press frame, with an FEA stress plot of the die under load.' },
  { num: '19', cat: 'Thermal', title: 'Laboratory Vacuum Drying Oven', desc: 'Vacuum oven for low-temperature drying of powders, electrodes, and heat-sensitive materials. Covers chamber wall design under external pressure, door sealing, shelf heating, insulation, and vacuum connections.', type: 'Laboratory Equipment Design', focus: '3D CAD · External-Pressure FEA · Heat-Loss Calculations', visual: 'Front 3D view with the door open, showing heated shelves and vacuum port.' },
];

export const ROADMAP = [
  'Rotary Kiln for Laterite Calcination & Pre-Reduction', 'HPHT Corrosion Test Autoclave', 'Battery Pouch & Coin-Cell Test Fixture',
  'Spray Dryer for Catalyst & Battery Powders', 'Stirred-Tank Reactor for Process Studies', 'Polymer Membrane Casting & Drying System',
  'Sieve Shaker for Particle-Size Analysis', 'Solid–Liquid Filtration Unit', 'Shell-and-Tube Heat Exchanger', 'Glovebox / Inert-Atmosphere Workstation',
].map((t, i) => ({ n: 'R' + (i + 1), t }));
