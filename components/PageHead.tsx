import type { ReactNode } from 'react';

/** Section heading row: H1-styled-as-H2 title on the left, intro paragraph on the right. */
export default function PageHead({ title, children, wide }: { title: string; children?: ReactNode; wide?: boolean }) {
  return (
    <div className="head">
      <div className="head__stack">
        <h1 className="h2">{title}</h1>
      </div>
      {children && <p className={`lead${wide ? ' lead--wide' : ''}`}>{children}</p>}
    </div>
  );
}
