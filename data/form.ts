import { CONTACT } from './site.ts';

/**
 * Where the quote form posts. Defaults to FormSubmit's standard (non-AJAX) endpoint, which emails the
 * inquiry with its attachments to the site owner. The AJAX endpoint (/ajax/…) silently drops attachments,
 * so the form is submitted as a normal multipart POST that navigates to FormSubmit and back to `_next`.
 * FormSubmit sends a one-time activation email on the first submission — the owner must click it before
 * inquiries are delivered.
 * NEXT_PUBLIC_FORM_ENDPOINT can point elsewhere, but it must accept a normal multipart/form-data POST
 * (with the same field names) and redirect the browser to the `_next` URL.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || `https://formsubmit.co/${CONTACT.email}`;

export const SERVICE_OPTIONS = [
  'CAD Design & 3D Modeling', 'Finite Element Analysis (FEA)', 'Thermal Simulation', 'Computational Fluid Dynamics (CFD)',
  'Chemical & Process Equipment Design', 'Technical Drawings & Engineering Documentation', 'Engineering Calculations & Preliminary Sizing', 'Other / Not Sure',
];
export const TIMELINE_OPTIONS = ['As soon as possible', 'Within 2–4 weeks', 'Within 1–3 months', 'Flexible / To be discussed'];

export const FILE_ACCEPT = '.pdf,.step,.stp,.iges,.igs,.stl,.dwg,.dxf,.f3d,.zip,.jpg,.jpeg,.png';
export const FILE_OK = /\.(pdf|step|stp|iges|igs|stl|dwg|dxf|f3d|zip|jpe?g|png)$/i;
export const MAX_FILES = 5;
/** FormSubmit accepts at most 10 MB of attachments per submission, in total. */
export const MAX_TOTAL_BYTES = 10 * 1024 * 1024;
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

type FileLike = { name: string; size: number };

/**
 * Adds files with a type check, de-duplication (name + size), the 5-file cap and the
 * 10 MB total-size limit. Files that would push the total over the limit are rejected.
 */
export function addFiles<F extends FileLike>(current: F[], incoming: F[]): { files: F[]; error: string } {
  const files = [...current], bad: string[] = [];
  let total = current.reduce((n, f) => n + f.size, 0), tooBig = false, tooMany = false;
  for (const f of incoming) {
    if (!FILE_OK.test(f.name)) { bad.push(f.name + ' (type)'); continue; }
    if (files.some(c => c.name === f.name && c.size === f.size)) continue;
    if (files.length >= MAX_FILES) { tooMany = true; continue; }
    if (total + f.size > MAX_TOTAL_BYTES) { bad.push(f.name + ' (over 10 MB in total)'); tooBig = true; continue; }
    files.push(f); total += f.size;
  }
  const parts: string[] = [];
  if (bad.length) parts.push('Not added: ' + bad.join(', ') + '.');
  if (tooMany) parts.push(`Maximum ${MAX_FILES} files.`);
  if (tooBig) parts.push('For larger files, paste a shareable link below.');
  return { files, error: parts.join(' ') };
}

export const fileSize = (n: number) => (n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB');
