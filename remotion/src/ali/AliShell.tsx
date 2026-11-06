import React, { useEffect } from "react";
import { AbsoluteFill, Audio, Loop, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import fontList from "../../public/fonts/ali-fonts.json";
import { loadFonts } from "../fonts";
import type { SceneData } from "../types";
import { PendingScene, aliScenes } from "./scenes";
import { fontsAli, pal } from "./kit";

export type AliData = { id: string; fps: number; totalFrames: number; hasAudio: boolean; scenes: (Omit<SceneData, "audio"> & { audio: string | null })[] };

let aliFontsStarted = false;
const loadAliFonts = () => {
  if (aliFontsStarted || typeof document === "undefined") return;
  aliFontsStarted = true;
  const h = delayRender("ali fonts");
  Promise.all(
    (fontList as [string, string, number, string][]).map(([fam, file, w, ur]) =>
      new FontFace(fam, `url(${staticFile(file)})`, { weight: String(w), unicodeRange: ur }).load().then((ff) => document.fonts.add(ff))
    )
  ).then(() => continueRender(h)).catch((e) => { console.error(e); continueRender(h); });
};

export const AliShell: React.FC<{ data: AliData }> = ({ data }) => {
  useEffect(() => { loadFonts(); loadAliFonts(); }, []);
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [1, 0], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [data.totalFrames - 20, data.totalFrames - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0b0603" }}>
      {data.scenes.map((sc) => {
        const Comp = aliScenes[sc.id] ?? PendingScene;
        return (
          <Sequence key={sc.id} from={sc.startFrame} durationInFrames={sc.durationInFrames}>
            <Comp scene={sc as SceneData} durationInFrames={sc.durationInFrames} />
            {data.hasAudio && sc.audio && (
              <Sequence from={sc.audioStartFrame}>
                <Audio src={staticFile(sc.audio)} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      {/* ambience: interior room tone with lamp crackle (no music) */}
      <Loop durationInFrames={39 * 30}>
        <Audio src={staticFile("ali/sfx/room.mp3")} volume={0.55} />
      </Loop>
      <AliSubtitles data={data} />
      <AbsoluteFill style={{ background: "#000", opacity: Math.max(fadeIn, fadeOut), pointerEvents: "none" }} />
      {!data.hasAudio && (
        <div style={{ position: "absolute", top: 60, right: 40, padding: "8px 16px", borderRadius: 8, background: "rgba(0,0,0,0.55)", color: "#ffb4a0", fontFamily: fontsAli.body, fontWeight: 800, fontSize: 26 }}>
          ОЗВУЧКА ЖОК · тайминг болжолдуу
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Burned-in Kyrgyz subtitles: warm dark plate, current word in gold, lower-third above platform UI. */
const AliSubtitles: React.FC<{ data: AliData }> = ({ data }) => {
  const f = useCurrentFrame();
  const t = f / data.fps;
  const cues = React.useMemo(
    () => data.scenes.flatMap((sc) => {
      const base = (sc.startFrame + sc.audioStartFrame) / data.fps;
      return sc.cues.map((c) => ({ s: base + c.s, e: base + c.e, words: sc.words.slice((c as any).w0, (c as any).w1).map((w) => ({ ...w, s: base + w.s, e: base + w.e })) }));
    }),
    [data]
  );
  const cue = cues.find((c) => t >= c.s && t < c.e);
  if (!cue) return null;
  const k = Math.min(1, (t - cue.s) / 0.12) * Math.min(1, (cue.e - t) / 0.1);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 360, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{
        maxWidth: 900, padding: "18px 34px 20px", borderRadius: 26, background: "rgba(22,12,6,0.74)",
        border: "1.5px solid rgba(255,210,122,0.28)", boxShadow: "0 12px 34px rgba(0,0,0,0.4)",
        fontFamily: fontsAli.body, fontWeight: 800, fontSize: 54, lineHeight: 1.24, color: "#fbf3e2", textAlign: "center", textWrap: "balance",
        opacity: k, transform: `translateY(${(1 - k) * 10}px)`,
      }}>
        {cue.words.map((w, i) => (
          <span key={i} style={{ color: t >= w.s && t <= w.e + 0.1 ? pal.gold : undefined }}>{w.w}{i < cue.words.length - 1 ? " " : ""}</span>
        ))}
      </div>
    </div>
  );
};
