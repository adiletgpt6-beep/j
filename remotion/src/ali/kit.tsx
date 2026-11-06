// Art kit for the "Ali ibn Abu Talib" video: 7th-century Meccan interior, dastarkhan, faceless figures,
// the light that stands in for the Prophet ﷺ (who is never drawn), dust, camera and grading.
// Everything is original vector art drawn in SVG; nothing is traced from the reference video.
import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";

export const W = 1080;
export const H = 1920;

export const pal = {
  night0: "#0f1428",
  night1: "#232a4d",
  wallDark: "#4a2c18",
  wall: "#7a4e2c",
  wallLit: "#b07a45",
  floor: "#5c3a20",
  floorLit: "#8a5b33",
  beam: "#3a2414",
  cloth: "#d9b98a",
  clothShade: "#b8935f",
  gold: "#ffd27a",
  goldDeep: "#e0a640",
  light: "#fff1c9",
  skin: "#b98563",
  skinShade: "#9a6a4b",
  beard: "#2b1d16",
  white: "#f3ead8",
  green: "#2f6b4f",
  greenDark: "#234f3b",
  red: "#7d1f1f",
  redDark: "#4e1212",
};

export const robes = ["#8c6a3e", "#5e6b3c", "#3f4d6e", "#6e3a3a", "#7a6a55", "#4f5a4a", "#6b5a7a", "#8a7a5a"];

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (f: number, a: number, b: number, e?: (t: number) => number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

/** Perspective helper for the long dastarkhan shot. d = depth (1 near … 9 far). */
export const VP = { x: 540, y: 820 };
export const persp = (d: number, side: number, spread = 1) => ({
  x: VP.x + (side * 430 * spread) / d,
  y: VP.y + 1100 / d,
  s: 1 / d,
});

/* ---------------------------------------------------------------- camera / grading */

export const Camera: React.FC<{ scale?: number; x?: number; y?: number; rot?: number; origin?: string; children: React.ReactNode }> = ({ scale = 1, x = 0, y = 0, rot = 0, origin = "50% 50%", children }) => (
  <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rot}deg)`, transformOrigin: origin }}>{children}</AbsoluteFill>
);

export const Grade: React.FC<{ vignette?: number; warmth?: number; dim?: number }> = ({ vignette = 0.75, warmth = 0.12, dim = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 45%, rgba(8,4,2,${vignette}) 100%)` }} />
      <AbsoluteFill style={{ background: `rgba(255,170,80,${warmth})`, mixBlendMode: "soft-light" }} />
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(6,3,1,${dim})` }} />}
      <Img src={staticFile(`ali/tex/grain${Math.floor(f / 2) % 4}.png`)} style={{ position: "absolute", width: W, height: H, opacity: 0.09, mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- light, dust, lamps */

/** The Prophet ﷺ is never depicted. His presence is this warm light at the head of the dastarkhan. */
export const HolyLight: React.FC<{ x: number; y: number; intensity: number; rays?: number; raysRot?: number; scale?: number }> = ({ x, y, intensity, rays = 0, raysRot = 0, scale = 1 }) => {
  const f = useCurrentFrame();
  const breathe = 1 + Math.sin(f / 22) * 0.03;
  const n = 18;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
      <defs>
        <radialGradient id="hl-core">
          <stop offset="0%" stopColor="#fffaf0" stopOpacity={1} />
          <stop offset="25%" stopColor={pal.light} stopOpacity={0.85} />
          <stop offset="60%" stopColor={pal.gold} stopOpacity={0.25} />
          <stop offset="100%" stopColor={pal.gold} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="hl-col" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={pal.light} stopOpacity={0} />
          <stop offset="70%" stopColor={pal.light} stopOpacity={0.55} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0.9} />
        </linearGradient>
        <radialGradient id="hl-ray">
          <stop offset="0%" stopColor={pal.light} stopOpacity={0.55} />
          <stop offset="100%" stopColor={pal.gold} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        {rays > 0 && (
          <g opacity={rays} transform={`rotate(${raysRot})`}>
            {Array.from({ length: n }).map((_, i) => (
              <path key={i} d="M0 0 L-55 -1500 L55 -1500 Z" fill="url(#hl-ray)" transform={`rotate(${(360 / n) * i + (i % 2) * 4})`} opacity={i % 2 ? 0.6 : 1} />
            ))}
          </g>
        )}
        <rect x={-70 * breathe} y={-1200} width={140 * breathe} height={1200} fill="url(#hl-col)" opacity={0.75 * intensity} />
        <circle r={260 * breathe * (0.6 + intensity * 0.6)} fill="url(#hl-core)" opacity={Math.min(1, intensity)} />
        <ellipse cy={40} rx={260 * (0.6 + intensity * 0.5)} ry={46} fill="url(#hl-core)" opacity={0.7 * intensity} />
      </g>
    </svg>
  );
};

export const Dust: React.FC<{ n?: number; area?: [number, number, number, number]; seed?: string; opacity?: number }> = ({ n = 46, area = [180, 200, 900, 1500], seed = "d", opacity = 0.8 }) => {
  const f = useCurrentFrame();
  const [x0, y0, x1, y1] = area;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "screen" }}>
      {Array.from({ length: n }).map((_, i) => {
        const rx = random(`${seed}x${i}`), ry = random(`${seed}y${i}`), rs = random(`${seed}s${i}`);
        const sp = 0.25 + rs * 0.6;
        const y = y1 - (((ry * (y1 - y0)) + f * sp) % (y1 - y0));
        const x = x0 + rx * (x1 - x0) + Math.sin((f + i * 40) / (50 + rs * 40)) * 18;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin((f + i * 13) / (20 + rs * 25)));
        return <circle key={i} cx={x} cy={y} r={1.4 + rs * 3.2} fill={pal.light} opacity={tw * opacity * (0.35 + rs * 0.65)} />;
      })}
    </svg>
  );
};

export const flicker = (f: number, seed: number) => 0.86 + 0.08 * Math.sin(f / 3.1 + seed) + 0.06 * Math.sin(f / 1.7 + seed * 2.3);

/** Hanging brass oil lamp with chain and glow. (x,y) = flame position. */
export const HangingLamp: React.FC<{ x: number; y: number; s?: number; on?: number; seed?: number; chainTop?: number }> = ({ x, y, s = 1, on = 1, seed = 0, chainTop = -400 }) => {
  const f = useCurrentFrame();
  const fl = flicker(f, seed) * on;
  const sw = Math.sin((f + seed * 30) / 70) * 1.5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${sw}) scale(${s})`}>
      <line x1={0} y1={chainTop / s} x2={0} y2={-30} stroke="#2a1a0e" strokeWidth={3} />
      <circle r={190 * fl} fill="url(#lampGlow)" opacity={0.9 * on} />
      <path d="M-46 -6 Q0 40 46 -6 L36 -18 L-36 -18 Z" fill="#a8742f" />
      <path d="M-46 -6 Q0 40 46 -6" fill="none" stroke="#6e4718" strokeWidth={3} />
      <path d="M-14 -18 L-8 -34 L8 -34 L14 -18 Z" fill="#7d5320" />
      <path d={`M0 -${30 + 22 * fl} Q10 -36 0 -18 Q-10 -36 0 -${30 + 22 * fl} Z`} fill="#ffe7a0" opacity={on} />
    </g>
  );
};

export const LampGlowDefs: React.FC = () => (
  <defs>
    <radialGradient id="lampGlow">
      <stop offset="0%" stopColor="#ffe3a0" stopOpacity={0.75} />
      <stop offset="35%" stopColor="#ffb85c" stopOpacity={0.25} />
      <stop offset="100%" stopColor="#ff9a3c" stopOpacity={0} />
    </radialGradient>
  </defs>
);

/* ---------------------------------------------------------------- the room */

/** Long room seen down the axis of the dastarkhan, light doorway at the far end. */
export const Room: React.FC<{ lampsOn?: number; lightIntensity?: number }> = ({ lampsOn = 1, lightIntensity = 1 }) => {
  const bx0 = 330, bx1 = 750, by0 = 430, by1 = VP.y + 100; // back wall
  const beams = [0.0, 0.32, 0.55, 0.72, 0.84];
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <LampGlowDefs />
      <defs>
        <linearGradient id="r-ceil" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#24150b" /><stop offset="100%" stopColor="#4a2e19" /></linearGradient>
        <linearGradient id="r-left" x1="0" x2="1"><stop offset="0%" stopColor="#3a2414" /><stop offset="100%" stopColor={pal.wall} /></linearGradient>
        <linearGradient id="r-right" x1="1" x2="0"><stop offset="0%" stopColor="#3a2414" /><stop offset="100%" stopColor={pal.wall} /></linearGradient>
        <radialGradient id="r-back" cx="50%" cy="70%" r="70%">
          <stop offset="0%" stopColor={lightIntensity > 0.2 ? "#d9a566" : pal.wall} />
          <stop offset="100%" stopColor={pal.wall} />
        </radialGradient>
        <linearGradient id="r-floor" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={pal.floorLit} /><stop offset="100%" stopColor="#3d2614" /></linearGradient>
      </defs>
      {/* ceiling */}
      <path d={`M0 0 H${W} L${bx1} ${by0} H${bx0} Z`} fill="url(#r-ceil)" />
      {beams.map((t, i) => {
        const y = lerp(30, by0 - 6, t), xl = lerp(0, bx0, t), xr = lerp(W, bx1, t);
        return <rect key={i} x={xl} y={y} width={xr - xl} height={lerp(26, 8, t)} fill={pal.beam} />;
      })}
      {/* walls */}
      <path d={`M0 0 L${bx0} ${by0} L${bx0} ${by1} L0 ${H * 0.78} Z`} fill="url(#r-left)" />
      <path d={`M${W} 0 L${bx1} ${by0} L${bx1} ${by1} L${W} ${H * 0.78} Z`} fill="url(#r-right)" />
      <rect x={bx0} y={by0} width={bx1 - bx0} height={by1 - by0} fill="url(#r-back)" />
      {/* side wall niches */}
      {[0.35, 0.62].map((t, i) => (
        <g key={i}>
          <path d={`M${lerp(0, bx0, t) + 20} ${lerp(330, by0 + 60, t)} q${lerp(40, 14, t)} -${lerp(60, 20, t)} ${lerp(80, 28, t)} 0 v${lerp(150, 50, t)} h-${lerp(80, 28, t)} Z`} fill="#2c1a0d" opacity={0.85} />
          <path d={`M${W - lerp(0, W - bx1, t) - 20} ${lerp(330, by0 + 60, t)} q-${lerp(40, 14, t)} -${lerp(60, 20, t)} -${lerp(80, 28, t)} 0 v${lerp(150, 50, t)} h${lerp(80, 28, t)} Z`} fill="#2c1a0d" opacity={0.85} />
        </g>
      ))}
      {/* doorway / source of light at the head */}
      <path d={`M${VP.x - 80} ${by1} V${by0 + 130} Q${VP.x} ${by0 + 40} ${VP.x + 80} ${by0 + 130} V${by1} Z`} fill={lightIntensity > 0.05 ? "#ffe8b8" : "#1d120a"} />
      <path d={`M${VP.x - 80} ${by1} V${by0 + 130} Q${VP.x} ${by0 + 40} ${VP.x + 80} ${by0 + 130} V${by1}`} fill="none" stroke="#3a2414" strokeWidth={10} />
      {/* floor */}
      <path d={`M0 ${H * 0.78} L${bx0} ${by1} H${bx1} L${W} ${H * 0.78} V${H} H0 Z`} fill="url(#r-floor)" />
      {/* rug edges along the walls */}
      <path d={`M0 ${H * 0.86} L${bx0 + 10} ${by1 + 4} L${bx0 + 40} ${by1 + 4} L120 ${H}  L0 ${H} Z`} fill="#6a2a22" opacity={0.55} />
      <path d={`M${W} ${H * 0.86} L${bx1 - 10} ${by1 + 4} L${bx1 - 40} ${by1 + 4} L${W - 120} ${H} L${W} ${H} Z`} fill="#6a2a22" opacity={0.55} />
      {/* hanging lamps */}
      <HangingLamp x={250} y={420} s={1.05} on={lampsOn} seed={1} chainTop={-420} />
      <HangingLamp x={830} y={420} s={1.05} on={lampsOn} seed={2} chainTop={-420} />
      <HangingLamp x={420} y={520} s={0.55} on={lampsOn} seed={3} chainTop={-400} />
      <HangingLamp x={660} y={520} s={0.55} on={lampsOn} seed={4} chainTop={-400} />
    </svg>
  );
};

/* ---------------------------------------------------------------- dastarkhan */

export const Dastarkhan: React.FC<{ dNear?: number; dFar?: number; seed?: string }> = ({ dNear = 0.95, dFar = 9, seed = "t" }) => {
  const n = persp(dNear, 1, 0.55), f = persp(dFar, 1, 0.55);
  const nl = persp(dNear, -1, 0.55), fl = persp(dFar, -1, 0.55);
  const items: React.ReactNode[] = [];
  for (let d = 1.15; d < dFar; d *= 1.22) {
    for (const side of [-0.55, -0.18, 0.2, 0.52]) {
      const p = persp(d, side, 0.5);
      const kind = Math.floor(random(`${seed}${d.toFixed(2)}${side}`) * 4);
      items.push(<Dish key={`${d}${side}`} x={p.x} y={p.y} s={p.s} kind={kind} />);
    }
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={`M${nl.x} ${n.y} L${fl.x} ${f.y} H${f.x} L${n.x} ${n.y} Z`} fill={pal.cloth} />
      <path d={`M${nl.x} ${n.y} L${fl.x} ${f.y} L${fl.x + 4} ${f.y} L${nl.x + 40} ${n.y} Z`} fill={pal.clothShade} />
      <path d={`M${n.x} ${n.y} L${f.x} ${f.y} L${f.x - 4} ${f.y} L${n.x - 40} ${n.y} Z`} fill={pal.clothShade} />
      {/* woven pattern lines */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1={lerp(nl.x, n.x, t)} y1={n.y} x2={lerp(fl.x, f.x, t)} y2={f.y} stroke="#c49c62" strokeWidth={3} opacity={0.5} />
      ))}
      {items}
    </svg>
  );
};

export const Dish: React.FC<{ x: number; y: number; s: number; kind: number }> = ({ x, y, s, kind }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={4} cy={10} rx={74} ry={20} fill="#000" opacity={0.15} />
    {kind === 0 && (<><ellipse rx={70} ry={22} fill="#8a4e26" /><ellipse cy={-4} rx={58} ry={16} fill="#5a2f14" /><ellipse cy={-8} rx={44} ry={10} fill="#c98a3c" /></>)}
    {kind === 1 && (<><ellipse rx={64} ry={20} fill="#c9a26a" /><circle cx={-20} cy={-8} r={10} fill="#5a2a14" /><circle cx={4} cy={-10} r={10} fill="#6a3218" /><circle cx={24} cy={-6} r={10} fill="#5a2a14" /><circle cx={-4} cy={0} r={9} fill="#4a2210" /></>)}
    {kind === 2 && (<><ellipse rx={60} ry={18} fill="#d8b070" /><ellipse cy={-3} rx={52} ry={13} fill="#e8c88a" /><path d="M-30 -4 Q0 -12 30 -4" stroke="#b88a4a" strokeWidth={3} fill="none" /></>)}
    {kind === 3 && (<><path d="M-26 0 Q-30 -54 -10 -64 L10 -64 Q30 -54 26 0 Z" fill="#9a5a2e" /><ellipse cy={-64} rx={12} ry={5} fill="#5a2f14" /><ellipse rx={26} ry={8} fill="#7a4220" /></>)}
  </g>
);

/* ---------------------------------------------------------------- people (no facial features) */

export type Headwear = "turban" | "shemagh" | "cap" | "veil";

/**
 * Seated relative, three-quarter view facing `face` (1 = right, -1 = left). No eyes or mouth — emotion via
 * head drop/turn and posture. Origin at the floor contact point; full height ≈ 400 units at s = 1.
 */
export const Seated: React.FC<{ x: number; y: number; s: number; robe: string; hw?: Headwear; hwColor?: string; beard?: boolean; face?: 1 | -1; drop?: number; turn?: number; lean?: number; dark?: number }> = ({ x, y, s, robe, hw = "turban", hwColor = "#efe4cc", beard = true, face = 1, drop = 0, turn = 0, lean = 0, dark = 0 }) => {
  const headRot = face * (drop * 22) + turn * 18;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * face} ${s}) rotate(${lean * 6})`} filter={dark > 0.04 ? `url(#dk${Math.min(9, Math.round(dark * 10))})` : undefined}>
      <ellipse cx={0} cy={6} rx={150} ry={22} fill="#000" opacity={0.25} />
      {/* folded legs + robe */}
      <path d="M-140 0 Q-150 -60 -90 -90 L-70 -250 Q0 -300 70 -250 L100 -90 Q160 -60 140 0 Z" fill={robe} />
      <path d="M-140 0 Q-150 -60 -90 -90 L-70 -250 Q-40 -270 -10 -276 L-30 -90 Q-60 -40 -60 0 Z" fill="#000" opacity={0.18} />
      {/* arm resting on knee */}
      <path d="M40 -230 Q90 -170 110 -100 L80 -88 Q60 -150 20 -200 Z" fill={robe} />
      <path d="M40 -230 Q90 -170 110 -100 L80 -88 Q60 -150 20 -200 Z" fill="#000" opacity={0.12} />
      <circle cx={100} cy={-92} r={16} fill={pal.skinShade} />
      {/* head */}
      <g transform={`translate(0 -${290 - drop * 14}) rotate(${headRot})`}>
        <rect x={-20} y={0} width={40} height={30} fill={pal.skinShade} />
        <ellipse cx={8} cy={-40} rx={44} ry={50} fill={pal.skin} />
        {beard && <path d="M-10 -20 Q20 30 52 -24 Q50 2 30 18 Q8 30 -14 4 Z" fill={pal.beard} opacity={0.92} />}
        {hw === "turban" && (<><path d="M-40 -58 Q8 -120 56 -58 Q58 -40 50 -38 Q8 -60 -38 -36 Q-46 -46 -40 -58 Z" fill={hwColor} /><path d="M-36 -48 Q8 -70 52 -48" stroke="#00000022" strokeWidth={6} fill="none" /></>)}
        {hw === "shemagh" && (<><path d="M-46 -50 Q8 -118 62 -50 L58 10 Q50 30 40 40 L44 -30 Q8 -60 -28 -30 L-58 60 Q-70 0 -46 -50 Z" fill={hwColor} /><path d="M-40 -60 Q8 -96 58 -60" stroke="#2b2b2b" strokeWidth={7} fill="none" /></>)}
        {hw === "cap" && <path d="M-36 -62 Q8 -104 52 -62 Z" fill={hwColor} />}
        {hw === "veil" && <path d="M-50 -40 Q8 -124 66 -40 L74 80 L-70 80 Z" fill={hwColor} />}
      </g>
    </g>
  );
};

/**
 * The boy (Ali) — ALWAYS from behind, no face. White thobe, green cloak, small white wrap; holds a clay jug.
 * arm: 0 = right arm down … 1 = raised high. Origin at the feet; height ≈ 900 units at s = 1.
 */
export const BoyBack: React.FC<{ x: number; y: number; s: number; arm?: number; jug?: boolean; glow?: number; walk?: number }> = ({ x, y, s, arm = 0, jug = true, glow = 0, walk = 0 }) => {
  const a = lerp(12, -168, arm); // shoulder rotation (deg)
  const bob = Math.sin(walk * Math.PI * 2) * 6;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      {glow > 0 && <ellipse cx={0} cy={-520} rx={360} ry={560} fill="url(#boyRim)" opacity={glow} />}
      <ellipse cx={0} cy={4} rx={150} ry={24} fill="#000" opacity={0.3} />
      {/* thobe */}
      <path d="M-120 0 L-100 -560 Q0 -610 100 -560 L120 0 Z" fill={pal.white} />
      {/* cloak */}
      <path d="M-150 -10 L-128 -560 Q-80 -640 0 -650 Q80 -640 128 -560 L150 -10 Q90 6 40 -6 L30 -540 L-30 -540 L-40 -6 Q-90 6 -150 -10 Z" fill={pal.green} />
      <path d="M-150 -10 L-128 -560 Q-100 -610 -60 -630 L-70 -10 Q-110 0 -150 -10 Z" fill={pal.greenDark} opacity={0.8} />
      <path d="M-30 -540 L-40 -6 L40 -6 L30 -540 Z" fill={pal.white} opacity={0.9} />
      {/* left arm with jug (screen left), relaxed */}
      <g transform="translate(-118 -560) rotate(8)">
        <path d="M-24 0 Q-40 160 -20 320 L22 320 Q24 160 22 0 Z" fill={pal.green} />
        <circle cx={0} cy={330} r={26} fill={pal.skin} />
        {jug && (
          <g transform="translate(0 360)">
            <path d="M-46 0 Q-74 70 -40 130 L40 130 Q74 70 46 0 Q30 -20 22 -34 L-22 -34 Q-30 -20 -46 0 Z" fill="#a85e2c" />
            <path d="M-46 0 Q-74 70 -40 130 L-10 130 Q-40 70 -20 -34 L-22 -34 Q-30 -20 -46 0 Z" fill="#7e4320" />
            <path d="M-20 -34 L-24 -52 L24 -52 L20 -34 Z" fill="#8a4a22" />
            <path d="M46 10 Q90 20 70 70" stroke="#7e4320" strokeWidth={12} fill="none" />
            <path d="M-50 40 Q0 54 50 40" stroke="#5a2f14" strokeWidth={5} fill="none" opacity={0.7} />
          </g>
        )}
      </g>
      {/* right arm, rotates up */}
      <g transform={`translate(118 -560) rotate(${a})`}>
        <path d="M-22 0 Q-30 160 -14 330 L26 330 Q34 160 24 0 Z" fill={pal.green} />
        <path d="M-14 300 L26 300 L22 340 L-12 340 Z" fill={pal.white} />
        <ellipse cx={6} cy={358} rx={26} ry={30} fill={pal.skin} />
      </g>
      {/* head from behind: neck, hair at nape, white wrap */}
      <rect x={-26} y={-690} width={52} height={60} fill={pal.skinShade} />
      <ellipse cx={0} cy={-740} rx={62} ry={70} fill="#2b1d16" />
      <ellipse cx={-62} cy={-738} rx={10} ry={20} fill={pal.skinShade} />
      <ellipse cx={62} cy={-738} rx={10} ry={20} fill={pal.skinShade} />
      <path d="M-66 -760 Q0 -850 66 -760 Q68 -735 60 -730 Q0 -760 -60 -730 Q-68 -740 -66 -760 Z" fill={pal.white} />
      <path d="M-62 -748 Q0 -774 62 -748" stroke="#00000018" strokeWidth={8} fill="none" />
    </g>
  );
};

/** Darkening filters dk0..dk9 (multiply RGB by 1 - k/10, slightly cooled) used for depth/atmosphere. */
export const DarkDefs: React.FC = () => (
  <defs>
    {Array.from({ length: 10 }).map((_, k) => {
      const a = 1 - k / 10;
      return (
        <filter key={k} id={`dk${k}`}>
          <feColorMatrix type="matrix" values={`${a} 0 0 0 0  0 ${a} 0 0 0  0 0 ${Math.min(1, a * 1.05)} 0 0  0 0 0 1 0`} />
        </filter>
      );
    })}
  </defs>
);

export const BoyRimDefs: React.FC = () => (
  <defs>
    <radialGradient id="boyRim">
      <stop offset="0%" stopColor={pal.light} stopOpacity={0.55} />
      <stop offset="60%" stopColor={pal.gold} stopOpacity={0.18} />
      <stop offset="100%" stopColor={pal.gold} stopOpacity={0} />
    </radialGradient>
  </defs>
);

/* ---------------------------------------------------------------- typography */

export const fontsAli = {
  title: "'Cormorant Garamond', 'Times New Roman', serif",
  body: "Nunito, Inter, sans-serif",
  arabic: "Amiri, serif",
};

export const GoldTitle: React.FC<{ text: string; y: number; size?: number; p: number; spacing?: number; glow?: number; color?: string }> = ({ text, y, size = 120, p, spacing = 0.04, glow = 1, color = pal.gold }) => (
  <div
    style={{
      position: "absolute", left: 40, right: 40, top: y, textAlign: "center", whiteSpace: "nowrap",
      fontFamily: fontsAli.title, fontWeight: 700, fontSize: size, lineHeight: 1.02, color,
      letterSpacing: `${spacing + (1 - p) * 0.12}em`, opacity: p, transform: `translateY(${(1 - p) * 24}px) scale(${0.96 + p * 0.04})`,
      textShadow: `0 0 ${30 * glow}px rgba(255,190,90,${0.55 * glow}), 0 4px 18px rgba(0,0,0,0.6)`,
    }}
  >
    {text}
  </div>
);

/** Small parchment tag (e.g. "1-суроо", "13 жаш"). */
export const Tag: React.FC<{ x: number; y: number; big: string; small: string; p: number; rot?: number }> = ({ x, y, big, small, p, rot = -4 }) => (
  <div
    style={{
      position: "absolute", left: x, top: y, padding: "14px 26px 12px", borderRadius: 10,
      background: "linear-gradient(180deg,#f4e3bf,#e2c690)", boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
      transform: `rotate(${rot}deg) scale(${0.7 + p * 0.3})`, opacity: p, textAlign: "center",
      border: "2px solid #b88a4a",
    }}
  >
    <div style={{ fontFamily: fontsAli.body, fontWeight: 900, fontSize: 76, lineHeight: 0.95, color: "#7d1f1f" }}>{big}</div>
    <div style={{ fontFamily: fontsAli.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.08em", color: "#4a2c18" }}>{small}</div>
  </div>
);
