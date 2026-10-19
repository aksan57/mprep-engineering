'use client';

import Link from 'next/link';
import { useState } from 'react';
import FilterPills from '@/components/FilterPills';
import Img from '@/components/Img';
import { CASE_STUDIES, PROJECT_CATS, PROJECTS, type ProjectCat } from '@/data/projects';
import s from './projects.module.css';

export default function ProjectsList() {
  const [cat, setCat] = useState<ProjectCat>('All');
  const featured = CASE_STUDIES.filter(c => cat === 'All' || c.cat === cat);
  const list = PROJECTS.filter(p => cat === 'All' || p.cat === cat);
  const count = list.length + featured.length;

  return (
    <>
      <FilterPills label="Filter projects" options={PROJECT_CATS} value={cat} onChange={setCat} scroll />
      <p className="sr-only" aria-live="polite">{count} {count === 1 ? 'project' : 'projects'} shown</p>

      {featured.map(c => (
        <article key={c.num} className={s.featured}>
          <div className={s.featuredMedia}><Img src={c.image.src} alt={c.image.alt} /></div>
          <div className={s.featuredBody}>
            <div className={s.cardTop}>
              <span className={s.numCat}><span className={s.num}>{c.num}</span><span className="label" style={{ letterSpacing: '.1em' }}>{c.cat}</span></span>
              <span className="badge badge--teal">PUBLISHED CASE STUDY</span>
            </div>
            <h2 className={s.featuredTitle}>{c.title}</h2>
            <p className={s.featuredDesc}>{c.desc}</p>
            <dl className={s.dl}>
              <div><dt className="label">TYPE</dt><dd>{c.type}</dd></div>
              <div><dt className="label">FOCUS</dt><dd className={s.pills}>{c.focus.map(f => <span key={f} className="pill">{f}</span>)}</dd></div>
            </dl>
            <div className={s.featuredFoot}>
              <Link href={c.href} className="btn btn--primary" style={{ height: 46, padding: '0 20px', fontSize: 14.5 }}>View case study <span aria-hidden="true">→</span></Link>
              <span className={s.disclaimer}>Conceptual · not fabricated or experimentally validated</span>
            </div>
          </div>
        </article>
      ))}

      {list.length > 0 && (
        <ul className={s.devList} aria-label="Projects in development">
          {list.map(p => (
            <li key={p.num} className={s.devItem}>
              <div className={s.devHead}>
                <span className={s.numCat}><span className={s.num}>{p.num}</span><span className={`label ${s.cat}`}>{p.cat}</span></span>
                <span className="badge">IN DEVELOPMENT</span>
              </div>
              <div className={s.devMain}>
                <h2 className={s.devTitle}>{p.title}</h2>
                <p className={s.devDesc}>{p.desc}</p>
              </div>
              <dl className={s.devMeta}>
                <div><dt className="label" style={{ fontSize: 10 }}>TYPE</dt><dd>{p.type}</dd></div>
                <div><dt className="label" style={{ fontSize: 10 }}>FOCUS</dt><dd className={s.focus}>{p.focus}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
      )}
      {count === 0 && <p style={{ fontSize: 14, color: 'var(--mute)' }}>No projects in this category yet.</p>}
    </>
  );
}
