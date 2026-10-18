import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { SERVICES } from '@/data/services';
import { pageMeta } from '@/lib/meta';
import s from '../pages.module.css';

export const metadata = pageMeta('/services/');

export default function ServicesPage() {
  return (
    <section className="section">
      <div className="container">
        <PageHead title="From geometry to a decision.">
          Each service can be engaged on its own or combined into one workflow. Every deliverable states the inputs and assumptions it depends on.
        </PageHead>
        <div className="hairline" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))' }}>
          {SERVICES.map(sv => (
            <article key={sv.tag} className={s.serviceCard}>
              <span className="label" style={{ letterSpacing: '.1em' }}>{sv.tag}</span>
              <h2 className={s.serviceTitle}>{sv.title}</h2>
              <p className={s.body14}>{sv.summary}</p>
              <div className={s.ruledBlock}>
                <span className="label">DELIVERABLES</span>
                <ul className="bullets bullets--tight">{sv.deliverables.map(d => <li key={d}>{d}</li>)}</ul>
              </div>
              <div className={s.block}>
                <span className="label">APPLICATIONS</span>
                <p className={s.text14}>{sv.applications}</p>
              </div>
              <div className={s.valueBox}>
                <span className="label label--accent">DECISION VALUE</span>
                <p className={s.text14}>{sv.value}</p>
              </div>
            </article>
          ))}
          <div className={s.serviceCta}>
            <p className={s.serviceCtaText}>Not sure which service fits? Describe the problem — scope can be defined together.</p>
            <Link href="/contact/" className="btn btn--primary btn--sm" style={{ alignSelf: 'flex-start', fontWeight: 500 }}>Request a Quote</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
