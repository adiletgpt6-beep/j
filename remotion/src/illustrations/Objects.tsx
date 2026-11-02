import React from "react";
import { colors } from "../theme";

export const Coin: React.FC<{ x: number; y: number; r?: number; color?: string; glow?: boolean; label?: string }> = ({ x, y, r = 30, color = colors.gold, glow = false, label }) => (
  <g transform={`translate(${x} ${y})`}>
    {glow && <circle r={r * 1.8} fill={color} opacity={0.25} />}
    <circle r={r} fill={color} />
    <circle r={r * 0.72} fill="none" stroke={colors.goldDeep} strokeWidth={r * 0.08} />
    {label ? (
      <text y={r * 0.3} textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight={900} fontSize={r * 0.9} fill={colors.goldDeep}>
        {label}
      </text>
    ) : (
      <circle r={r * 0.22} fill={colors.goldDeep} opacity={0.8} />
    )}
  </g>
);

export const CoinStack: React.FC<{ x: number; y: number; count?: number; width?: number; color?: string }> = ({ x, y, count = 5, width = 90, color = colors.gold }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: count }).map((_, i) => (
      <g key={i} transform={`translate(0 ${-i * 16})`}>
        <ellipse cx={0} cy={0} rx={width / 2} ry={14} fill={colors.goldDeep} />
        <rect x={-width / 2} y={-14} width={width} height={14} fill={colors.goldDeep} />
        <ellipse cx={0} cy={-14} rx={width / 2} ry={14} fill={color} />
      </g>
    ))}
  </g>
);

export const Banknote: React.FC<{ x: number; y: number; rotate?: number; scale?: number; color?: string }> = ({ x, y, rotate = 0, scale = 1, color = colors.brandSoft }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <rect x={-90} y={-45} width={180} height={90} rx={12} fill={color} />
    <rect x={-78} y={-33} width={156} height={66} rx={8} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={3} />
    <circle cx={0} cy={0} r={22} fill="rgba(255,255,255,0.5)" />
  </g>
);

export const GoldBar: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-70 30 L-55 -30 L55 -30 L70 30 Z" fill={colors.gold} />
    <path d="M-55 -30 L-45 -42 L45 -42 L55 -30 Z" fill="#F2CC6B" />
    <rect x={-30} y={-14} width={60} height={14} rx={4} fill={colors.goldDeep} opacity={0.5} />
  </g>
);

/** Balance scale. tilt in degrees */
export const Scale: React.FC<{ x: number; y: number; scale?: number; tilt?: number; left?: React.ReactNode; right?: React.ReactNode }> = ({ x, y, scale = 1, tilt = 0, left, right }) => {
  const arm = 220;
  const dy = Math.sin((tilt * Math.PI) / 180) * arm;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={-120} y={160} width={240} height={26} rx={13} fill={colors.brandDeep} />
      <rect x={-12} y={-160} width={24} height={330} rx={12} fill={colors.brandDeep} />
      <g transform={`rotate(${tilt})`}>
        <rect x={-arm} y={-172} width={arm * 2} height={20} rx={10} fill={colors.brandDeep} />
      </g>
      {/* pans */}
      <g transform={`translate(${-arm} ${-162 + dy})`}>
        <line x1={0} y1={0} x2={-60} y2={110} stroke={colors.brandDeep} strokeWidth={5} />
        <line x1={0} y1={0} x2={60} y2={110} stroke={colors.brandDeep} strokeWidth={5} />
        <path d="M-90 110 Q0 170 90 110 Z" fill={colors.brandSoft} />
        <g transform="translate(0 112)">{left}</g>
      </g>
      <g transform={`translate(${arm} ${-162 - dy})`}>
        <line x1={0} y1={0} x2={-60} y2={110} stroke={colors.brandDeep} strokeWidth={5} />
        <line x1={0} y1={0} x2={60} y2={110} stroke={colors.brandDeep} strokeWidth={5} />
        <path d="M-90 110 Q0 170 90 110 Z" fill={colors.brandSoft} />
        <g transform="translate(0 112)">{right}</g>
      </g>
      <circle cx={0} cy={-162} r={16} fill={colors.gold} />
    </g>
  );
};

/** Savings box / chest */
export const Chest: React.FC<{ x: number; y: number; scale?: number; open?: number }> = ({ x, y, scale = 1, open = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-120} y={-80} width={240} height={110} rx={14} fill="#A66E3F" />
    <rect x={-120} y={-80} width={240} height={18} fill="#8C5A32" />
    <g transform={`translate(-120 -80) rotate(${-open * 60}) translate(120 80)`}>
      <path d="M-120 -80 Q-120 -150 0 -150 Q120 -150 120 -80 Z" fill="#B97A48" />
      <rect x={-120} y={-92} width={240} height={14} fill="#8C5A32" />
    </g>
    <rect x={-14} y={-50} width={28} height={36} rx={6} fill={colors.gold} />
  </g>
);

export const Card: React.FC<{ x: number; y: number; w: number; h: number; color?: string; stroke?: string; radius?: number; children?: React.ReactNode; opacity?: number; shadow?: boolean }> = ({
  x,
  y,
  w,
  h,
  color = "#FFFFFF",
  stroke = colors.mint,
  radius = 36,
  children,
  opacity = 1,
  shadow = true,
}) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    {shadow && <rect x={-w / 2 + 6} y={-h / 2 + 14} width={w} height={h} rx={radius} fill="rgba(0,0,0,0.06)" />}
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={radius} fill={color} stroke={stroke} strokeWidth={4} />
    {children}
  </g>
);

export const Check: React.FC<{ x: number; y: number; r?: number; color?: string; progress?: number }> = ({ x, y, r = 30, color = colors.brand, progress = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={color} />
    <path d={`M${-r * 0.45} 0 L${-r * 0.1} ${r * 0.35} L${r * 0.5} ${-r * 0.35}`} fill="none" stroke="#fff" strokeWidth={r * 0.22} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={r * 2.2} strokeDashoffset={r * 2.2 * (1 - progress)} />
  </g>
);

export const Heart: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({ x, y, scale = 1, color = colors.terracotta }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M0 40 C-60 -10 -60 -60 -25 -60 C-8 -60 0 -45 0 -40 C0 -45 8 -60 25 -60 C60 -60 60 -10 0 40 Z" fill={color} />
  </g>
);

export const SvgText: React.FC<{ x: number; y: number; size?: number; weight?: number; color?: string; anchor?: "start" | "middle" | "end"; family?: "display" | "body"; children: React.ReactNode; opacity?: number }> = ({
  x,
  y,
  size = 36,
  weight = 700,
  color = colors.ink,
  anchor = "middle",
  family = "display",
  children,
  opacity = 1,
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={family === "display" ? "Nunito, Inter, sans-serif" : "Inter, sans-serif"} fontWeight={weight} fontSize={size} fill={color} opacity={opacity}>
    {children}
  </text>
);
