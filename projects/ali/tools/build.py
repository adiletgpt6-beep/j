#!/usr/bin/env python3
"""Build narration data for the Ali video (Remotion data JSON + SRT).

  python3 projects/ali/tools/build.py                 # placeholder timings (no API calls) for full + test
  python3 projects/ali/tools/build.py --tts test      # ElevenLabs narration for the test fragment only (PAID)
  python3 projects/ali/tools/build.py --tts full      # ElevenLabs narration for all scenes (PAID)

Scene text may contain "||" to split it into chunks voiced separately and joined by a deliberate silence
(timing.chunk_gap_s) — used for the dramatic pause after "эч ким кол көтөрбөйт".
Audio is cached by content hash in build/align/ali, so re-running only voices changed scenes.
"""
import hashlib, json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
P = ROOT / "projects" / "ali"
sys.path.insert(0, str(ROOT / "tools"))
import tts as base  # reuse api_tts, words_from_alignment, build_cues, srt helpers

CFG = json.loads((P / "voice.json").read_text(encoding="utf-8"))
SCRIPT = json.loads((P / "script.ky.json").read_text(encoding="utf-8"))
PUB = ROOT / "remotion" / "public" / "ali"
ALIGN = ROOT / "build" / "align" / "ali"
FPS = CFG["timing"]["fps"]
VOICE = {"voice_id": CFG["voice_id"], "language_code": CFG["language_code"]}
base.CFG = {**base.CFG, "model_id": CFG["model_id"], "output_format": CFG["output_format"], "voice_settings": CFG["voice_settings"]}


def placeholder_words(text):
    words, t = [], 0.0
    for w in text.split():
        if w == "||":
            t += CFG["timing"]["chunk_gap_s"]; continue
        if w in ("—", "–"):
            t += CFG["placeholder"]["pause"]["—"]; words.append({"w": w, "s": t, "e": t + 0.05}); continue
        d = (len(w) + 1) / CFG["placeholder"]["chars_per_s"]
        words.append({"w": w, "s": t, "e": t + d}); t += d
        last = re.sub(r"[»«\"]", "", w)[-1:]
        t += CFG["placeholder"]["pause"].get(last, 0.0)
    return words, t + 0.1


def apply_display(words):
    """Merge spoken sequences into their display form (e.g. 'он үч' -> '13')."""
    out, i = [], 0
    while i < len(words):
        for spoken, shown in SCRIPT["display"]:
            sp = spoken.split(); n = len(sp)
            seg = [re.sub(r"[^\w-]", "", x["w"].lower()) for x in words[i:i + n]]
            if seg == sp:
                tail = re.sub(r"^[\w-]+", "", words[i + n - 1]["w"]) if not shown.endswith("-") else ""
                if shown.endswith("-") and i + n < len(words):  # '214-' glues to next word: '214-аят'
                    nxt = words[i + n]; out.append({"w": shown + nxt["w"], "s": words[i]["s"], "e": nxt["e"]}); i += n + 1
                else:
                    out.append({"w": shown + tail, "s": words[i]["s"], "e": words[i + n - 1]["e"]}); i += n
                break
        else:
            out.append(words[i]); i += 1
    return out


def make_cues(words):
    """Phrase-based subtitle cues: break on pauses, sentence ends, dashes, colons and opening quotes;
    keep a trailing '— дейт.' style tag with the quote it belongs to."""
    S = CFG["subtitles"]; cues, cur = [], []
    L = lambda ws: len(" ".join(x["w"] for x in ws))
    for i, w in enumerate(words):
        if cur:
            prev = cur[-1]["w"]; gap = w["s"] - cur[-1]["e"]
            brk = (L(cur + [w]) > S["max_chars"] or gap > S["gap_break_s"]
                   or (re.search(r"[.!?…]»?$", prev) and L(cur) >= 10)
                   or (re.search(r"[:]$", prev) and L(cur) >= 14)
                   or (w["w"] in ("—", "–") and L(cur) >= 14 and not re.search(r"[!?.]»$", prev))
                   or (w["w"].startswith("«") and L(cur) >= 14)
                   or (prev.endswith(",") and L(cur) >= S["soft_break_chars"]))
            if brk: cues.append(cur); cur = []
        cur.append(w)
    if cur: cues.append(cur)
    for i in range(len(cues) - 1):  # never leave a number at a line end ("13 | жаштардагы")
        if len(cues[i]) > 1 and re.fullmatch(r"[\d–-]+", cues[i][-1]["w"]):
            cues[i + 1].insert(0, cues[i].pop())
    merged = []
    for c in cues:  # glue short tails like '— дейт.' / '— деп жооп берет.' to the quote
        orphan = len(c) == 1 and len(c[0]["w"]) <= 10 and c[0]["s"] - merged[-1][-1]["e"] < 0.4 if merged else False
        if merged and (c[0]["w"] in ("—", "–") or orphan) and L(merged[-1] + c) <= S["max_chars"] + 12:
            merged[-1] = merged[-1] + c
        else:
            merged.append(c)
    out, k = [], 0
    for i, c in enumerate(merged):
        s0 = max(0.0, c[0]["s"] - 0.06); e0 = c[-1]["e"] + 0.3
        if i + 1 < len(merged): e0 = min(e0, merged[i + 1][0]["s"] - 0.04)
        out.append({"s": s0, "e": e0, "text": " ".join(x["w"] for x in c), "w0": k, "w1": k + len(c)}); k += len(c)
    return out


LOUD = "loudnorm=I=-15:TP=-1.5:LRA=11,aresample=44100"  # narration level (reference video sits at -14 LUFS)


def voice_scene(sc):
    chunks = [c.strip() for c in sc["text"].split("||")]
    words, parts, t = [], [], 0.0
    for k, chunk in enumerate(chunks):
        key = hashlib.sha1(f"{chunk}|{CFG['voice_id']}|{CFG['model_id']}|{json.dumps(CFG['voice_settings'], sort_keys=True)}".encode()).hexdigest()
        mp3 = ALIGN / f"{sc['id']}-{k}.mp3"; aj = ALIGN / f"{sc['id']}-{k}.json"
        data = base.api_tts(chunk, VOICE, mp3, aj, key)
        tempo = CFG.get("tempo", 1.0)
        slow = ALIGN / f"{sc['id']}-{k}.t{tempo}.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-af", f"atempo={tempo}", "-ar", "44100", str(slow)], check=True)
        for w in base.words_from_alignment(data["alignment"]):
            words.append({"w": w["w"], "s": w["s"] / tempo + t, "e": w["e"] / tempo + t})
        parts.append(slow); t += base.audio_duration(slow) + (CFG["timing"]["chunk_gap_s"] if k < len(chunks) - 1 else 0)
    out = PUB / "audio" / f"{sc['id']}.mp3"; out.parent.mkdir(parents=True, exist_ok=True)
    if len(parts) == 1:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(parts[0]), "-af", LOUD, "-ar", "44100", "-b:a", "160k", str(out)], check=True)
    else:
        gap = CFG["timing"]["chunk_gap_s"]; inputs, filt = [], ""
        for i, p in enumerate(parts): inputs += ["-i", str(p)]
        filt = "".join(f"[{i}:a]aresample=44100,apad=pad_dur={gap if i < len(parts)-1 else 0}[a{i}];" for i in range(len(parts)))
        filt += "".join(f"[a{i}]" for i in range(len(parts))) + f"concat=n={len(parts)}:v=0:a=1,{LOUD}[o]"
        subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", filt, "-map", "[o]", "-b:a", "160k", str(out)], check=True)
    return words, base.audio_duration(out), f"ali/audio/{sc['id']}.mp3"


def build(comp_id, scenes, use_tts):
    t = CFG["timing"]; cursor, out_scenes, srt, n = 0, [], [], 0
    has_audio = True
    for idx, sc in enumerate(scenes):
        if use_tts:
            words, dur, audio = voice_scene(sc)
        else:
            words, dur = placeholder_words(sc["text"]); audio = None; has_audio = False
        words = apply_display(words)
        cues = make_cues(words)
        lead = t["first_lead_in_s"] if idx == 0 else t["lead_in_s"]
        tail = t["last_tail_s"] if idx == len(scenes) - 1 else t["tail_s"]
        if sc.get("tail_s"): tail = sc["tail_s"]
        lead_f = round(lead * FPS); dur_f = lead_f + round(dur * FPS) + round(tail * FPS)
        a0 = (cursor + lead_f) / FPS
        for c in cues:
            n += 1; srt.append(f"{n}\n{base.srt_time(a0 + c['s'])} --> {base.srt_time(a0 + c['e'])}\n{base.wrap_two_lines(c['text'])}\n")
        out_scenes.append({"id": sc["id"], "text": " ".join(w["w"] for w in words), "audio": audio, "audioDurationS": round(dur, 3),
                           "startFrame": cursor, "durationInFrames": dur_f, "audioStartFrame": lead_f,
                           "words": [{"w": w["w"], "s": round(w["s"], 3), "e": round(w["e"], 3)} for w in words],
                           "cues": [{"s": round(c["s"], 3), "e": round(c["e"], 3), "text": c["text"], "w0": c["w0"], "w1": c["w1"]} for c in cues]})
        cursor += dur_f
    data = {"id": comp_id, "lang": "ky", "title": SCRIPT["title"], "fps": FPS, "totalFrames": cursor, "totalSeconds": round(cursor / FPS, 2),
            "hasAudio": has_audio, "voice": CFG["voice_name"] if has_audio else "placeholder timings (no narration)", "scenes": out_scenes}
    (PUB / "data").mkdir(parents=True, exist_ok=True); (P / "subtitles").mkdir(exist_ok=True)
    (PUB / "data" / f"{comp_id}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    (P / "subtitles" / f"{comp_id}.ky.srt").write_text("\n".join(srt), encoding="utf-8")
    print(f"{comp_id}: scenes={len(out_scenes)} total={data['totalSeconds']}s audio={has_audio}")


if __name__ == "__main__":
    use_tts = "--tts" in sys.argv
    which = [a for a in sys.argv[1:] if not a.startswith("--")] or ["test", "full"]
    test_scenes = [s for s in SCRIPT["scenes"] if s.get("test")]
    for w in which:
        if w == "test": build("ali-test", test_scenes, use_tts)
        elif w == "full": build("ali", SCRIPT["scenes"], use_tts)
