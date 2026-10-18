import Link from 'next/link';
import { CONTACT } from '@/data/site';

// FormSubmit redirects here (`_next`) after delivering an inquiry. Not in the sitemap.
export const metadata = { title: 'Inquiry sent', robots: { index: false, follow: false } };

export default function ThanksPage() {
  return (
    <section className="section">
      <div className="container" style={{ gap: 20, alignItems: 'flex-start' }}>
        <span className="eyebrow">Inquiry sent</span>
        <h1 className="h2">Thank you for your inquiry.</h1>
        <p className="lead">
          We will review your project and reply by email. If you need to add anything, write to{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/projects/" className="btn btn--primary">Explore Projects</Link>
          <Link href="/" className="text-link">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
