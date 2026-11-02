import React from "react";
import { colors } from "../theme";

/* Extra flat primitives for videos 02 (sadaqa) and 03 (sadaqa jariya). SVG fragments — wrap in <Canvas>. */

/** Small golden flame / "light of a good deed" */
export const Flame: React.FC<{ x: number; y: number; scale?: number; opacity?: number; color?: string }> = ({ x, y, scale = 1, opacity = 1, color = colors.gold }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
    <circle r={46} fill={color} opacity={0.18} />
    <path d="M0 -40 C 18 -22 26 -6 26 8 A26 26 0 0 1 -26 8 C -26 -6 -18 -22 0 -40 Z" fill={color} />
    <path d="M0 -14 C 8 -6 12 2 12 9 A12 12 0 0 1 -12 9 C -12 2 -8 -6 0 -14 Z" fill="#FFF3CF" />
  </g>
);

/** Round flat bread (nan). half: 0 = whole, 1 = split into two halves moving apart */
export const Bread: React.FC<{ x: number; y: number; scale?: number; split?: number }> = ({ x, y, scale = 1, split = 0 }) => {
  const gap = split * 26;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g transform={`translate(${-gap} 0)`}>
        <path d="M0 -44 A44 44 0 0 0 0 44 Z" fill="#E2B274" />
        <path d="M0 -28 A28 28 0 0 0 0 28 Z" fill="#D29B5A" />
        <circle cx={-14} cy={-10} r={3} fill="#B9803F" />
        <circle cx={-18} cy={10} r={3} fill="#B9803F" />
      </g>
      <g transform={`translate(${gap} 0)`}>
        <path d="M0 -44 A44 44 0 0 1 0 44 Z" fill="#E2B274" />
        <path d="M0 -28 A28 28 0 0 1 0 28 Z" fill="#D29B5A" />
        <circle cx={14} cy={-10} r={3} fill="#B9803F" />
        <circle cx={18} cy={10} r={3} fill="#B9803F" />
      </g>
    </g>
  );
};

export const Apple: React.FC<{ x: number; y: number; r?: number; color?: string }> = ({ x, y, r = 16, color = "#D9534F" }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={color} />
    <path d={`M0 ${-r * 0.8} L${r * 0.15} ${-r * 1.35}`} stroke="#6B4F3A" strokeWidth={r * 0.18} strokeLinecap="round" />
    <ellipse cx={r * 0.45} cy={-r * 1.1} rx={r * 0.45} ry={r * 0.22} fill="#5E9E6E" transform={`rotate(-30 ${r * 0.45} ${-r * 1.1})`} />
  </g>
);

/** Basket with apples. Origin at the bottom centre. */
export const Basket: React.FC<{ x: number; y: number; scale?: number; apples?: number }> = ({ x, y, scale = 1, apples = 5 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-60 -90 Q0 -150 60 -90" fill="none" stroke="#8C6A52" strokeWidth={10} strokeLinecap="round" />
    {Array.from({ length: apples }).map((_, i) => (
      <Apple key={i} x={-40 + (i % 3) * 40 + (i > 2 ? 20 : 0)} y={-78 - Math.floor(i / 3) * 24} r={15} color={i % 2 ? "#D9534F" : "#E8A33D"} />
    ))}
    <path d="M-80 -70 L-66 0 L66 0 L80 -70 Z" fill="#C9955B" />
    <path d="M-80 -70 L80 -70" stroke="#A66E3F" strokeWidth={8} />
    <path d="M-72 -40 L72 -40 M-68 -20 L68 -20" stroke="#A66E3F" strokeWidth={4} opacity={0.6} />
  </g>
);

/** Picket fence. Origin at ground level, drawn from x to x+width */
export const Fence: React.FC<{ x: number; y: number; width: number; height?: number; color?: string }> = ({ x, y, width, height = 110, color = "#D9C7A6" }) => {
  const n = Math.max(2, Math.floor(width / 46));
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={-height * 0.75} width={width} height={14} fill={color} />
      <rect x={0} y={-height * 0.35} width={width} height={14} fill={color} />
      {Array.from({ length: n }).map((_, i) => (
        <g key={i} transform={`translate(${i * (width / (n - 1))} 0)`}>
          <rect x={-10} y={-height} width={20} height={height} rx={4} fill={color} />
          <path d={`M-10 ${-height} L0 ${-height - 14} L10 ${-height} Z`} fill={color} />
        </g>
      ))}
    </g>
  );
};

/** Minibus (marshrutka). Origin at the bottom centre. */
export const Minibus: React.FC<{ x: number; y: number; scale?: number; color?: string; flip?: boolean }> = ({ x, y, scale = 1, color = "#E8E4DA", flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    <rect x={-150} y={-150} width={300} height={130} rx={26} fill={color} />
    <path d="M90 -150 Q150 -150 150 -90 L150 -20 L90 -20 Z" fill={color} />
    <rect x={-150} y={-70} width={300} height={16} fill={colors.brandSoft} />
    {[-130, -70, -10, 50].map((wx, i) => (
      <rect key={i} x={wx} y={-134} width={50} height={46} rx={8} fill="#9FC3D6" />
    ))}
    <path d="M100 -134 Q140 -134 140 -92 L140 -88 L100 -88 Z" fill="#9FC3D6" />
    <circle cx={-85} cy={-20} r={28} fill={colors.ink} />
    <circle cx={-85} cy={-20} r={12} fill="#9A9A90" />
    <circle cx={85} cy={-20} r={28} fill={colors.ink} />
    <circle cx={85} cy={-20} r={12} fill="#9A9A90" />
    <rect x={140} y={-60} width={14} height={16} rx={4} fill={colors.gold} />
  </g>
);

/** Road strip with dashed centre line and optional zebra crossing at crossingX */
export const Road: React.FC<{ y: number; height?: number; crossingX?: number; width?: number }> = ({ y, height = 130, crossingX, width = 1080 }) => (
  <g>
    <rect x={0} y={y} width={width} height={height} fill="#5A5F66" />
    <line x1={0} y1={y + height / 2} x2={width} y2={y + height / 2} stroke="#F3E4C8" strokeWidth={6} strokeDasharray="40 30" />
    {crossingX !== undefined &&
      [0, 1, 2, 3, 4].map((i) => <rect key={i} x={crossingX - 90 + i * 40} y={y + 10} width={24} height={height - 20} fill="#F3E4C8" opacity={0.9} />)}
  </g>
);

/** Shopping bag. Origin at bottom centre. */
export const Bag: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({ x, y, scale = 1, color = "#C98BA4" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-28 -90 Q0 -130 28 -90" fill="none" stroke={colors.ink} strokeWidth={6} />
    <path d="M-40 -90 L-34 0 L34 0 L40 -90 Z" fill={color} />
    <rect x={-20} y={-60} width={40} height={30} rx={6} fill="#fff" opacity={0.5} />
    <ellipse cx={-6} cy={-96} rx={14} ry={10} fill="#5E9E6E" />
    <rect x={6} y={-108} width={14} height={20} rx={4} fill="#E2B274" />
  </g>
);

/** Ladder leaning. Origin at foot. */
export const Ladder: React.FC<{ x: number; y: number; height?: number; angle?: number; color?: string }> = ({ x, y, height = 320, angle = -15, color = "#B97A48" }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <rect x={-40} y={-height} width={12} height={height} rx={6} fill={color} />
    <rect x={28} y={-height} width={12} height={height} rx={6} fill={color} />
    {Array.from({ length: Math.floor(height / 50) }).map((_, i) => (
      <rect key={i} x={-34} y={-30 - i * 50} width={68} height={10} rx={5} fill={color} />
    ))}
  </g>
);

export const Bulb: React.FC<{ x: number; y: number; scale?: number; on?: number }> = ({ x, y, scale = 1, on = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle r={90} fill={colors.gold} opacity={0.3 * on} />
    <circle r={60} fill={colors.gold} opacity={0.3 * on} />
    <circle r={38} fill={on > 0.5 ? "#FFE28A" : "#E9E4D6"} stroke={colors.goldDeep} strokeWidth={4} />
    <rect x={-16} y={30} width={32} height={26} rx={6} fill="#9A9A90" />
    <rect x={-12} y={56} width={24} height={8} rx={4} fill="#6E6E66" />
    <path d="M-10 20 L-6 0 L6 0 L10 20" fill="none" stroke={colors.goldDeep} strokeWidth={3} />
    {on > 0.5 &&
      [0, 1, 2, 3, 4].map((i) => {
        const a = -Math.PI * 0.9 + (i / 4) * Math.PI * 0.8;
        return <line key={i} x1={Math.cos(a) * 52} y1={Math.sin(a) * 52} x2={Math.cos(a) * 72} y2={Math.sin(a) * 72} stroke={colors.gold} strokeWidth={6} strokeLinecap="round" opacity={on} />;
      })}
  </g>
);

/** Speech bubble; children drawn centred at (0,0) inside the bubble */
export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; tail?: "left" | "right" | "bottom"; color?: string; children?: React.ReactNode }> = ({ x, y, w, h, tail = "bottom", color = "#FFFFFF", children }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(40, h / 2)} fill={color} stroke={colors.mint} strokeWidth={4} />
    {tail === "bottom" && <path d={`M-20 ${h / 2 - 4} L0 ${h / 2 + 34} L30 ${h / 2 - 4} Z`} fill={color} />}
    {tail === "left" && <path d={`M${-w / 2 + 4} 10 L${-w / 2 - 34} 40 L${-w / 2 + 4} 40 Z`} fill={color} />}
    {tail === "right" && <path d={`M${w / 2 - 4} 10 L${w / 2 + 34} 40 L${w / 2 - 4} 40 Z`} fill={color} />}
    {children}
  </g>
);

/** Water jug. Origin at bottom centre. level 0..1 fills the body; tilt (deg, positive = pour to the left). */
export const Jug: React.FC<{ x: number; y: number; scale?: number; level?: number; tilt?: number; id: string; frame?: number }> = ({ x, y, scale = 1, level = 0.7, tilt = 0, id, frame = 0 }) => {
  const h = 220;
  const waterTop = -h * level;
  const wave = Array.from({ length: 9 })
    .map((_, i) => {
      const wx = -90 + i * 22.5;
      const wy = waterTop + Math.sin(frame / 6 + i) * 4;
      return `${i === 0 ? "M" : "L"}${wx} ${wy}`;
    })
    .join(" ");
  return (
    <g transform={`translate(${x} ${y}) rotate(${-tilt} 0 -110) scale(${scale})`}>
      <defs>
        <clipPath id={`jug-${id}`}>
          <path d="M-70 0 L-82 -150 Q-82 -205 -30 -220 L30 -220 Q82 -205 82 -150 L70 0 Z" />
        </clipPath>
      </defs>
      {/* handle */}
      <path d="M72 -170 Q140 -160 118 -60 Q108 -36 62 -40" fill="none" stroke="#8FB7CD" strokeWidth={16} strokeLinecap="round" />
      {/* body */}
      <path d="M-70 0 L-82 -150 Q-82 -205 -30 -220 L30 -220 Q82 -205 82 -150 L70 0 Z" fill="#DCEEF6" stroke="#8FB7CD" strokeWidth={6} />
      <g clipPath={`url(#jug-${id})`}>
        <path d={`${wave} L90 ${waterTop} L90 10 L-90 10 Z`} fill="#7FB3D5" />
        <path d={`${wave} L90 ${waterTop}`} fill="none" stroke="#A9D2EA" strokeWidth={6} />
      </g>
      {/* spout */}
      <path d="M-50 -214 L-100 -250 L-36 -236 Z" fill="#DCEEF6" stroke="#8FB7CD" strokeWidth={6} strokeLinejoin="round" />
      <rect x={-56} y={-26} width={112} height={10} rx={5} fill="#8FB7CD" opacity={0.6} />
      {/* ornament band */}
      <path d="M-74 -120 L74 -120" stroke={colors.gold} strokeWidth={5} opacity={0.8} />
      {[-40, 0, 40].map((dx) => (
        <path key={dx} d={`M${dx} -140 L${dx + 12} -128 L${dx} -116 L${dx - 12} -128 Z`} fill={colors.gold} opacity={0.8} />
      ))}
    </g>
  );
};

/** Drinking cup. Origin at the bottom centre. fill 0..1 */
export const Cup: React.FC<{ x: number; y: number; scale?: number; fill?: number; id: string; color?: string }> = ({ x, y, scale = 1, fill = 0, id, color = "#F6F1E6" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <defs>
      <clipPath id={`cup-${id}`}>
        <path d="M-40 0 L-50 -84 L50 -84 L40 0 Z" />
      </clipPath>
    </defs>
    <path d="M-40 0 L-50 -84 L50 -84 L40 0 Z" fill={color} stroke="#8FB7CD" strokeWidth={5} strokeLinejoin="round" />
    <g clipPath={`url(#cup-${id})`}>
      <rect x={-60} y={-80 * fill} width={120} height={100} fill="#7FB3D5" />
      <rect x={-60} y={-80 * fill} width={120} height={5} fill="#A9D2EA" />
    </g>
    <path d="M-44 -62 L44 -62" stroke={colors.gold} strokeWidth={4} opacity={0.8} />
  </g>
);

/** Water stream from (x1,y1) to (x2,y2); frame animates the flow */
export const Stream: React.FC<{ x1: number; y1: number; x2: number; y2: number; frame?: number; opacity?: number; width?: number }> = ({ x1, y1, x2, y2, frame = 0, opacity = 1, width = 12 }) => (
  <g opacity={opacity}>
    <path d={`M${x1} ${y1} Q${x1 - 10} ${(y1 + y2) / 2} ${x2} ${y2}`} fill="none" stroke="#7FB3D5" strokeWidth={width} strokeLinecap="round" />
    <path d={`M${x1} ${y1} Q${x1 - 10} ${(y1 + y2) / 2} ${x2} ${y2}`} fill="none" stroke="#C9E6F4" strokeWidth={width * 0.4} strokeLinecap="round" strokeDasharray="14 22" strokeDashoffset={-frame * 4} />
  </g>
);

/** Book shelf plank with coloured books. count = books shown (0..max). Origin at the plank's left end. */
export const Shelf: React.FC<{ x: number; y: number; width: number; count: number; max?: number; seed?: number }> = ({ x, y, width, count, max = 9, seed = 0 }) => {
  const palette = [colors.brand, colors.terracotta, colors.gold, "#3F6B8E", "#6E8F6B", "#C98BA4", colors.brandSoft, "#B97A48", "#7FB3D5"];
  const bw = (width - 24) / max;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-6} y={0} width={width + 12} height={16} rx={6} fill="#8C6A52" />
      {Array.from({ length: Math.max(0, Math.min(max, count)) }).map((_, i) => {
        const h = 90 + ((i * 37 + seed * 11) % 40);
        return <rect key={i} x={12 + i * bw} y={-h} width={bw - 8} height={h} rx={5} fill={palette[(i + seed) % palette.length]} />;
      })}
    </g>
  );
};

export const Blackboard: React.FC<{ x: number; y: number; w?: number; h?: number; chalk?: number }> = ({ x, y, w = 300, h = 180, chalk = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2 - 12} y={-h / 2 - 12} width={w + 24} height={h + 24} rx={12} fill="#B97A48" />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill="#2F5D4A" />
    <line x1={-w / 2 + 30} y1={-h / 2 + 50} x2={-w / 2 + 30 + (w - 60) * Math.min(1, chalk * 2)} y2={-h / 2 + 50} stroke="#F3E4C8" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
    <line x1={-w / 2 + 30} y1={-h / 2 + 100} x2={-w / 2 + 30 + (w - 120) * Math.max(0, Math.min(1, chalk * 2 - 1))} y2={-h / 2 + 100} stroke="#F3E4C8" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
    <rect x={-w / 2 + 20} y={h / 2 - 8} width={60} height={10} rx={4} fill="#F3E4C8" />
  </g>
);

/** Simple table/desk. Origin at the table-top centre. */
export const Table: React.FC<{ x: number; y: number; w?: number; h?: number; color?: string; legs?: boolean }> = ({ x, y, w = 360, h = 30, color = "#B97A48", legs = true }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={0} width={w} height={h} rx={10} fill={color} />
    {legs && (
      <g>
        <rect x={-w / 2 + 20} y={h} width={22} height={120} rx={6} fill="#8C5A32" />
        <rect x={w / 2 - 42} y={h} width={22} height={120} rx={6} fill="#8C5A32" />
      </g>
    )}
  </g>
);

export const Brick: React.FC<{ x: number; y: number; w?: number; h?: number; color?: string; opacity?: number }> = ({ x, y, w = 120, h = 56, color = "#D08A5E", opacity = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={color} />
    <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h / 3} rx={6} fill="#fff" opacity={0.14} />
  </g>
);

/** Standpipe / tap with running water. Origin at ground. flow 0..1 */
export const Tap: React.FC<{ x: number; y: number; scale?: number; flow?: number; frame?: number }> = ({ x, y, scale = 1, flow = 1, frame = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-14} y={-150} width={28} height={150} rx={8} fill="#8FA5B5" />
    <rect x={-14} y={-150} width={80} height={24} rx={10} fill="#8FA5B5" />
    <rect x={50} y={-140} width={18} height={40} rx={6} fill="#8FA5B5" />
    <rect x={-30} y={-176} width={32} height={14} rx={6} fill={colors.terracotta} />
    {flow > 0 && (
      <g opacity={flow}>
        <rect x={53} y={-100} width={12} height={100} rx={6} fill="#7FB3D5" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={59} cy={-100 + ((frame * 6 + i * 33) % 100)} r={4} fill="#C9E6F4" />
        ))}
        <ellipse cx={59} cy={0} rx={50} ry={10} fill="#7FB3D5" opacity={0.7} />
      </g>
    )}
    <ellipse cx={0} cy={0} rx={30} ry={8} fill="#6E6E66" opacity={0.5} />
  </g>
);

/** Half of a date fruit on light */
export const HalfDate: React.FC<{ x: number; y: number; scale?: number; glow?: number }> = ({ x, y, scale = 1, glow = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle r={120} fill={colors.gold} opacity={0.22 * glow} />
    <circle r={80} fill={colors.gold} opacity={0.22 * glow} />
    <path d="M0 -70 A44 70 0 0 0 0 70 Z" fill="#5A3A26" />
    <path d="M0 -70 A44 70 0 0 0 0 70" fill="none" stroke="#8A5A3A" strokeWidth={6} />
    <ellipse cx={-10} cy={0} rx={10} ry={34} fill="#C9A26A" />
    <path d="M0 -70 L0 70" stroke="#8A5A3A" strokeWidth={4} />
  </g>
);

/** Empty portrait frame with warm light (no face) */
export const LightFrame: React.FC<{ x: number; y: number; scale?: number; glow?: number }> = ({ x, y, scale = 1, glow = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-60} y={-76} width={120} height={152} rx={10} fill={colors.goldDeep} />
    <rect x={-48} y={-64} width={96} height={128} rx={6} fill="#FFF4D6" />
    <circle r={40} fill={colors.gold} opacity={0.5 * glow} />
    <circle r={22} fill="#FFF9E5" opacity={glow} />
  </g>
);

/** Twinkling stars (pass the frame) */
export const Stars: React.FC<{ frame: number; count?: number; maxY?: number; color?: string }> = ({ frame, count = 40, maxY = 900, color = "#fff" }) => (
  <g>
    {Array.from({ length: count }).map((_, i) => {
      const sx = (i * 263 + 97) % 1080;
      const sy = 40 + ((i * 157 + 31) % maxY);
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 25 + i * 1.7));
      return <circle key={i} cx={sx} cy={sy} r={2.5} fill={color} opacity={tw * 0.8} />;
    })}
  </g>
);

/** Falling autumn leaves (pass the frame). Screen coordinates. */
export const Leaves: React.FC<{ frame: number; count?: number; top?: number; bottom?: number }> = ({ frame, count = 14, top = 380, bottom = 1240 }) => (
  <g>
    {Array.from({ length: count }).map((_, i) => {
      const seed = (i * 7919 + 13) % 1000;
      const period = 240 + (seed % 120);
      const p = ((frame + seed) % period) / period;
      const x = (seed * 1.08 + Math.sin(frame / 30 + i) * 40) % 1080;
      const y = top + p * (bottom - top);
      const col = ["#D9A24A", "#C9774B", "#B9821F", "#8F5E3C"][i % 4];
      return <ellipse key={i} cx={x} cy={y} rx={12} ry={7} fill={col} opacity={0.9 * Math.sin(p * Math.PI)} transform={`rotate(${frame * 3 + i * 40} ${x} ${y})`} />;
    })}
  </g>
);

/** Small calendar icon */
export const CalendarIcon: React.FC<{ x: number; y: number; scale?: number; label?: string }> = ({ x, y, scale = 1, label }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-40} y={-40} width={80} height={80} rx={12} fill="#fff" stroke={colors.brandDeep} strokeWidth={5} />
    <rect x={-40} y={-40} width={80} height={22} rx={10} fill={colors.brandDeep} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={-28 + (i % 3) * 20} y={-6 + Math.floor(i / 3) * 18} width={14} height={12} rx={3} fill={colors.mint} />
    ))}
    {label && (
      <text y={26} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={900} fontSize={30} fill={colors.brandDeep}>
        {label}
      </text>
    )}
  </g>
);

/** Clock icon; hands rotate with frame */
export const ClockIcon: React.FC<{ x: number; y: number; r?: number; frame?: number }> = ({ x, y, r = 40, frame = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#fff" stroke={colors.goldDeep} strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => (
      <circle key={i} cx={Math.cos((i / 4) * Math.PI * 2) * r * 0.78} cy={Math.sin((i / 4) * Math.PI * 2) * r * 0.78} r={3} fill={colors.goldDeep} />
    ))}
    <line x1={0} y1={0} x2={Math.cos(frame / 20 - Math.PI / 2) * r * 0.62} y2={Math.sin(frame / 20 - Math.PI / 2) * r * 0.62} stroke={colors.goldDeep} strokeWidth={5} strokeLinecap="round" />
    <line x1={0} y1={0} x2={Math.cos(frame / 240 - Math.PI / 2) * r * 0.42} y2={Math.sin(frame / 240 - Math.PI / 2) * r * 0.42} stroke={colors.goldDeep} strokeWidth={6} strokeLinecap="round" />
    <circle r={5} fill={colors.goldDeep} />
  </g>
);

/** Eight-point star ornament (geometric, non-figurative) */
export const StarOrnament: React.FC<{ x: number; y: number; r?: number; color?: string; opacity?: number; rotate?: number }> = ({ x, y, r = 40, color = colors.gold, opacity = 1, rotate = 0 }) => {
  const pts = Array.from({ length: 16 })
    .map((_, i) => {
      const a = (i / 16) * Math.PI * 2;
      const rr = i % 2 === 0 ? r : r * 0.55;
      return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
    })
    .join(" ");
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
      <polygon points={pts} fill={color} />
      <circle r={r * 0.22} fill="#FFF9E5" />
    </g>
  );
};
