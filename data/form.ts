import { CONTACT } from './site';

/**
 * Where the quote form posts. Defaults to FormSubmit's AJAX endpoint, which emails the inquiry
 * (with attachments) to the site owner. FormSubmit sends a one-time activation email on the first
 * submission — the owner must click it before inquiries are delivered.
 * Override with NEXT_PUBLIC_FORM_ENDPOINT (e.g. a server-side handler) without code changes.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || `https://formsubmit.co/ajax/${CONTACT.email}`;

export const SERVICE_OPTIONS = [
  'CAD Design & 3D Modeling', 'Finite Element Analysis (FEA)', 'Thermal Simulation', 'Computational Fluid Dynamics (CFD)',
  'Chemical & Process Equipment Design', 'Technical Drawings & Engineering Documentation', 'Engineering Calculations & Preliminary Sizing', 'Other / Not Sure',
];
export const TIMELINE_OPTIONS = ['As soon as possible', 'Within 2–4 weeks', 'Within 1–3 months', 'Flexible / To be discussed'];

export const FILE_ACCEPT = '.pdf,.step,.stp,.iges,.igs,.stl,.dwg,.dxf,.f3d,.zip,.jpg,.jpeg,.png';
export const FILE_OK = /\.(pdf|step|stp|iges|igs|stl|dwg|dxf|f3d|zip|jpe?g|png)$/i;
export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FormFields = { name: string; company: string; email: string; service: string; description: string; reference: string; timeline: string; budget: string };
export const EMPTY_FORM: FormFields = { name: '', company: '', email: '', service: '', description: '', reference: '', timeline: '', budget: '' };

export function validate(f: FormFields): Partial<Record<keyof FormFields, string>> {
  const e: Partial<Record<keyof FormFields, string>> = {};
  if (!f.name.trim()) e.name = 'Please enter your name.';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Please enter a valid email address.';
  if (!f.service) e.service = 'Please select a service.';
  if (f.description.trim().length < 20) e.description = 'Please describe the project (at least 20 characters).';
  return e;
}

/** Adds files with type/size checks, de-duplication (name + size) and the 5-file cap. */
export function addFiles(current: File[], incoming: File[]): { files: File[]; error: string } {
  const add: File[] = [], bad: string[] = [];
  for (const f of incoming) {
    if (!FILE_OK.test(f.name)) bad.push(f.name + ' (type)');
    else if (f.size > MAX_FILE_BYTES) bad.push(f.name + ' (over 20 MB)');
    else if (!current.some(c => c.name === f.name && c.size === f.size) && !add.some(c => c.name === f.name && c.size === f.size)) add.push(f);
  }
  let files = [...current, ...add], error = bad.length ? 'Not added: ' + bad.join(', ') : '';
  if (files.length > MAX_FILES) { files = files.slice(0, MAX_FILES); error = (error ? error + '. ' : '') + `Maximum ${MAX_FILES} files.`; }
  return { files, error };
}

export const fileSize = (n: number) => (n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB');
