import Link from 'next/link';
import Img from '@/components/Img';
import ModelHint from '@/components/ModelHint';
import ModelViewer from '@/components/ModelViewer';
import { CZ, MODEL } from '@/data/czr4';
import { EQUIPMENT, SERVICES } from '@/data/services';
import s from './home.module.css';

export default function HomePage() {
  return (
    <>
      <section className={`section--navy ${s.hero}`}>
        <div className={s.heroGrid}>
          <div className={s.heroText}>
            <h1 className="h1">Material Preparation Equipment, Engineered.</h1>
            <p className={s.heroLead}>
              We design material preparation equipment and material processing systems through precision CAD modeling, structural analysis, thermal and CFD simulation.
            </p>
            <div className={s.heroCtas}>
              <Link href="/projects/" className="btn btn--primary">Explore Projects</Link>
              <Link href="/contact/" className="btn btn--outline-dark">Discuss a Project</Link>
            </div>
          </div>
          <figure className={s.heroFigure}>
            <div className={s.heroFrame}>
              <ModelViewer src={MODEL.src} alt={MODEL.alt} sizeLabel={MODEL.sizeLabel} poster="/assets/home/hero-cz-r4.webp" posterFit="cover" posterPriority fill />
            </div>
            <figcaption className={s.heroCaption}><span>CZ-R4 crystal-growth furnace</span><span>Concept study</span></figcaption>
            <ModelHint className={s.heroCaption} mouse="Drag to rotate · scroll to zoom" />
          </figure>
        </div>
        <ul className={s.strip}>
          {SERVICES.map(sv => (
            <li key={sv.tag}><Link href="/services/" className={s.stripLink}>{sv.short}</Link></li>
          ))}
        </ul>
      </section>

      <section className="section section--rule" aria-labelledby="focus-title" style={{ paddingBlock: 'clamp(56px,7vw,96px)' }}>
        <div className="container" style={{ gap: 'clamp(32px,4vw,48px)' }}>
          <div className="head" style={{ gap: '20px 56px' }}>
            <div className="head__stack">
              <span className="eyebrow">Equipment focus</span>
              <h2 id="focus-title" className={s.h2Small}>Seven categories of material preparation equipment.</h2>
            </div>
            <p className="lead">Engineering informed by how the equipment is actually used in the lab — from component geometry and stress checks to fabrication-ready drawings.</p>
          </div>
          <div className="hairline" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))' }}>
            {EQUIPMENT.map(eq => (
              <article key={eq.title} className={s.eqCard}>
                <h3 className={s.eqTitle}>{eq.title}</h3>
                <div className={s.eqBlock}>
                  <span className="label" style={{ fontSize: 10 }}>EQUIPMENT</span>
                  <p className={s.eqExamples}>{eq.examples}</p>
                </div>
                <div className={`${s.eqBlock} ${s.eqWork}`}>
                  <span className="label" style={{ fontSize: 10 }}>CAD / FEA / CFD WORK</span>
                  <p className={s.eqWorkText}>{eq.work}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule" aria-label="Selected project" style={{ paddingBlock: 'clamp(48px,6vw,80px)' }}>
        <div className={s.teaser}>
          <div className={s.teaserText}>
            <span className="eyebrow">Selected project</span>
            <h2 className={s.teaserTitle}>{CZ.title}</h2>
            <p className="lead">{CZ.teaser}</p>
            <Link href="/projects/cz-r4/" className="text-link">Read the case study <span aria-hidden="true">→</span></Link>
          </div>
          <div className={s.teaserMedia}>
            <Link href="/projects/cz-r4/" aria-label="Open the CZ-R4 case study" className={s.teaserThumb}>
              <Img src="/assets/cz-r4/00-buckling-mode1.webp" alt="CZ-R4 linear buckling mode 1 under full vacuum." />
            </Link>
            <div className="hairline" style={{ gridTemplateColumns: 'repeat(3,minmax(0,1fr))' }}>
              {[['SCOPE', 'CAD · Thermal · FEA'], ['TYPE', 'Concept & analysis'], ['STATUS', 'Not built / validated']].map(([k, v]) => (
                <div key={k} className={s.teaserCell}><span className="label" style={{ fontSize: 11, letterSpacing: 0 }}>{k}</span><span className={s.teaserCellValue}>{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
