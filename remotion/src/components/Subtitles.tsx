import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, fonts, safe, sizes, W } from "../theme";
import type { VideoData } from "../types";

type AbsCue = { s: number; e: number; text: string; words: { w: string; s: number; e: number }[] };

const buildAbs = (data: VideoData): AbsCue[] => {
  const out: AbsCue[] = [];
  for (const sc of data.scenes) {
    const base = (sc.startFrame + sc.audioStartFrame) / data.fps;
    for (const c of sc.cues) {
      const ws = sc.words.filter((w) => w.s >= c.s - 0.2 && w.e <= c.e + 0.05 && c.text.includes(w.w));
      out.push({ s: base + c.s, e: base + c.e, text: c.text, words: ws.map((w) => ({ w: w.w, s: base + w.s, e: base + w.e })) });
    }
  }
  return out;
};

/** Burned-in subtitles: pill above the bottom safe zone, 2 lines max, current word highlighted. */
export const Subtitles: React.FC<{ data: VideoData }> = ({ data }) => {
  const frame = useCurrentFrame();
  const t = frame / data.fps;
  const cues = React.useMemo(() => buildAbs(data), [data]);
  const cue = cues.find((c) => t >= c.s && t < c.e);
  if (!cue) return null;
  const age = t - cue.s;
  const appear = Math.min(1, age / 0.12);
  const words = cue.text.split(" ");
  let wi = 0;
  return (
    <div style={{ position: "absolute", left: 0, width: W, bottom: safe.bottom, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: W - safe.side * 2 + 20,
          background: "rgba(16, 40, 30, 0.86)",
          borderRadius: 28,
          padding: "20px 34px",
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: sizes.subtitle,
          lineHeight: 1.28,
          color: colors.white,
          textAlign: "center",
          opacity: appear,
          transform: `translateY(${(1 - appear) * 12}px)`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        {words.map((w, i) => {
          const tw = cue.words.find((x) => x.w === w && cue.words.indexOf(x) >= wi);
          if (tw) wi = cue.words.indexOf(tw) + 1;
          const active = tw ? t >= tw.s && t <= tw.e + 0.08 : false;
          return (
            <span key={i} style={{ color: active ? colors.gold : colors.white, transition: "none" }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};
