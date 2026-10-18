export const BRAND = 'MPrep Engineering';
export const SITE_TITLE = 'MPrep Engineering — Engineering Equipment for Material Preparation';
export const SITE_DESCRIPTION =
  'MPrep Engineering — CAD design, finite element analysis (FEA), CFD and thermal simulation for laboratory and material processing equipment: powder and sample preparation, slurry mixing, thermal processing and coating systems.';

/** Set NEXT_PUBLIC_SITE_URL to the production origin (no trailing slash) before building. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

/** Logo on navy, 1200×630 (public/og.png). */
export const OG_IMAGE = { url: '/og.png', width: 1200, height: 630, alt: SITE_TITLE };

export const CONTACT = {
  email: 'ilhamaksanmaulana579@gmail.com',
  linkedinCompany: 'https://www.linkedin.com/company/mprep-engineering/',
  linkedinFounder: 'https://www.linkedin.com/in/ilhamaksan/',
  founder: 'Ilham Aksan Maulana',
  location: 'Indonesia · Remote projects worldwide',
};

export type NavItem = { href: string; label: string; icon: string; description: string };

export const NAV: NavItem[] = [
  { href: '/', label: 'Home', icon: 'M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-5h4v5', description: SITE_DESCRIPTION },
  { href: '/services/', label: 'Services', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', description: 'CAD design, FEA, thermal simulation, CFD, process equipment design and technical documentation for material preparation equipment.' },
  { href: '/projects/', label: 'Projects', icon: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12L4 7.5M12 12v9', description: 'Equipment design studies from crystal growth and electrochemistry to EOR, nickel processing, biomass conversion and emulsion preparation.' },
  { href: '/process/', label: 'How I Work', icon: 'M4 5h6v5H4zM14 14h6v5h-6zM7 10v3a3 3 0 0 0 3 3h4', description: 'Six reviewable stages from requirements to delivered drawings and documentation.' },
  { href: '/pricing/', label: 'Pricing', icon: 'M3 12V4h8l10 10-8 8zM7.5 8h.01', description: 'Engagement models and starting prices in USD for design projects, FEA / CFD / thermal studies, hourly support and monthly retainers.' },
  { href: '/tools/', label: 'Tools', icon: 'M3 4h18v12H3zM8 20h8M12 16v4', description: 'Software and exchange formats used across CAD modeling, simulation and documentation.' },
  { href: '/calculators/', label: 'Calculators', icon: 'M5 3h14v18H5zM8 7h8M8 12h2M14 12h2M8 16h2M14 16h2', description: 'Quick first-order engineering calculators for heat transfer, structural stress, buckling, pipe flow and pump power.' },
  { href: '/about/', label: 'About', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6 8-6s8 2 8 6', description: 'Ilham Aksan Maulana — equipment design, thermal engineering and engineering simulation, with a research background in materials and electrochemistry.' },
  { href: '/blog/', label: 'Blog', icon: 'M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4', description: 'Engineering notes on equipment design, CAD modeling, structural analysis, heat transfer and CFD.' },
  { href: '/contact/', label: 'Contact', icon: 'M3 6h18v12H3zM3 7l9 6 9-6', description: 'Request a quote for equipment design or engineering analysis.' },
];

export const navFor = (href: string) => NAV.find(n => n.href === href)!;
