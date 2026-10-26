# Stone Aura website — project status

_Last updated: 2026-10-26 (v3: cinematic rebuild with licensed footage and photography, deployed via GitHub Pages)_

## What this is
Static marketing site for **Stone Aura** (legal name **M/S Anugraha Enterprises**), tagline *“Nature’s Strength. Your Foundation.”* There's no framework and no build step. `index.html` is the whole site and loads assets from `assets/`.

- Repository: https://github.com/spectertechnologies9-automation/stone-aura (branch `main`)
- Hosting: GitHub Pages, deployed by `.github/workflows/deploy.yml` on every push to `main`
- The live URL and deploy evidence are in the "Deployment" section below.

## Files
| Path | Purpose |
|---|---|
| `index.html` | Source of truth: HTML, CSS and vanilla JS. |
| `assets/video/` | Hero brand film: 1440p, 1080p and 9:16 portrait cuts, each as VP9 WebM and H.264 MP4 (26 MB total; each visitor loads one file, 1.6–5.4 MB). |
| `assets/images/` | Responsive WebP sets: posters, products, process, applications, About (8 MB total; loaded lazily). |
| `assets/fonts/` | Self-hosted Instrument Serif, Manrope and Space Grotesk (latin subset, 86 KB, preloaded). |
| `index-standalone.html` | **Generated** single file with images inlined, one size each (about 3.2 MB). Rebuild with `python build_standalone.py`. |
| `ASSETS.md` | Source URL, photographer and licence for every image and clip. |
| `.github/workflows/deploy.yml` | Pages deployment (copies `index.html`, `index-standalone.html` and `assets/` into the artifact). |
| `_work/stock/build_video.sh`, `_work/stock/build_images.py` | Rebuild the video and image deliverables from the licensed masters. The masters aren't committed. |
| `_work/pw/*.js` | Playwright test scripts. Run `npm i` in `_work/pw`; the browsers come from the local Playwright cache or `npx playwright install`. |

## v3 changes (this round)
- **Hero:** a full-viewport video built from two licensed 4K Pexels clips. Shot 1 is a conveyor reveal over stockpiles at sunset; shot 2 is a dusk drone push-in over a processing plant.
  - Edited into an 18.3 s loop with a light grade and a dip to dark, so the loop has no hard cut.
  - Phones get a native 9:16 cut rather than a crop of the desktop frame. Screens ≥1700 px get 1440p.
  - The brand name, tagline and CTAs are real HTML.
  - Responsive poster images double as the largest-paint element and the fallback.
  - The video pauses when off-screen, and doesn't play with reduced motion or Save-Data/2G; the poster shows instead.
- **Intro:** an "aperture" opening (clip-path) with a slow zoom-out and fine corner frame lines. The wordmark rises letter by letter, then the tagline and CTAs appear. Scrolling adds parallax, a dim and a copy drift, and all of it runs on phones too.
- **Every image replaced.** The old 330–650 px AI thumbnails and the owner screenshots are gone. Products, process, applications and About now use sharp Unsplash photos downloaded at 2400 px, plus two 4K video stills. Sources are in `ASSETS.md` and footer credits.
- **Production cycle on phones:** an animated photo-and-schematic panel above swipeable, snap-scrolling stage cards, with dots and previous/next buttons. Nothing sticky covers the text. The canvas animation and photo transitions are kept, and desktop keeps the sticky scroll-synced layout.
- **About:** a large feature image with a curtain reveal and parallax.
- **Fonts:** self-hosted and preloaded, and the hero copy stays hidden until fonts settle, so measured layout shift is 0.
- **Video:** WebM VP9 sources come first; MP4 is the fallback for Safari and others.
- **Fixed during testing:**
  - The About reveal never fired, because Chrome's IntersectionObserver doesn't count a fully clipped element. It's now a transform curtain.
  - CRLF line endings introduced by Python helpers.
  - The standalone build briefly ballooned to 14 MB when every `srcset` size was inlined.

## Tests run (2026-10-26, Playwright 1.56 with installed Google Chrome, plus bundled Chromium, local server)
- **Viewport sweep** at 320, 360, 390, 430, 768, 1024, 1440 and 1920 px: no horizontal overflow, 0 console or page errors, 0 failed requests (Chrome).
- **Video:** the expected file is chosen per viewport (portrait 720p WebM on 390/430 phones, 1080p WebM at 1440, 1440p WebM at 1920). It plays (currentTime advancing) and pauses when off-screen; with reduced motion it stays paused and the poster shows. All three MP4 fallbacks decode and play in Chrome.
- **No JavaScript:** title, CTAs, hero poster, product cards and the mailto link are visible, and the video still has sources.
- **Reduced motion:** all content visible immediately, no errors.
- **Mobile menu:** opens, focuses the first link, locks scroll, and closes on link click.
- **Enquiry:** a product's "Enquire" button preselects its chip, and type, materials and notes flow into the mailto subject and body.
- **Mobile process carousel:** the next button moves to the correct stage (HUD shows 03/06), and swiping updates the active stage.
- **Layout shift:** 0 at 360, 390, 430 and 1440 px over 5 cold loads each.
- **Performance (Chrome, local):**
  - LCP about 450 ms on mobile and 330–380 ms on desktop (poster image).
  - With 4× CPU throttling on mobile, a full-page scroll produced no frames over 50 ms.
  - Initial mobile images are about 140 KB, plus the 1.6 MB portrait video stream.
- **GitHub Pages simulation:** served from a sub-path (`/project22/`), every asset resolved and nothing returned an error.
- **Not run:** Lighthouse CLI, real iOS/Android devices, Firefox/WebKit engines, and sending a real email.

## Known limitations and open items
1. **Gemini wasn't used.** It isn't signed in in the built-in browser, and Claude in Chrome wasn't connected. Higgsfield has 0 credits. All imagery is licensed stock.
2. **Phone and WhatsApp numbers are unknown.** Set `CONTACT.phone` / `CONTACT.whatsapp` in `index.html`.
3. **Address** is carried over from the old site and needs owner confirmation.
4. **Stock imagery** shows foreign plants (one hero clip shows a sand plant with a green building). Replacing it with real Stone Aura footage and photos is the biggest remaining upgrade; the build scripts make swapping easy.
5. The 6-inch and 8-inch block cards use a concrete-block wall and stacked block pallets, which are representative rather than exact product shots.
6. **Process stages** are generic. Confirm the air-classification stage matches the actual plant.

## Commands
```bash
python -m http.server 5173 --bind 127.0.0.1      # preview at http://127.0.0.1:5173/
python build_standalone.py                        # regenerate the single-file build
FF=ffmpeg bash _work/stock/build_video.sh         # rebuild the hero film (needs the 4K masters, see ASSETS.md)
cd _work/stock && python build_images.py          # rebuild the image sets (needs the 2400 px sources)
cd _work/pw && npm i && CH=chrome node test.js && CH=chrome node func.js && node video.js
```

## Deployment
See the section appended below after the first verified deploy.
