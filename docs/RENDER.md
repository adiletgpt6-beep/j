# Повторный рендер

## Требования
- Node.js 22+, ffmpeg (Remotion приносит свой ffmpeg, системный нужен только для `tools/qa.py`), Python 3.10+ с Pillow,
  Chromium/Chrome. В этой среде использовался Chromium из Playwright (`/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`);
  путь задан в `remotion/remotion.config.ts`, `remotion/render.mjs`, `remotion/stills.mjs`. На другой машине уберите
  `browserExecutable`/`setBrowserExecutable` — Remotion скачает свой браузер — или укажите свой путь.
- `ELEVENLABS_API_KEY` в окружении — только если нужно перегенерировать озвучку.

## Шаги
```bash
cd remotion && npm install            # один раз

# 1. (если менялся текст) озвучка + тайминги + субтитры
python3 tools/tts.py 01-zakat         # один ролик, оба языка; `all` — всё; добавьте `--rebuild`, чтобы пересобрать
                                      # data/SRT из уже имеющегося аудио без обращения к API
python3 tools/qa_audio.py 01-zakat    # проверка речи распознаванием; плохие реплики: tools/fix_audio.py <id> ky <scene>

# 2. рендер
cd remotion
node render.mjs 01-zakat-ky           # один ролик → ../out/zeket-01-zakat-ky.mp4 (≈7 минут на 4 ядрах)
node render.mjs                       # все 18

# 3. проверка и публикация в репозиторий
cd ..
python3 tools/qa.py                   # кодек/разрешение/fps/звук/громкость + контактные листы в build/qa/
cp out/*.mp4 videos/ && git add videos && git commit -m "Re-render" && git push
```

## Быстрый просмотр кадров
```bash
cd remotion
node stills.mjs 03-sadaqa-jariya-ru 30,400,900,1400,1900,2300 /tmp/stills
python3 ../tools/sheet.py /tmp/stills            # контактный лист /tmp/stills/sheet.png
npx remotion studio                              # интерактивный предпросмотр в браузере
```

## Параметры
- Композиции называются `<video-id>-<lang>`, например `05-calculate-ru`. Список — `remotion/src/videos/index.ts`.
- Длительность композиции берётся из `remotion/public/data/<id>.<lang>.json` (`totalFrames`), поэтому после
  перегенерации озвучки ничего менять вручную не нужно.
- Кодирование: H.264, CRF 20, yuv420p, AAC 192 kbps (`render.mjs`). Для сайта этого достаточно; для соцсетей тоже.
- Паузы: 0.45 с до реплики и 0.75 с после (первая/последняя сцена — 0.9/1.6 с), см. `tools/voices.json → timing`.
- Безопасные зоны и размеры текста — `remotion/src/theme.ts` (`safe`, `zone`, `sizes`).
