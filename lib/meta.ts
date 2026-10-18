import type { Metadata } from 'next';
import { BRAND, navFor, OG_IMAGE } from '@/data/site';

/**
 * Per-page title, description, canonical URL and OG/Twitter text, from the NAV entry.
 * Next.js replaces (not merges) the openGraph/twitter objects, so the image is repeated here.
 */
export function pageMeta(href: string, override?: { title?: string; description?: string }): Metadata {
  const n = navFor(href);
  const title = override?.title ?? n?.label ?? BRAND;
  const description = override?.description ?? n?.description;
  return {
    title,
    description,
    alternates: { canonical: href },
    openGraph: { type: 'website', siteName: BRAND, locale: 'en_US', title: `${title} — ${BRAND}`, description, url: href, images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title: `${title} — ${BRAND}`, description, images: [OG_IMAGE.url] },
  };
}
