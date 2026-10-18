import PageHead from '@/components/PageHead';
import { FORMATS, TOOL_GROUPS } from '@/data/tools';
import { pageMeta } from '@/lib/meta';
import s from '../pages.module.css';

export const metadata = pageMeta('/tools/', { title: 'Software & tools' });

export default function ToolsPage() {
  return (
    <section className="section">
      <div className="container">
        <PageHead title="Software & tools">
          The software used across modeling, simulation and documentation. Files can be delivered in native or neutral formats to fit your workflow.
        </PageHead>
        <div className="hairline" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))' }}>
          {TOOL_GROUPS.map(g => (
            <article key={g.tag} className={s.toolCard}>
              <span className={s.toolTag}>{g.tag}</span>
              <h2 className={s.toolTitle}>{g.title}</h2>
              <ul className={s.toolList}>
                {g.items.map(it => <li key={it.n}><span className={s.toolName}>{it.n}</span><span className={s.toolLevel}>{it.l}</span></li>)}
              </ul>
              <p className={s.toolUse}>{g.use}</p>
            </article>
          ))}
        </div>
        <div className={s.block} style={{ gap: 12 }}>
          <h2 className="label">EXCHANGE FORMATS</h2>
          <div className={s.formats}>
            {FORMATS.map(f => (
              <div key={f.k} className={s.formatGroup}>
                <span className={s.formatKey}>{f.k}</span>
                {f.v.map(x => <span key={x} className={s.formatPill}>{x}</span>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
