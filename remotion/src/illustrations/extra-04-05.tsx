import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, W } from "../theme";
import { pop, prog } from "../components/anim";
import { SvgText, Check, Coin } from "./index";

/* ------------------------------------------------------------------ */
/* Extra flat primitives used by videos 04 (recipients) and 05 (calc)  */
/* All are SVG fragments unless stated otherwise. Origin conventions    */
/* are noted per primitive.                                             */
/* ------------------------------------------------------------------ */

/** Envelope with a gold seal. Origin centre. ≈ 160×110 at scale 1 */
export const Envelope: React.FC<{ x: number; y: number; scale?: number; color?: string; rotate?: number }> = ({ x, y, scale = 1, color = "#FFF9EC", rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <rect x={-80} y={-55} width={160} height={110} rx={12} fill={color} stroke={colors.brand} strokeWidth={5} />
    <path d="M-80 -45 L0 20 L80 -45" fill="none" stroke={colors.brand} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={0} cy={14} r={18} fill={colors.gold} />
    <circle cx={0} cy={14} r={9} fill={colors.goldDeep} opacity={0.6} />
  </g>
);

/** Arrow from (x,y) pointing at `angle` degrees (0 = right, -90 = up). */
export const Arrow: React.FC<{ x: number; y: number; angle: number; len: number; color?: string; width?: number; opacity?: number; head?: number }> = ({ x, y, angle, len, color = colors.brandSoft, width = 8, opacity = 1, head = 22 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} opacity={opacity}>
    <line x1={0} y1={0} x2={Math.max(0, len - head * 0.6)} y2={0} stroke={color} strokeWidth={width} strokeLinecap="round" />
    <path d={`M${len} 0 L${len - head} ${-head * 0.6} L${len - head} ${head * 0.6} Z`} fill={color} />
  </g>
);

/** Wicker basket. Origin bottom centre. Draw `BasketFront` after contents to occlude them. */
export const Basket: React.FC<{ x: number; y: number; scale?: number; color?: string; label?: string }> = ({ x, y, scale = 1, color = "#C8975B" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-160 -170 L-130 0 L130 0 L160 -170 Z" fill="#B7854C" />
    <ellipse cx={0} cy={-170} rx={160} ry={30} fill="#8C6A3F" />
    <ellipse cx={0} cy={-170} rx={140} ry={20} fill={colors.creamDark} />
    <path d="M-100 -175 Q0 -330 100 -175" fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" />
  </g>
);
export const BasketFront: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({ x, y, scale = 1, color = "#C8975B" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-160 -170 Q-160 -150 -150 -130 L-130 0 L130 0 L150 -130 Q160 -150 160 -170 Q0 -120 -160 -170 Z" fill={color} />
    {[-110, -60, -10, 40, 90].map((bx, i) => (
      <path key={i} d={`M${bx} -145 L${bx + 18} -8`} stroke="#A97A44" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
    ))}
    {[-120, -80, -40].map((by, i) => (
      <path key={i} d={`M-150 ${by} Q0 ${by + 25} 150 ${by}`} fill="none" stroke="#A97A44" strokeWidth={6} opacity={0.6} />
    ))}
    <path d="M-160 -170 Q0 -120 160 -170" fill="none" stroke="#8C6A3F" strokeWidth={12} strokeLinecap="round" />
  </g>
);

/** Chain of links, breaks in the middle: gap 0..1 separates and tilts the halves. Origin centre. */
export const Chain: React.FC<{ x: number; y: number; scale?: number; gap?: number; color?: string }> = ({ x, y, scale = 1, gap = 0, color = "#6B7280" }) => {
  const link = (lx: number, i: number) => (
    <g key={i} transform={`translate(${lx} 0) rotate(${i % 2 ? 90 : 0})`}>
      <rect x={-34} y={-18} width={68} height={36} rx={18} fill="none" stroke={color} strokeWidth={12} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g transform={`translate(${-gap * 90} ${gap * 40}) rotate(${-gap * 25})`}>{[-230, -176, -122, -68].map((lx, i) => link(lx, i))}</g>
      <g transform={`translate(${gap * 90} ${gap * 40}) rotate(${gap * 25})`}>{[68, 122, 176, 230].map((lx, i) => link(lx, i + 1))}</g>
      {/* the broken link: two halves flying apart */}
      <g transform={`translate(${-14 - gap * 160} ${-gap * 120}) rotate(${-gap * 90})`} opacity={1 - gap * 0.3}>
        <path d="M-14 -18 L-14 18 A18 18 0 0 1 -14 -18" fill="none" stroke={color} strokeWidth={12} transform="translate(-6 0)" />
      </g>
      <g transform={`translate(${14 + gap * 160} ${-gap * 120}) rotate(${gap * 90})`} opacity={1 - gap * 0.3}>
        <path d="M14 -18 L14 18 A18 18 0 0 0 14 -18" fill="none" stroke={color} strokeWidth={12} transform="translate(6 0)" />
      </g>
      {gap > 0.2 && (
        <g opacity={Math.min(1, (gap - 0.2) * 3)}>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = -Math.PI / 2 + (i - 2) * 0.5;
            const r = 40 + gap * 90;
            return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r - 10} r={6 + (i % 2) * 3} fill={colors.gold} />;
          })}
        </g>
      )}
    </g>
  );
};

/** Door in a frame; open 0..1 swings the leaf and lets light pour out. Origin bottom centre, ≈ 260 wide, 400 tall. */
export const Door: React.FC<{ x: number; y: number; scale?: number; open?: number; wall?: string; light?: string }> = ({ x, y, scale = 1, open = 0, wall = "#B4A58B", light = "#FFE7A8" }) => {
  const skew = open * 32; // perspective fake
  const w = 180 * (1 - open * 0.55);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* light pouring out */}
      <path d={`M-90 -380 L90 -380 L${90 + open * 260} 0 L${-90 - open * 260} 0 Z`} fill={light} opacity={open * 0.55} />
      <rect x={-130} y={-420} width={260} height={420} rx={14} fill={wall} />
      <rect x={-90} y={-380} width={180} height={380} rx={6} fill={light} opacity={0.4 + open * 0.6} />
      <rect x={-90} y={-380} width={180} height={380} rx={6} fill={colors.brandDeep} opacity={1 - open} />
      {/* leaf */}
      <g transform={`translate(-90 -380) skewY(${-skew})`}>
        <rect x={0} y={0} width={w} height={380} rx={6} fill="#7A5236" />
        <rect x={w * 0.14} y={30} width={w * 0.72} height={140} rx={6} fill="#8F6244" />
        <rect x={w * 0.14} y={200} width={w * 0.72} height={140} rx={6} fill="#8F6244" />
        <circle cx={w * 0.84} cy={190} r={9} fill={colors.gold} />
      </g>
    </g>
  );
};

/** Folder with sheets of paper. heavy 0..1 = how many papers bulge out. Origin centre. */
export const Folder: React.FC<{ x: number; y: number; scale?: number; color?: string; papers?: number; rotate?: number }> = ({ x, y, scale = 1, color = colors.terracotta, papers = 0, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <rect x={-110} y={-90} width={220} height={170} rx={14} fill={color} />
    {Array.from({ length: Math.round(papers) }).map((_, i) => (
      <rect key={i} x={-96 + i * 4} y={-130 - i * 10} width={192} height={130} rx={8} fill="#FFF9EC" stroke="#E6DCC4" strokeWidth={3} transform={`rotate(${(i % 2 ? 1 : -1) * i * 1.5})`} />
    ))}
    <path d="M-110 -40 L-110 -90 Q-110 -104 -96 -104 L-30 -104 L-10 -80 L110 -80 L110 -40 Z" fill={color} />
    <rect x={-110} y={-40} width={220} height={120} rx={14} fill={color} />
    <rect x={-110} y={-40} width={220} height={120} rx={14} fill="rgba(0,0,0,0.08)" />
  </g>
);

/** Clipboard with a list; checks 0..n show ticked rows. Origin centre, ≈ 200×260. */
export const Clipboard: React.FC<{ x: number; y: number; scale?: number; checks?: number; rows?: number }> = ({ x, y, scale = 1, checks = 0, rows = 4 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-100} y={-130} width={200} height={260} rx={16} fill="#8C6A52" />
    <rect x={-88} y={-112} width={176} height={232} rx={10} fill="#FFF9EC" />
    <rect x={-40} y={-144} width={80} height={32} rx={10} fill={colors.ink} />
    {Array.from({ length: rows }).map((_, i) => {
      const ry = -70 + i * 50;
      const done = checks > i;
      return (
        <g key={i}>
          <rect x={-66} y={ry - 14} width={28} height={28} rx={6} fill={done ? colors.brand : "none"} stroke={colors.brand} strokeWidth={4} />
          {done && <path d={`M-60 ${ry} L-54 ${ry + 7} L-44 ${ry - 7}`} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />}
          <rect x={-26} y={ry - 6} width={60 + (i % 3) * 12} height={12} rx={6} fill={colors.mint} />
        </g>
      );
    })}
  </g>
);

/** Road receding to a vanishing point with dashed centre line. Origin: vanishing point at (x, y); road reaches down to `bottom`. */
export const RoadHorizon: React.FC<{ x: number; y: number; bottom: number; halfWidth?: number; color?: string; dashOffset?: number; opacity?: number }> = ({ x, y, bottom, halfWidth = 420, color = "#8A8F9A", dashOffset = 0, opacity = 1 }) => {
  const h = bottom - y;
  const segs = 8;
  return (
    <g opacity={opacity}>
      <path d={`M${x} ${y} L${x + halfWidth} ${bottom} L${x - halfWidth} ${bottom} Z`} fill={color} />
      <path d={`M${x} ${y} L${x + halfWidth * 0.85} ${bottom} L${x - halfWidth * 0.85} ${bottom} Z`} fill="rgba(255,255,255,0.08)" />
      {Array.from({ length: segs }).map((_, i) => {
        const t0 = ((i + dashOffset) % segs) / segs;
        const t1 = Math.min(1, t0 + 0.06);
        const ease = (t: number) => t * t;
        const y0 = y + ease(t0) * h;
        const y1 = y + ease(t1) * h;
        const wmid = 4 + ease(t0) * 18;
        return <path key={i} d={`M${x - wmid * 0.4} ${y0} L${x + wmid * 0.4} ${y0} L${x + wmid} ${y1} L${x - wmid} ${y1} Z`} fill="#FFF3C9" opacity={0.85} />;
      })}
    </g>
  );
};

/** Simple road sign icon (road receding) used in the nuance scene. Origin centre, 140×140. */
export const RoadIcon: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-70} y={-70} width={140} height={140} rx={30} fill="#E8EDF2" stroke="#9AA6B5" strokeWidth={5} />
    <path d="M-10 -40 L10 -40 L50 50 L-50 50 Z" fill="#7B8594" />
    <path d="M-2 -30 L2 -30 L3 -12 L-3 -12 Z M-4 -2 L4 -2 L5 16 L-5 16 Z M-6 26 L6 26 L7 44 L-7 44 Z" fill="#FFF3C9" />
    <path d="M-60 50 L60 50" stroke="#6E8F6B" strokeWidth={8} strokeLinecap="round" />
  </g>
);

/** Festival / fireworks icon. Origin centre, 140×140. t drives sparkle animation. */
export const FestivalIcon: React.FC<{ x: number; y: number; scale?: number; t?: number }> = ({ x, y, scale = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-70} y={-70} width={140} height={140} rx={30} fill="#FBEFD9" stroke="#E0B37A" strokeWidth={5} />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2 + t * 0.2;
      const r = 26 + 10 * Math.sin(t * 0.3 + i);
      return <line key={i} x1={Math.cos(a) * 10} y1={-10 + Math.sin(a) * 10} x2={Math.cos(a) * r} y2={-10 + Math.sin(a) * r} stroke={i % 2 ? colors.terracotta : colors.gold} strokeWidth={6} strokeLinecap="round" />;
    })}
    <circle cx={0} cy={-10} r={8} fill={colors.red} />
    {/* bunting */}
    <path d="M-60 40 Q0 60 60 40" fill="none" stroke="#6E8F6B" strokeWidth={4} />
    {[-40, -14, 12, 38].map((bx, i) => (
      <path key={i} d={`M${bx} ${44 + Math.abs(bx) * -0.12} L${bx + 12} ${62 + Math.abs(bx) * -0.12} L${bx + 24} ${44 + Math.abs(bx) * -0.12} Z`} fill={i % 2 ? colors.terracotta : colors.brandSoft} />
    ))}
  </g>
);

/** School building with a small flag. Origin bottom centre, ≈ 300×240. */
export const School: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-150} y={-170} width={300} height={170} rx={10} fill="#F3E4C8" />
    <path d="M-160 -165 L0 -240 L160 -165 Z" fill={colors.brandSoft} />
    <rect x={-6} y={-300} width={6} height={70} fill="#8C6A52" />
    <path d="M0 -300 L50 -285 L0 -270 Z" fill={colors.terracotta} />
    {[-110, -50, 10, 70].map((wx, i) => (
      <rect key={i} x={wx} y={-140} width={40} height={44} rx={6} fill="#BFDDEB" stroke="#fff" strokeWidth={3} />
    ))}
    <rect x={-32} y={-80} width={64} height={80} rx={6} fill={colors.brandDeep} />
    <rect x={-80} y={-74} width={36} height={36} rx={5} fill="#BFDDEB" stroke="#fff" strokeWidth={3} />
    <rect x={44} y={-74} width={36} height={36} rx={5} fill="#BFDDEB" stroke="#fff" strokeWidth={3} />
  </g>
);

/** Playground swing. Origin bottom centre, ≈ 220×200. swing: angle in degrees. */
export const Playground: React.FC<{ x: number; y: number; scale?: number; swing?: number }> = ({ x, y, scale = 1, swing = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-110 0 L-80 -190 L80 -190 L110 0" fill="none" stroke={colors.terracotta} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
    <g transform={`translate(0 -190) rotate(${swing})`}>
      <line x1={-30} y1={0} x2={-30} y2={130} stroke="#8C6A52" strokeWidth={6} />
      <line x1={30} y1={0} x2={30} y2={130} stroke="#8C6A52" strokeWidth={6} />
      <rect x={-44} y={128} width={88} height={16} rx={8} fill={colors.brand} />
    </g>
    <ellipse cx={0} cy={4} rx={130} ry={14} fill="rgba(0,0,0,0.06)" />
  </g>
);

/** Teacup (piala) with steam. Origin bottom centre. */
export const Teacup: React.FC<{ x: number; y: number; scale?: number; steam?: number; color?: string }> = ({ x, y, scale = 1, steam = 0, color = "#FFFFFF" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={0} cy={0} rx={46} ry={10} fill="rgba(0,0,0,0.08)" />
    <path d="M-50 -70 Q-40 0 0 0 Q40 0 50 -70 Z" fill={color} stroke={colors.brandSoft} strokeWidth={4} />
    <ellipse cx={0} cy={-70} rx={50} ry={14} fill="#C9843F" />
    <ellipse cx={0} cy={-70} rx={50} ry={14} fill="none" stroke={colors.brandSoft} strokeWidth={4} />
    <path d="M-30 -40 Q0 -36 30 -40" fill="none" stroke={colors.brandSoft} strokeWidth={3} opacity={0.6} />
    {[-16, 0, 16].map((sx, i) => (
      <path key={i} d={`M${sx} -90 Q${sx - 8} -110 ${sx} -130 Q${sx + 8} -150 ${sx} -170`} fill="none" stroke="#9FB7BC" strokeWidth={4} strokeLinecap="round" opacity={0.6 * Math.max(0, Math.sin(steam * 0.08 + i))} />
    ))}
  </g>
);

/** Notebook with lines and a pen. Origin centre. */
export const Notebook: React.FC<{ x: number; y: number; scale?: number; rotate?: number; lines?: number }> = ({ x, y, scale = 1, rotate = 0, lines = 3 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <rect x={-110} y={-80} width={220} height={160} rx={14} fill="#FFF9EC" stroke={colors.mint} strokeWidth={5} />
    <rect x={-110} y={-80} width={24} height={160} rx={8} fill={colors.brand} />
    {Array.from({ length: lines }).map((_, i) => (
      <line key={i} x1={-60} y1={-40 + i * 34} x2={40 + (i % 2) * 40} y2={-40 + i * 34} stroke={colors.mint} strokeWidth={9} strokeLinecap="round" />
    ))}
  </g>
);

export const Pen: React.FC<{ x: number; y: number; scale?: number; rotate?: number }> = ({ x, y, scale = 1, rotate = -35 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <rect x={-10} y={-90} width={20} height={150} rx={8} fill={colors.brandDeep} />
    <path d="M-10 60 L0 90 L10 60 Z" fill="#F1C9A5" />
    <rect x={-10} y={-90} width={20} height={26} rx={8} fill={colors.gold} />
  </g>
);

/** Cardboard box of goods. Origin bottom centre, 140×110 */
export const GoodsBox: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-70} y={-110} width={140} height={110} rx={8} fill="#D9B27C" />
    <rect x={-74} y={-116} width={148} height={26} rx={6} fill="#C49A62" />
    <rect x={-10} y={-116} width={20} height={110} fill="#B38350" opacity={0.6} />
    <rect x={-56} y={-70} width={40} height={30} rx={4} fill="#FFF9EC" />
  </g>
);

/** Side-view car. Origin bottom centre, ≈ 240×110 */
export const Car: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({ x, y, scale = 1, color = "#7FA8C9" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-120} y={-70} width={240} height={56} rx={18} fill={color} />
    <path d="M-70 -70 L-45 -112 L55 -112 L85 -70 Z" fill={color} />
    <path d="M-40 -104 L-58 -74 L-6 -74 L-6 -104 Z M8 -104 L8 -74 L70 -74 L50 -104 Z" fill="#DDEEF7" />
    <circle cx={-70} cy={-14} r={22} fill={colors.ink} />
    <circle cx={70} cy={-14} r={22} fill={colors.ink} />
    <circle cx={-70} cy={-14} r={9} fill="#C9D1D9" />
    <circle cx={70} cy={-14} r={9} fill="#C9D1D9" />
  </g>
);

/** Personal things: a shirt and a small bag. Origin centre, ≈ 180×130 */
export const PersonalThings: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-80 -40 L-50 -62 L-20 -62 Q0 -44 20 -62 L50 -62 L80 -40 L62 -14 L48 -22 L48 60 L-48 60 L-48 -22 L-62 -14 Z" fill="#8FB0D1" />
    <rect x={40} y={-10} width={70} height={70} rx={12} fill={colors.terracotta} />
    <path d="M55 -10 Q75 -40 95 -10" fill="none" stroke={colors.terracotta} strokeWidth={8} />
  </g>
);

/** Gentle strike-through: two soft red strokes across a w×h box centred at (x,y). progress 0..1 */
export const Strike: React.FC<{ x: number; y: number; w: number; progress: number; color?: string }> = ({ x, y, w, progress, color = colors.red }) => {
  const p = Math.max(0, Math.min(1, progress));
  const half = w / 2;
  return (
    <g opacity={0.75}>
      <line x1={x - half} y1={y} x2={x - half + w * p} y2={y} stroke={color} strokeWidth={10} strokeLinecap="round" />
    </g>
  );
};

/** Bread loaf + water bottle gift. Origin centre. */
export const BreadAndWater: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={-30} cy={10} rx={46} ry={26} fill="#D9A24A" />
    <path d="M-62 2 Q-30 -10 2 2" fill="none" stroke="#B9821F" strokeWidth={4} />
    <rect x={30} y={-40} width={36} height={76} rx={12} fill="#7FB3D5" />
    <rect x={38} y={-54} width={20} height={18} rx={5} fill={colors.brandSoft} />
  </g>
);

/** Small ornamental Qur'an page (no text): book with geometric ornament. Origin centre, 320×220 */
export const OrnamentBook: React.FC<{ x: number; y: number; scale?: number; open?: number }> = ({ x, y, scale = 1, open = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <g transform={`scale(${0.2 + 0.8 * open} 1)`}>
      <path d="M-170 -100 Q-85 -122 0 -100 L0 110 Q-85 88 -170 110 Z" fill="#FFF9EC" stroke={colors.brand} strokeWidth={8} strokeLinejoin="round" />
      <path d="M170 -100 Q85 -122 0 -100 L0 110 Q85 88 170 110 Z" fill="#FFF9EC" stroke={colors.brand} strokeWidth={8} strokeLinejoin="round" />
      {/* ornament: frames + eight-pointed stars */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${side * 85} 5)`} opacity={open}>
          <rect x={-58} y={-78} width={116} height={160} rx={10} fill="none" stroke={colors.gold} strokeWidth={5} />
          <g transform="rotate(45)">
            <rect x={-26} y={-26} width={52} height={52} fill="none" stroke={colors.gold} strokeWidth={5} />
          </g>
          <rect x={-26} y={-26} width={52} height={52} fill="none" stroke={colors.gold} strokeWidth={5} />
          <circle r={9} fill={colors.brand} />
          <line x1={-40} y1={-56} x2={40} y2={-56} stroke={colors.mint} strokeWidth={6} strokeLinecap="round" />
          <line x1={-40} y1={58} x2={40} y2={58} stroke={colors.mint} strokeWidth={6} strokeLinecap="round" />
        </g>
      ))}
    </g>
  </g>
);

/** Speech bubble with a question mark (or any text). Origin: tail tip at (x, y). */
export const Bubble: React.FC<{ x: number; y: number; text: string; scale?: number; color?: string; textColor?: string; flip?: boolean }> = ({ x, y, text, scale = 1, color = "#FFFFFF", textColor = colors.brandDeep, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    <path d="M0 0 L20 -40 L60 -40 Q0 -40 0 0" fill={color} />
    <rect x={-10} y={-140} width={140} height={110} rx={34} fill={color} stroke={colors.mint} strokeWidth={4} />
    <path d="M0 0 L26 -36 L70 -36 Z" fill={color} />
    <g transform={`translate(60 -72) scale(${flip ? -1 : 1} 1)`}>
      <SvgText x={0} y={22} size={64} weight={900} color={textColor}>
        {text}
      </SvgText>
    </g>
  </g>
);

/* ------------------------------------------------------------------ */
/* Composite components (use hooks)                                     */
/* ------------------------------------------------------------------ */

/** Necklace of 8 slots along a shallow arc (video 04). `filled` = how many are filled, `appear` = frame each new slot lights up. */
export const Necklace: React.FC<{ filled: number; appearAt?: number[]; y?: number; highlight?: number[]; opacity?: number; compact?: boolean }> = ({ filled, appearAt = [], y = 1165, highlight = [], opacity = 1 }) => {
  const frame = useCurrentFrame();
  const n = 8;
  const pts = Array.from({ length: n }).map((_, i) => {
    const u = i / (n - 1);
    const x = 150 + u * (W - 300);
    const yy = y - Math.sin(u * Math.PI) * 26;
    return { x, y: yy };
  });
  return (
    <g opacity={opacity}>
      <path d={`M${pts[0].x} ${pts[0].y} ${pts.slice(1).map((p, i) => `Q${(pts[i].x + p.x) / 2} ${(pts[i].y + p.y) / 2 - 6} ${p.x} ${p.y}`).join(" ")}`} fill="none" stroke={colors.goldDeep} strokeWidth={5} opacity={0.5} />
      {pts.map((p, i) => {
        const isFilled = i < filled;
        const at = appearAt[i] ?? 0;
        const s = isFilled ? pop(frame, at, { damping: 12, stiffness: 140 }) : 1;
        const hl = highlight.includes(i) ? 0.5 + 0.5 * Math.sin(frame / 8) : 0;
        return (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <circle r={40} fill="#fff" opacity={0.9} />
            <circle r={36} fill={isFilled ? colors.gold : colors.creamDark} stroke={isFilled ? colors.goldDeep : colors.sand} strokeWidth={4} transform={`scale(${isFilled ? 0.7 + 0.3 * s : 1})`} />
            {hl > 0 && <circle r={46} fill="none" stroke={colors.gold} strokeWidth={5} opacity={hl * 0.8} />}
            <SvgText x={0} y={13} size={36} weight={900} color={isFilled ? colors.brandDeep : "#B9AF9A"} opacity={isFilled ? s : 0.8}>
              {String(i + 1)}
            </SvgText>
          </g>
        );
      })}
    </g>
  );
};

/** Step indicator for video 05: 5 circles. `step` (1..5) is the active one; completed steps show checks. */
export const StepIndicator: React.FC<{ step: number; delay?: number; y?: number; dark?: boolean }> = ({ step, delay = 0, y = 470, dark = false }) => {
  const frame = useCurrentFrame();
  const n = 5;
  const gap = 150;
  const x0 = W / 2 - (gap * (n - 1)) / 2;
  const lineColor = dark ? "rgba(255,255,255,0.35)" : colors.sand;
  const ringP = prog(frame, delay, delay + 20);
  return (
    <g>
      <line x1={x0} y1={y} x2={x0 + gap * (n - 1)} y2={y} stroke={lineColor} strokeWidth={6} strokeLinecap="round" />
      <line x1={x0} y1={y} x2={x0 + gap * Math.max(0, step - 1) * ringP + gap * Math.max(0, step - 1) * (1 - ringP) * 0} y2={y} stroke={colors.brand} strokeWidth={6} strokeLinecap="round" />
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + i * gap;
        const done = i + 1 < step;
        const active = i + 1 === step;
        const s = active ? pop(frame, delay, { damping: 10, stiffness: 150 }) : 1;
        const pulse = active ? 1 + 0.06 * Math.sin(frame / 7) : 1;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${(0.8 + 0.2 * s) * pulse})`}>
            {active && <circle r={44} fill={colors.gold} opacity={0.25} />}
            <circle r={30} fill={done ? colors.brand : active ? colors.gold : dark ? "rgba(255,255,255,0.12)" : colors.cream} stroke={done || active ? "none" : lineColor} strokeWidth={5} />
            {done ? (
              <Check x={0} y={0} r={30} color={colors.brand} />
            ) : (
              <SvgText x={0} y={11} size={32} weight={900} color={active ? colors.brandDeep : dark ? "#DCE6EE" : "#B9AF9A"}>
                {String(i + 1)}
              </SvgText>
            )}
          </g>
        );
      })}
    </g>
  );
};

/** Schematic calculator screen content for <Phone>. Coordinates: 0..420 × 0..860 */
export const CalculatorScreen: React.FC<{ title: string; value: string; result: string; resultLabel: string; reveal?: number }> = ({ title, value, result, resultLabel, reveal = 1 }) => (
  <g>
    <rect x={0} y={0} width={420} height={120} fill={colors.brand} />
    <rect x={0} y={0} width={420} height={860} fill="none" />
    <SvgText x={210} y={80} size={34} weight={900} color="#fff">
      {title}
    </SvgText>
    <rect x={30} y={150} width={360} height={110} rx={18} fill={colors.mintLight} stroke={colors.mint} strokeWidth={3} />
    <SvgText x={360} y={222} size={48} weight={900} color={colors.brandDeep} anchor="end">
      {value}
    </SvgText>
    <SvgText x={50} y={190} size={22} weight={700} color={colors.inkSoft} anchor="start">
      × 2,5 %
    </SvgText>
    <rect x={30} y={290} width={360} height={110} rx={18} fill={colors.gold} opacity={reveal} />
    <SvgText x={50} y={330} size={22} weight={700} color={colors.brandDeep} anchor="start" opacity={reveal}>
      {resultLabel}
    </SvgText>
    <SvgText x={360} y={372} size={48} weight={900} color={colors.brandDeep} anchor="end" opacity={reveal}>
      {result}
    </SvgText>
    {Array.from({ length: 12 }).map((_, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      return <rect key={i} x={30 + col * 125} y={440 + row * 100} width={110} height={82} rx={16} fill={row === 3 && col === 2 ? colors.brand : colors.mintLight} stroke={colors.mint} strokeWidth={3} />;
    })}
    {Array.from({ length: 9 }).map((_, i) => (
      <SvgText key={i} x={85 + (i % 3) * 125} y={494 + Math.floor(i / 3) * 100} size={34} weight={800} color={colors.brandDeep}>
        {String(i + 1)}
      </SvgText>
    ))}
    <SvgText x={85} y={794} size={34} weight={800} color={colors.brandDeep}>
      0
    </SvgText>
    <SvgText x={210} y={794} size={34} weight={800} color={colors.brandDeep}>
      ,
    </SvgText>
    <SvgText x={335} y={794} size={34} weight={800} color="#fff">
      =
    </SvgText>
  </g>
);

/** Thin flowing stream (bezier) that draws itself; `p` 0..1 draws, `flow` offsets dashes to animate. */
export const Stream: React.FC<{ d: string; color?: string; width?: number; p?: number; flow?: number; opacity?: number }> = ({ d, color = colors.brand, width = 16, p = 1, flow = 0, opacity = 1 }) => (
  <g opacity={opacity}>
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} opacity={0.35} />
    <path d={d} fill="none" stroke={color} strokeWidth={width * 0.45} strokeLinecap="round" pathLength={1} strokeDasharray={`0.06 0.08`} strokeDashoffset={-flow} opacity={p > 0.95 ? 0.9 : 0} />
  </g>
);

/** Coin dot helper for streams */
export const StreamCoin: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 14 }) => <Coin x={x} y={y} r={r} />;
