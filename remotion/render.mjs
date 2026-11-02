// Render compositions to MP4. Usage: node render.mjs [compId ...]   (no args = all)
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, getCompositions } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const OUT = path.resolve("../out");
fs.mkdirSync(OUT, { recursive: true });
const browserExecutable = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
const chromiumOptions = { gl: "angle" };
const wanted = process.argv.slice(2);

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), webpackOverride: (c) => c });
const comps = await getCompositions(serveUrl, { browserExecutable, chromiumOptions });
const ids = wanted.length ? wanted : comps.map((c) => c.id);
for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable, chromiumOptions });
  const outputLocation = path.join(OUT, `zeket-${id}.mp4`);
  const t0 = Date.now();
  let lastPct = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    audioCodec: "aac",
    outputLocation,
    browserExecutable,
    chromiumOptions,
    concurrency: 4,
    imageFormat: "jpeg",
    jpegQuality: 90,
    crf: 20,
    x264Preset: "slow",
    pixelFormat: "yuv420p",
    audioBitrate: "192k",
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== lastPct) { lastPct = pct; process.stdout.write(`${id}: ${pct}%\n`); }
    },
  });
  console.log(`done ${id} in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${outputLocation}`);
}
