import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, W, H } from "../theme";
import { floatY, linear } from "../components/anim";

/** Sky gradient background. mode: day | dawn | dusk | night */
export const Sky: React.FC<{ mode?: "day" | "dawn" | "dusk" | "night"; height?: number }> = ({ mode = "day", height = H }) => {
  const g = {
    day: ["#DCEEF6", "#F4F1E6"],
    dawn: ["#F6D7B8", "#FBEFD9"],
    dusk: ["#E9B591", "#F7E3CF"],
    night: ["#15213A", "#2B3F63"],
  }[mode];
  return <div style={{ position: "absolute", left: 0, top: 0, width: W, height, background: `linear-gradient(180deg, ${g[0]} 0%, ${g[1]} 100%)` }} />;
};

export const Sun: React.FC<{ x?: number; y?: number; r?: number; color?: string; rays?: boolean }> = ({ x = 820, y = 420, r = 70, color = colors.gold, rays = true }) => {
  const frame = useCurrentFrame();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      {rays && (
        <g transform={`rotate(${frame * 0.15} ${x} ${y})`} opacity={0.35}>
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={x} y1={y} x2={x + Math.cos((i / 12) * Math.PI * 2) * (r * 2.2)} y2={y + Math.sin((i / 12) * Math.PI * 2) * (r * 2.2)} stroke={color} strokeWidth={6} strokeLinecap="round" />
          ))}
        </g>
      )}
      <circle cx={x} cy={y} r={r * 1.5} fill={color} opacity={0.18} />
      <circle cx={x} cy={y} r={r} fill={color} />
    </svg>
  );
};

export const Moon: React.FC<{ x?: number; y?: number; r?: number; phase?: number; color?: string }> = ({ x = 800, y = 380, r = 60, phase = 0.25, color = "#F6E7B8" }) => {
  // phase 0..1: 0 new, 0.5 full. Render as crescent mask.
  const k = Math.cos(phase * Math.PI * 2); // 1 at new, -1 at full
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      <defs>
        <mask id={`moonmask-${x}-${y}`}>
          <rect width={W} height={H} fill="black" />
          <circle cx={x} cy={y} r={r} fill="white" />
          <ellipse cx={x + r * 0.55 * (k > 0 ? 1 : -1) * 0} cy={y} rx={Math.abs(k) * r * 1.05} ry={r * 1.05} fill={k > 0 ? "black" : "white"} transform={`translate(${k > 0 ? r * 0.35 : 0} 0)`} />
        </mask>
      </defs>
      <circle cx={x} cy={y} r={r * 1.8} fill={color} opacity={0.12} />
      <circle cx={x} cy={y} r={r} fill={color} mask={`url(#moonmask-${x}-${y})`} />
    </svg>
  );
};

export const Cloud: React.FC<{ x: number; y: number; scale?: number; speed?: number; opacity?: number }> = ({ x, y, scale = 1, speed = 0.3, opacity = 0.9 }) => {
  const frame = useCurrentFrame();
  const dx = (frame * speed) % (W + 400) - 200;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H} opacity={opacity}>
      <g transform={`translate(${x + dx} ${y}) scale(${scale})`} fill="#FFFFFF">
        <ellipse cx={0} cy={0} rx={90} ry={40} />
        <circle cx={-40} cy={-10} r={40} />
        <circle cx={20} cy={-25} r={50} />
        <circle cx={60} cy={-5} r={35} />
      </g>
    </svg>
  );
};

/** Layered mountain silhouettes (Ala-Too) with snow caps */
export const Mountains: React.FC<{ y?: number; parallax?: number; far?: string; near?: string }> = ({ y = 900, parallax = 0, far = colors.mountainFar, near = colors.mountain }) => {
  const frame = useCurrentFrame();
  const px = parallax * frame;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      <g transform={`translate(${-px * 0.3} ${y})`}>
        <path d={`M-200 300 L120 60 L260 180 L420 -20 L600 170 L760 40 L900 160 L1080 20 L1300 220 L1300 400 L-200 400Z`} fill={far} />
        <path d={`M400 0 L420 -20 L440 10 L460 -5 L480 20 L470 30 L430 40 Z`} fill="#fff" opacity={0.9} />
        <path d={`M1060 40 L1080 20 L1100 45 L1120 25 L1140 55 L1120 70 L1080 72 Z`} fill="#fff" opacity={0.9} />
      </g>
      <g transform={`translate(${-px * 0.6} ${y + 120})`}>
        <path d={`M-200 400 L60 140 L200 240 L380 80 L520 220 L700 100 L860 230 L1000 120 L1300 300 L1300 500 L-200 500Z`} fill={near} />
        <path d={`M360 100 L380 80 L400 105 L420 90 L440 120 L420 130 L390 135 Z`} fill="#fff" opacity={0.85} />
        <path d={`M680 120 L700 100 L720 125 L740 110 L760 140 L740 150 L710 150 Z`} fill="#fff" opacity={0.85} />
      </g>
    </svg>
  );
};

/** Rolling ground / hills */
export const Ground: React.FC<{ y?: number; color?: string; color2?: string }> = ({ y = 1150, color = "#9DBF8A", color2 = "#7FA86C" }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
    <path d={`M0 ${y + 60} Q 300 ${y - 40} 600 ${y + 20} T 1080 ${y - 10} L1080 ${H} L0 ${H}Z`} fill={color} />
    <path d={`M0 ${y + 220} Q 250 ${y + 120} 540 ${y + 200} T 1080 ${y + 160} L1080 ${H} L0 ${H}Z`} fill={color2} />
  </svg>
);

/** Falling rain drops */
export const Rain: React.FC<{ intensity?: number; opacity?: number; area?: { x: number; y: number; w: number; h: number } }> = ({ intensity = 40, opacity = 0.7, area = { x: 0, y: 0, w: W, h: 1200 } }) => {
  const frame = useCurrentFrame();
  const drops = Array.from({ length: intensity }).map((_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const x = area.x + (seed / 233280) * area.w;
    const speed = 18 + (seed % 7);
    const y = area.y + ((frame * speed + seed) % area.h);
    return { x, y, l: 26 + (seed % 20) };
  });
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H} opacity={opacity}>
      {drops.map((d, i) => (
        <line key={i} x1={d.x} y1={d.y} x2={d.x - 4} y2={d.y + d.l} stroke="#7FB3D5" strokeWidth={4} strokeLinecap="round" />
      ))}
    </svg>
  );
};

/** Sparkle particles rising */
export const Sparkles: React.FC<{ x: number; y: number; count?: number; spread?: number; color?: string; start?: number; size?: number }> = ({ x, y, count = 10, spread = 120, color = colors.gold, start = 0, size = 8 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - start);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={W} height={H}>
      {Array.from({ length: count }).map((_, i) => {
        const seed = (i * 7919) % 1000;
        const period = 60 + (seed % 40);
        const t = ((f + seed) % period) / period;
        const px = x + ((seed / 1000) - 0.5) * spread * 2;
        const py = y - t * 220;
        const o = Math.sin(t * Math.PI);
        return <circle key={i} cx={px} cy={py} r={size * (0.5 + 0.5 * o)} fill={color} opacity={o * 0.9} />;
      })}
    </svg>
  );
};
