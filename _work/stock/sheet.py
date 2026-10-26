"""Download preview thumbnails listed as `id url` lines on stdin and build a labelled contact sheet."""
import sys, io, urllib.request
from PIL import Image, ImageDraw
out = sys.argv[1]; items = [l.split() for l in sys.stdin if l.strip()]
tw, th, cols = 360, 220, 5
S = Image.new('RGB', (cols * tw, ((len(items) + cols - 1) // cols) * (th + 18)), 'white'); d = ImageDraw.Draw(S)
for i, (k, u) in enumerate(items):
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        im = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=20).read())).convert('RGB'); im.thumbnail((tw - 6, th - 6))
        x, y = (i % cols) * tw, (i // cols) * (th + 18); S.paste(im, (x + 3, y + 3)); d.text((x + 4, y + th), k, fill='black')
    except Exception as e: print(k, e)
S.save(out, quality=85); print('saved', out, len(items))
