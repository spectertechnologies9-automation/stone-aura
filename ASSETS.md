# Stone Aura — visual asset sources and licences

All photography and footage on the site is **illustrative stock**, not Stone Aura's own quarry, plant, machinery, staff or projects. The site labels it that way in the hero ("Illustrative footage"), on the About image, in the materials and process notes, and in the footer credits.

- **Pexels licence** (https://www.pexels.com/license/): free for commercial use, no attribution required, modification allowed.
- **Unsplash licence** (https://unsplash.com/license): free for commercial use, no attribution required. Selling the photos unaltered or building a competing service isn't allowed.

Credits are listed anyway, in the footer and below. Everything was downloaded on 2026-10-26.

## Hero film (`assets/video/`, posters `assets/images/hero-poster*`)
| Source | Use | Master |
|---|---|---|
| Pexels video 17094405 — https://www.pexels.com/video/17094405/ | Shot 1: conveyor reveal over stockpiles at sunset (0–7.5 s); poster frame | 3840×2160, 29.97 fps |
| Pexels video 17094323 — https://www.pexels.com/video/17094323/ | Shot 2: drone push-in over stockpiles and processing plant at dusk (3–15 s); stills for the process "Washing" and "Supply" stages | 3840×2160, 29.97 fps |

Delivered versions: 2560×1440 for screens ≥1700 px wide, 1920×1080 otherwise, and a native 720×1280 portrait cut for phones. Each comes as VP9 WebM (preferred) and H.264 MP4 (fallback), silent, 18.3 s. To rebuild them, run `_work/stock/build_video.sh`.

## Photography (Unsplash, `assets/images/`)
| File prefix | Subject | Unsplash page | Photographer |
|---|---|---|---|
| p-6mm | grey/blue fine stone chips | https://unsplash.com/photos/grey-and-blue-pebbles-McMw8DdSlJ4 | @mitchellf0x |
| p-12mm | grey crushed chips | https://unsplash.com/photos/black-and-white-abstract-painting-_OUi6HxZ8aY | @nadinmario |
| p-20mm | angular crushed stone | https://unsplash.com/photos/a-pile-of-rocks-sitting-next-to-each-other-kcRGnpAmo-s | @nicgeo99 |
| p-40mm | large angular stone | https://unsplash.com/photos/photo-of-gray-rocks-WkpRaJG5CQY | @itsnathan001 |
| p-gsb | stone + fines mix | https://unsplash.com/photos/a-black-and-white-photo-of-rocks-and-gravel-s7uIDh2sBcg | @pretzelman |
| p-msand | fine crushed-stone sand | https://unsplash.com/photos/gray-and-black-stone-fragments-P_GVmDmka6s | @thejmoore |
| p-sand-2x | sand stockpile + conveyors | https://unsplash.com/photos/large-sand-and-gravel-piles-with-industrial-conveyors-HkxPrTZGEl8 | @omikron |
| p-sand-3x | sand plant + stockpile | https://unsplash.com/photos/sand-processing-machinery-and-large-pile-of-sand-Ju8a_9Tt7-k | @omikron |
| p-foundation | large rough stone | https://unsplash.com/photos/a-pile-of-rough-gray-rocks-1u0_8_shypg | @margot97 |
| p-cobble | granite setts | https://unsplash.com/photos/brown-and-gray-bricks-kcyI_GZsXTw | @jimtography |
| p-granite | speckled grey granite | https://unsplash.com/photos/a-close-up-of-a-grey-surface-oVdcLa0GEU8 | @enginakyurt |
| p-block-8 | stacked concrete blocks | https://unsplash.com/photos/stacks-of-concrete-paving-stones-on-a-wet-surface-otareJQsBMs | @skstrannik |
| p-block-6, a-masonry | concrete block wall | https://unsplash.com/photos/grey-brick-wall-during-daytime-NHkIzoZwxe0 | @timmossholder |
| proc-quarry | benched quarry face | https://unsplash.com/photos/a-large-rock-wall-u6zVikMNTmQ | @jetztabertempo |
| proc-primary | crushing plant | https://unsplash.com/photos/brown-and-white-wooden-building-w5Lp7kATuvo | @rstar50 |
| proc-secondary | crushing & screening line | https://unsplash.com/photos/construction-site-during-daytime-FDfdZg_JIdI | @josiahfarrow |
| proc-screen | plant tower and conveyors | https://unsplash.com/photos/a-large-cement-plant-sitting-on-top-of-a-dirt-hill-tJPSKUrkOxQ | @artistseyes |
| proc-classify | screen and sand pile | https://unsplash.com/photos/a-large-pile-of-sand-next-to-a-metal-structure-lCAhI5WA8LM | @dypeskogen |
| about-quarry | mountain quarry at dusk | https://unsplash.com/photos/a-rocky-mountain-range-Ts4XNhBd7QY | @ingsamu |
| a-roads | road roller on base course | https://unsplash.com/photos/yellow-and-black-heavy-equipment-on-snow-covered-ground-during-daytime-XeRqsvi9qBc | @luandmario |
| a-residential | modern house | https://unsplash.com/photos/white-and-brown-concrete-building-under-blue-sky-during-daytime-_TPTXZd9mOo | @webaliser |
| a-commercial | high-rise with cranes | https://unsplash.com/photos/low-angle-photography-of-cranes-on-top-of-building-8Gg2Ne_uTcM | @danist07 |
| a-concrete | rebar for a slab | https://unsplash.com/photos/two-men-working-sgYamIzhAhg | @etiennegirardet |
| a-paving | granite-paved street | https://unsplash.com/photos/high-rise-buildings-under-cloudy-sky-9aYAaVjm3_o | @zacharyshakked |

Sources were downloaded at 2400 px wide (`_work/stock/photos/`, not committed). `_work/stock/build_images.py` exports the responsive WebP sets (products 480/800 px, process 960/1600 px, applications 900/1600 px).

## Fonts (`assets/fonts/`)
Instrument Serif, Manrope and Space Grotesk, all under the SIL Open Font License 1.1. They're self-hosted latin subsets taken from Google Fonts.

## Removed from the site
- The previous AI-generated set (330–650 px product thumbnails and others) and the earlier Higgsfield portrait hero. Both are kept locally in `_work/retired-assets-img/` but no longer used.
- The owner-uploaded screenshots (Google Lens overlays and unclear rights). They're kept locally in `_work/uploads/`.
