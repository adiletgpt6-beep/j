import React from "react";
import { colors, W, H } from "../theme";

/* Extra flat-style primitives for videos 08 (fitr-sadaqa) and 09 (transparency).
 * All are SVG fragments (wrap in <Canvas>) unless noted. */

/** Crescent moon drawn as a path (no mask) so it can be scaled / rotated / faded freely. Horns point up-left by default. */
export const Crescent: React.FC<{ x: number; y: number; r?: number; color?: string; rotate?: number; opacity?: number; glow?: number; thickness?: number }> = ({
  x,
  y,
  r = 60,
  color = "#F6E7B8",
  rotate = -35,
  opacity = 1,
  glow = 0.15,
  thickness = 1.1,
}) => {
  const R = r * thickness;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
      {glow > 0 && <circle r={r * 2.2} fill={color} opacity={glow * 0.5} />}
      {glow > 0 && <circle r={r * 1.5} fill={color} opacity={glow} />}
      <path d={`M0 ${-r} A${r} ${r} 0 1 1 0 ${r} A${R} ${R} 0 0 0 0 ${-r} Z`} fill={color} />
    </g>
  );
};

/** Twinkling stars field (pass the current frame). */
export const Stars: React.FC<{ frame: number; count?: number; top?: number; height?: number; color?: string; seed?: number }> = ({ frame, count = 40, top = 40, height = 760, color = "#fff", seed = 0 }) => (
  <g>
    {Array.from({ length: count }).map((_, i) => {
      const k = i + seed;
      const sx = (k * 263 + 71) % W;
      const sy = top + ((k * 157 + 23) % height);
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / 22 + k * 1.7));
      return <circle key={i} cx={sx} cy={sy} r={1.8 + (k % 3) * 0.6} fill={color} opacity={tw * 0.85} />;
    })}
  </g>
);

/** Hanging lantern. Origin at the hook. swing in degrees. lit 0..1 */
export const Lantern: React.FC<{ x: number; y: number; scale?: number; color?: string; lit?: number; swing?: number }> = ({ x, y, scale = 1, color = colors.gold, lit = 1, swing = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${swing}) scale(${scale})`}>
    <line x1={0} y1={0} x2={0} y2={30} stroke={colors.goldDeep} strokeWidth={4} />
    <rect x={-18} y={30} width={36} height={14} rx={5} fill={colors.goldDeep} />
    {lit > 0 && <circle cx={0} cy={95} r={78} fill="#FFD27A" opacity={0.22 * lit} />}
    <path d="M-34 44 L34 44 L44 110 Q0 134 -44 110 Z" fill={lit > 0.5 ? "#FFD27A" : "#E8C184"} opacity={0.75 + 0.25 * lit} />
    <path d="M-34 44 L34 44 L44 110 Q0 134 -44 110 Z" fill="none" stroke={colors.goldDeep} strokeWidth={4} />
    <path d="M-20 44 L-24 112 M0 44 L0 122 M20 44 L24 112" stroke={colors.goldDeep} strokeWidth={3} opacity={0.6} />
    <ellipse cx={0} cy={124} rx={22} ry={8} fill={colors.goldDeep} />
    <circle cx={0} cy={82} r={12} fill="#FFF3C4" opacity={lit} />
  </g>
);

/** Teapot (chainek) */
export const Teapot: React.FC<{ x: number; y: number; scale?: number; color?: string; steam?: number }> = ({ x, y, scale = 1, color = "#5C8FB8", steam = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={0} cy={0} rx={56} ry={40} fill={color} />
    <rect x={-56} y={-30} width={112} height={30} fill={color} />
    <ellipse cx={0} cy={-30} rx={56} ry={16} fill={color} />
    <ellipse cx={0} cy={-30} rx={38} ry={10} fill="#3F6E93" />
    <path d="M0 -50 Q0 -56 8 -56 Q0 -66 -8 -56 Q0 -56 0 -50" fill={colors.gold} />
    <circle cx={0} cy={-52} r={8} fill={colors.gold} />
    <path d="M50 -20 Q100 -40 90 10 Q84 24 70 20" fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" />
    <path d="M-50 -10 Q-100 -20 -90 25" fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" />
    <circle cx={-22} cy={-6} r={10} fill="#fff" opacity={0.35} />
    {steam > 0 && (
      <g opacity={steam * 0.6}>
        <path d="M-10 -70 q 10 -20 0 -40 q -10 -20 0 -40" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
        <path d="M14 -72 q 10 -18 0 -36 q -10 -18 0 -36" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
      </g>
    )}
  </g>
);

/** Tea bowl (piala) */
export const Piala: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({ x, y, scale = 1, color = "#F3F3F0" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-30 -10 Q-26 26 0 26 Q26 26 30 -10 Z" fill={color} />
    <ellipse cx={0} cy={-10} rx={30} ry={9} fill={color} />
    <ellipse cx={0} cy={-10} rx={22} ry={6} fill="#C68B4E" />
    <path d="M-26 6 L26 6" stroke={colors.brandSoft} strokeWidth={3} opacity={0.7} />
  </g>
);

/** Bowl with dates */
export const DatesBowl: React.FC<{ x: number; y: number; scale?: number; fill?: number }> = ({ x, y, scale = 1, fill = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-60 -8 Q-54 36 0 36 Q54 36 60 -8 Z" fill="#E7E4DA" />
    {fill > 0 && (
      <g opacity={fill}>
        {[[-34, -14], [-10, -20], [16, -16], [38, -10], [-22, -30], [4, -36], [26, -30]].map(([dx, dy], i) => (
          <ellipse key={i} cx={dx} cy={dy} rx={16} ry={9} fill={i % 2 ? "#6A3A22" : "#8A4B2A"} transform={`rotate(${(i * 37) % 60 - 30} ${dx} ${dy})`} />
        ))}
      </g>
    )}
    <ellipse cx={0} cy={-8} rx={60} ry={12} fill="none" stroke="#D3CFC3" strokeWidth={5} />
  </g>
);

/** Round flat bread (nan) */
export const Bread: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={0} cy={0} rx={60} ry={24} fill="#D9A25A" />
    <ellipse cx={0} cy={-4} rx={56} ry={20} fill="#E8B86C" />
    <ellipse cx={0} cy={-4} rx={24} ry={9} fill="#D9A25A" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <circle key={i} cx={Math.cos((i / 6) * Math.PI * 2) * 36} cy={-4 + Math.sin((i / 6) * Math.PI * 2) * 13} r={3} fill="#B9833F" />
    ))}
  </g>
);

/** Fruit plate (apples / pomegranate) */
export const FruitPlate: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={0} cy={6} rx={56} ry={16} fill="#F3F3F0" />
    <circle cx={-22} cy={-10} r={18} fill="#D94F4F" />
    <circle cx={16} cy={-12} r={18} fill="#E8A33D" />
    <circle cx={-2} cy={-26} r={16} fill="#8DBB5E" />
  </g>
);

/**
 * Dastorkon: low table with a patterned cloth. `items` 0..1 reveals food step by step (tea → bowls → dates → bread → fruit).
 * Origin at table top centre; width ≈ 360 at scale 1.
 */
export const Dastorkon: React.FC<{ x: number; y: number; scale?: number; items?: number; cloth?: string; cloth2?: string; steam?: number; width?: number }> = ({
  x,
  y,
  scale = 1,
  items = 1,
  cloth = "#C94F4F",
  cloth2 = colors.gold,
  steam = 0,
  width = 360,
}) => {
  const step = (i: number, n = 5) => Math.min(1, Math.max(0, items * n - i));
  const w = width / 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* legs */}
      <rect x={-w + 30} y={10} width={18} height={60} rx={6} fill="#8C6A52" />
      <rect x={w - 48} y={10} width={18} height={60} rx={6} fill="#8C6A52" />
      {/* cloth */}
      <rect x={-w} y={-18} width={w * 2} height={40} rx={12} fill={cloth} />
      <rect x={-w} y={-18} width={w * 2} height={40} rx={12} fill="none" stroke={cloth2} strokeWidth={4} strokeDasharray="14 10" opacity={0.8} />
      <path d={`M${-w} 22 Q${-w / 2} 46 0 22 Q${w / 2} 46 ${w} 22`} fill="none" stroke={cloth2} strokeWidth={4} opacity={0.6} />
      {/* items */}
      <g transform={`translate(${-w * 0.6} -22) scale(${0.56 * step(0)})`}>
        <Teapot x={0} y={0} scale={1} steam={steam} />
      </g>
      <g transform={`translate(${-w * 0.15} -22) scale(${0.7 * step(1)})`}>
        <Piala x={0} y={0} />
      </g>
      <g transform={`translate(${w * 0.7} -22) scale(${0.7 * step(1)})`}>
        <Piala x={0} y={0} />
      </g>
      <g transform={`translate(${w * 0.2} -22) scale(${0.72 * step(2)})`}>
        <DatesBowl x={0} y={0} />
      </g>
      <g transform={`translate(${w * 0.5} -34) scale(${0.7 * step(3)})`}>
        <Bread x={0} y={0} />
      </g>
      <g transform={`translate(${-w * 0.3} -46) scale(${0.6 * step(4)})`}>
        <FruitPlate x={0} y={0} />
      </g>
    </g>
  );
};

/** Barley ear (long awns), origin at stem base */
export const Barley: React.FC<{ x: number; y: number; scale?: number; color?: string; bend?: number }> = ({ x, y, scale = 1, color = "#D8BE7A", bend = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${bend})`}>
    <path d="M0 0 Q 4 -110 0 -220" stroke="#A98A4A" strokeWidth={6} fill="none" strokeLinecap="round" />
    {Array.from({ length: 6 }).map((_, i) => (
      <g key={i} transform={`translate(0 ${-120 - i * 18})`}>
        <ellipse cx={-11} cy={0} rx={8} ry={17} fill={color} transform="rotate(-18)" />
        <ellipse cx={11} cy={0} rx={8} ry={17} fill={color} transform="rotate(18)" />
        <path d="M-12 -14 L-30 -70 M12 -14 L30 -70" stroke="#A98A4A" strokeWidth={2.5} strokeLinecap="round" />
      </g>
    ))}
    <ellipse cx={0} cy={-232} rx={8} ry={16} fill={color} />
  </g>
);

/** Bunch of raisins (dried grapes) */
export const Raisins: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({ x, y, scale = 1, color = "#6B3E5B" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M0 -60 Q6 -90 20 -100" stroke="#7A8F4E" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M0 -62 Q-30 -80 -40 -60 Q-20 -58 0 -62" fill="#8DBB5E" />
    {[[-26, -40], [0, -46], [26, -40], [-16, -16], [12, -18], [-2, 8], [-30, -12], [30, -12], [20, 10], [-20, 10]].map(([dx, dy], i) => (
      <ellipse key={i} cx={dx} cy={dy} rx={15} ry={17} fill={i % 3 === 0 ? "#52304A" : color} />
    ))}
    {[[-26, -44], [0, -50], [12, -22]].map(([dx, dy], i) => (
      <ellipse key={i} cx={dx - 4} cy={dy - 4} rx={4} ry={5} fill="#fff" opacity={0.35} />
    ))}
  </g>
);

/** A few dates (fruit) */
export const DatesFruit: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {[[-30, 0, -20], [0, -14, 10], [30, 0, -8], [-10, 16, 30], [18, 18, -25]].map(([dx, dy, rot], i) => (
      <g key={i} transform={`translate(${dx} ${dy}) rotate(${rot})`}>
        <ellipse rx={30} ry={15} fill={i % 2 ? "#6A3A22" : "#8A4B2A"} />
        <ellipse cx={-6} cy={-5} rx={10} ry={4} fill="#fff" opacity={0.18} />
      </g>
    ))}
  </g>
);

/** Sack of grain */
export const Sack: React.FC<{ x: number; y: number; scale?: number; color?: string; children?: React.ReactNode }> = ({ x, y, scale = 1, color = "#D8C3A0", children }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-80 0 Q-90 -90 -60 -130 L-40 -150 L40 -150 L60 -130 Q90 -90 80 0 Z" fill={color} />
    <path d="M-44 -150 Q0 -170 44 -150 L36 -134 Q0 -146 -36 -134 Z" fill="#B99E78" />
    <path d="M-60 -40 Q0 -20 60 -40" stroke="#B99E78" strokeWidth={4} fill="none" opacity={0.6} />
    {children}
  </g>
);

/** Megaphone / announcement icon */
export const Megaphone: React.FC<{ x: number; y: number; scale?: number; color?: string; waves?: number }> = ({ x, y, scale = 1, color = colors.brand, waves = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-50 -24 L10 -56 L10 56 L-50 24 Z" fill={color} />
    <rect x={-74} y={-24} width={30} height={48} rx={8} fill={color} />
    <rect x={-66} y={20} width={22} height={40} rx={8} fill={color} opacity={0.8} />
    <g opacity={waves} stroke={colors.gold} strokeWidth={6} fill="none" strokeLinecap="round">
      <path d="M30 -28 Q46 0 30 28" />
      <path d="M52 -44 Q78 0 52 44" />
    </g>
  </g>
);

/** Calendar leaf icon with a header and a big number / label */
export const CalendarIcon: React.FC<{ x: number; y: number; scale?: number; header?: string; label?: string; color?: string; labelSize?: number }> = ({ x, y, scale = 1, header = "", label = "", color = colors.terracotta, labelSize = 48 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-70} y={-80} width={140} height={150} rx={16} fill="#fff" stroke={colors.mint} strokeWidth={4} />
    <rect x={-70} y={-80} width={140} height={40} rx={16} fill={color} />
    <rect x={-70} y={-56} width={140} height={16} fill={color} />
    <rect x={-40} y={-92} width={12} height={28} rx={6} fill={colors.ink} />
    <rect x={28} y={-92} width={12} height={28} rx={6} fill={colors.ink} />
    <text y={-50} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={800} fontSize={22} fill="#fff">
      {header}
    </text>
    <text y={labelSize * 0.35 + 10} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={900} fontSize={labelSize} fill={colors.brandDeep}>
      {label}
    </text>
  </g>
);

/** Donation box with a slot and a heart */
export const DonationBox: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({ x, y, scale = 1, color = colors.brand }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-110} y={-120} width={220} height={120} rx={14} fill={color} />
    <rect x={-110} y={-120} width={220} height={22} rx={10} fill={colors.brandDeep} />
    <rect x={-50} y={-112} width={100} height={8} rx={4} fill={colors.nightDeep} />
    <path d="M0 -40 C-30 -66 -30 -92 -12 -92 C-4 -92 0 -84 0 -82 C0 -84 4 -92 12 -92 C30 -92 30 -66 0 -40 Z" fill={colors.gold} />
  </g>
);

/** Wrapped bundle (amanat), optional glow 0..1 */
export const Parcel: React.FC<{ x: number; y: number; scale?: number; glow?: number; color?: string; ribbon?: string }> = ({ x, y, scale = 1, glow = 1, color = "#F7E9C6", ribbon = colors.gold }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {glow > 0 && <circle r={110} fill="#FFE08A" opacity={0.18 * glow} />}
    {glow > 0 && <circle r={75} fill="#FFE08A" opacity={0.25 * glow} />}
    <path d="M-50 -30 Q-56 30 -40 44 L40 44 Q56 30 50 -30 Q30 -50 0 -46 Q-30 -50 -50 -30 Z" fill={color} />
    <path d="M-50 -30 Q-56 30 -40 44 L40 44 Q56 30 50 -30 Q30 -50 0 -46 Q-30 -50 -50 -30 Z" fill="none" stroke={colors.goldDeep} strokeWidth={3} opacity={0.6} />
    <path d="M-10 -46 Q-18 -70 -34 -72 Q-10 -56 0 -48 Q10 -56 34 -72 Q18 -70 10 -46" fill={ribbon} />
    <rect x={-6} y={-46} width={12} height={90} fill={ribbon} opacity={0.9} />
    <circle cx={-18} cy={-12} r={8} fill="#fff" opacity={0.35} />
  </g>
);

/** Open document icon (lines of text) */
export const DocIcon: React.FC<{ x: number; y: number; scale?: number; color?: string; accent?: string }> = ({ x, y, scale = 1, color = "#fff", accent = colors.brand }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-50 -70 L20 -70 L50 -40 L50 70 L-50 70 Z" fill={color} stroke={accent} strokeWidth={6} strokeLinejoin="round" />
    <path d="M20 -70 L20 -40 L50 -40" fill="none" stroke={accent} strokeWidth={6} strokeLinejoin="round" />
    <line x1={-30} y1={-20} x2={30} y2={-20} stroke={accent} strokeWidth={8} strokeLinecap="round" />
    <line x1={-30} y1={8} x2={30} y2={8} stroke={accent} strokeWidth={8} strokeLinecap="round" opacity={0.7} />
    <line x1={-30} y1={36} x2={6} y2={36} stroke={accent} strokeWidth={8} strokeLinecap="round" opacity={0.5} />
  </g>
);

/** Bar chart icon; progress 0..1 grows the bars */
export const ChartIcon: React.FC<{ x: number; y: number; scale?: number; progress?: number; colorsBars?: string[] }> = ({ x, y, scale = 1, progress = 1, colorsBars = [colors.brandSoft, colors.gold, colors.brand] }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <line x1={-60} y1={60} x2={60} y2={60} stroke={colors.brandDeep} strokeWidth={6} strokeLinecap="round" />
    {[70, 120, 95].map((h, i) => (
      <rect key={i} x={-48 + i * 36} y={60 - h * progress} width={26} height={h * progress} rx={6} fill={colorsBars[i % colorsBars.length]} />
    ))}
  </g>
);

/** Magnifier with a check-mark inside */
export const MagnifierCheck: React.FC<{ x: number; y: number; scale?: number; color?: string; check?: number }> = ({ x, y, scale = 1, color = colors.brand, check = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle r={52} fill="#fff" stroke={color} strokeWidth={10} />
    <line x1={38} y1={38} x2={78} y2={78} stroke={color} strokeWidth={16} strokeLinecap="round" />
    <path d="M-24 2 L-8 18 L26 -18" fill="none" stroke={colors.brandSoft} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - check)} />
  </g>
);

/** Folder icon (closed) with optional check badge */
export const Folder: React.FC<{ x: number; y: number; scale?: number; color?: string; check?: number }> = ({ x, y, scale = 1, color = colors.gold, check = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-80 -50 L-30 -50 L-14 -34 L80 -34 L80 60 L-80 60 Z" fill={colors.goldDeep} />
    <rect x={-80} y={-26} width={160} height={86} rx={10} fill={color} />
    <rect x={-56} y={-12} width={70} height={8} rx={4} fill="#fff" opacity={0.6} />
    {check > 0 && (
      <g transform={`translate(58 38) scale(${check})`}>
        <circle r={26} fill={colors.brand} stroke="#fff" strokeWidth={5} />
        <path d="M-12 0 L-3 9 L13 -9" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </g>
);

/** Very simplified Kyrgyzstan outline. Normalised 0..1 points scaled to width w (height ≈ 0.55 w). Origin at top-left. */
const KG_POINTS: [number, number][] = [
  [0.18, 0.3], [0.3, 0.2], [0.42, 0.22], [0.6, 0.18], [0.8, 0.26], [0.98, 0.3], [1.0, 0.42], [0.92, 0.56], [0.8, 0.66], [0.68, 0.74], [0.55, 0.8], [0.45, 0.86],
  [0.36, 0.78], [0.3, 0.9], [0.18, 0.98], [0.06, 0.94], [0.04, 0.82], [0.12, 0.74], [0.22, 0.7], [0.3, 0.6], [0.26, 0.5], [0.14, 0.46], [0.06, 0.4], [0.1, 0.32],
];
export const KG_CITIES: [number, number][] = [
  [0.44, 0.32], [0.26, 0.8], [0.76, 0.42], [0.62, 0.6], [0.2, 0.4], [0.3, 0.6], [0.1, 0.88],
];
export const KyrgyzMap: React.FC<{ x: number; y: number; w?: number; fill?: string; stroke?: string; dots?: number; dotColor?: string; pulse?: number }> = ({
  x,
  y,
  w = 300,
  fill = colors.mint,
  stroke = colors.brand,
  dots = 0,
  dotColor = colors.gold,
  pulse = 0,
}) => {
  const s = w;
  const d = KG_POINTS.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px * s} ${py * s * 0.62}`).join(" ") + " Z";
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={d} fill={fill} stroke={stroke} strokeWidth={4} strokeLinejoin="round" />
      {KG_CITIES.map(([px, py], i) => {
        const vis = Math.min(1, Math.max(0, dots * KG_CITIES.length - i));
        if (vis <= 0) return null;
        return (
          <g key={i} transform={`translate(${px * s} ${py * s * 0.62})`}>
            <circle r={s * 0.05 * (1 + 0.4 * pulse)} fill={dotColor} opacity={0.25 * vis} />
            <circle r={s * 0.025 * vis} fill={dotColor} />
          </g>
        );
      })}
    </g>
  );
};

/** Speech bubble with a tail. side: which side the tail points to. */
export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; side?: "left" | "right"; color?: string; stroke?: string; children?: React.ReactNode; opacity?: number; scale?: number }> = ({
  x,
  y,
  w,
  h,
  side = "left",
  color = "#fff",
  stroke = colors.mint,
  children,
  opacity = 1,
  scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
    <rect x={-w / 2 + 4} y={-h / 2 + 10} width={w} height={h} rx={28} fill="rgba(0,0,0,0.06)" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={28} fill={color} stroke={stroke} strokeWidth={4} />
    {side === "left" ? (
      <path d={`M${-w / 2 + 40} ${h / 2 - 2} L${-w / 2 + 10} ${h / 2 + 34} L${-w / 2 + 80} ${h / 2 - 2} Z`} fill={color} stroke={stroke} strokeWidth={4} strokeLinejoin="round" />
    ) : (
      <path d={`M${w / 2 - 40} ${h / 2 - 2} L${w / 2 - 10} ${h / 2 + 34} L${w / 2 - 80} ${h / 2 - 2} Z`} fill={color} stroke={stroke} strokeWidth={4} strokeLinejoin="round" />
    )}
    <rect x={-w / 2 + 12} y={h / 2 - 8} width={w - 24} height={12} fill={color} />
    {children}
  </g>
);

/** Small picture icon (photo of a project) */
export const PhotoIcon: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-50} y={-40} width={100} height={80} rx={10} fill="#fff" stroke={colors.brand} strokeWidth={5} />
    <rect x={-40} y={-30} width={80} height={60} rx={6} fill={colors.sky} />
    <path d="M-40 30 L-14 0 L4 20 L18 6 L40 30 Z" fill={colors.brandSoft} />
    <circle cx={22} cy={-14} r={7} fill={colors.gold} />
  </g>
);

/** Question mark glyph */
export const QuestionMark: React.FC<{ x: number; y: number; size?: number; color?: string; opacity?: number }> = ({ x, y, size = 90, color = colors.terracotta, opacity = 1 }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={900} fontSize={size} fill={color} opacity={opacity}>
    ?
  </text>
);

/** Dashed road / path. progress 0..1 reveals it. */
export const RoadPath: React.FC<{ d: string; progress?: number; color?: string; width?: number; dashed?: boolean; opacity?: number; length?: number }> = ({ d, progress = 1, color = colors.sand, width = 40, dashed = false, opacity = 1, length = 2000 }) => (
  <g opacity={opacity}>
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={length} strokeDashoffset={length * (1 - progress)} />
    {dashed && <path d={d} fill="none" stroke="#fff" strokeWidth={Math.max(4, width * 0.12)} strokeLinecap="round" strokeDasharray="18 26" opacity={0.8 * progress} />}
  </g>
);

/** Fog overlay (HTML). density 0..1. Drifts slowly with frame. */
export const Fog: React.FC<{ density: number; frame: number; color?: string; top?: number; bottom?: number }> = ({ density, frame, color = "232,236,238", top = 0, bottom = H }) => {
  if (density <= 0) return null;
  const drift = (frame * 0.6) % 400;
  return (
    <div style={{ position: "absolute", left: 0, top, width: W, height: bottom - top, pointerEvents: "none", opacity: density, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `rgba(${color},0.55)` }} />
      <div style={{ position: "absolute", left: -400 + drift, top: 0, width: W + 800, height: "100%", background: `radial-gradient(ellipse 50% 40% at 30% 40%, rgba(${color},0.9) 0%, rgba(${color},0) 70%), radial-gradient(ellipse 45% 35% at 75% 65%, rgba(${color},0.85) 0%, rgba(${color},0) 70%)` }} />
      <div style={{ position: "absolute", left: 400 - drift * 1.4, top: 0, width: W + 800, height: "100%", background: `radial-gradient(ellipse 40% 30% at 60% 30%, rgba(${color},0.8) 0%, rgba(${color},0) 70%), radial-gradient(ellipse 50% 30% at 20% 75%, rgba(${color},0.8) 0%, rgba(${color},0) 70%)` }} />
    </div>
  );
};

/** Browser window frame (schematic site). Children in local coordinates with origin at the content top-left. */
export const BrowserFrame: React.FC<{ x: number; y: number; w: number; h: number; url?: string; children?: React.ReactNode }> = ({ x, y, w, h, url = "zeket.kg", children }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={6} y={14} width={w} height={h} rx={30} fill="rgba(0,0,0,0.08)" />
    <rect x={0} y={0} width={w} height={h} rx={30} fill="#fff" stroke={colors.mint} strokeWidth={4} />
    <path d={`M0 30 Q0 0 30 0 L${w - 30} 0 Q${w} 0 ${w} 30 L${w} 70 L0 70 Z`} fill={colors.mintLight} />
    <line x1={0} y1={70} x2={w} y2={70} stroke={colors.mint} strokeWidth={4} />
    <circle cx={36} cy={35} r={9} fill={colors.terracotta} />
    <circle cx={66} cy={35} r={9} fill={colors.gold} />
    <circle cx={96} cy={35} r={9} fill={colors.brandSoft} />
    <rect x={130} y={18} width={w - 260} height={34} rx={17} fill="#fff" stroke={colors.mint} strokeWidth={3} />
    <text x={w / 2} y={43} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={600} fontSize={24} fill={colors.inkSoft}>
      {url}
    </text>
    <g transform="translate(0 70)">{children}</g>
  </g>
);

/** Donut chart (SVG) — segments as fractions; progress 0..1 sweeps it in */
export const Donut: React.FC<{ x: number; y: number; r?: number; thickness?: number; segments: { value: number; color: string }[]; progress?: number }> = ({ x, y, r = 70, thickness = 26, segments, progress = 1 }) => {
  const total = segments.reduce((a, s) => a + s.value, 0);
  let acc = 0;
  const circ = 2 * Math.PI * r;
  return (
    <g transform={`translate(${x} ${y}) rotate(-90)`}>
      <circle r={r} fill="none" stroke={colors.mint} strokeWidth={thickness} />
      {segments.map((s, i) => {
        const start = acc / total;
        acc += s.value;
        const frac = s.value / total;
        const vis = Math.min(frac, Math.max(0, progress - start));
        if (vis <= 0) return null;
        return <circle key={i} r={r} fill="none" stroke={s.color} strokeWidth={thickness} strokeDasharray={`${vis * circ} ${circ}`} strokeDashoffset={-start * circ} />;
      })}
    </g>
  );
};
