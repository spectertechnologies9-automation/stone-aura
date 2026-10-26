// Visual + overflow + console checks across viewports. Usage: node test.js [only-width]
const { chromium } = require('playwright');
const URL = 'http://127.0.0.1:5173/index.html';
const VIEWS = [[320,640],[360,780],[390,844],[430,932],[768,1024],[1024,768],[1440,900],[1920,1080]];
const only = process.argv[2] ? +process.argv[2] : 0;
(async () => {
  const b = await chromium.launch(process.env.CH ? { channel: process.env.CH } : {});
  for (const [w,h] of VIEWS.filter(v => !only || v[0] === only)) {
    const mobile = w < 768;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
    const p = await ctx.newPage(); const errs = [];
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('pageerror', e => errs.push(String(e.stack).split(String.fromCharCode(10)).slice(0,3).join(' | ')));
    p.on('requestfailed', r => errs.push('FAILED ' + r.url()));
    await p.goto(URL, { waitUntil: 'load' }); await p.waitForTimeout(2600);
    await p.screenshot({ path: `shots/hero-${w}.png` });
    // scroll through the page to trigger reveals, checking overflow along the way
    const total = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += Math.round(h * .6)) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(120); }
    await p.waitForTimeout(800);
    const over = await p.evaluate(() => {
      const W = document.documentElement.clientWidth, bad = [];
      document.querySelectorAll('body *').forEach(el => { const r = el.getBoundingClientRect(); if (r.width && !el.closest('.spec-media,.app,.proc-ph,.hero-frame') && (r.right > W + 1 || r.left < -1)) { const cs = getComputedStyle(el); if (cs.position !== 'fixed' && !el.closest('.hero-sticky,.contours,.menu,.grain,svg')) bad.push(el.tagName + '.' + el.className + ' ' + Math.round(r.left) + '→' + Math.round(r.right)); } });
      return { sw: document.documentElement.scrollWidth, W, bad: bad.slice(0, 8) };
    });
    console.log(`${w}x${h}: scrollWidth ${over.sw} vs ${over.W}; errors ${errs.length}`, errs.slice(0,3), over.bad);
    if (w === 390 || w === 1440) { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300); await p.screenshot({ path: `shots/full-${w}.png`, fullPage: true }); }
    await ctx.close();
  }
  await b.close();
})();
