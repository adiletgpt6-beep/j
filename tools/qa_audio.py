#!/usr/bin/env python3
"""Speech QA: transcribe each generated narration clip with ElevenLabs Scribe and compare with the script.
Reports word error rate (WER) per scene so mispronounced / dropped / hallucinated words can be caught and regenerated.
Usage: python3 tools/qa_audio.py 01-zakat [ky|ru]      (warning at WER > 0.15)
Results are cached in build/qa/stt/.
"""
import json, os, re, sys, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "build" / "qa" / "stt"; CACHE.mkdir(parents=True, exist_ok=True)
LANG = {"ky": "kir", "ru": "rus"}


def norm(s):
    s = s.lower().replace("ё", "е")
    s = re.sub(r"[^\w\s]", " ", s)
    return s.split()


def wer(ref, hyp):
    r, h = norm(ref), norm(hyp)
    d = list(range(len(h) + 1))
    for i in range(1, len(r) + 1):
        prev, d[0] = d[0], i
        for j in range(1, len(h) + 1):
            cur = min(d[j] + 1, d[j - 1] + 1, prev + (r[i - 1] != h[j - 1]))
            prev, d[j] = d[j], cur
    return d[len(h)] / max(1, len(r))


def stt(mp3: Path, lang: str):
    c = CACHE / f"{mp3.parent.parent.name}.{lang}.{mp3.stem}.json"
    if c.exists() and c.stat().st_mtime >= mp3.stat().st_mtime:
        return json.loads(c.read_text())
    key = os.environ["ELEVENLABS_API_KEY"]
    r = subprocess.run(["curl", "-sS", "-m", "180", "-X", "POST", "https://api.elevenlabs.io/v1/speech-to-text", "-H", f"xi-api-key: {key}",
                        "-F", "model_id=scribe_v1", "-F", f"language_code={LANG[lang]}", "-F", f"file=@{mp3}"], capture_output=True, text=True)
    data = json.loads(r.stdout)
    c.write_text(json.dumps(data, ensure_ascii=False))
    return data


def main(vid, langs):
    worst = 0
    for lang in langs:
        data = json.loads((ROOT / "remotion" / "public" / "data" / f"{vid}.{lang}.json").read_text())
        for sc in data["scenes"]:
            mp3 = ROOT / "remotion" / "public" / sc["audio"]
            res = stt(mp3, lang)
            w = wer(sc["text"], res.get("text", ""))
            worst = max(worst, w)
            flag = "  " if w <= 0.15 else "!!"
            print(f"{flag} {vid} {lang} {sc['id']:<10} WER={w:.2f}  {res.get('text','')[:110]}")
    return worst


if __name__ == "__main__":
    vid = sys.argv[1]; langs = sys.argv[2:] or ["ky", "ru"]
    main(vid, langs)
