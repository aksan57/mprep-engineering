import s from './ModelViewer.module.css';

// Kept out of ModelViewer.tsx ('use client'): values exported from a client module reach server
// components as client references, not strings.
export const TOUCH_HINT = 'Two fingers to rotate · pinch to zoom';

/**
 * Gesture hint for a ModelViewer. Shows `mouse` on devices with a mouse/trackpad and `touch` on touch-first
 * devices (no hover, coarse pointer). Switched in CSS, so server HTML is identical and there's no flash.
 */
export default function ModelHint({ mouse, touch = TOUCH_HINT, className }: { mouse: string; touch?: string; className?: string }) {
  return (
    <p className={className}>
      <span className={s.hintMouse}>{mouse}</span>
      <span className={s.hintTouch}>{touch}</span>
    </p>
  );
}
