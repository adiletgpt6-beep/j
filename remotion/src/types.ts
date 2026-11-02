export type Lang = "ky" | "ru";

export type Word = { w: string; s: number; e: number };
export type Cue = { s: number; e: number; text: string };

export type SceneData = {
  id: string;
  text: string;
  caption?: string;
  note?: string;
  labels?: string[];
  excluded?: string[];
  audio: string;
  audioDurationS: number;
  startFrame: number;
  durationInFrames: number;
  audioStartFrame: number;
  words: Word[];
  cues: Cue[];
};

export type VideoData = {
  id: string;
  lang: Lang;
  title: string;
  fps: number;
  totalFrames: number;
  totalSeconds: number;
  scenes: SceneData[];
};

export type SceneProps = {
  scene: SceneData;
  lang: Lang;
  durationInFrames: number;
  index: number;
};

export type SceneComponent = React.FC<SceneProps>;
export type SceneMap = Record<string, SceneComponent>;
