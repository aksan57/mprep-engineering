// Hexagon mark filled with a triangulated FEA-style mesh. Source artboard: design/…/logo/HexFlow.dc.html
const MESH =
  'M29 24.8 33 38M14 33.5 33 38M47 14.5 33 38M47 14.5 55 26M33 38 55 26M60 7 55 26M74 15.1 55 26M74 15.1 80 30M55 26 80 30M95 27.2 80 30M106 33.5 92 48M95 27.2 92 48M80 30 92 48M106 52 92 48M55 26 63 42M80 30 63 42M80 30 74 52M92 48 74 52M33 38 47 47M55 26 47 47M63 42 47 47M14 47 33 38M33 38 28 58M14 47 28 58M47 47 28 58M43 63 28 58M14 68 28 58M28 58 30 80M14 68 30 80M43 63 30 80M14 86.5 30 80M24 92.3 30 80M42 102.6 30 80M30 80 52 92M42 102.6 52 92M52 76 30 80M52 76 52 92M60 113 52 92M71 106.7 52 92M52 92 78 88M71 106.7 78 88M68 77 52 92M52 76 68 77M68 77 78 88M88 96.9 78 88M106 86.5 90 66M88 96.9 90 66M90 66 78 88M106 71 90 66M106 52 90 66M92 48 90 66M92 48 78 64M78 64 90 66M78 64 78 88M74 52 63 42M47 47 43 63M43 63 52 76M68 77 78 64M78 64 74 52M56 55 64 67M56 55 74 52M56 55 63 42M56 55 47 47M56 55 43 63M64 67 43 63M64 67 52 76M64 67 68 77M64 67 78 64M64 67 74 52';
const HEX = 'M60 7 106 33.5v53L60 113 14 86.5v-53Z';

// Stroke weights per rendered size, matching the prototype (smaller marks get heavier strokes).
const STROKES: Record<number, [number, number]> = { 52: [2.4, 7.5], 40: [3, 7.5], 38: [2.6, 8], 36: [2.6, 8], 28: [3, 9], 26: [3.2, 10] };

export function LogoMark({ size = 52, color = 'var(--logo-navy)' }: { size?: number; color?: string }) {
  const [mesh, hex] = STROKES[size] ?? [2.6, 8];
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 120 120" style={{ flex: 'none', display: 'block' }}>
      <path d={MESH} fill="none" stroke={color} strokeWidth={mesh} strokeLinecap="round" />
      <path d={HEX} fill="none" stroke={color} strokeWidth={hex} strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const lg = size === 'lg';
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: lg ? 5 : 3, lineHeight: 1, minWidth: 0 }}>
      <span style={{ fontFamily: 'var(--font-logo)', fontWeight: 800, fontSize: lg ? 30 : 19, letterSpacing: '-.03em', whiteSpace: 'nowrap', color: 'var(--logo-navy)' }}>
        MPrep
      </span>
      <span style={{ fontFamily: 'var(--font-logo-mono)', fontWeight: 500, fontSize: lg ? 9.5 : 8, letterSpacing: '.42em', whiteSpace: 'nowrap', color: lg ? 'var(--logo-navy)' : 'var(--t4)' }}>
        ENGINEERING
      </span>
    </span>
  );
}
