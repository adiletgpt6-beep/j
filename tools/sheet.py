#!/usr/bin/env python3
"""Tile PNG stills from a directory into one contact sheet: python3 tools/sheet.py /tmp/stills [out.png] [cols]"""
import sys, glob
from pathlib import Path
from PIL import Image

d = Path(sys.argv[1]); out = sys.argv[2] if len(sys.argv) > 2 else str(d / "sheet.png"); cols = int(sys.argv[3]) if len(sys.argv) > 3 else 4
fs = sorted(f for f in glob.glob(str(d / "*.png")) if not f.endswith("sheet.png"))
ims = [Image.open(f) for f in fs]
w, h = ims[0].size
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (w * cols, h * rows), "white")
for i, im in enumerate(ims):
    sheet.paste(im, ((i % cols) * w, (i // cols) * h))
sheet.save(out); print(out, sheet.size)
