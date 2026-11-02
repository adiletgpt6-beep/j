import React from "react";
import { W, H, colors } from "../theme";

/** Simple village house with roof, door, window, optional chimney smoke */
export const House: React.FC<{ x: number; y: number; scale?: number; wall?: string; roof?: string; lit?: boolean; windowOn?: boolean }> = ({ x, y, scale = 1, wall = "#F3E4C8", roof = colors.terracotta, lit = false, windowOn = true }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-110} y={-120} width={220} height={140} rx={8} fill={wall} />
    <path d={`M-135 -115 L0 -230 L135 -115 Z`} fill={roof} />
    <rect x={-32} y={-60} width={64} height={80} rx={6} fill={colors.brandDeep} />
    <rect x={40} y={-95} width={48} height={48} rx={6} fill={windowOn ? (lit ? "#FFE49A" : "#BFDDEB") : wall} stroke="#fff" strokeWidth={4} />
    <rect x={-88} y={-95} width={48} height={48} rx={6} fill={windowOn ? (lit ? "#FFE49A" : "#BFDDEB") : wall} stroke="#fff" strokeWidth={4} />
    <rect x={60} y={-210} width={26} height={60} fill="#8C6A52" />
  </g>
);

/** Kyrgyz yurt (boz üy) */
export const Yurt: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-120 0 L-110 -80 L110 -80 L120 0 Z" fill="#F4ECDD" />
    <path d="M-110 -80 Q0 -200 110 -80 Z" fill="#E7DCC6" />
    <path d="M-110 -80 Q0 -200 110 -80" fill="none" stroke={colors.terracotta} strokeWidth={6} />
    <path d="M-120 0 L120 0" stroke={colors.terracotta} strokeWidth={6} />
    <path d="M-20 -164 Q0 -178 20 -164" fill="none" stroke={colors.brandDeep} strokeWidth={6} />
    <rect x={-26} y={-70} width={52} height={70} rx={6} fill={colors.brandDeep} />
    <path d="M-110 -60 L110 -60 M-116 -40 L116 -40" stroke={colors.terracotta} strokeWidth={4} opacity={0.6} />
  </g>
);

/** Mosque silhouette (dome + minaret), no people */
export const Mosque: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({ x, y, scale = 1, color = "#E9F1EC" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-150} y={-90} width={300} height={90} rx={8} fill={color} />
    <path d="M-90 -90 Q0 -220 90 -90 Z" fill={color} />
    <rect x={-170} y={-230} width={30} height={230} rx={8} fill={color} />
    <path d="M-170 -230 Q-155 -270 -140 -230 Z" fill={color} />
    <circle cx={0} cy={-212} r={6} fill={colors.gold} />
    <path d="M-2 -236 a10 10 0 1 0 8 4 a7 7 0 1 1 -8 -4" fill={colors.gold} />
    <rect x={-40} y={-60} width={80} height={60} rx={40} fill={colors.brandDeep} opacity={0.8} />
  </g>
);

export const Tree: React.FC<{ x: number; y: number; scale?: number; grow?: number; leaf?: string; trunk?: string; sway?: number }> = ({ x, y, scale = 1, grow = 1, leaf = "#5E9E6E", trunk = "#8C6A52", sway = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale * grow}) rotate(${sway})`}>
    <path d="M-14 0 L-10 -120 L10 -120 L14 0 Z" fill={trunk} />
    <circle cx={0} cy={-170} r={70} fill={leaf} />
    <circle cx={-55} cy={-130} r={55} fill={leaf} />
    <circle cx={55} cy={-130} r={55} fill={leaf} />
    <circle cx={0} cy={-110} r={60} fill={leaf} />
    <circle cx={-20} cy={-175} r={30} fill="#7FBA8B" opacity={0.7} />
  </g>
);

export const Sapling: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M0 0 L0 -70" stroke="#6E9B5B" strokeWidth={8} strokeLinecap="round" />
    <path d="M0 -45 Q-40 -70 -30 -100 Q0 -80 0 -45" fill="#5E9E6E" />
    <path d="M0 -60 Q40 -85 30 -115 Q0 -95 0 -60" fill="#7FBA8B" />
  </g>
);

/** Wheat ear (brand motif) */
export const Wheat: React.FC<{ x: number; y: number; scale?: number; color?: string; bend?: number }> = ({ x, y, scale = 1, color = colors.gold, bend = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${bend})`}>
    <path d="M0 0 Q 6 -120 0 -240" stroke="#B8902E" strokeWidth={6} fill="none" strokeLinecap="round" />
    {Array.from({ length: 7 }).map((_, i) => (
      <g key={i} transform={`translate(0 ${-110 - i * 20})`}>
        <ellipse cx={-14} cy={0} rx={10} ry={20} fill={color} transform="rotate(-25)" />
        <ellipse cx={14} cy={0} rx={10} ry={20} fill={color} transform="rotate(25)" />
      </g>
    ))}
    <ellipse cx={0} cy={-255} rx={9} ry={18} fill={color} />
  </g>
);

/** Water well with roof */
export const Well: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx={0} cy={0} rx={70} ry={22} fill="#8D8A82" />
    <rect x={-70} y={-50} width={140} height={50} fill="#A9A49A" />
    <rect x={-70} y={-50} width={140} height={10} fill="#C8C2B6" />
    <rect x={-60} y={-150} width={10} height={100} fill="#8C6A52" />
    <rect x={50} y={-150} width={10} height={100} fill="#8C6A52" />
    <path d="M-90 -150 L0 -210 L90 -150 Z" fill={colors.terracotta} />
    <rect x={-60} y={-120} width={120} height={8} fill="#6B4F3A" />
    <rect x={-14} y={-112} width={28} height={30} rx={4} fill="#7FB3D5" />
  </g>
);

export const Book: React.FC<{ x: number; y: number; scale?: number; color?: string; open?: boolean }> = ({ x, y, scale = 1, color = colors.brand, open = true }) =>
  open ? (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-150 -90 Q-75 -110 0 -90 L0 90 Q-75 70 -150 90 Z" fill="#FFF9EC" stroke={color} strokeWidth={8} strokeLinejoin="round" />
      <path d="M150 -90 Q75 -110 0 -90 L0 90 Q75 70 150 90 Z" fill="#FFF9EC" stroke={color} strokeWidth={8} strokeLinejoin="round" />
      {[-60, -30, 0, 30].map((dy, i) => (
        <g key={i}>
          <line x1={-120} y1={dy} x2={-30} y2={dy - 4} stroke={colors.mint} strokeWidth={8} strokeLinecap="round" />
          <line x1={30} y1={dy - 4} x2={120} y2={dy} stroke={colors.mint} strokeWidth={8} strokeLinecap="round" />
        </g>
      ))}
    </g>
  ) : (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={-70} y={-95} width={140} height={190} rx={10} fill={color} />
      <rect x={-56} y={-95} width={12} height={190} fill="rgba(255,255,255,0.35)" />
      <rect x={-30} y={-50} width={80} height={14} rx={7} fill={colors.gold} />
    </g>
  );

/** Stylised phone frame for UI illustrations. Children rendered in screen coords (0..420 x 0..860). */
export const Phone: React.FC<{ x: number; y: number; scale?: number; children?: React.ReactNode; label?: string }> = ({ x, y, scale = 1, children, label }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-230} y={-450} width={460} height={900} rx={60} fill={colors.ink} />
    <rect x={-210} y={-430} width={420} height={860} rx={44} fill="#FFFFFF" />
    <rect x={-60} y={-420} width={120} height={22} rx={11} fill={colors.ink} />
    <g transform="translate(-210 -430)">{children}</g>
    {label && (
      <text x={0} y={490} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize={26} fontWeight={600} fill={colors.inkSoft}>
        {label}
      </text>
    )}
  </g>
);

/** Full-screen SVG canvas helper */
export const Canvas: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
    {children}
  </svg>
);
