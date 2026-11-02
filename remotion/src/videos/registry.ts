import type { SceneMap } from "../types";
import { scenes as s01 } from "./01-zakat";
import { scenes as s02 } from "./02-sadaqa";
import { scenes as s03 } from "./03-sadaqa-jariya";
import { scenes as s04 } from "./04-recipients";
import { scenes as s05 } from "./05-calculate";
import { scenes as s06 } from "./06-how-zeket-works";
import { scenes as s07 } from "./07-ushr";
import { scenes as s08 } from "./08-fitr";
import { scenes as s09 } from "./09-transparency";

// Scene components per video id (components cannot travel through Remotion props, so they are looked up here)
export const sceneRegistry: Record<string, SceneMap> = {
  "01-zakat": s01,
  "02-sadaqa": s02,
  "03-sadaqa-jariya": s03,
  "04-recipients": s04,
  "05-calculate": s05,
  "06-how-zeket-works": s06,
  "07-ushr": s07,
  "08-fitr": s08,
  "09-transparency": s09,
};
