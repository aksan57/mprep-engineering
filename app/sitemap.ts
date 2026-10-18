import type { MetadataRoute } from 'next';
import { NAV, SITE_URL } from '@/data/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...NAV.map(n => n.href), '/projects/cz-r4/'];
  return paths.map(p => ({ url: SITE_URL + p, changeFrequency: 'monthly', priority: p === '/' ? 1 : 0.7 }));
}
