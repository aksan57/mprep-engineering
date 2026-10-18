import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ gap: 20, alignItems: 'flex-start' }}>
        <span className="eyebrow">404</span>
        <h1 className="h2">This page doesn&apos;t exist.</h1>
        <p className="lead">The link may be out of date. Try the projects or get in touch directly.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/projects/" className="btn btn--primary">Explore Projects</Link>
          <Link href="/" className="text-link">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
