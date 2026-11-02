import { continueRender, delayRender, staticFile } from "remotion";

const faces: [string, string, number][] = [
  ["Nunito", "fonts/Nunito-Bold.ttf", 700],
  ["Nunito", "fonts/Nunito-ExtraBold.ttf", 800],
  ["Nunito", "fonts/Nunito-Black.ttf", 900],
  ["Inter", "fonts/Inter-Medium.ttf", 500],
  ["Inter", "fonts/Inter-SemiBold.ttf", 600],
  ["Inter", "fonts/Inter-Bold.ttf", 700],
];

let started = false;
export const loadFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("Loading fonts");
  Promise.all(
    faces.map(([family, file, weight]) => {
      const f = new FontFace(family, `url(${staticFile(file)})`, { weight: String(weight) });
      return f.load().then((loaded) => document.fonts.add(loaded));
    })
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
