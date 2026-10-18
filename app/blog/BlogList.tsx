'use client';

import { useState } from 'react';
import FilterPills from '@/components/FilterPills';
import { BLOG_CATS, POSTS, type BlogCat } from '@/data/posts';
import s from '../pages.module.css';

export default function BlogList() {
  const [cat, setCat] = useState<BlogCat>('All');
  const posts = POSTS.filter(p => cat === 'All' || p.cats.includes(cat as Exclude<BlogCat, 'All'>));
  return (
    <>
      <FilterPills label="Filter by topic" options={BLOG_CATS} value={cat} onChange={setCat} />
      <p className="sr-only" aria-live="polite">{posts.length} posts shown</p>
      <div className={s.postGrid}>
        {posts.map(p => (
          <article key={p.num} className={s.post}>
            <div className={s.postVisual} aria-hidden="true">{p.image}</div>
            <div className={s.postBody}>
              <div className={s.postMeta}><span style={{ color: 'var(--teal-text)', textTransform: 'uppercase' }}>{p.label}</span><span style={{ flex: 'none', color: 'var(--mute)' }}>{p.num}</span></div>
              <h2 className={s.postTitle}>{p.title}</h2>
              <p className={s.body14} style={{ fontSize: 14 }}>{p.summary}</p>
              <p className={s.postTopics}>{p.topics}</p>
              <div className={s.postFoot}>Coming soon</div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
