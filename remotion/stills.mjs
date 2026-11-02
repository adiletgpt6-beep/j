// Render still frames for QA: node stills.mjs <compositionId> <frame,frame,...> <outDir>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const [compId, framesArg, outDir = "/tmp/stills"] = process.argv.slice(2);
const frames = framesArg.split(",").map(Number);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), webpackOverride: (c) => c });
const composition = await selectComposition({ serveUrl, id: compId, browserExecutable: "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome", chromiumOptions: { gl: "angle" } });
for (const f of frames) {
  const out = path.join(outDir, `${compId}-${String(f).padStart(5, "0")}.png`);
  await renderStill({ composition, serveUrl, output: out, frame: f, browserExecutable: "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome", chromiumOptions: { gl: "angle" }, scale: 0.5 });
  console.log("wrote", out);
}
