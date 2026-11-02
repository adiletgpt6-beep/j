#!/usr/bin/env python3
"""Generate narration audio with ElevenLabs (with character timestamps), build word timings,
subtitle cues (SRT + JSON) and the per-video data file consumed by the Remotion compositions.

Usage:
  python3 tools/tts.py 01-zakat            # both languages
  python3 tools/tts.py 01-zakat ru         # one language
  python3 tools/tts.py all                 # everything
  python3 tools/tts.py 01-zakat --rebuild  # rebuild data/subtitles from cached audio without calling the API

Requires env ELEVENLABS_API_KEY. Audio is cached by content hash in build/align/, so re-running is free
unless a scene's text, voice or model changed.
"""
import base64, hashlib, json, os, re, sys, time, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"
PUBLIC = ROOT / "remotion" / "public"
AUDIO_DIR = PUBLIC / "audio"
DATA_DIR = PUBLIC / "data"
ALIGN_DIR = ROOT / "build" / "align"
SUB_DIR = ROOT / "subtitles"
CFG = json.loads((ROOT / "tools" / "voices.json").read_text(encoding="utf-8"))
FPS = CFG["timing"]["fps"]


def api_tts(text: str, voice: dict, out_mp3: Path, out_json: Path, cache_key: str):
    if out_json.exists() and out_mp3.exists():
        try:
            if json.loads(out_json.read_text(encoding="utf-8")).get("cache_key") == cache_key:
                return json.loads(out_json.read_text(encoding="utf-8"))
        except Exception:
            pass
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("ELEVENLABS_API_KEY is not set")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice['voice_id']}/with-timestamps?output_format={CFG['output_format']}"
    body = {
        "text": text,
        "model_id": CFG["model_id"],
        "language_code": voice["language_code"],
        "voice_settings": CFG["voice_settings"],
    }
    req = urllib.request.Request(url, data=json.dumps(body).encode("utf-8"),
                                 headers={"xi-api-key": key, "Content-Type": "application/json"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                res = json.loads(r.read().decode("utf-8"))
            break
        except urllib.error.HTTPError as e:
            msg = e.read().decode("utf-8", "ignore")[:300]
            if e.code in (429, 500, 502, 503, 504) and attempt < 4:
                time.sleep(3 * (attempt + 1)); continue
            sys.exit(f"ElevenLabs error {e.code}: {msg}")
        except Exception as e:  # network
            if attempt < 4:
                time.sleep(3 * (attempt + 1)); continue
            raise
    out_mp3.parent.mkdir(parents=True, exist_ok=True)
    out_mp3.write_bytes(base64.b64decode(res["audio_base64"]))
    align = res.get("alignment") or res.get("normalized_alignment")
    data = {"cache_key": cache_key, "text": text, "alignment": align}
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    return data


def audio_duration(path: Path) -> float:
    import subprocess
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True).stdout.strip()
    return float(out)


def words_from_alignment(align: dict):
    chars = align["characters"]; st = align["character_start_times_seconds"]; en = align["character_end_times_seconds"]
    words, cur, cs, ce = [], "", None, None
    for c, s, e in zip(chars, st, en):
        if c.isspace():
            if cur:
                words.append({"w": cur, "s": cs, "e": ce}); cur, cs, ce = "", None, None
            continue
        if cs is None: cs = s
        cur += c; ce = e
    if cur: words.append({"w": cur, "s": cs, "e": ce})
    return words


def build_cues(words, max_chars, soft_break, gap_break):
    cues, cur = [], []
    def flush():
        nonlocal cur
        if cur:
            cues.append({"s": cur[0]["s"], "e": cur[-1]["e"], "text": " ".join(w["w"] for w in cur), "words": cur}); cur = []
    for i, w in enumerate(words):
        if cur:
            length = len(" ".join(x["w"] for x in cur)) + 1 + len(w["w"])
            gap = w["s"] - cur[-1]["e"]
            cur_len = len(" ".join(x["w"] for x in cur))
            hard_punct = bool(re.search(r"[.!?…]$", cur[-1]["w"]))
            mid_punct = bool(re.search(r"[:;]$", cur[-1]["w"])) or cur[-1]["w"] in ("—", "–")
            soft_punct = bool(re.search(r"[,]$", cur[-1]["w"]))
            if length > max_chars or gap > gap_break or (hard_punct and cur_len >= 12) or (mid_punct and cur_len >= 22) or (soft_punct and cur_len >= soft_break):
                flush()
        cur.append(w)
    flush()
    # merge tiny trailing cues (e.g. a lone dash) into previous
    merged = []
    for c in cues:
        if merged and len(c["text"]) <= 3:
            p = merged[-1]; p["e"] = c["e"]; p["text"] += " " + c["text"]; p["words"] += c["words"]
        else:
            merged.append(c)
    # display padding
    for i, c in enumerate(merged):
        c["s"] = max(0.0, c["s"] - 0.08)
        nxt = merged[i + 1]["s"] - 0.08 if i + 1 < len(merged) else None
        c["e"] = c["e"] + 0.35 if nxt is None else min(c["e"] + 0.35, nxt - 0.02)
    return merged


def srt_time(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def wrap_two_lines(text, max_line=32):
    if len(text) <= max_line: return text
    words = text.split(); best = None
    for k in range(1, len(words)):
        a, b = " ".join(words[:k]), " ".join(words[k:])
        score = abs(len(a) - len(b))
        if best is None or score < best[0]: best = (score, a, b)
    return best[1] + "\n" + best[2]


def process(video_id: str, lang: str, rebuild_only=False):
    content = json.loads((CONTENT / f"{video_id}.json").read_text(encoding="utf-8"))
    voice_key = content["voice"][lang]; voice = CFG["voices"][voice_key]
    t = CFG["timing"]
    scenes_out, cursor_frames, srt_entries, n = [], 0, [], 0
    for idx, sc in enumerate(content["scenes"]):
        text = sc[lang]["text"].strip()
        cache_key = hashlib.sha1(f"{text}|{voice['voice_id']}|{CFG['model_id']}|{json.dumps(CFG['voice_settings'],sort_keys=True)}".encode()).hexdigest()
        mp3 = AUDIO_DIR / video_id / lang / f"{sc['id']}.mp3"
        aj = ALIGN_DIR / video_id / lang / f"{sc['id']}.json"
        if rebuild_only:
            data = json.loads(aj.read_text(encoding="utf-8"))
        else:
            data = api_tts(text, voice, mp3, aj, cache_key)
        dur = audio_duration(mp3)
        words = words_from_alignment(data["alignment"])
        cues = build_cues(words, CFG["subtitles"]["max_chars"], CFG["subtitles"]["soft_break_chars"], CFG["subtitles"]["gap_break_s"])
        lead = t["first_lead_in_s"] if idx == 0 else t["lead_in_s"]
        tail = t["last_tail_s"] if idx == len(content["scenes"]) - 1 else t["tail_s"]
        lead_f = round(lead * FPS); dur_f = lead_f + round(dur * FPS) + round(tail * FPS)
        scene_start_s = cursor_frames / FPS; audio_start_s = scene_start_s + lead_f / FPS
        for c in cues:
            n += 1
            srt_entries.append(f"{n}\n{srt_time(audio_start_s + c['s'])} --> {srt_time(audio_start_s + c['e'])}\n{wrap_two_lines(c['text'])}\n")
        entry = {k: v for k, v in sc[lang].items() if k != "text"}
        entry.update({
            "id": sc["id"], "text": text, "audio": f"audio/{video_id}/{lang}/{sc['id']}.mp3",
            "audioDurationS": round(dur, 3), "startFrame": cursor_frames, "durationInFrames": dur_f, "audioStartFrame": lead_f,
            "words": [{"w": w["w"], "s": round(w["s"], 3), "e": round(w["e"], 3)} for w in words],
            "cues": [{"s": round(c["s"], 3), "e": round(c["e"], 3), "text": c["text"]} for c in cues],
        })
        scenes_out.append(entry); cursor_frames += dur_f
    out = {"id": video_id, "lang": lang, "title": content["title"][lang], "fps": FPS, "totalFrames": cursor_frames,
           "totalSeconds": round(cursor_frames / FPS, 2), "voice": {"key": voice_key, "name": voice["name"], "model": CFG["model_id"]}, "scenes": scenes_out}
    DATA_DIR.mkdir(parents=True, exist_ok=True); SUB_DIR.mkdir(parents=True, exist_ok=True)
    (DATA_DIR / f"{video_id}.{lang}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    (SUB_DIR / f"{video_id}.{lang}.srt").write_text("\n".join(srt_entries), encoding="utf-8")
    print(f"{video_id} [{lang}] scenes={len(scenes_out)} total={out['totalSeconds']}s voice={voice['name']}")
    return out


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    rebuild = "--rebuild" in sys.argv
    ids = sorted(p.stem for p in CONTENT.glob("*.json")) if (not args or args[0] == "all") else [args[0]]
    langs = [args[1]] if len(args) > 1 else ["ky", "ru"]
    for vid in ids:
        for lang in langs:
            process(vid, lang, rebuild_only=rebuild)
