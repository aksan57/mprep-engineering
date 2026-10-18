import PageHead from '@/components/PageHead';
import { pageMeta } from '@/lib/meta';
import BlogList from './BlogList';

export const metadata = pageMeta('/blog/', { title: 'Engineering notes' });

export default function BlogPage() {
  return (
    <section className="section">
      <div className="container" style={{ gap: 'clamp(32px,4vw,48px)' }}>
        <PageHead title="Engineering notes">
          Technical articles on equipment design, CAD modeling, structural analysis, heat transfer, and computational fluid dynamics. Explore engineering methods, modeling assumptions, preliminary calculations, and practical lessons from material-processing and laboratory equipment design.
        </PageHead>
        <BlogList />
        <div className="band" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', padding: 'clamp(28px,4vw,48px)', alignItems: 'start' }}>
          <p className="band__title" style={{ fontSize: 'clamp(24px,2.4vw,32px)' }}>Engineering knowledge, documented.</p>
          <p className="band__body">Each article focuses on the methods, assumptions, and engineering decisions behind equipment design. The objective is not merely to present simulation results, but to explain how models are constructed, how results should be interpreted, and where further verification is needed.</p>
        </div>
      </div>
    </section>
  );
}
