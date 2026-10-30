# Stone Aura website

Static marketing site for Stone Aura (legal name M/S Anugraha Enterprises). There's no framework and no build step; it deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.

## Architecture
- `index.html` is the single source file (HTML + CSS + vanilla JS). Assets live in `assets/images` (responsive WebP), `assets/video` (hero film, WebM + MP4 per size) and `assets/fonts` (self-hosted, preloaded). Use relative paths only, so the site works under the Pages sub-path.
- `index-standalone.html` is **generated** by `python build_standalone.py`. Never edit it directly; rebuild after changing `index.html`.
- Hero: a photo slideshow (`.hs` figures, wipe + Ken Burns in CSS, timing in the `hsGo`/`hsSchedule` script block; it pauses off-screen, on tab hide and under reduced motion). The old hero film in `assets/video/` is no longer referenced.
- Animation: CSS transitions plus a single on-demand rAF loop (`kick()` / `frameLoop`) for hero parallax, the production-cycle canvas, nav tone and image parallax. Add scroll-linked work there; don't add a second loop or GSAP/Lenis without a real need. Animate only transform/opacity in scroll code.
- Hidden animation states are always prefixed with `.js`, and IntersectionObserver targets must never be fully clipped (Chrome won't report them; use a curtain pseudo-element instead). Keep the `.reveal-all` fail-safe rules in sync when adding new hidden states.
- Phones keep all motion. The process section becomes a swipeable card row (≤820 px) instead of the desktop sticky layout.
- Python helpers that write `index.html` must use `newline='\n'` (Windows would otherwise write CRLF).

## Content rules
- Don't invent specs, prices, certifications, stats, testimonials or project claims. The founding year is 2014 (ignore the "2018 Stone Aura Marketing" variant).
- Contact details: phone and WhatsApp are **+91 89042 07227** (`CONTACT` object in the script, plus static `tel:`/`wa.me` links in the hero, dock, menu, contact section and footer). Email is `stoneaura.aggregates@gmail.com`. The "Save contact" buttons link to `assets/stone-aura.vcf`; update it if details change.
- The hero slideshow (`hs-*`) and most material cards (`m-*`) use owner-supplied site photos. Everything else is illustrative stock (see `ASSETS.md`): label it as illustrative and never present it as the company's own facilities. Record source and licence for any new asset in `ASSETS.md` and the footer credits.

## Checks
With the server running (`python -m http.server 5173 --bind 127.0.0.1`), run `cd _work/pw && CH=chrome node test.js && CH=chrome node func.js && node video.js`.
