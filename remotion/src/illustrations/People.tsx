import React from "react";
import { colors } from "../theme";

export type Hat = "none" | "kalpak" | "scarf" | "cap" | "elechek" | "hijab";

/**
 * Flat, friendly character. Origin at feet center. Height ≈ 300 at scale 1.
 * armL / armR: rotation in degrees (0 = hanging down, negative = raised forward for right arm)
 */
export const Person: React.FC<{
  x: number;
  y: number;
  scale?: number;
  skin?: string;
  outfit?: string;
  outfit2?: string;
  hat?: Hat;
  hatColor?: string;
  hair?: string;
  flip?: boolean;
  armL?: number;
  armR?: number;
  smile?: boolean;
  sit?: boolean;
  child?: boolean;
  bob?: number;
}> = ({ x, y, scale = 1, skin = colors.skin1, outfit = colors.brand, outfit2, hat = "none", hatColor = "#F7F3EA", hair = "#2B2320", flip = false, armL = 0, armR = 0, smile = true, sit = false, child = false, bob = 0 }) => {
  const s = child ? scale * 0.62 : scale;
  const o2 = outfit2 ?? outfit;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s})`}>
      {/* legs */}
      {!sit && (
        <g>
          <rect x={-34} y={-120} width={28} height={120} rx={12} fill={o2} />
          <rect x={6} y={-120} width={28} height={120} rx={12} fill={o2} />
          <ellipse cx={-20} cy={0} rx={24} ry={10} fill={colors.ink} />
          <ellipse cx={20} cy={0} rx={24} ry={10} fill={colors.ink} />
        </g>
      )}
      {sit && (
        <g>
          <rect x={-40} y={-120} width={80} height={60} rx={20} fill={o2} />
          <rect x={-40} y={-80} width={110} height={26} rx={13} fill={o2} />
          <ellipse cx={80} cy={-54} rx={22} ry={10} fill={colors.ink} />
        </g>
      )}
      {/* body */}
      <path d="M-62 -120 Q-70 -250 -40 -270 L40 -270 Q70 -250 62 -120 Z" fill={outfit} />
      {/* arms */}
      <g transform={`translate(-52 -250) rotate(${armL})`}>
        <rect x={-14} y={0} width={28} height={130} rx={14} fill={outfit} />
        <circle cx={0} cy={136} r={16} fill={skin} />
      </g>
      <g transform={`translate(52 -250) rotate(${armR})`}>
        <rect x={-14} y={0} width={28} height={130} rx={14} fill={outfit} />
        <circle cx={0} cy={136} r={16} fill={skin} />
      </g>
      {/* neck + head */}
      <rect x={-14} y={-300} width={28} height={40} fill={skin} />
      <circle cx={0} cy={-330} r={52} fill={skin} />
      {/* hair / hat */}
      {hat === "none" && <path d="M-52 -340 Q-50 -395 0 -392 Q50 -395 52 -340 Q30 -360 0 -358 Q-30 -360 -52 -340 Z" fill={hair} />}
      {hat === "cap" && (
        <g>
          <path d="M-54 -345 Q-50 -400 0 -398 Q50 -400 54 -345 Z" fill={hatColor} />
          <rect x={-10} y={-352} width={74} height={12} rx={6} fill={hatColor} />
        </g>
      )}
      {hat === "kalpak" && (
        <g>
          <path d="M-56 -345 L-30 -430 L0 -450 L30 -430 L56 -345 Z" fill={hatColor} stroke={colors.ink} strokeWidth={4} />
          <path d="M-56 -345 Q0 -325 56 -345 L56 -330 Q0 -310 -56 -330 Z" fill={colors.ink} />
          <path d="M-6 -395 L0 -430 L6 -395" stroke={colors.ink} strokeWidth={3} fill="none" />
        </g>
      )}
      {hat === "scarf" && (
        <g>
          <path d="M-58 -330 Q-60 -400 0 -398 Q60 -400 58 -330 L58 -280 Q0 -260 -58 -280 Z" fill={hatColor} />
          <circle cx={0} cy={-330} r={44} fill={skin} />
        </g>
      )}
      {hat === "hijab" && (
        <g>
          <path d="M-60 -330 Q-62 -405 0 -402 Q62 -405 60 -330 L66 -250 Q0 -230 -66 -250 Z" fill={hatColor} />
          <circle cx={0} cy={-328} r={42} fill={skin} />
        </g>
      )}
      {hat === "elechek" && (
        <g>
          <ellipse cx={0} cy={-392} rx={62} ry={44} fill="#FFFFFF" />
          <rect x={-62} y={-400} width={124} height={50} rx={14} fill="#FFFFFF" />
          <path d="M-56 -350 L-62 -300 Q0 -280 62 -300 L56 -350 Z" fill="#FFFFFF" />
          <circle cx={0} cy={-330} r={42} fill={skin} />
          <path d="M-20 -395 L20 -395" stroke={colors.terracotta} strokeWidth={4} />
        </g>
      )}
      {/* face */}
      <circle cx={-18} cy={-335} r={5} fill={colors.ink} />
      <circle cx={18} cy={-335} r={5} fill={colors.ink} />
      {smile ? <path d="M-16 -312 Q0 -298 16 -312" stroke={colors.ink} strokeWidth={4} fill="none" strokeLinecap="round" /> : <path d="M-14 -308 L14 -308" stroke={colors.ink} strokeWidth={4} strokeLinecap="round" />}
    </g>
  );
};

/** Pair of open hands (receiving / giving) */
export const Hands: React.FC<{ x: number; y: number; scale?: number; skin?: string; open?: number }> = ({ x, y, scale = 1, skin = colors.skin1, open = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <g transform={`rotate(${-10 * open})`}>
      <path d="M-150 60 Q-140 -20 -80 -30 L-20 -20 Q10 0 0 40 L-20 90 Q-80 110 -150 60 Z" fill={skin} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-105 + i * 24} y={-70 - (i === 1 || i === 2 ? 12 : 0)} width={20} height={70} rx={10} fill={skin} />
      ))}
    </g>
    <g transform={`scale(-1 1) rotate(${-10 * open})`}>
      <path d="M-150 60 Q-140 -20 -80 -30 L-20 -20 Q10 0 0 40 L-20 90 Q-80 110 -150 60 Z" fill={skin} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-105 + i * 24} y={-70 - (i === 1 || i === 2 ? 12 : 0)} width={20} height={70} rx={10} fill={skin} />
      ))}
    </g>
  </g>
);
