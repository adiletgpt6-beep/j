import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, W, H } from "../theme";
import { prog } from "../components/anim";

/** Soft decorative background: cream with faint radial glow and tiny dot pattern */
export const SoftBackground: React.FC<{ tint?: string; glow?: string; children?: React.ReactNode }> = ({ tint = colors.cream, glow = colors.mint, children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, ${glow} 0%, ${tint} 62%)` }}>
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: 0.35 }}>
      <defs>
        <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="2.2" fill={colors.brandSoft} opacity="0.35" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#dots)" />
    </svg>
    {children}
  </AbsoluteFill>
);

/** Fades children in over the first frames and slides them up slightly */
export const Enter: React.FC<{ delay?: number; children: React.ReactNode; dy?: number; dur?: number }> = ({ delay = 0, children, dy = 40, dur = 14 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, delay + dur);
  return <div style={{ position: "absolute", inset: 0, opacity: p, transform: `translateY(${(1 - p) * dy}px)` }}>{children}</div>;
};

/** Example / illustration badge (top right) */
export const Badge: React.FC<{ text: string; delay?: number; color?: string }> = ({ text, delay = 0, color = colors.terracotta }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, delay + 12);
  return (
    <div style={{ position: "absolute", top: 130, right: 64, opacity: p, transform: `translateY(${(1 - p) * -16}px)`, fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 32, color: "#fff", background: color, padding: "10px 26px", borderRadius: 999, letterSpacing: 1 }}>
      {text}
    </div>
  );
};
