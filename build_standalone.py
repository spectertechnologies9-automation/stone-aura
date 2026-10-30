"""Build index-standalone.html: index.html with its images inlined as data URIs.

index.html (+ assets/) is the source and the real deploy (responsive images, streamed video).
The standalone file is a single portable HTML for sharing: each image keeps one size only,
and the hero film is NOT inlined (too large), so the standalone file shows the hero poster
unless an assets/video/ folder sits next to it.

Usage:  python build_standalone.py
"""
import base64
import pathlib
import re

root = pathlib.Path(__file__).parent
html = (root / 'index.html').read_text(encoding='utf-8')
cache = {}


def inline(match):
    path = match.group(0)
    if path not in cache:
        data = (root / path).read_bytes()
        cache[path] = 'data:image/webp;base64,' + base64.b64encode(data).decode('ascii')
    return cache[path]


# one candidate per image: <img> keeps its src; <source> keeps the first (smallest) srcset entry
html = re.sub(r'(<img [^>]*?) srcset="[^"]*" sizes="[^"]*"', r'\1', html)
html = re.sub(r'(<source [^>]*?)srcset="([^", ]+) \d+w(?:, [^"]*)?" sizes="[^"]*"', r'\1srcset="\2"', html)
out = re.sub(r'assets/images/[\w.-]+\.webp', inline, html)
# the "save contact" vCard travels inside the file too
vcf = (root / 'assets' / 'stone-aura.vcf').read_bytes()
out = out.replace('assets/stone-aura.vcf', 'data:text/vcard;base64,' + base64.b64encode(vcf).decode('ascii'))
# preload hints are pointless once images are inline
out = re.sub(r'<link rel="preload" as="image"[^>]*>\n', '', out)
(root / 'index-standalone.html').write_text(out, encoding='utf-8', newline='\n')
print(f'index-standalone.html: {len(out) // 1024} KB, {len(cache)} images inlined')
