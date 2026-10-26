"""Builds assets/images/*.webp (responsive widths) from the licensed sources in _work/stock. Re-runnable."""
from PIL import Image, ImageOps
import os
SRC = 'photos/'; OUT = '../../assets/images/'
os.makedirs(OUT, exist_ok=True)

def build(src, name, widths, ratio=None, focus=(.5, .5), q=78):
    im = Image.open(src).convert('RGB')
    if ratio:  # crop to aspect ratio around a focal point
        w, h = im.size; tw, th = (w, round(w / ratio)) if w / h < ratio else (round(h * ratio), h)
        tw, th = min(tw, w), min(th, h)
        x = round((w - tw) * focus[0]); y = round((h - th) * focus[1]); im = im.crop((x, y, x + tw, y + th))
    for w in widths:
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        p = f'{OUT}{name}-{w}.webp'; r.save(p, 'WEBP', quality=q, method=6)
        print(p, r.size, os.path.getsize(p) // 1024, 'KB')

# hero posters (video frame from the 4K master)
build('frames/poster-4k.png', 'hero-poster', [1280, 1920, 2560], q=72)
build('frames/poster-4k.png', 'hero-poster-portrait', [720, 1080], ratio=9 / 16, q=72)
# products: square, focus on the material
for n, f in [('p-6mm', (.5, .5)), ('p-12mm', (.5, .5)), ('p-20mm', (.5, .5)), ('p-40mm', (.5, .5)), ('p-gsb', (.5, .5)),
             ('p-msand', (.5, .5)), ('p-sand-2x', (.35, .5)), ('p-sand-3x', (.3, .5)), ('p-foundation', (.5, .5)),
             ('p-cobble', (.5, .5)), ('p-granite', (.5, .5)), ('p-block-8', (.5, .55)), ('p-block-6', (.5, .5))]:
    build(SRC + n + '.jpg', n, [480, 800], ratio=1, focus=f, q=72)
# process stages: 4:3
for n, f in [('proc-quarry', (.5, .5)), ('proc-primary', (.5, .5)), ('proc-secondary', (.5, .5)), ('proc-screen', (.5, .4)), ('proc-classify', (.5, .5))]:
    build(SRC + n + '.jpg', n, [960, 1600], ratio=4 / 3, focus=f)
# applications + feature imagery
for n in ['a-roads', 'a-residential', 'a-commercial', 'a-concrete']:
    build(SRC + n + '.jpg', n, [900, 1600], ratio=3 / 2)
build(SRC + 'a-paving.jpg', 'a-paving', [900, 1600], ratio=4 / 5, focus=(.5, .85))
build(SRC + 'about-quarry.jpg', 'about-quarry', [1200, 2400])
# washing + supply stages: stills from the 4K dusk footage (Pexels 17094323)
build('photos/proc-wash.png', 'proc-wash', [960, 1600], ratio=4 / 3, focus=(.5, .6))
build('photos/proc-supply.png', 'proc-supply', [960, 1600], ratio=4 / 3, focus=(.45, .6))
build(SRC + 'p-block-6.jpg', 'a-masonry', [900, 1600], ratio=3 / 2)
