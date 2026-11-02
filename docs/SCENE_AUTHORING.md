# Scene authoring guide (Remotion)

Each video lives in `remotion/src/videos/<id>.tsx` and exports `scenes: SceneMap` — an object mapping the
scene `id`s from `content/<id>.json` to React components. The shell (`components/VideoShell.tsx`) sequences the
scenes, plays each scene's narration audio, draws burned-in subtitles and 10-frame cross-fades. **Scenes never
render subtitles or audio themselves.**

## Scene contract

```tsx
const Hook: React.FC<SceneProps> = ({ scene, lang, durationInFrames, index }) => { ... }
export const scenes: SceneMap = { hook: Hook, ... };
```

- `useCurrentFrame()` inside a scene is **relative to the scene start** (0 … durationInFrames).
- `scene` is the entry from `remotion/public/data/<id>.<lang>.json`: `text`, `caption`, `note`, `labels`,
  `words` (word timings in seconds relative to the audio start), `audioStartFrame`, `audioDurationS`.
- Sync visuals to speech with `wordFrame(scene, "нисаб")` → frame when that word (substring, case-insensitive)
  is spoken. Give a fallback fraction: `wordFrame(scene, "год", 0.4)`. Use `t(lang, "кырг", "рус")` to pick
  the needle per language. `speechEnd(scene)` = frame when narration ends.
- Narration lengths differ between KY and RU; **never hard-code absolute frame numbers** for key beats, derive
  them from `wordFrame`, `durationInFrames` or fractions.

## Layout (1080×1920, phone-safe)

| Zone | y range | Use |
|---|---|---|
| top safe (Reels/TikTok UI) | 0–190 | nothing important (BrandChip may sit at 120) |
| caption | 230–400 | `<Caption>` title/key phrase (Nunito 56–92) |
| illustration | 430–1230 (`zone`) | the picture; centre ≈ (540, 830) |
| note | ≈1140–1210 | `<Note>` source / disclaimer pill (optional) |
| subtitles | ≈1270–1500 | drawn by the shell |
| bottom safe | 1500–1920 | background only |

Keep all text ≥ 32 px, numbers ≥ 44 px. Keep important things inside x = 64…1016.

## Toolkit

- `theme.ts` — `colors`, `fonts`, `safe`, `zone`. Brand green `#006633`, gold `#E0A93A`, cream `#FAF6EE`.
- `components/Text.tsx` — `Caption`, `Note`, `BigLabel`, `Tag`.
- `components/anim.ts` — `pop` (spring), `prog` (eased 0→1 between frames), `linear`, `floatY`, `sway`,
  `wordFrame`, `speechEnd`.
- `components/Camera.tsx` — slow zoom/pan wrapper.
- `components/Brand.tsx` — `BrandChip`, `LogoLockup` (use the lockup in every outro).
- `scenes/common.tsx` — `SoftBackground`, `Enter`, `Badge` ("Мисал / Пример", "Иллюстрация").
- `illustrations/` — `Sky`, `Sun`, `Moon`, `Cloud`, `Mountains`, `Ground`, `Rain`, `Sparkles`, `House`, `Yurt`,
  `Mosque`, `Tree`, `Sapling`, `Wheat`, `Well`, `Book`, `Phone`, `Canvas`, `Person` (hats: kalpak, elechek, scarf,
  hijab, cap), `Hands`, `Coin`, `CoinStack`, `Banknote`, `GoldBar`, `Scale`, `Chest`, `Card`, `Check`, `Heart`, `SvgText`.
  All illustration primitives are SVG fragments — wrap them in `<Canvas>` (full-screen svg) and position with x/y.

Add new primitives to `illustrations/` when you need them (keep them reusable and flat-styled).

## Style rules

- Flat 2D, soft colours, rounded shapes, gentle springs; always some motion (camera drift, floating, growth).
- Kyrgyz context: Ala-Too mountains, yurts, kalpak/elechek, bazaars, fields, village houses.
- People with dignity: upright, calm faces, no begging poses. Never depict Allah or prophets; the Qur'an is shown as
  a closed/open book with ornament only — no Arabic verse text.
- UI mock-ups are schematic and labelled with `<Badge text="Иллюстрация" />`.
- Every scene must look different from the previous one (different background/composition), no slideshow feel.

## Checking your work

```bash
cd remotion
node stills.mjs 02-sadaqa-ky 30,200,500,900,1400,2000,2600 /tmp/stills   # half-scale PNG stills
```
Then look at the PNGs (contact sheet: `python3 tools/sheet.py /tmp/stills`). Check both languages — captions are
longer in one of them. Do not run full renders while other work is going on; `node render.mjs <compId>` renders a
final MP4 to `out/` (~7 min per video).
