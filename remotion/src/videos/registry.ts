import type { SceneMap } from "../types";
import { scenes as s01 } from "./01-zakat";

// Scene components per video id (components cannot travel through Remotion props, so they are looked up here)
export const sceneRegistry: Record<string, SceneMap> = {
  "01-zakat": s01,
};
