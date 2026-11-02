import React from "react";
import { colors } from "../theme";
import { pop, prog, clamp01 } from "../components/anim";
import { Check, SvgText } from "./Objects";
import { Mosque } from "./Buildings";

/* ------------------------------------------------------------------ */
/* Extra flat primitives for videos 06 (how Zeket works) and 07 (ushr) */
/* All are SVG fragments — render inside <Canvas>.                     */
/* ------------------------------------------------------------------ */

/** 5-step progress indicator (video 06). `current` is 1-based; frame = scene frame. */
export const StepBar: React.FC<{ current: number; frame: number; y?: number; total?: number; dark?: boolean }> = ({ current, frame, y = 480, total = 5, dark = false }) => {
  const xs = Array.from({ length: total }).map((_, i) => 180 + i * 180);
  const lineFill = prog(frame, 8, 34);
  const pulse = 1 + 0.06 * Math.sin(frame / 9);
  const future = dark ? "rgba(255,255,255,0.55)" : "#FFFFFF";
  const stroke = dark ? "rgba(255,255,255,0.7)" : colors.mint;
  return (
    <g>
      {/* track */}
      <line x1={xs[0]} y1={y} x2={xs[total - 1]} y2={y} stroke={stroke} strokeWidth={10} strokeLinecap="round" />
      {/* filled part up to current step */}
      {current > 1 && (
        <line x1={xs[0]} y1={y} x2={xs[current - 2] + (xs[current - 1] - xs[current - 2]) * lineFill} y2={y} stroke={colors.brand} strokeWidth={10} strokeLinecap="round" />
      )}
      {xs.map((x, i) => {
        const n = i + 1;
        const done = n < current;
        const cur = n === current;
        const s = pop(frame, 2 + i * 4, { damping: 14, stiffness: 120 });
        const fill = done ? colors.brand : cur ? colors.gold : future;
        const txt = done || cur ? "#FFFFFF" : dark ? colors.brandDeep : colors.inkSoft;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s * (cur ? pulse : 1)})`}>
            {cur && <circle r={58} fill={colors.gold} opacity={0.25} />}
            <circle r={40} fill={fill} stroke={done || cur ? "transparent" : stroke} strokeWidth={6} />
            {done ? <Check x={0} y={0} r={40} color={colors.brand} /> : (
              <SvgText x={0} y={15} size={44} weight={900} color={txt}>
                {String(n)}
              </SvgText>
            )}
          </g>
        );
      })}
    </g>
  );
};

/** Grain sack. Origin at bottom centre, height ≈ 150 at scale 1. */
export const Sack: React.FC<{ x: number; y: number; scale?: number; color?: string; highlight?: boolean }> = ({ x, y, scale = 1, color = "#D9B27A", highlight = false }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {highlight && <ellipse cx={0} cy={-70} rx={95} ry={110} fill={colors.gold} opacity={0.28} />}
    <path d="M-62 0 Q-74 -60 -48 -108 L-22 -126 Q0 -136 22 -126 L48 -108 Q74 -60 62 0 Z" fill={highlight ? colors.gold : color} />
    <path d="M-40 -20 Q0 -10 40 -20" stroke="rgba(0,0,0,0.12)" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M-44 -60 Q0 -50 44 -60" stroke="rgba(0,0,0,0.1)" strokeWidth={6} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={-134} rx={24} ry={10} fill="#F1E3BE" />
    <rect x={-30} y={-130} width={60} height={16} rx={8} fill="#8C6A52" />
  </g>
);

export const Apple: React.FC<{ x: number; y: number; r?: number; color?: string }> = ({ x, y, r = 22, color = "#D94F4F" }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={color} />
    <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.25} fill="rgba(255,255,255,0.35)" />
    <path d={`M0 ${-r} L0 ${-r - 12}`} stroke="#6B4F3A" strokeWidth={4} strokeLinecap="round" />
    <path d={`M2 ${-r - 6} Q 14 ${-r - 22} 24 ${-r - 10} Q 12 ${-r - 2} 2 ${-r - 6}Z`} fill="#5E9E6E" />
  </g>
);

/** Basket with apples. Origin at bottom centre. */
export const Basket: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-70 -80 Q0 -150 70 -80" fill="none" stroke="#B48A52" strokeWidth={10} strokeLinecap="round" />
    <Apple x={-32} y={-86} r={20} />
    <Apple x={8} y={-96} r={20} color="#E0A93A" />
    <Apple x={40} y={-84} r={20} />
    <path d="M-80 -80 L-64 0 L64 0 L80 -80 Z" fill="#C89B5E" />
    <path d="M-76 -62 L76 -62 M-72 -42 L72 -42 M-68 -22 L68 -22" stroke="#A97E48" strokeWidth={5} />
    <rect x={-84} y={-90} width={168} height={16} rx={8} fill="#A97E48" />
  </g>
);

/** Parcel box with tape. Origin at bottom centre. */
export const Parcel: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({ x, y, scale = 1, color = "#D9A86C" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-50} y={-80} width={100} height={80} rx={8} fill={color} />
    <rect x={-50} y={-80} width={100} height={16} rx={6} fill="#C08D55" />
    <rect x={-10} y={-80} width={20} height={80} fill="#F3E4C8" opacity={0.9} />
    <path d="M22 -42 C10 -52 10 -62 20 -62 C25 -62 27 -58 27 -56 C27 -58 29 -62 34 -62 C44 -62 44 -52 27 -36 Z" fill={colors.terracotta} transform="translate(0 4)" />
  </g>
);

/** Delivery van with boxes. Origin at ground centre; width ≈ 300 at scale 1. `wheel` = rotation in degrees. */
export const Van: React.FC<{ x: number; y: number; scale?: number; wheel?: number; color?: string }> = ({ x, y, scale = 1, wheel = 0, color = colors.brand }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-150} y={-120} width={200} height={100} rx={12} fill={color} />
    <path d="M50 -120 L110 -120 Q140 -120 150 -90 L150 -20 L50 -20 Z" fill={colors.brandDeep} />
    <path d="M62 -108 L108 -108 Q126 -108 134 -84 L134 -70 L62 -70 Z" fill="#BFDDEB" />
    <rect x={-150} y={-40} width={300} height={20} rx={6} fill={colors.brandDeep} />
    {/* boxes visible through open side */}
    <rect x={-134} y={-108} width={168} height={76} rx={8} fill="#F3E4C8" />
    <Parcel x={-90} y={-32} scale={0.55} />
    <Parcel x={-30} y={-32} scale={0.55} color="#E6C089" />
    <Parcel x={-60} y={-76} scale={0.5} />
    <path d="M-150 -120 L-150 -20" stroke={colors.brandDeep} strokeWidth={6} />
    {[-90, 100].map((wx, i) => (
      <g key={i} transform={`translate(${wx} 0) rotate(${wheel})`}>
        <circle r={34} fill={colors.ink} />
        <circle r={16} fill="#C9C9C9" />
        <line x1={-16} y1={0} x2={16} y2={0} stroke={colors.ink} strokeWidth={5} />
        <line x1={0} y1={-16} x2={0} y2={16} stroke={colors.ink} strokeWidth={5} />
      </g>
    ))}
    <circle cx={146} cy={-50} r={8} fill={colors.gold} />
  </g>
);

/** Document folder with optional check. Origin at centre; 140×110 at scale 1. */
export const Folder: React.FC<{ x: number; y: number; scale?: number; color?: string; check?: number; rotate?: number }> = ({ x, y, scale = 1, color = "#F0C96A", check = 0, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <path d="M-70 -40 L-70 -56 L-20 -56 L-8 -44 L70 -44 L70 56 L-70 56 Z" fill={color} />
    <rect x={-70} y={-36} width={140} height={92} rx={8} fill="#FFFFFF" />
    <rect x={-64} y={-26} width={128} height={82} rx={8} fill={color} opacity={0.9} />
    <line x1={-40} y1={-2} x2={30} y2={-2} stroke="rgba(0,0,0,0.18)" strokeWidth={6} strokeLinecap="round" />
    <line x1={-40} y1={18} x2={10} y2={18} stroke="rgba(0,0,0,0.18)" strokeWidth={6} strokeLinecap="round" />
    {check > 0 && (
      <g transform={`translate(40 20) scale(${0.6 + 0.4 * check})`} opacity={clamp01(check)}>
        <Check x={0} y={0} r={26} progress={clamp01(check)} />
      </g>
    )}
  </g>
);

/** Office table. Origin at table-top centre. */
export const Desk: React.FC<{ x: number; y: number; w?: number; color?: string }> = ({ x, y, w = 600, color = "#B97A48" }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={0} width={w} height={34} rx={10} fill={color} />
    <rect x={-w / 2 + 30} y={34} width={26} height={130} fill="#8C5A32" />
    <rect x={w / 2 - 56} y={34} width={26} height={130} fill="#8C5A32" />
  </g>
);

/** Small chair seen from the side (for seated people), origin at floor centre. */
export const Chair: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({ x, y, scale = 1, color = "#6E8F6B" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-50} y={-130} width={100} height={24} rx={8} fill={color} />
    <rect x={-60} y={-250} width={24} height={130} rx={8} fill={color} />
    <rect x={-44} y={-106} width={16} height={106} fill="#4E6B4C" />
    <rect x={28} y={-106} width={16} height={106} fill="#4E6B4C" />
  </g>
);

/** Water pump (motor + pipe). Origin at ground centre. `on` 0..1 animates water. */
export const Pump: React.FC<{ x: number; y: number; scale?: number; on?: number; frame?: number }> = ({ x, y, scale = 1, on = 0, frame = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-80} y={-20} width={160} height={20} rx={6} fill="#8D8A82" />
    <rect x={-70} y={-120} width={120} height={100} rx={14} fill="#4F6F8F" />
    <rect x={-56} y={-104} width={60} height={40} rx={8} fill="#7FB3D5" />
    <circle cx={30} cy={-60} r={18} fill={colors.ink} />
    <circle cx={30} cy={-60} r={8} fill={on > 0.5 ? "#7FBA8B" : colors.red} />
    {/* lever */}
    <g transform={`translate(-50 -120) rotate(${-40 + on * 50})`}>
      <rect x={-6} y={-90} width={12} height={90} rx={6} fill={colors.ink} />
      <circle cy={-90} r={12} fill={colors.terracotta} />
    </g>
    {/* pipe */}
    <path d="M50 -90 L110 -90 L110 -50" stroke="#8D8A82" strokeWidth={22} fill="none" strokeLinecap="round" />
    {/* water */}
    {on > 0 && (
      <g opacity={on}>
        {Array.from({ length: 6 }).map((_, i) => {
          const t = ((frame * 3 + i * 14) % 60) / 60;
          return <circle key={i} cx={110 + Math.sin(t * 4 + i) * 6} cy={-40 + t * 44} r={7 + i % 3} fill="#7FB3D5" opacity={1 - t} />;
        })}
      </g>
    )}
  </g>
);

/** Irrigation channel (aryk) between x1 and x2 at y. Water flows when flow > 0. */
export const Aryk: React.FC<{ x1: number; x2: number; y: number; flow?: number; frame?: number; height?: number }> = ({ x1, x2, y, flow = 0, frame = 0, height = 36 }) => (
  <g>
    <rect x={x1 - 10} y={y - height / 2 - 10} width={x2 - x1 + 20} height={height + 20} rx={height / 2 + 10} fill="#8D8A82" />
    <rect x={x1} y={y - height / 2} width={x2 - x1} height={height} rx={height / 2} fill="#5A5750" />
    <rect x={x1} y={y - height / 2} width={(x2 - x1) * clamp01(flow)} height={height} rx={height / 2} fill="#7FB3D5" />
    {flow > 0 && (
      <line x1={x1 + 10} y1={y} x2={x1 + (x2 - x1 - 20) * clamp01(flow)} y2={y} stroke="#BFDDEB" strokeWidth={6} strokeLinecap="round" strokeDasharray="28 36" strokeDashoffset={-frame * 4} />
    )}
  </g>
);

/** Water barrel on a small cart. Origin at ground centre. */
export const BarrelCart: React.FC<{ x: number; y: number; scale?: number; wheel?: number }> = ({ x, y, scale = 1, wheel = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-110} y={-70} width={220} height={16} rx={6} fill="#8C6A52" />
    <path d="M110 -62 L170 -40" stroke="#8C6A52" strokeWidth={10} strokeLinecap="round" />
    <rect x={-80} y={-220} width={160} height={150} rx={20} fill="#A66E3F" />
    <rect x={-84} y={-200} width={168} height={14} rx={7} fill="#6B4F3A" />
    <rect x={-84} y={-100} width={168} height={14} rx={7} fill="#6B4F3A" />
    <ellipse cx={0} cy={-220} rx={80} ry={16} fill="#7FB3D5" />
    <path d="M-30 -240 Q 0 -260 30 -240" stroke="#BFDDEB" strokeWidth={6} fill="none" strokeLinecap="round" />
    {[-60, 60].map((wx, i) => (
      <g key={i} transform={`translate(${wx} -30) rotate(${wheel})`}>
        <circle r={30} fill={colors.ink} />
        <circle r={12} fill="#C9C9C9" />
        <line x1={-12} y1={0} x2={12} y2={0} stroke={colors.ink} strokeWidth={4} />
      </g>
    ))}
  </g>
);

/** Winding mountain stream. `d` is an SVG path; animated highlights. */
export const Stream: React.FC<{ d: string; width?: number; frame?: number; opacity?: number }> = ({ d, width = 40, frame = 0, opacity = 1 }) => (
  <g opacity={opacity}>
    <path d={d} stroke="#5E97BF" strokeWidth={width + 10} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
    <path d={d} stroke="#7FB3D5" strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} stroke="#CFE8F5" strokeWidth={width * 0.22} fill="none" strokeLinecap="round" strokeDasharray="30 50" strokeDashoffset={-frame * 3} opacity={0.9} />
  </g>
);

/** Spring / small pool with ripples. */
export const Spring: React.FC<{ x: number; y: number; scale?: number; frame?: number }> = ({ x, y, scale = 1, frame = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse rx={90} ry={32} fill="#7FB3D5" />
    {[0, 1, 2].map((i) => {
      const t = ((frame + i * 20) % 60) / 60;
      return <ellipse key={i} rx={20 + t * 60} ry={(20 + t * 60) * 0.35} fill="none" stroke="#DFF0F8" strokeWidth={4} opacity={1 - t} />;
    })}
    {[-70, 60, -20, 50].map((sx, i) => (
      <ellipse key={i} cx={sx} cy={-6 + (i % 2) * 24} rx={16} ry={9} fill="#8D8A82" />
    ))}
  </g>
);

/** Water drop icon */
export const Drop: React.FC<{ x: number; y: number; r?: number; color?: string }> = ({ x, y, r = 20, color = "#5E97BF" }) => (
  <path transform={`translate(${x} ${y})`} d={`M0 ${-r * 1.6} C ${r * 0.9} ${-r * 0.5} ${r} ${0} ${r} ${r * 0.3} A ${r} ${r} 0 1 1 ${-r} ${r * 0.3} C ${-r} 0 ${-r * 0.9} ${-r * 0.5} 0 ${-r * 1.6} Z`} fill={color} />
);

/** Snowflake */
export const Snowflake: React.FC<{ x: number; y: number; r?: number; opacity?: number }> = ({ x, y, r = 14, opacity = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    {[0, 60, 120].map((a) => (
      <line key={a} x1={-r} y1={0} x2={r} y2={0} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" transform={`rotate(${a})`} />
    ))}
  </g>
);

/** Schematic receipt / bill with a water drop. Origin at centre; 200×260 at scale 1. */
export const Receipt: React.FC<{ x: number; y: number; scale?: number; rotate?: number }> = ({ x, y, scale = 1, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <path d="M-100 -130 L100 -130 L100 110 L80 130 L60 110 L40 130 L20 110 L0 130 L-20 110 L-40 130 L-60 110 L-80 130 L-100 110 Z" fill="#FFFFFF" stroke={colors.mint} strokeWidth={4} />
    <Drop x={0} y={-80} r={18} />
    {[-30, -4, 22, 48].map((dy, i) => (
      <g key={i}>
        <line x1={-70} y1={dy} x2={i === 3 ? -10 : 10} y2={dy} stroke={colors.mint} strokeWidth={8} strokeLinecap="round" />
        <line x1={34} y1={dy} x2={70} y2={dy} stroke={i === 3 ? colors.gold : colors.mint} strokeWidth={8} strokeLinecap="round" />
      </g>
    ))}
    <rect x={-70} y={70} width={140} height={6} rx={3} fill={colors.brand} opacity={0.4} />
  </g>
);

/** Calendar sheet. Origin at centre; 260×260 at scale 1. */
export const Calendar: React.FC<{ x: number; y: number; scale?: number; color?: string; children?: React.ReactNode }> = ({ x, y, scale = 1, color = colors.brand, children }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-130} y={-120} width={260} height={250} rx={24} fill="#FFFFFF" stroke={colors.mint} strokeWidth={5} />
    <rect x={-130} y={-120} width={260} height={64} rx={24} fill={color} />
    <rect x={-130} y={-90} width={260} height={34} fill={color} />
    {[-70, 70].map((rx, i) => (
      <rect key={i} x={rx - 10} y={-142} width={20} height={50} rx={10} fill={colors.ink} />
    ))}
    {Array.from({ length: 12 }).map((_, i) => (
      <circle key={i} cx={-90 + (i % 6) * 36} cy={-20 + Math.floor(i / 6) * 32} r={7} fill={colors.mint} />
    ))}
    {children}
  </g>
);

/** Thought bubble with cloud outline; children drawn at centre. */
export const ThoughtBubble: React.FC<{ x: number; y: number; scale?: number; children?: React.ReactNode; tail?: "left" | "right"; fill?: string }> = ({ x, y, scale = 1, children, tail = "left", fill = "#FFFFFF" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <g fill={fill} stroke={colors.mint} strokeWidth={5}>
      <ellipse cx={0} cy={0} rx={150} ry={95} />
      <circle cx={-90} cy={-50} r={60} />
      <circle cx={40} cy={-70} r={66} />
      <circle cx={110} cy={-20} r={50} />
      <circle cx={-60} cy={55} r={50} />
      <circle cx={70} cy={55} r={48} />
    </g>
    <g fill={fill}>
      <ellipse cx={0} cy={0} rx={146} ry={91} />
      <circle cx={-90} cy={-50} r={56} />
      <circle cx={40} cy={-70} r={62} />
      <circle cx={110} cy={-20} r={46} />
      <circle cx={-60} cy={55} r={46} />
      <circle cx={70} cy={55} r={44} />
    </g>
    <g transform={`scale(${tail === "left" ? 1 : -1} 1)`}>
      <circle cx={-120} cy={118} r={20} fill={fill} stroke={colors.mint} strokeWidth={5} />
      <circle cx={-160} cy={156} r={12} fill={fill} stroke={colors.mint} strokeWidth={5} />
    </g>
    {children}
  </g>
);

/** Simplified Kyrgyzstan outline (schematic blob) with region dots. Box ≈ 440×240 at scale 1, origin top-left. */
export const KG_DOTS: [number, number][] = [
  [262, 48], // Bishkek / Chuy
  [112, 72], // Talas
  [372, 98], // Issyk-Kul
  [300, 132], // Naryn
  [172, 148], // Jalal-Abad
  [214, 188], // Osh
  [108, 206], // Batken
];

export const KgMap: React.FC<{ x: number; y: number; scale?: number; fill?: string; stroke?: string; dots?: boolean; dotOpacity?: (i: number) => number; activeDot?: number; frame?: number }> = ({
  x,
  y,
  scale = 1,
  fill = colors.mint,
  stroke = colors.brand,
  dots = true,
  dotOpacity = () => 1,
  activeDot = -1,
  frame = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path
      d="M40 72 Q70 40 122 42 Q170 56 206 50 Q230 28 268 30 Q310 44 350 48 Q392 54 416 76 Q436 100 424 136 Q410 164 376 182 Q330 206 290 202 Q248 184 222 212 Q180 236 140 230 Q94 226 72 198 Q50 176 22 150 Q4 120 14 96 Q24 78 40 72 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    {dots &&
      KG_DOTS.map(([dx, dy], i) => {
        const active = i === activeDot;
        const ring = active ? 1 + 0.5 * ((frame % 40) / 40) : 0;
        return (
          <g key={i} transform={`translate(${dx} ${dy})`} opacity={dotOpacity(i)}>
            {active && <circle r={14 + ring * 18} fill={colors.gold} opacity={0.5 - ring * 0.3} />}
            <circle r={active ? 14 : 10} fill={active ? colors.gold : colors.brand} stroke="#FFFFFF" strokeWidth={4} />
          </g>
        );
      })}
  </g>
);

/** Window frame with clipped content (children are drawn in window coordinates: 0..w × 0..h). */
export const WindowFrame: React.FC<{ x: number; y: number; w?: number; h?: number; id?: string; children?: React.ReactNode }> = ({ x, y, w = 300, h = 340, id = "win", children }) => (
  <g transform={`translate(${x} ${y})`}>
    <defs>
      <clipPath id={id}>
        <rect x={0} y={0} width={w} height={h} rx={14} />
      </clipPath>
    </defs>
    <rect x={-18} y={-18} width={w + 36} height={h + 36} rx={22} fill="#FFFFFF" />
    <g clipPath={`url(#${id})`}>{children}</g>
    <rect x={w / 2 - 7} y={0} width={14} height={h} fill="#FFFFFF" />
    <rect x={0} y={h / 2 - 7} width={w} height={14} fill="#FFFFFF" />
    <rect x={-30} y={h + 18} width={w + 60} height={22} rx={8} fill="#E9DFCB" />
  </g>
);

/** Arm bent across the chest with the hand on the heart — overlay on a <Person> at the same x/y/scale. */
export const HandOnHeart: React.FC<{ x: number; y: number; scale?: number; skin?: string; outfit?: string; flip?: boolean; bob?: number; glow?: number }> = ({ x, y, scale = 1, skin = colors.skin1, outfit = colors.brand, flip = false, bob = 0, glow = 0 }) => (
  <g transform={`translate(${x} ${y + bob}) scale(${flip ? -scale : scale} ${scale})`}>
    {/* cover the straight right arm */}
    <path d="M-62 -120 Q-70 -250 -40 -270 L40 -270 Q70 -250 62 -120 Z" fill={outfit} />
    <path d="M52 -250 L78 -180" stroke={outfit} strokeWidth={28} strokeLinecap="round" />
    <path d="M78 -180 L14 -200" stroke={outfit} strokeWidth={26} strokeLinecap="round" />
    {glow > 0 && <circle cx={8} cy={-205} r={30 + glow * 26} fill={colors.gold} opacity={0.35 * glow} />}
    <circle cx={8} cy={-205} r={17} fill={skin} />
  </g>
);

/** Closed eyes overlay for a <Person> at the same x/y/scale. */
export const ClosedEyes: React.FC<{ x: number; y: number; scale?: number; skin?: string; flip?: boolean; bob?: number; amount?: number }> = ({ x, y, scale = 1, skin = colors.skin1, flip = false, bob = 0, amount = 1 }) => (
  <g transform={`translate(${x} ${y + bob}) scale(${flip ? -scale : scale} ${scale})`} opacity={clamp01(amount)}>
    <circle cx={-18} cy={-335} r={9} fill={skin} />
    <circle cx={18} cy={-335} r={9} fill={skin} />
    <path d="M-26 -336 Q-18 -328 -10 -336" stroke={colors.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M10 -336 Q18 -328 26 -336" stroke={colors.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

/** Sickle held in a hand. Origin at handle end. */
export const Sickle: React.FC<{ x: number; y: number; scale?: number; rotate?: number }> = ({ x, y, scale = 1, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <rect x={-8} y={-10} width={16} height={70} rx={8} fill="#8C6A52" />
    <path d="M0 -10 Q-10 -90 60 -120 Q90 -130 100 -110 Q50 -110 20 -60 Q8 -40 6 -10 Z" fill="#C9CED2" stroke="#8F979C" strokeWidth={3} />
  </g>
);

export const Potato: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-34 -6 Q-30 -30 0 -28 Q30 -30 34 -4 Q36 20 6 26 Q-28 28 -34 -6 Z" fill="#C8A26A" />
    {[[-14, -8], [10, -12], [4, 10], [-10, 12]].map(([px, py], i) => (
      <circle key={i} cx={px} cy={py} r={3} fill="#9A7540" />
    ))}
  </g>
);

/** Hand cursor pointing up-left with index finger. Origin at the fingertip. */
export const Pointer: React.FC<{ x: number; y: number; scale?: number; skin?: string; press?: number }> = ({ x, y, scale = 1, skin = colors.skin1, press = 0 }) => (
  <g transform={`translate(${x} ${y + press * 6}) scale(${scale}) rotate(-15)`}>
    <rect x={-12} y={0} width={24} height={60} rx={12} fill={skin} stroke="#FFFFFF" strokeWidth={4} />
    <path d="M-34 50 Q-40 100 -10 120 L40 120 Q62 110 58 70 L52 40 Q40 30 30 44 L30 60 Q20 50 8 56 L0 52 Z" fill={skin} stroke="#FFFFFF" strokeWidth={4} strokeLinejoin="round" />
  </g>
);

/** Arched bridge drawn progressively from both ends. progress 0..1 */
export const Bridge: React.FC<{ x1: number; x2: number; y: number; rise?: number; progress?: number }> = ({ x1, x2, y, rise = 150, progress = 1 }) => {
  const d = `M${x1} ${y} Q ${(x1 + x2) / 2} ${y - rise * 2} ${x2} ${y}`;
  const len = 1200;
  const half = Math.max(0, Math.min(1, progress));
  return (
    <g>
      <path d={d} stroke={colors.brandDeep} strokeWidth={28} fill="none" strokeLinecap="round" strokeDasharray={`${len * half} ${len}`} />
      <path d={d} stroke={colors.brand} strokeWidth={28} fill="none" strokeLinecap="round" strokeDasharray={`${len * half} ${len}`} strokeDashoffset={-len * (1 - half)} transform={`translate(${x1 + x2} 0) scale(-1 1)`} />
      <path d={`M${x1} ${y - 50} Q ${(x1 + x2) / 2} ${y - 50 - rise * 2} ${x2} ${y - 50}`} stroke={colors.gold} strokeWidth={10} fill="none" strokeLinecap="round" opacity={progress >= 1 ? 1 : 0} />
      {progress >= 1 &&
        Array.from({ length: 7 }).map((_, i) => {
          const t = (i + 0.5) / 7;
          const px = x1 + (x2 - x1) * t;
          const py = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y - rise * 2) + t * t * y;
          return <line key={i} x1={px} y1={py} x2={px} y2={py - 50} stroke={colors.gold} strokeWidth={8} strokeLinecap="round" />;
        })}
    </g>
  );
};

/** Point on the quadratic bridge/road curve for t in 0..1 */
export const quadPoint = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, t: number) => ({
  x: (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2,
  y: (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2,
});

/** "Ask the Muftiyat" card: small mosque + question bubble. Origin at centre. */
export const AskCard: React.FC<{ x: number; y: number; scale?: number; label: string }> = ({ x, y, scale = 1, label }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-150} y={-150} width={300} height={300} rx={40} fill="#FFFFFF" stroke={colors.mint} strokeWidth={5} />
    <Mosque x={0} y={60} scale={0.62} color={colors.brandSoft} />
    <g transform="translate(90 -80)">
      <circle r={40} fill={colors.gold} />
      <SvgText x={0} y={16} size={48} weight={900} color="#FFFFFF">
        ?
      </SvgText>
    </g>
    <SvgText x={0} y={122} size={34} weight={800} color={colors.brandDeep}>
      {label}
    </SvgText>
  </g>
);

/** Simple bar chart inside a card. values 0..1, grow 0..1 */
export const BarChart: React.FC<{ x: number; y: number; w?: number; h?: number; values: number[]; grow?: number; colorsList?: string[] }> = ({ x, y, w = 300, h = 180, values, grow = 1, colorsList = [colors.brand, colors.gold, colors.brandSoft, colors.terracotta] }) => {
  const bw = w / values.length;
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1={0} y1={h} x2={w} y2={h} stroke={colors.mint} strokeWidth={4} />
      {values.map((v, i) => {
        const bh = h * v * clamp01(grow * values.length - i);
        return <rect key={i} x={i * bw + bw * 0.2} y={h - bh} width={bw * 0.6} height={bh} rx={10} fill={colorsList[i % colorsList.length]} />;
      })}
    </g>
  );
};

/** Pie chart drawn with arcs. values sum to 1; reveal 0..1 */
export const PieChart: React.FC<{ x: number; y: number; r?: number; values: number[]; reveal?: number; colorsList?: string[] }> = ({ x, y, r = 90, values, reveal = 1, colorsList = [colors.brand, colors.gold, colors.brandSoft, colors.terracotta] }) => {
  let acc = 0;
  const total = clamp01(reveal);
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={colors.mintLight} />
      {values.map((v, i) => {
        const start = acc;
        acc += v;
        const end = Math.min(acc, total);
        if (end <= start) return null;
        const a0 = -Math.PI / 2 + start * Math.PI * 2;
        const a1 = -Math.PI / 2 + end * Math.PI * 2;
        const large = end - start > 0.5 ? 1 : 0;
        const d = `M0 0 L${Math.cos(a0) * r} ${Math.sin(a0) * r} A${r} ${r} 0 ${large} 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r} Z`;
        return <path key={i} d={d} fill={colorsList[i % colorsList.length]} />;
      })}
      <circle r={r * 0.45} fill="#FFFFFF" />
    </g>
  );
};
