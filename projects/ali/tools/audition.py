#!/usr/bin/env python3
"""Voice audition: voices the FIRST chunk of the test scene with each candidate (with timestamps, same cache key
as build.py, so the chosen voice's take is reused in the video). PAID: ~43 chars per voice.
  python3 projects/ali/tools/audition.py <voice_id> [<voice_id> ...]"""
import hashlib, json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build as B
sc = next(s for s in B.SCRIPT["scenes"] if s.get("test"))
chunk = sc["text"].split("||")[0].strip()
for vid in sys.argv[1:]:
    key = hashlib.sha1(f"{chunk}|{vid}|{B.CFG['model_id']}|{json.dumps(B.CFG['voice_settings'], sort_keys=True)}".encode()).hexdigest()
    d = B.ALIGN / "audition" / vid
    B.base.api_tts(chunk, {"voice_id": vid, "language_code": B.CFG["language_code"]}, d / "take.mp3", d / "take.json", key)
    print(vid, len(chunk), "chars ->", d / "take.mp3")
