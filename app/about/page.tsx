import Img from '@/components/Img';
import { ABOUT_CAPS, ABOUT_FOCUS, ABOUT_RESEARCH } from '@/data/about';
import { pageMeta } from '@/lib/meta';
import s from '../pages.module.css';

export const metadata = pageMeta('/about/');

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container" style={{ gap: 'clamp(56px,7vw,96px)' }}>
        <div className={s.aboutTop}>
          <div className={s.portrait}>
            <Img src="/assets/about/portrait.webp" alt="Portrait of Ilham Aksan Maulana in a laboratory coat." fit="cover" priority />
          </div>
          <div className={s.aboutIntro}>
            <div className={s.block} style={{ gap: 12 }}>
              <h1 className={s.aboutName}>Ilham Aksan Maulana</h1>
              <p className={s.aboutRole}>Equipment Design · Thermal Engineering · Engineering Simulation</p>
            </div>
            <p className={s.p17}>I hold an M.Sc. in Chemistry from Universitas Indonesia, with research experience in advanced materials, electrochemistry, and material processing. I am developing an engineering practice focused on the conceptual design, 3D modeling, and simulation-based evaluation of equipment for material processing, laboratory operations, and industrial applications.</p>
            <p className={s.p16}>My multidisciplinary background combines an understanding of material properties and experimental processes with CAD modeling, engineering calculations, and thermal and structural analysis. This enables me to approach equipment design from both the material and engineering perspectives, considering the operating conditions, functional requirements, and physical constraints that influence equipment performance.</p>
            <p className={s.p16}>My focus is on translating process requirements into practical equipment concepts supported by clear engineering assumptions, technical documentation, and simulation-based evaluation.</p>
          </div>
        </div>

        <div className={s.block} style={{ gap: 24 }}>
          <h2 className={s.monoH2}>ENGINEERING DESIGN FOCUS</h2>
          <div className={s.focusGrid}>
            {ABOUT_FOCUS.map(f => (
              <div key={f.t} className={s.focusItem}><h3 className={s.focusTitle}>{f.t}</h3><p className={s.capV}>{f.d}</p></div>
            ))}
          </div>
        </div>

        <div className={s.block} style={{ gap: 24 }}>
          <h2 className={s.monoH2}>TECHNICAL CAPABILITIES</h2>
          <div className="hairline" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))' }}>
            {ABOUT_CAPS.map(c => <div key={c.k} className={s.capCell}><span className={s.capK}>{c.k}</span><span className={s.capV}>{c.v}</span></div>)}
          </div>
        </div>

        <div className={s.block} style={{ gap: 24 }}>
          <div className={s.block} style={{ gap: 12 }}>
            <h2 className={s.monoH2}>RESEARCH &amp; ENGINEERING BACKGROUND</h2>
            <p className={s.p16} style={{ maxWidth: 720 }}>My research experience provides a foundation for understanding the materials, processing conditions, and experimental requirements that influence equipment design.</p>
          </div>
          <div className={s.research}>
            {ABOUT_RESEARCH.map(r => (
              <article key={r.t} className={s.researchItem}>
                <div className={s.block}><span className={s.researchOrg}>{r.org}</span><h3 className={s.researchTitle}>{r.t}</h3></div>
                <div className={s.researchBody}>
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--t2)', textWrap: 'pretty' }}>{r.d}</p>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--t4)', textWrap: 'pretty' }}>
                    <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>Engineering relevance: </strong>{r.rel}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={`band ${s.approach}`} style={{ alignItems: 'start' }}>
          <div className={s.block} style={{ gap: 14 }}>
            <span className="tagline">DESIGN APPROACH</span>
            <p className="band__title" style={{ fontSize: 'clamp(24px,2.4vw,32px)', lineHeight: 1.25 }}>Understand the process. Design the equipment. Evaluate the engineering.</p>
          </div>
          <div className={s.approachText}>
            <p>Equipment design begins with understanding the process, the material being handled, and the required operating conditions.</p>
            <p>I approach each design by translating these requirements into equipment geometry, identifying relevant thermal and structural considerations, and evaluating the proposed concept through engineering calculations and simulation where appropriate.</p>
            <p>The objective is to develop technically documented equipment concepts that can support further engineering development, design review, and potential fabrication.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
