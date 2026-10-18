'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  addFiles, EMPTY_FORM, FILE_ACCEPT, fileSize, FORM_ENDPOINT, SERVICE_OPTIONS, TIMELINE_OPTIONS, validate, type FormFields,
} from '@/data/form';
import { CONTACT } from '@/data/site';
import s from './QuoteForm.module.css';

type Key = keyof FormFields;

/** Readable field names as they appear in the inquiry email. */
function readableFields(form: FormFields): [string, string][] {
  return [
    ['Name', form.name.trim()],
    ['Company', form.company.trim() || '—'],
    ['Email', form.email.trim()],
    ['Service', form.service],
    ['Timeline', form.timeline || '—'],
    ['Budget', form.budget.trim() || '—'],
    ['Reference link', form.reference.trim() || '—'],
    ['Project description', form.description.trim()],
  ];
}

export default function QuoteForm() {
  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [dragOn, setDragOn] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const postRef = useRef<HTMLFormElement | null>(null);

  // Coming back with the Back button restores this page from the bfcache with "Sending…" still set.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      setSending(false);
      postRef.current?.remove(); postRef.current = null;
    };
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  const set = (k: Key) => (e: { target: { value: string } }) => {
    const v = e.target.value;
    setForm(f => ({ ...f, [k]: v }));
    setErrors(er => ({ ...er, [k]: '' }));
    setSendError('');
  };
  const take = (list: File[]) => { const r = addFiles(files, list); setFiles(r.files); setFileError(r.error); setDragOn(false); };
  const err = (k: Key) => errors[k] ? { 'aria-invalid': true, 'aria-describedby': `qf-${k}-err` } : {};

  /**
   * Submits through a hidden native <form> (multipart POST) rather than fetch(): FormSubmit's AJAX
   * endpoint drops attachments, and file inputs can only carry files in a real form submission.
   * FormSubmit redirects back to /contact/thanks/ once the email is sent.
   */
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const found = validate(form);
    setErrors(found); setSendError('');
    const first = Object.keys(found)[0];
    if (first) { formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }

    // Honeypot: bots fill every field; people never see this one.
    const honey = (formRef.current?.elements.namedItem('_honey') as HTMLInputElement | null)?.value ?? '';

    const post = document.createElement('form');
    post.action = FORM_ENDPOINT; post.method = 'POST'; post.enctype = 'multipart/form-data';
    post.hidden = true; post.setAttribute('aria-hidden', 'true');
    const add = (name: string, value: string) => {
      const i = document.createElement('input');
      i.type = 'hidden'; i.name = name; i.value = value; post.appendChild(i);
    };
    add('_subject', `New project inquiry — ${form.service} — ${form.name.trim()}`);
    add('_template', 'table'); add('_captcha', 'false'); add('_replyto', form.email.trim());
    add('_honey', honey);
    add('_next', `${window.location.origin}/contact/thanks/`);
    readableFields(form).forEach(([k, v]) => add(k, v));

    try {
      files.forEach((f, i) => {
        const dt = new DataTransfer();
        dt.items.add(f);
        const input = document.createElement('input');
        input.type = 'file'; input.name = `attachment${i + 1}`; input.files = dt.files;
        post.appendChild(input);
      });
    } catch {
      setSendError(`This browser can't attach files to the inquiry. Remove the files and paste a shareable link instead, or email ${CONTACT.email} directly.`);
      return;
    }

    setSending(true);
    postRef.current?.remove();
    postRef.current = post;
    document.body.appendChild(post);
    post.submit();
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-label="Project inquiry" className={s.form}>
      <span className={s.kicker}>PROJECT DETAILS</span>

      <div className={s.field}>
        <label htmlFor="qf-name">Full name *</label>
        <input id="qf-name" name="name" autoComplete="name" placeholder="Enter your name" value={form.name} onChange={set('name')} {...err('name')} />
        {errors.name && <span id="qf-name-err" role="alert" className={s.err}>{errors.name}</span>}
      </div>
      <div className={s.field}>
        <label htmlFor="qf-company">Company / Organization</label>
        <input id="qf-company" name="company" autoComplete="organization" placeholder="If applicable" value={form.company} onChange={set('company')} />
      </div>
      <div className={s.field}>
        <label htmlFor="qf-email">Work email *</label>
        <input id="qf-email" name="email" type="email" autoComplete="email" placeholder="Where we can contact you" value={form.email} onChange={set('email')} {...err('email')} />
        {errors.email && <span id="qf-email-err" role="alert" className={s.err}>{errors.email}</span>}
      </div>
      <div className={s.field}>
        <label htmlFor="qf-service">Required service *</label>
        <select id="qf-service" name="service" value={form.service} onChange={set('service')} {...err('service')}>
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.service && <span id="qf-service-err" role="alert" className={s.err}>{errors.service}</span>}
      </div>

      <div className={`${s.field} ${s.full}`}>
        <label htmlFor="qf-description">Project description *</label>
        <span id="qf-description-help" className={s.help}>Describe the equipment, process, or engineering problem you need help with. Include relevant operating conditions, dimensions, materials, performance requirements, and expected deliverables where available.</span>
        <textarea
          id="qf-description" name="description" rows={6} value={form.description} onChange={set('description')}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={['qf-description-help', errors.description && 'qf-description-err'].filter(Boolean).join(' ')}
        />
        {errors.description && <span id="qf-description-err" role="alert" className={s.err}>{errors.description}</span>}
      </div>

      <div className={`${s.full} ${s.files}`}>
        <div className={s.field}>
          <span id="qf-files-label">Drawings &amp; reference files</span>
          <span className={s.help}>Optional. Upload files, or provide a shareable link to existing CAD files, technical drawings, specifications, or other project references. Ensure linked files are accessible.</span>
        </div>
        <label
          className={s.drop} data-drag={dragOn || undefined}
          onDragOver={e => { e.preventDefault(); if (!dragOn) setDragOn(true); }}
          onDragLeave={() => setDragOn(false)}
          onDrop={e => { e.preventDefault(); take([...(e.dataTransfer?.files ?? [])]); }}
        >
          <input
            type="file" multiple accept={FILE_ACCEPT} className={s.fileInput} aria-labelledby="qf-files-label"
            onChange={e => { const l = [...(e.target.files ?? [])]; e.target.value = ''; take(l); }}
          />
          <span className={s.dropTitle}>Drop files here or <span className={s.browse}>browse</span></span>
          <span className={s.dropHint}>PDF · STEP · IGES · STL · DWG · DXF · F3D · ZIP · JPG · PNG · up to 5 files, 10 MB in total</span>
        </label>
        {fileError && <span role="alert" className={s.err}>{fileError}</span>}
        {files.length > 0 && (
          <ul className={s.fileList} aria-label="Attached files">
            {files.map((f, i) => (
              <li key={f.name + f.size}>
                <span className={s.fileName}>{f.name}</span>
                <span className={s.fileSize}>{fileSize(f.size)}</span>
                <button type="button" aria-label={`Remove ${f.name}`} className={s.remove} onClick={() => { setFiles(fs => fs.filter((_, j) => j !== i)); setFileError(''); }}>×</button>
              </li>
            ))}
          </ul>
        )}
        <input name="reference" value={form.reference} onChange={set('reference')} placeholder="Or paste a shareable link (Google Drive, Dropbox, OneDrive…)" aria-label="Shareable link to reference files" className={s.input} />
      </div>

      <div className={s.field}>
        <label htmlFor="qf-timeline">Target timeline</label>
        <select id="qf-timeline" name="timeline" value={form.timeline} onChange={set('timeline')}>
          <option value="">Select your preferred timeframe</option>
          {TIMELINE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div className={s.field}>
        <label htmlFor="qf-budget">Estimated budget</label>
        <input id="qf-budget" name="budget" placeholder="Optional, e.g. USD 500–1,000" value={form.budget} onChange={set('budget')} aria-describedby="qf-budget-help" />
      </div>
      <p id="qf-budget-help" className={`${s.full} ${s.help}`} style={{ marginTop: -6 }}>An approximate budget helps us recommend an appropriate project scope.</p>

      <div className={s.honey} aria-hidden="true">
        <label>Leave this field empty<input name="_honey" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className={`${s.full} ${s.footer}`}>
        <p className={s.consent}>By submitting this form, you agree that the information provided may be used to review and respond to your project inquiry. Please do not include confidential or sensitive technical information unless appropriate confidentiality arrangements are in place.</p>
        <div className={s.submitRow}>
          <button type="submit" className={s.submit} disabled={sending}>{sending ? 'Sending…' : 'Submit inquiry'}</button>
          <span className={s.help}>* Required</span>
        </div>
      </div>

      {sendError && <div role="alert" className={`${s.full} ${s.fail}`}>{sendError}</div>}
    </form>
  );
}
