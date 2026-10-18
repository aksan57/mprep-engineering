import Link from 'next/link';
import Calculator from '@/components/Calculator';
import PageHead from '@/components/PageHead';
import { CALC_GROUPS } from '@/data/calculators';
import { pageMeta } from '@/lib/meta';

export const metadata = pageMeta('/calculators/', { title: 'Quick engineering calculators' });

export default function CalculatorsPage() {
  return (
    <section className="section">
      <div className="container">
        <PageHead title="Quick engineering calculators">
          First-order engineering estimates using standard textbook formulas. Useful for preliminary sizing, design comparisons, and early-stage engineering decisions. These calculators do not replace detailed engineering analysis, simulation, or applicable design codes.
        </PageHead>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(40px,5vw,64px)' }}>
          {CALC_GROUPS.map(g => (
            <div key={g.tag} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <h2 className="eyebrow" style={{ flex: 'none', letterSpacing: '.12em', fontWeight: 400 }}>{g.tag}</h2>
                <span aria-hidden="true" style={{ flex: 1, height: 1, background: 'var(--l12)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,380px),1fr))', gap: 20 }}>
                {g.items.map(c => <Calculator key={c.id} id={c.id} />)}
              </div>
            </div>
          ))}
        </div>

        <div className="tint-panel" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(20px,2.4vw,28px)' }}>
          <h2 className="label label--accent" style={{ fontSize: 11 }}>ENGINEERING NOTE</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--t3)', maxWidth: 820, textWrap: 'pretty' }}>All results are preliminary estimates based on the specified equations and assumptions. Confirm units, material properties, boundary conditions, and applicable engineering standards before using any result for equipment design or fabrication.</p>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--t3)', maxWidth: 820, textWrap: 'pretty' }}>For complex geometries, high-temperature equipment, pressure-containing components, or coupled thermal and structural loading, detailed CAD, FEA, thermal simulation, or CFD may be required.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '20px 24px', border: '1px dashed var(--l25)', borderRadius: 6 }}>
          <span style={{ fontSize: 15 }}>Need more than a first-order estimate?</span>
          <Link href="/contact/" className="btn btn--primary btn--sm">Request a Quote</Link>
        </div>
      </div>
    </section>
  );
}
