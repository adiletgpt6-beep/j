import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { colors, fonts, safe } from "../theme";
import { pop } from "./anim";

/** Small brand chip in the top-left safe area */
export const BrandChip: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, delay, { damping: 16, stiffness: 100 });
  return (
    <div style={{ position: "absolute", top: safe.top - 70, left: safe.side, display: "flex", alignItems: "center", gap: 12, opacity: s, transform: `translateX(${(1 - s) * -20}px)` }}>
      <Img src={staticFile("brand/zeket-logo.png")} style={{ width: 54, height: 50, objectFit: "contain" }} />
      <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 34, color: colors.brand, letterSpacing: 2 }}>ZEKET</div>
    </div>
  );
};

/** Large logo lockup for outros */
export const LogoLockup: React.FC<{ delay?: number; y?: number; scale?: number; showUrl?: boolean }> = ({ delay = 0, y = 820, scale = 1, showUrl = true }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, delay, { damping: 13, stiffness: 90 });
  const s2 = pop(frame, delay + 10, { damping: 16, stiffness: 110 });
  const glow = 0.5 + 0.5 * Math.sin(frame / 20);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${scale})` }}>
      <div style={{ width: 420, height: 420, borderRadius: 210, background: `radial-gradient(circle, rgba(224,169,58,${0.18 + glow * 0.1}) 0%, rgba(224,169,58,0) 70%)`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.7 + 0.3 * s})`, opacity: s }}>
        <Img src={staticFile("brand/zeket-logo.png")} style={{ width: 300, height: 280, objectFit: "contain" }} />
      </div>
      <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 96, color: colors.brand, letterSpacing: 6, opacity: s2, transform: `translateY(${(1 - s2) * 30}px)`, marginTop: -20 }}>ZEKET</div>
      {showUrl && (
        <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 40, color: colors.inkSoft, opacity: s2, marginTop: 6 }}>zeket.kg</div>
      )}
    </div>
  );
};
