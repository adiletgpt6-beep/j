import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import type { SceneData } from "../types";
import { BoyBack, BoyRimDefs, DarkDefs, Camera, Dastarkhan, Dust, GoldTitle, Grade, HolyLight, Room, Seated, Tag, VP, ease, lerp, pal, persp, robes, type Headwear } from "./kit";

const FPS = 30;
export type AliSceneProps = { scene: SceneData; durationInFrames: number };

/** Frame (scene-relative) when the narrator starts the word containing `needle`. */
export const wf = (scene: SceneData, needle: string, fallback = 0.5, occurrence = 0) => {
  const n = needle.toLowerCase();
  let seen = 0;
  for (const w of scene.words) {
    if (w.w.toLowerCase().includes(n)) {
      if (seen === occurrence) return scene.audioStartFrame + Math.round(w.s * FPS);
      seen++;
    }
  }
  return Math.round(scene.audioStartFrame + scene.audioDurationS * FPS * fallback);
};

/* ------------------------------------------------------------------ the gathering of relatives */

type Guest = { d: number; side: -1 | 1; robe: string; hw: Headwear; hwColor: string; beard: boolean; abuLahab?: boolean };
const DEPTHS = [1.35, 1.85, 2.5, 3.3, 4.4, 5.8, 7.6];
export const GUESTS: Guest[] = DEPTHS.flatMap((d, i) =>
  ([-1, 1] as const).map((side, k) => {
    const j = i * 2 + k;
    const abuLahab = i === 1 && side === 1;
    return {
      d, side,
      robe: abuLahab ? pal.red : robes[j % robes.length],
      hw: abuLahab ? "shemagh" : (["turban", "shemagh", "cap", "turban"] as Headwear[])[j % 4],
      hwColor: abuLahab ? "#3a0e0e" : ["#efe4cc", "#d8cdb5", "#c9b48a", "#e9dcc0"][(j * 3) % 4],
      beard: j % 5 !== 3,
      abuLahab,
    };
  })
);

/** Relatives seated on both sides of the dastarkhan. drop(i) / turn(i) per guest index (0..1). */
export const Gathering: React.FC<{ drop?: (i: number, g: Guest) => number; turn?: (i: number, g: Guest) => number; dark?: number; spread?: number }> = ({ drop = () => 0, turn = () => 0, dark = 0, spread = 1 }) => {
  const order = GUESTS.map((g, i) => ({ g, i })).sort((a, b) => b.g.d - a.g.d);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <DarkDefs />
      {order.map(({ g, i }) => {
        const p = persp(g.d, g.side, spread);
        const depthDark = Math.min(0.55, (g.d - 1.3) * 0.07) + dark;
        return (
          <Seated key={i} x={p.x} y={p.y} s={p.s * 0.95} robe={g.robe} hw={g.hw} hwColor={g.hwColor} beard={g.beard}
            face={g.side === -1 ? 1 : -1} drop={drop(i, g)} turn={turn(i, g)} dark={depthDark} />
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ s10: the first question (TEST FRAGMENT) */

export const S10First: React.FC<AliSceneProps> = ({ scene, durationInFrames }) => {
  const f = useCurrentFrame();
  const fAsk = wf(scene, "сурайт");
  const fNone = wf(scene, "эч");
  const fB = wf(scene, "бирок");
  const f13 = wf(scene, "13");
  const fC = wf(scene, "көтөрүп");
  const fMen = wf(scene, "мен");
  const fElchi = wf(scene, "алланын");
  const X = 9; // crossfade frames between shots

  // ---- shot A: silence around the table
  const aOp = 1 - ease(f, fB - X, fB);
  const aPush = ease(f, 0, fB, Easing.inOut(Easing.cubic));
  const heads = (i: number) => ease(f, fNone + (i % 7) * 3, fNone + 16 + (i % 7) * 3, Easing.inOut(Easing.quad));
  const dimA = ease(f, fNone, fNone + 30) * 0.25;

  // ---- shot B: the boy with the jug
  const bOp = ease(f, fB - X, fB) * (1 - ease(f, fC - X, fC));
  const bT = ease(f, fB - X, fC, Easing.inOut(Easing.sin));

  // ---- shot C: the hand rises
  const cOp = ease(f, fC - X, fC);
  const cT = ease(f, fC - X, durationInFrames, Easing.out(Easing.quad));
  const arm = spring({ frame: f - fC, fps: FPS, config: { damping: 15, stiffness: 70, mass: 1.1 } });
  const burst = ease(f, fMen - 4, fMen + 22, Easing.out(Easing.cubic));
  const turnTo = (i: number) => ease(f, fMen + (i % 5) * 4, fMen + 20 + (i % 5) * 4, Easing.inOut(Easing.quad));

  return (
    <AbsoluteFill style={{ background: "#120a05" }}>
      {/* A */}
      {aOp > 0 && (
        <AbsoluteFill style={{ opacity: aOp }}>
          <Camera scale={lerp(1.02, 1.16, aPush)} y={lerp(0, 40, aPush)} origin={`${VP.x}px ${VP.y + 200}px`}>
            <Room lightIntensity={0.8} />
            <HolyLight x={VP.x} y={VP.y + 70} intensity={0.9 - dimA} scale={0.85} />
            <Dastarkhan />
            <Gathering drop={(i) => heads(i)} dark={dimA * 0.5} />
            <Dust area={[300, 500, 780, 1300]} seed="a" />
          </Camera>
          <Grade vignette={0.8 + dimA} dim={dimA * 0.6} />
          <Tag x={70} y={250} big="1" small="СУРОО" p={spring({ frame: f - fAsk + 4, fps: FPS, config: { damping: 13 } })} />
        </AbsoluteFill>
      )}

      {/* B */}
      {bOp > 0 && (
        <AbsoluteFill style={{ opacity: bOp }}>
          <Camera scale={1.32} x={lerp(60, -40, bT)} y={-80} origin={`${VP.x}px ${VP.y}px`}>
            <AbsoluteFill style={{ filter: "blur(7px) brightness(0.8)" }}>
              <Room lightIntensity={0.8} />
              <HolyLight x={VP.x} y={VP.y + 70} intensity={0.75} scale={0.9} />
              <Dastarkhan />
              <Gathering drop={() => 1} dark={0.15} />
            </AbsoluteFill>
          </Camera>
          <Camera scale={lerp(1.0, 1.06, bT)} x={lerp(30, -20, bT)} origin="30% 100%">
            <svg width={1080} height={1920} style={{ position: "absolute" }}>
              <BoyRimDefs />
              <BoyBack x={340} y={2010} s={1.55} arm={0} glow={0.35} walk={lerp(0, 0.5, ease(f, fB - X, fB + 30))} />
            </svg>
          </Camera>
          <Dust area={[100, 300, 1000, 1600]} seed="b" n={40} />
          <Grade vignette={0.85} />
          <Tag x={640} y={300} big="13" small="ЖАШ" rot={4} p={spring({ frame: f - f13, fps: FPS, config: { damping: 12 } })} />
        </AbsoluteFill>
      )}

      {/* C */}
      {cOp > 0 && (
        <AbsoluteFill style={{ opacity: cOp }}>
          <Camera scale={lerp(1.18, 1.28, cT)} y={lerp(140, 110, cT)} origin={`${VP.x}px ${VP.y}px`}>
            <Room lightIntensity={1} />
            <HolyLight x={VP.x} y={VP.y + 70} intensity={0.85 + burst * 0.7} rays={burst * 0.9} raysRot={f * 0.15} scale={0.9 + burst * 0.3} />
            <Dastarkhan />
            <Gathering drop={(i) => 1 - turnTo(i)} turn={(i, g) => turnTo(i) * (g.side === -1 ? -0.6 : 0.6)} />
            <Dust area={[150, 250, 950, 1500]} seed="c" n={70} opacity={0.6 + burst * 0.4} />
          </Camera>
          <Camera scale={lerp(1.0, 1.05, cT)} origin="25% 100%">
            <svg width={1080} height={1920} style={{ position: "absolute" }}>
              <BoyRimDefs />
              <BoyBack x={290} y={2330} s={1.85} arm={arm} glow={0.35 + burst * 0.65} />
            </svg>
          </Camera>
          <Grade vignette={0.7 - burst * 0.2} warmth={0.12 + burst * 0.08} />
          <GoldTitle text="«МЕН БАРМЫН," y={150} size={104} p={ease(f, fMen - 2, fMen + 14)} glow={1 + burst} />
          <GoldTitle text="ОО, АЛЛАНЫН ЭЛЧИСИ!»" y={272} size={56} spacing={0.06} p={ease(f, fElchi - 2, fElchi + 14)} />
        </AbsoluteFill>
      )}

      {/* sound design for this scene */}
      <Sequence from={Math.max(0, fC - 10)} durationInFrames={130}>
        <Audio src={staticFile("ali/sfx/swell.mp3")} volume={0.55} />
      </Sequence>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ not yet animated (full video, after approval) */

export const PendingScene: React.FC<AliSceneProps> = ({ scene }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#120a05" }}>
      <Camera scale={1.05 + f * 0.0006} origin={`${VP.x}px ${VP.y}px`}>
        <Room lightIntensity={0.8} />
        <HolyLight x={VP.x} y={VP.y + 70} intensity={0.8} scale={0.85} />
        <Dastarkhan />
        <Gathering />
        <Dust />
      </Camera>
      <Grade />
      <div style={{ position: "absolute", top: 260, width: "100%", textAlign: "center", color: "#ffd27a", fontFamily: "Nunito", fontWeight: 800, fontSize: 40, opacity: interpolate(f, [0, 10], [0, 0.8]) }}>
        {scene.id} — анимация после утверждения теста
      </div>
    </AbsoluteFill>
  );
};

export const aliScenes: Record<string, React.FC<AliSceneProps>> = {
  "s10-first": S10First,
};
