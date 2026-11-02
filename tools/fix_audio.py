#!/usr/bin/env python3
"""Regenerate narration clips whose speech-to-text check looks bad, keep the best take.
Usage: python3 tools/fix_audio.py <video-id> <lang> <sceneId> [tries=2]
For each try a new take is generated (ElevenLabs v3 is non-deterministic), transcribed, and the take with the
lowest word error rate (original included) is kept. Then data/subtitles are rebuilt for that video.
"""
import json, os, shutil, subprocess, sys, tempfile
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import tts, qa_audio

ROOT = Path(__file__).resolve().parent.parent


def main(vid, lang, scene_id, tries=2):
    content = json.loads((ROOT / "content" / f"{vid}.json").read_text(encoding="utf-8"))
    sc = next(s for s in content["scenes"] if s["id"] == scene_id)
    voice = tts.CFG["voices"][content["voice"][lang]]
    text = sc[lang]["text"].strip()
    mp3 = tts.AUDIO_DIR / vid / lang / f"{scene_id}.mp3"
    aj = tts.ALIGN_DIR / vid / lang / f"{scene_id}.json"
    best = (qa_audio.wer(text, qa_audio.stt(mp3, lang).get("text", "")), None)
    print(f"original WER={best[0]:.2f}")
    tmp = Path(tempfile.mkdtemp())
    for i in range(tries):
        m, a = tmp / f"take{i}.mp3", tmp / f"take{i}.json"
        key = json.loads(aj.read_text())["cache_key"] if aj.exists() else "x"
        tts.api_tts(text, voice, m, a, key)
        # qa_audio caches by name; use a unique name for the temp take
        shutil.copy(m, tmp / f"{scene_id}_t{i}.mp3")
        res = qa_audio.stt(tmp / f"{scene_id}_t{i}.mp3", lang) if False else _stt_nocache(tmp / f"{scene_id}_t{i}.mp3", lang)
        w = qa_audio.wer(text, res.get("text", ""))
        print(f"take {i} WER={w:.2f}  {res.get('text','')[:100]}")
        if w < best[0]:
            best = (w, (m, a))
    if best[1]:
        m, a = best[1]
        shutil.copy(m, mp3); shutil.copy(a, aj)
        # invalidate STT cache for the scene
        for c in qa_audio.CACHE.glob(f"{vid}.{lang}.{scene_id}.json"): c.unlink()
        print(f"replaced with better take (WER={best[0]:.2f})")
    else:
        print("kept original")
    tts.process(vid, lang, rebuild_only=True)


def _stt_nocache(mp3, lang):
    key = os.environ["ELEVENLABS_API_KEY"]
    r = subprocess.run(["curl", "-sS", "-m", "180", "-X", "POST", "https://api.elevenlabs.io/v1/speech-to-text", "-H", f"xi-api-key: {key}",
                        "-F", "model_id=scribe_v1", "-F", f"language_code={qa_audio.LANG[lang]}", "-F", f"file=@{mp3}"], capture_output=True, text=True)
    return json.loads(r.stdout)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv) > 4 else 2)
