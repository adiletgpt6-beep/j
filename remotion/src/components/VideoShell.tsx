import React, { useEffect } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFonts } from "../fonts";
import { colors } from "../theme";
import type { SceneMap, VideoData } from "../types";
import { sceneRegistry } from "../videos/registry";
import { Subtitles } from "./Subtitles";

const T = 10; // transition frames

export const VideoShell: React.FC<{ data: VideoData }> = ({ data }) => {
  const scenes: SceneMap = sceneRegistry[data.id] ?? {};
  useEffect(() => loadFonts(), []);
  const frame = useCurrentFrame();
  const endFade = interpolate(frame, [data.totalFrames - 18, data.totalFrames - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: colors.cream, fontFamily: "Inter, sans-serif" }}>
      <TransitionSeries>
        {data.scenes.map((sc, i) => {
          const Comp = scenes[sc.id];
          const last = i === data.scenes.length - 1;
          const dur = sc.durationInFrames + (last ? 0 : T);
          return (
            <React.Fragment key={sc.id}>
              <TransitionSeries.Sequence durationInFrames={dur}>
                <AbsoluteFill style={{ background: colors.cream }}>
                  {Comp ? <Comp scene={sc} lang={data.lang} durationInFrames={dur} index={i} /> : <MissingScene id={sc.id} />}
                </AbsoluteFill>
                <Sequence from={sc.audioStartFrame} durationInFrames={Math.ceil(sc.audioDurationS * data.fps) + 2}>
                  <Audio src={staticFile(sc.audio)} />
                </Sequence>
              </TransitionSeries.Sequence>
              {!last && <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      <Subtitles data={data} />
      <AbsoluteFill style={{ background: colors.cream, opacity: endFade, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const MissingScene: React.FC<{ id: string }> = ({ id }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", color: colors.red, fontSize: 60 }}>missing scene: {id}</AbsoluteFill>
);
