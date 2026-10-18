import s from '../article.module.css';

/** Schematic of a horizontal tube furnace with the six boundary-condition groups discussed in the article. */
const LEGEND = ['Heater power or control', 'Insulation k(T), layers, contacts', 'Internal surface radiation, ε', 'Shell convection + radiation', 'Water-cooled flanges', 'Penetrations, supports, sensor'];

export function FurnaceBcLegend() {
  return <ol className={s.legend}>{LEGEND.map((l, i) => <li key={l}><span className={s.legendNum} aria-hidden="true">{i + 1}</span>{l}</li>)}</ol>;
}

export default function FurnaceBcDiagram() {
  const coilsX = Array.from({ length: 15 }, (_, i) => 188 + i * 28);
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.04em' } as const;
  const tag = (x: number, y: number, n: number) => (
    <g key={`t${n}`}>
      <circle cx={x} cy={y} r={11} fill="#007A7A" />
      <text x={x} y={y + 4} textAnchor="middle" fill="#fff" style={{ ...mono, fontSize: 11.5, fontWeight: 600 }}>{n}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 760 352" className={s.diagram} role="img" aria-labelledby="bcd-title bcd-desc">
      <title id="bcd-title">Boundary conditions in a tube-furnace thermal model</title>
      <desc id="bcd-desc">Cross-section of a horizontal tube furnace: heater coils around a work tube inside an insulation layer and steel shell, water-cooled end flanges, a thermocouple port and support feet. Numbered tags mark heater power, insulation conductivity, internal radiation, shell convection and radiation, cooled flanges and penetrations.</desc>
      <defs>
        <linearGradient id="bcd-hot" x1="0" x2="1">
          <stop offset="0" stopColor="#FDEDE3" />
          <stop offset=".5" stopColor="#F7B993" />
          <stop offset="1" stopColor="#FDEDE3" />
        </linearGradient>
        <pattern id="bcd-ins" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#F6EEDC" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#E2D2AE" strokeWidth="1.2" />
        </pattern>
        <marker id="bcd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#C2410C" />
        </marker>
      </defs>

      {/* shell + insulation */}
      <rect x="150" y="80" width="460" height="230" rx="4" fill="#486581" />
      <rect x="156" y="86" width="448" height="218" rx="2" fill="url(#bcd-ins)" />
      {/* hot zone cavity */}
      <rect x="176" y="140" width="408" height="110" fill="url(#bcd-hot)" />
      {/* work tube */}
      <rect x="62" y="164" width="636" height="62" fill="none" stroke="#102A43" strokeWidth="2" />
      <rect x="64" y="168" width="632" height="54" fill="#fff" fillOpacity=".35" />
      {/* heater coils */}
      {coilsX.map(x => <circle key={`a${x}`} cx={x} cy="150" r="5" fill="#C2410C" />)}
      {coilsX.map(x => <circle key={`b${x}`} cx={x} cy="240" r="5" fill="#C2410C" />)}
      {/* internal radiation rays */}
      <g stroke="#C2410C" strokeWidth="1.2" strokeDasharray="3 3" fill="none" markerEnd="url(#bcd-arrow)">
        <line x1="300" y1="156" x2="318" y2="166" />
        <line x1="440" y1="234" x2="458" y2="224" />
      </g>
      {/* water-cooled flanges */}
      <rect x="40" y="150" width="22" height="90" rx="2" fill="#CFE6EA" stroke="#007A7A" strokeWidth="1.5" />
      <rect x="698" y="150" width="22" height="90" rx="2" fill="#CFE6EA" stroke="#007A7A" strokeWidth="1.5" />
      <path d="M51 150 v-18 M51 240 v18 M709 150 v-18 M709 240 v18" stroke="#007A7A" strokeWidth="3" />
      {/* thermocouple + feet */}
      <rect x="377" y="44" width="6" height="104" fill="#334E68" />
      <rect x="200" y="310" width="16" height="34" fill="#334E68" />
      <rect x="544" y="310" width="16" height="34" fill="#334E68" />
      <line x1="150" y1="344" x2="610" y2="344" stroke="#829AB1" strokeWidth="1" />
      {/* shell losses */}
      <g stroke="#C2410C" strokeWidth="1.6" fill="none" markerEnd="url(#bcd-arrow)">
        <path d="M250 78 q4 -8 0 -16 t0 -16" />
        <path d="M500 78 q4 -8 0 -16 t0 -16" />
      </g>
      <g stroke="#C2410C" strokeWidth="1.6" markerEnd="url(#bcd-arrow)"><line x1="320" y1="312" x2="320" y2="336" /><line x1="440" y1="312" x2="440" y2="336" /></g>

      {/* tags */}
      {tag(210, 120, 1)}
      {tag(590, 110, 2)}
      {tag(330, 196, 3)}
      {tag(530, 44, 4)}
      {tag(30, 120, 5)}
      {tag(404, 40, 6)}

      <text x="16" y="24" style={mono} fill="#627D98">SCHEMATIC · NOT TO SCALE</text>
    </svg>
  );
}
