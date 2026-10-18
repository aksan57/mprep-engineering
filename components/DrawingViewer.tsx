'use client';

import { useEffect, useState } from 'react';
import Img from './Img';

type Props = { pdf: string; preview: { src: string; alt: string }; title: string };

/**
 * PDF drawing viewer. Wide screens get the browser's embedded PDF viewer; phones (where inline
 * PDFs often don't render) get a static preview that opens the PDF in a new tab.
 * The iframe is only mounted on wide screens, so phones never download it.
 */
export default function DrawingViewer({ pdf, preview, title }: Props) {
  const [embed, setEmbed] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(min-width: 720px) and (hover: hover)');
    const on = () => setEmbed(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  if (embed) {
    return <iframe src={`${pdf}#view=FitH`} title={title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, background: '#fff' }} />;
  }
  return (
    <a href={pdf} target="_blank" rel="noopener" className="fill-img" aria-label={`${title} — open PDF in a new tab`} style={{ position: 'absolute', inset: 0, display: 'block', background: '#fff' }}>
      <Img src={preview.src} alt={preview.alt} />
      <span style={{ position: 'absolute', right: 8, bottom: 8, display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 14px', borderRadius: 4, background: 'rgba(16,42,67,.9)', color: '#E6F7F7', font: '500 11px var(--font-mono)', letterSpacing: '.06em' }}>
        OPEN PDF ↗
      </span>
    </a>
  );
}
