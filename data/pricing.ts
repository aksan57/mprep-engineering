export type Plan = {
  tag: string; title: string; from: string; price: string; unit: string;
  note?: string; badge?: string; best: string; items: string[]; foot?: string; cta: string; featured?: boolean;
};

// All prices in USD. Do not add tiers, discounts or currencies.
export const PLANS: Plan[] = [
  { tag: 'FIXED SCOPE · MOST COMMON', title: 'Design project', from: 'From', price: '$450', unit: 'per project', featured: true,
    best: 'For developing new equipment concepts or improving existing designs through 3D CAD modeling and engineering documentation.',
    items: ['3D CAD models and assemblies', 'Manufacturing and technical drawings', 'Equipment and component design', 'Design basis and technical documentation', 'Agreed revision rounds'],
    cta: 'Request a Quote' },
  { tag: 'ENGINEERING ANALYSIS', title: 'FEA / CFD / thermal study', from: 'From', price: '$500', unit: 'per study',
    note: 'Thermal studies from $700 · CFD studies from $800',
    best: 'For evaluating structural integrity, fluid flow, and thermal performance under defined operating conditions.',
    items: ['Structural FEA and stress analysis', 'CFD simulations for fluid flow and pressure distribution', 'Thermal analysis and heat-transfer studies', 'Model setup, mesh refinement, and convergence checks', 'Results for agreed load cases and operating conditions', 'Technical report covering assumptions, methodology, and results', 'Engineering recommendations for design improvement'],
    cta: 'Request a Quote' },
  { tag: 'FLEXIBLE · ON DEMAND', title: 'Hourly engineering support', from: '', price: '$40', unit: 'per hour',
    best: 'For ongoing technical assistance, design reviews, engineering calculations, or projects with evolving requirements.',
    items: ['CAD and engineering design support', 'FEA, CFD, and thermal analysis assistance', 'Design reviews and technical calculations', 'Engineering documentation and revisions', 'Flexible scheduling based on availability'],
    cta: 'Request a Quote' },
  { tag: 'ONGOING COLLABORATION', title: 'Monthly engineering retainer', from: 'From', price: '$650', unit: 'per month', badge: 'Effective rate ~$32/hour',
    best: 'For businesses that need recurring engineering support without committing to a full-time engineering hire.',
    items: ['Up to 20 hours of engineering support per month', 'Priority scheduling', 'Design reviews and engineering calculations', 'CAD model and documentation updates', 'Ongoing technical consultation', 'Monthly timesheet and work summary'],
    foot: 'Additional hours and work beyond the agreed scope are quoted separately.',
    cta: 'Discuss Your Requirements' },
];

export const TRUST_POINTS = [
  { t: 'Clear scope and fixed quotes before work starts', icon: 'M9 12l2 2 4-4M4 4h16v16H4z' },
  { t: 'Async-friendly collaboration · UTC+7, replies within 24 hours', icon: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
  { t: 'Research-grade methodology and documented assumptions', icon: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5' },
  { t: 'Secure file handling · NDA available on request', icon: 'M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11' },
];

export const QUOTE_FACTORS = [
  { k: 'Design complexity', v: 'Geometry, component count, assemblies, and manufacturing requirements.' },
  { k: 'Analysis requirements', v: 'Number of load cases, operating conditions, design variants, and simulation scenarios.' },
  { k: 'Physics involved', v: 'Structural behavior, fluid flow, turbulence, heat transfer, or coupled multiphysics.' },
  { k: 'Input data', v: 'Availability of existing CAD files, technical drawings, material properties, and operating conditions.' },
  { k: 'Documentation', v: 'Required calculations, technical reports, manufacturing drawings, and supporting documentation.' },
  { k: 'Project timeline', v: 'Standard delivery schedules versus urgent turnaround requirements.' },
];

export const QUOTE_STEPS = [
  { t: 'Share your project', b: 'Send your drawings, CAD files, technical brief, or a description of the engineering problem.' },
  { t: 'Define the scope', b: 'We review the requirements, available data, deliverables, and expected timeline.' },
  { t: 'Receive a proposal', b: 'You receive a project-specific quotation with the agreed scope, deliverables, and schedule.' },
  { t: 'Engineering and delivery', b: 'Work proceeds according to the approved proposal, with agreed revisions and technical documentation.' },
];
