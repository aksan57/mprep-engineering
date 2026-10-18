import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { PLANS, QUOTE_FACTORS, QUOTE_STEPS, TRUST_POINTS } from '@/data/pricing';
import { pageMeta } from '@/lib/meta';
import s from '../pages.module.css';

export const metadata = pageMeta('/pricing/');

export default function PricingPage() {
  return (
    <section className="section">
      <div className="container" style={{ gap: 'clamp(40px,5vw,64px)' }}>
        <PageHead title="Engagement models" wide>
          Every project is quoted after scoping. The prices below are starting points for common engineering services. Final costs depend on project complexity, available input data, and the level of technical documentation required. All prices are in USD.
        </PageHead>

        <div className={s.plans}>
          {PLANS.map(pl => (
            <article key={pl.title} className={`${s.plan}${pl.featured ? ' ' + s.planFeatured : ''}`}>
              <span className={s.planTag}>{pl.tag}</span>
              <h2 className={s.planTitle}>{pl.title}</h2>
              <div className={s.priceBox}>
                <div className={s.priceRow}>
                  {pl.from && <span className={s.priceMuted}>{pl.from}</span>}
                  <span className={s.price}>{pl.price}</span>
                  <span className={s.priceMuted}>{pl.unit}</span>
                </div>
                {pl.note && <span className={s.priceNote}>{pl.note}</span>}
                {pl.badge && <span className={s.priceBadge}>{pl.badge}</span>}
              </div>
              <p className={s.body14}>{pl.best}</p>
              <ul className="bullets">{pl.items.map(it => <li key={it}>{it}</li>)}</ul>
              {pl.foot && <p className={s.planFoot}>{pl.foot}</p>}
              <Link href="/contact/" className={`btn btn--primary btn--sm btn--block ${s.planCta}`}>{pl.cta}</Link>
            </article>
          ))}
        </div>

        <div className={s.trustWrap}>
          <ul className={s.trust}>
            {TRUST_POINTS.map(tp => (
              <li key={tp.t}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00A6A6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={tp.icon} /></svg>
                <span>{tp.t}</span>
              </li>
            ))}
          </ul>
          <p className={s.trustMore}>Have a project that doesn&apos;t fit these packages? <Link href="/contact/">Tell us about it →</Link></p>
        </div>

        <div className={s.factorsBox}>
          <div className={s.block} style={{ gap: 10 }}>
            <h2 className={s.h3_20}>What affects your quote?</h2>
            <p className={s.body14}>Each project is evaluated individually to provide a realistic scope, timeline, and price.</p>
          </div>
          <ul className={s.factors}>
            {QUOTE_FACTORS.map(q => <li key={q.k}><span>{q.k}</span><span>{q.v}</span></li>)}
          </ul>
        </div>

        <div className={s.block} style={{ gap: 24 }}>
          <h2 className={s.h3_20}>How it works</h2>
          <ol className={s.howSteps}>
            {QUOTE_STEPS.map(qs => <li key={qs.t}><span className={s.howTitle}>{qs.t}</span><span className={s.howBody}>{qs.b}</span></li>)}
          </ol>
        </div>

        <div className={s.navyBanner}>
          <div className={s.block} style={{ gap: 10, maxWidth: 640 }}>
            <h2 className={s.navyBannerTitle}>Have an engineering challenge?</h2>
            <p className={s.navyBannerBody}>Whether you need a new equipment design, a structural assessment, a CFD simulation, or a thermal study, let’s define the right engineering approach for your project.</p>
          </div>
          <Link href="/contact/" className="btn btn--primary">Request a Quote</Link>
        </div>
      </div>
    </section>
  );
}
