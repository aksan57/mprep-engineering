import CtaBand from '@/components/CtaBand';
import PageHead from '@/components/PageHead';
import { ROADMAP } from '@/data/projects';
import { pageMeta } from '@/lib/meta';
import ProjectsList from './ProjectsList';
import s from './projects.module.css';

export const metadata = pageMeta('/projects/', { title: 'Selected Projects' });

export default function ProjectsPage() {
  return (
    <section className="section section--paper">
      <div className="container">
        <PageHead title="Selected Projects" wide>
          Equipment design studies built from process knowledge — from crystal growth and electrochemistry to enhanced oil recovery, nickel processing, biomass conversion, and emulsion preparation. Each study documents its geometry, assumptions, methodology, results, and limitations.
        </PageHead>

        <ProjectsList />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 className="eyebrow" style={{ letterSpacing: '.12em' }}>On the roadmap</h2>
          <ul className={s.roadmap}>
            {ROADMAP.map(r => <li key={r.n}><span className={s.roadmapTag}>{r.n}</span><span style={{ minWidth: 0 }}>{r.t}</span></li>)}
          </ul>
        </div>

        <div className={`tint-panel ${s.docStandard}`}>
          <h2 className="eyebrow" style={{ letterSpacing: '.12em' }}>Documentation standard</h2>
          <p>Every published study documents design geometry, engineering assumptions, analysis methodology, and results. Simulation results are always presented with their assumptions and limitations, and conceptual designs are clearly distinguished from fabricated, experimentally validated, or code-verified equipment.</p>
        </div>

        <CtaBand />
      </div>
    </section>
  );
}
