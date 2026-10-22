// Software names appear as text only — no vendor logos.
export const TOOL_GROUPS = [
  { tag: 'CAD', title: '3D modeling & assemblies', items: [{ n: 'Autodesk Fusion', l: 'Working knowledge' }, { n: 'AutoCAD', l: 'Working knowledge' }, { n: 'FreeCAD', l: 'Working knowledge' }],
    use: 'Part and assembly modeling, parametric design, equipment layout, and simulation-ready geometry for engineering applications.' },
  { tag: 'FEA', title: 'Structural analysis', items: [{ n: 'Autodesk Fusion Simulation', l: 'Working knowledge' }, { n: 'PrePoMax / CalculiX', l: 'Working knowledge' }],
    use: 'Structural analysis workflows for evaluating stress, deformation, and stability under defined loading conditions. Analysis assumptions and boundary conditions are documented in project reports.' },
  { tag: 'THERMAL', title: 'Thermal simulation', items: [{ n: 'Autodesk Fusion Simulation', l: 'Working knowledge' }],
    use: 'Thermal studies for furnaces and heated equipment, including temperature distribution, heat-transfer assumptions, and evaluation of thermal performance.' },
  { tag: 'CFD', title: 'Fluid flow simulation', items: [{ n: 'OpenFOAM', l: 'Working knowledge' }, { n: 'SimFlow', l: 'Working knowledge' }],
    use: 'Fluid-flow and convective heat-transfer simulation for mixing, gas flow and cooling problems. CFD is a newer service line: published CFD case studies will be added as projects are completed.' },
  { tag: 'DRAWINGS', title: 'Technical drawings', items: [{ n: 'AutoCAD', l: 'Working knowledge' }],
    use: '2D engineering drawings, equipment layouts, dimensioning, and drawing preparation to support fabrication and design communication.' },
  { tag: 'CALC', title: 'Engineering calculations', items: [{ n: 'Microsoft Excel', l: 'Working knowledge' }],
    use: 'Engineering calculations, parameter studies, design comparisons, and supporting calculation sheets for equipment design and simulation projects.' },
  { tag: 'DOCS', title: 'Reporting & documentation', items: [{ n: 'Microsoft Word / PowerPoint', l: 'Working knowledge' }],
    use: 'Technical reports, design basis documents, simulation summaries, engineering calculations, and project presentations.' },
];

export const FORMATS = [
  { k: 'Native formats', v: ['F3D', 'DWG'] },
  { k: '3D exchange', v: ['STEP', 'GLB'] },
  { k: 'Drawings & reports', v: ['DXF', 'PDF'] },
];
