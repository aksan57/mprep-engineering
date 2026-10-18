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

/**
 * Optional Google Apps Script web-app URL (…/exec) that logs every inquiry as a row in a Google Sheet.
 * Empty = disabled. Setup: scripts/google-sheets-inquiries.gs.
 */
export const SHEET_ENDPOINT = process.env.NEXT_PUBLIC_SHEET_ENDPOINT || '';

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

// ── Budget ──────────────────────────────────────────────────────────────────────────────────────────

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'SGD', 'AUD', 'IDR'] as const;
export type Currency = (typeof CURRENCIES)[number];

/**
 * Rounded local thresholds [a, b, c] for the four budget tiers: under a · a–b · b–c · over c.
 * Tiers line up across currencies, so switching currency keeps the same tier selected.
 */
export const BUDGET_THRESHOLDS: Record<Currency, [number, number, number]> = {
  USD: [1_000, 5_000, 20_000],
  EUR: [1_000, 5_000, 20_000],
  GBP: [750, 4_000, 15_000],
  SGD: [1_500, 7_000, 27_000],
  AUD: [1_500, 8_000, 30_000],
  IDR: [15_000_000, 80_000_000, 300_000_000],
};

/** '' = no range chosen, '0'–'3' = tier index, 'unsure' = "Not sure yet". */
export type BudgetTier = '' | '0' | '1' | '2' | '3' | 'unsure';
export const BUDGET_UNSURE = 'Not sure yet';

const group = (n: number) => n.toLocaleString('en-US');

/** Range options for a currency, e.g. "IDR 15,000,000–80,000,000". Values are tier indices. */
export function budgetRanges(currency: Currency): { value: Exclude<BudgetTier, '' | 'unsure'>; label: string }[] {
  const [a, b, c] = BUDGET_THRESHOLDS[currency];
  return [
    { value: '0', label: `Under ${currency} ${group(a)}` },
    { value: '1', label: `${currency} ${group(a)}–${group(b)}` },
    { value: '2', label: `${currency} ${group(b)}–${group(c)}` },
    { value: '3', label: `Over ${currency} ${group(c)}` },
  ];
}

export const budgetRangeLabel = (currency: Currency, tier: BudgetTier) =>
  tier === 'unsure' ? BUDGET_UNSURE : budgetRanges(currency).find(r => r.value === tier)?.label ?? '';

/** Keeps only digits and drops leading zeros (paste "IDR 50.000.000" → "50000000"). Capped at 15 digits. */
export const parseAmount = (text: string) => text.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 15);

/** Digits → en-US thousands separators ("15000000" → "15,000,000"). */
export const formatAmount = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** Caret index in `formatted` that sits just after its `digitsBefore`-th digit. */
export function caretAfterDigits(formatted: string, digitsBefore: number) {
  if (digitsBefore <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i]) && ++seen === digitsBefore) return i + 1;
  }
  return formatted.length;
}

/**
 * The single "Budget" value sent with the inquiry (email table and Google Sheet column):
 * range → "IDR 15,000,000–80,000,000"; amount → "IDR 50,000,000";
 * both → "IDR 15,000,000–80,000,000 (exact: IDR 50,000,000)"; nothing → "—".
 */
export function budgetField(currency: Currency, tier: BudgetTier, amountDigits: string) {
  const range = budgetRangeLabel(currency, tier);
  const digits = parseAmount(amountDigits);
  const exact = digits ? `${currency} ${formatAmount(digits)}` : '';
  if (range && exact) return `${range} (exact: ${exact})`;
  return range || exact || '—';
}

// ── Form ────────────────────────────────────────────────────────────────────────────────────────────

export type FormFields = {
  name: string; company: string; email: string; services: string[]; description: string; reference: string; timeline: string;
  currency: Currency; budgetTier: BudgetTier; budgetAmount: string;
};
export const EMPTY_FORM: FormFields = {
  name: '', company: '', email: '', services: [], description: '', reference: '', timeline: '',
  currency: 'USD', budgetTier: '', budgetAmount: '',
};

/** Errors in field order (the first key is the field that gets focus). */
export function validate(f: FormFields): Partial<Record<keyof FormFields, string>> {
  const e: Partial<Record<keyof FormFields, string>> = {};
  if (!f.name.trim()) e.name = 'Please enter your name.';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Please enter a valid email address.';
  if (!f.services.length) e.services = 'Please select at least one service.';
  if (f.description.trim().length < 20) e.description = 'Please describe the project (at least 20 characters).';
  return e;
}

/** Selected services in SERVICE_OPTIONS order, regardless of the order they were ticked. */
export const orderedServices = (services: string[]) => SERVICE_OPTIONS.filter(o => services.includes(o));

/** Value of the "Service" field in the email and the Google Sheet: the selections joined with ", ". */
export const serviceField = (services: string[]) => orderedServices(services).join(', ');

/** Email subject: "… — <service> — <name>", or "… — <first> +N more — <name>" for several services. */
export function inquirySubject(services: string[], name: string) {
  const [first, ...rest] = orderedServices(services);
  return `New project inquiry — ${first}${rest.length ? ` +${rest.length} more` : ''} — ${name.trim()}`;
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
