// Verifies the deployed site end-to-end in installed Chrome.
const { chromium } = require('playwright');
const URL = process.env.URL || 'https://spectertechnologies9-automation.github.io/stone-aura/';
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const [w, h, m] of (process.env.VP ? JSON.parse(process.env.VP) : [[390, 844, true], [360, 780, true], [1440, 900, false]])) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, hasTouch: m }); const p = await ctx.newPage();
    const bad = [], errs = []; let n = 0;
    p.on('response', r => { n++; if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
    p.on('requestfailed', r => { if (!/\.(mp4|webm)$/.test(r.url())) bad.push('FAILED ' + r.url()); });
    p.on('pageerror', e => errs.push(String(e))); p.on('console', c => { if (c.type() === 'error') errs.push(c.text()); });
    const resp = await p.goto(URL, { waitUntil: 'load' }); await p.waitForTimeout(3500);
    const head = await p.evaluate(() => ({ title: document.title, h1: document.querySelector('h1').getAttribute('aria-label'), fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.style).join(', '), video: (v => ({ src: v.currentSrc.split('/').pop(), t: +v.currentTime.toFixed(1), playing: v.classList.contains('is-playing') }))(document.querySelector('.hero-video')), cls: [...document.documentElement.classList].join(' ') }));
    if (w !== 360) await p.screenshot({ path: `shots/live-hero-${w}.png` });
    const total = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += Math.round(h * .6)) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(110); }
    await p.waitForTimeout(1200);
    const imgs = await p.evaluate(() => { const all = [...document.images]; return { total: all.length, loaded: all.filter(i => i.complete && i.naturalWidth > 0).length, broken: all.filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.split('/').pop()) }; });
    const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    // navigation + enquiry
    let navOk;
    if (m) { await p.evaluate(() => scrollTo(0, 0)); await p.click('.menu-btn'); await p.waitForTimeout(800); await p.click('.menu a[href="#contact"]'); await p.waitForTimeout(1500); }
    else { await p.click('.nav-links a[href="#contact"]'); await p.waitForTimeout(1500); }
    navOk = await p.evaluate(() => Math.abs(document.querySelector('#contact').getBoundingClientRect().top) < 5);
    const mail = await p.$eval('#enq-mail', a => a.href.split('?')[0]);
    let carousel = 'n/a';
    if (m) { await p.evaluate(() => document.querySelector('#process').scrollIntoView()); await p.waitForTimeout(800); await p.click('#proc-next'); await p.waitForTimeout(1100); carousel = await p.$eval('.proc-step.is-active h3', e => e.textContent); }
    console.log(`${w}px: HTTP ${resp.status()}, ${n} responses, bad ${JSON.stringify(bad)}, errors ${JSON.stringify(errs)}`);
    console.log(`  ${JSON.stringify(head)}`);
    console.log(`  images ${imgs.loaded}/${imgs.total} loaded, broken ${JSON.stringify(imgs.broken)}; h-overflow ${over}px; nav→#contact ${navOk}; mail ${mail}; carousel next → ${carousel}`);
    await ctx.close();
  }
  const p = await b.newPage(); const r = await p.goto(URL + 'index-standalone.html'); await p.waitForTimeout(2000);
  console.log('standalone:', r.status(), await p.evaluate(() => [document.title.slice(0, 30), [...document.images].filter(i => i.complete && i.naturalWidth > 0).length]));
  await b.close();
})();
