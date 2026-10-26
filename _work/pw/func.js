const { chromium } = require('playwright');
const URL = 'http://127.0.0.1:5173/index.html';
(async () => {
  const b = await chromium.launch(process.env.CH ? { channel: process.env.CH } : {});
  // 1. No JavaScript: essential content must be visible
  let ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 }, isMobile: true });
  let p = await ctx.newPage(); await p.goto(URL); await p.waitForTimeout(500);
  console.log('noJS:', await p.evaluate(() => {
    const vis = s => { const e = document.querySelector(s); const cs = getComputedStyle(e); return cs.opacity !== '0' && cs.visibility !== 'hidden' && getComputedStyle(e).clipPath === 'none'; };
    return { title: vis('.hero-title'), cta: vis('.hero-cta'), frame: getComputedStyle(document.querySelector('.hero-media')).clipPath, video: !!document.querySelector('.hero-video source'), spec: getComputedStyle(document.querySelector('.spec-media')).clipPath, specBody: getComputedStyle(document.querySelector('.spec-body')).opacity, mailHref: document.querySelector('#enq-mail').href.slice(0, 60) };
  }));
  await p.screenshot({ path: 'shots/nojs-390.png' }); await ctx.close();
  // 2. Reduced motion
  ctx = await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto(URL); await p.waitForTimeout(600);
  console.log('reduced:', await p.evaluate(() => ({ cls: document.documentElement.className, titleT: getComputedStyle(document.querySelector('.hero-title .ch')).transform, sub: getComputedStyle(document.querySelector('.hero-sub')).opacity })), errs);
  await p.screenshot({ path: 'shots/reduced-1440.png' }); await ctx.close();
  // 3. Mobile menu + enquiry builder
  ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  p = await ctx.newPage(); await p.goto(URL); await p.waitForTimeout(1500);
  await p.click('.menu-btn'); await p.waitForTimeout(800);
  const menuOpen = await p.evaluate(() => [document.querySelector('.menu').classList.contains('is-open'), document.activeElement.textContent, getComputedStyle(document.body).overflow]);
  await p.screenshot({ path: 'shots/menu-390.png' });
  await p.click('.menu a[href="#materials"]'); await p.waitForTimeout(1200);
  const afterNav = await p.evaluate(() => [document.querySelector('.menu').classList.contains('is-open'), Math.round(document.querySelector('#materials').getBoundingClientRect().top)]);
  await p.click('.spec-enq[data-material="VSI 20 mm Jally"]'); await p.waitForTimeout(1500);
  await p.click('label.type-opt:has(input[value="Bulk order"])');
  await p.fill('#enq-note', 'Apartment slab, approx 40 units, Yelahanka');
  const mail = await p.$eval('#enq-mail', a => decodeURIComponent(a.href));
  console.log('menu open/focus/overflow:', menuOpen, 'after link click [open, materials top]:', afterNav);
  console.log('mailto:', mail);
  console.log('preview:', await p.$eval('#enq-preview', e => e.textContent));
  await ctx.close(); await b.close();
})();
