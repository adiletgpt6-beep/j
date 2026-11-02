import { interpolate, spring, Easing } from "remotion";
import { FPS } from "../theme";
import type { SceneData } from "../types";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 0..1 progress between frames a and b, eased */
export const prog = (frame: number, a: number, b: number, easing = Easing.out(Easing.cubic)) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const linear = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** Spring that starts at `delay` frames */
export const pop = (frame: number, delay: number, cfg?: { damping?: number; stiffness?: number; mass?: number }) =>
  spring({ frame: Math.max(0, frame - delay), fps: FPS, config: { damping: cfg?.damping ?? 14, stiffness: cfg?.stiffness ?? 120, mass: cfg?.mass ?? 1 } });

/** Gentle floating offset for idle motion */
export const floatY = (frame: number, amp = 8, period = 90, phase = 0) =>
  Math.sin(((frame + phase) / period) * Math.PI * 2) * amp;

export const sway = (frame: number, amp = 2, period = 120, phase = 0) =>
  Math.sin(((frame + phase) / period) * Math.PI * 2) * amp;

/** Frame (relative to scene start) at which a spoken word containing `needle` begins. */
export const wordFrame = (scene: SceneData, needle: string, fallbackFraction = 0.3, occurrence = 0): number => {
  const n = needle.toLowerCase();
  let seen = 0;
  for (const w of scene.words) {
    if (w.w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "").includes(n.replace(/[^\p{L}\p{N}]/gu, ""))) {
      if (seen === occurrence) return scene.audioStartFrame + Math.round(w.s * FPS);
      seen++;
    }
  }
  return Math.round(scene.audioStartFrame + scene.audioDurationS * FPS * fallbackFraction);
};

/** Frame at which the narration of the scene ends */
export const speechEnd = (scene: SceneData) => scene.audioStartFrame + Math.round(scene.audioDurationS * FPS);

/** Fade in at start, fade out near end of scene (frames) */
export const sceneFade = (frame: number, duration: number, fin = 10, fout = 0) => {
  const a = prog(frame, 0, fin);
  const b = fout > 0 ? 1 - prog(frame, duration - fout, duration) : 1;
  return a * b;
};
