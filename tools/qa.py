#!/usr/bin/env python3
"""Technical QA for rendered MP4s: codec, resolution, fps, audio, duration, loudness + contact sheet.
Usage: python3 tools/qa.py out/zeket-01-zakat-ky.mp4 [more.mp4 ...]   (no args = all in out/)
Writes build/qa/<name>.sheet.jpg and prints a summary table; exit code 1 if any check fails.
"""
import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QA = ROOT / "build" / "qa"; QA.mkdir(parents=True, exist_ok=True)


def probe(p: Path):
    out = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(p)], capture_output=True, text=True).stdout
    return json.loads(out)


def loudness(p: Path):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", str(p), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    il = tp = None
    for line in r.splitlines()[-30:]:
        line = line.strip()
        if line.startswith("I:"): il = float(line.split()[1])
        if line.startswith("Peak:"): tp = float(line.split()[1])
    return il, tp


def sheet(p: Path, n=12):
    info = probe(p); dur = float(info["format"]["duration"])
    out = QA / (p.stem + ".sheet.jpg")
    step = dur / (n + 1)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(p), "-vf", f"fps=1/{step:.4f},scale=360:-1,tile=4x{(n+3)//4}", "-frames:v", "1", str(out)], capture_output=True)
    return out


def check(p: Path):
    info = probe(p)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    a = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    dur = float(info["format"]["duration"])
    num, den = v["r_frame_rate"].split("/"); fps = int(num) / int(den)
    il, tp = loudness(p)
    ok = v["codec_name"] == "h264" and v["width"] == 1080 and v["height"] == 1920 and abs(fps - 30) < 0.01 and a is not None and a["codec_name"] == "aac" and 55 <= dur <= 150 and il is not None and -22 <= il <= -10
    sh = sheet(p)
    size_mb = p.stat().st_size / 1e6
    print(f"{'OK ' if ok else 'FAIL'} {p.name}: {v['codec_name']} {v['width']}x{v['height']} {fps:.0f}fps audio={a['codec_name'] if a else 'NONE'} dur={dur:.1f}s loudness={il} LUFS peak={tp} dBTP size={size_mb:.1f}MB sheet={sh.relative_to(ROOT)}")
    return ok


if __name__ == "__main__":
    files = [Path(a) for a in sys.argv[1:]] or sorted((ROOT / "out").glob("*.mp4"))
    results = [check(f) for f in files]
    sys.exit(0 if all(results) else 1)
