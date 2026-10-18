export type Service = {
  tag: string; short: string; title: string; summary: string;
  deliverables: string[]; applications: string; value: string;
};

export const SERVICES: Service[] = [
  { tag: 'CAD', short: 'CAD design & 3D modeling', title: 'CAD Design and 3D Modeling',
    summary: 'Parametric part and assembly models built for manufacture, analysis and review.',
    deliverables: ['Native and neutral CAD files (e.g. STEP)', 'Assemblies with clear part structure', 'Renders and exploded views'],
    applications: 'Equipment concepts, fixtures and enclosures, redesign of existing parts, simulation-ready geometry.',
    value: 'Resolves fit, layout and interference questions before material is cut.' },
  { tag: 'FEA', short: 'Finite element analysis', title: 'Finite Element Analysis (FEA)',
    summary: 'Structural analysis of stress, deformation and stiffness under defined loads.',
    deliverables: ['Model setup and mesh documentation', 'Stress and displacement results', 'Short report with assumptions and limits'],
    applications: 'Load-bearing frames, pressure-containing parts, brackets, thermally loaded components.',
    value: 'Shows where a design has margin and where it needs attention, relative to stated inputs.' },
  { tag: 'THERMAL', short: 'Thermal simulation', title: 'Thermal Simulation',
    summary: 'Conduction, convection and radiation modeling for components and equipment.',
    deliverables: ['Temperature fields and heat-flow paths', 'Boundary-condition summary', 'Parameter or design-variant comparison'],
    applications: 'Furnaces and hot zones, heat sinks, insulation layouts, thermally driven deformation.',
    value: 'Compares design options on heat loss, gradients and hot spots before prototyping.' },
  { tag: 'CFD', short: 'CFD simulation', title: 'Computational Fluid Dynamics (CFD)',
    summary: 'Simulation of fluid flow, mixing and convective heat transfer inside equipment.',
    deliverables: ['Flow, velocity and pressure fields', 'Mixing and residence-time indicators', 'Report with mesh, models and assumptions'],
    applications: 'Slurry mixing vessels and impellers, gas flow in furnaces and chambers, drying ovens, cooling channels.',
    value: 'Shows how flow behaves inside the equipment, so geometry can be improved before fabrication.' },
  { tag: 'PROCESS', short: 'Process equipment design', title: 'Chemical and Process Equipment Design',
    summary: 'Concept and detail design of vessels, chambers and process hardware.',
    deliverables: ['Equipment layout and sizing calculations', 'CAD models and general arrangement drawings', 'Design basis document'],
    applications: 'Reaction and heating chambers, lab-scale and pilot equipment, custom process hardware.',
    value: 'Turns process requirements into equipment geometry that can be quoted and reviewed.' },
  { tag: 'DOCS', short: 'Drawings & documentation', title: 'Technical Drawings and Documentation',
    summary: 'Manufacturing drawings, calculation sheets and analysis reports.',
    deliverables: ['2D drawings with dimensions and tolerances', 'Engineering calculation sheets', 'Technical reports in your template'],
    applications: 'Supplier packages, internal design reviews, project handover and records.',
    value: 'Gives reviewers and suppliers one traceable record of what was designed and why.' },
];

export const EQUIPMENT = [
  { title: 'Powder Preparation', examples: 'Ball mill, powder mixer, grinder, sieve shaker', work: 'Mechanical components, housings, shafts, vibration and stress analysis' },
  { title: 'Sample Preparation', examples: 'Hydraulic press, pellet press, sample-cutting fixture', work: 'Pressing mechanisms, stress analysis and structural optimisation' },
  { title: 'Slurry & Suspension Preparation', examples: 'Laboratory mixer, overhead stirrer, slurry mixing vessel', work: 'Impellers, vessels, shafts and mixing systems; CFD of flow and mixing' },
  { title: 'Thermal Processing', examples: 'Laboratory furnace, tube furnace, heating chamber', work: 'Heat transfer, temperature distribution, insulation, gas-flow CFD and structural analysis' },
  { title: 'Material Coating & Processing', examples: 'Dip-coating system, spin-coating fixture, drying oven', work: 'Mechanisms, component modeling, thermal analysis and drying-airflow CFD' },
  { title: 'Crystal Growth & Melt Processing', examples: 'Czochralski puller, Bridgman furnace, induction-heated crucible assembly', work: 'Hot-zone design, thermal gradient and melt-flow CFD, susceptor/crucible thermal stress, pull-mechanism modeling' },
  { title: 'Electrochemical & Photoelectrochemical Cells', examples: 'Electrochemical cells, PEC reactors, electrodeposition baths, flow cells', work: 'Cell and fixture design, electrolyte flow CFD, light-window and sealing design, thermal management' },
];

export const STEPS = [
  { title: 'Define the problem and requirements', body: 'Agree the question the work must answer, the acceptance criteria, and what is in and out of scope.' },
  { title: 'Establish geometry, materials, loads and BCs', body: 'Collect drawings and data; document every assumption where data is missing.' },
  { title: 'Develop the CAD model', body: 'Build clean, structured geometry — simplified for simulation where appropriate, with simplifications recorded.' },
  { title: 'Simulate and review convergence', body: 'Run analyses, check mesh sensitivity and solver convergence where applicable, and sanity-check against hand calculations.' },
  { title: 'Interpret results and implications', body: 'Translate fields and numbers into design implications, with limitations stated alongside.' },
  { title: 'Deliver drawings and documentation', body: 'Hand over models, drawings and a report your team can review, reuse and build on.' },
];
