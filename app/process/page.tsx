import PageHead from '@/components/PageHead';
import { STEPS } from '@/data/services';
import { pageMeta } from '@/lib/meta';
import s from '../pages.module.css';

export const metadata = pageMeta('/process/');

export default function ProcessPage() {
  return (
    <section className="section section--paper">
      <div className="container">
        <PageHead title="Six stages, each one reviewable.">
          Analysis quality depends on the assumptions, input data, boundary conditions and validation available for each project. These are agreed and recorded before results are interpreted.
        </PageHead>
        <ol className={`hairline ${s.steps}`} style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))' }}>
          {STEPS.map(st => (
            <li key={st.title}>
              <h2 className={s.stepTitle}>{st.title}</h2>
              <p className={s.stepBody}>{st.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
