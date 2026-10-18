import Link from 'next/link';

/** Shared "Need equipment designed around your process?" band (projects list + case study). */
export default function CtaBand() {
  return (
    <div className="band">
      <h2 className="band__title">Need equipment designed around your process?</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
        <Link href="/contact/" className="btn btn--primary">Discuss your project</Link>
        <span className="tagline">Design. Analyse. Document. Improve.</span>
      </div>
    </div>
  );
}
