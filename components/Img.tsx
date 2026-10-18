import sizes from '@/data/image-sizes.json';

type Props = { src: string; alt: string; fit?: 'contain' | 'cover'; priority?: boolean; className?: string };

/** <img> with intrinsic size from data/image-sizes.json (prevents layout shift) and lazy loading by default. */
export default function Img({ src, alt, fit = 'contain', priority, className }: Props) {
  const [width, height] = (sizes as Record<string, number[]>)[src] ?? [];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src} alt={alt} width={width} height={height}
      loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : undefined}
      className={[fit === 'cover' ? 'cover' : '', className].filter(Boolean).join(' ') || undefined}
    />
  );
}

/** A captioned figure with a fixed aspect-ratio frame. */
export function Figure({ src, alt, caption, ratio = '1/1', dark, fit }: { src: string; alt: string; caption?: string; ratio?: string; dark?: boolean; fit?: 'contain' | 'cover' }) {
  return (
    <figure className="figure">
      <div className={`frame${dark ? ' frame--dark' : ''}`} style={{ aspectRatio: ratio }}>
        <Img src={src} alt={alt} fit={fit} />
      </div>
      {caption && <figcaption className="figcaption">{caption}</figcaption>}
    </figure>
  );
}
