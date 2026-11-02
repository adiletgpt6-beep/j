import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, fonts, safe, sizes, W } from "../theme";
import { pop, prog } from "./anim";

/** Caption: words rise in one by one. Positioned in the upper safe zone by default. */
export const Caption: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  top?: number;
  align?: "center" | "left";
  weight?: number;
  maxWidth?: number;
  out?: number; // frame at which to fade out
}> = ({ text, delay = 0, size = sizes.caption, color = colors.brandDeep, top = safe.top + 40, align = "center", weight = 800, maxWidth = W - safe.side * 2, out }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const fade = out ? 1 - prog(frame, out, out + 10) : 1;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: safe.side,
        width: W - safe.side * 2,
        display: "flex",
        justifyContent: align === "center" ? "center" : "flex-start",
        opacity: fade,
      }}
    >
      <div style={{ maxWidth, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", gap: `0 ${size * 0.28}px`, fontFamily: fonts.display, fontWeight: weight, fontSize: size, lineHeight: 1.15, color, textAlign: align }}>
        {words.map((w, i) => {
          const s = pop(frame, delay + i * 3, { damping: 16, stiffness: 140 });
          return (
            <span key={i} style={{ display: "inline-block", opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Small rounded note pill (sources, disclaimers). Placed just above the subtitle zone by default. */
export const Note: React.FC<{ text: string; delay?: number; bottom?: number; color?: string; bg?: string; size?: number }> = ({
  text,
  delay = 0,
  bottom = safe.bottom + 290,
  color = colors.brandDeep,
  bg = "rgba(255,255,255,0.78)",
  size = sizes.note,
}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, delay, { damping: 18, stiffness: 110 });
  return (
    <div style={{ position: "absolute", bottom, left: 0, width: W, display: "flex", justifyContent: "center", opacity: s, transform: `translateY(${(1 - s) * 20}px)` }}>
      <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: size, color, background: bg, padding: "14px 30px", borderRadius: 999, border: `2px solid ${colors.mint}`, maxWidth: W - safe.side * 2, textAlign: "center" }}>
        {text}
      </div>
    </div>
  );
};

/** Big number / short key phrase that scales in */
export const BigLabel: React.FC<{ text: string; delay?: number; size?: number; color?: string; x?: number; y?: number; weight?: number; bg?: string }> = ({
  text,
  delay = 0,
  size = 150,
  color = colors.brand,
  x = W / 2,
  y = 900,
  weight = 900,
  bg,
}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, delay, { damping: 12, stiffness: 120 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * s})`,
        opacity: s,
        fontFamily: fonts.display,
        fontWeight: weight,
        fontSize: size,
        color,
        whiteSpace: "nowrap",
        background: bg,
        padding: bg ? "10px 40px" : 0,
        borderRadius: 40,
        letterSpacing: -2,
      }}
    >
      {text}
    </div>
  );
};

/** Tag label with icon-less rounded background, e.g. list items */
export const Tag: React.FC<{ text: string; delay?: number; x: number; y: number; color?: string; bg?: string; size?: number; width?: number }> = ({
  text,
  delay = 0,
  x,
  y,
  color = colors.white,
  bg = colors.brand,
  size = 40,
  width,
}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, delay, { damping: 14, stiffness: 130 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * s})`,
        opacity: s,
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: size,
        color,
        background: bg,
        padding: "14px 34px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        width,
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      {text}
    </div>
  );
};
