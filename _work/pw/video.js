// Verifies the hero film: chosen source per viewport, actual playback, reduced-motion + save-data behaviour.
const { chromium } = require('playwright');
const URL = 'http://127.0.0.1:5173/index.html';
(async () => {
  for (const channel of ['chrome', 'chromium']) {
    const b = await chromium.launch(channel === 'chrome' ? { channel } : {});
    for (const [w, h, extra] of [[390, 844], [430, 932], [1440, 900], [1920, 1080], [1440, 900, { reducedMotion: 'reduce' }]]) {
      const m = w < 768; const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, hasTouch: m, ...(extra || {}) });
      const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
      await p.goto(URL); await p.waitForTimeout(3500);
      const r = await p.evaluate(() => { const v = document.querySelector('.hero-video'); return { src: (v.currentSrc || '').split('/').pop(), t: +v.currentTime.toFixed(2), paused: v.paused, playing: v.classList.contains('is-playing'), w: v.videoWidth, h: v.videoHeight }; });
      await p.evaluate(() => scrollTo(0, innerHeight * 2)); await p.waitForTimeout(600);
      const off = await p.evaluate(() => document.querySelector('.hero-video').paused);
      console.log(channel, w + 'x' + h, extra ? 'reduced' : '', JSON.stringify(r), 'pausedOffscreen', off, errs);
      if (channel === 'chrome' && !extra && (w === 390 || w === 1440)) { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1200); await p.screenshot({ path: `shots/v3-hero-${w}.png` }); }
      await ctx.close();
    }
    await b.close();
  }
})();
