// Mobile perf: initial bytes, LCP, CLS, and frame pacing while scrolling with 4x CPU throttle.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const [w, h, m] of [[390, 844, true], [1440, 900, false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, hasTouch: m }); const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p); if (m) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    let bytes = 0; const byType = {};
    p.on('response', async r => { try { const len = (await r.body()).length; bytes += len; const t = r.request().resourceType(); byType[t] = (byType[t] || 0) + len; } catch {} });
    await p.goto('http://127.0.0.1:5173/index.html', { waitUntil: 'load' }); await p.waitForTimeout(3000);
    const vit = await p.evaluate(() => new Promise(res => { let lcp = 0, cls = 0; new PerformanceObserver(l => { const e = l.getEntries(); lcp = e[e.length - 1].startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); setTimeout(() => res({ lcp: Math.round(lcp), cls: +cls.toFixed(4) }), 300); }));
    const initial = Math.round(bytes / 1024);
    // scroll the whole page at a steady pace and record frame intervals
    const fr = await p.evaluate(async () => { const total = document.documentElement.scrollHeight - innerHeight; const d = []; let last = performance.now(); let y = 0; return await new Promise(res => { function f(t) { d.push(t - last); last = t; y += 22; scrollTo(0, y); if (y < total) requestAnimationFrame(f); else res(d); } requestAnimationFrame(f); }); });
    fr.sort((a, b) => a - b); const pct = q => fr[Math.floor(fr.length * q)].toFixed(1); const long = fr.filter(x => x > 50).length;
    console.log(`${w}px${m ? ' (4x CPU throttle)' : ''}: initial ${initial} KB [${Object.entries(byType).map(([k, v]) => k + ' ' + Math.round(v / 1024)).join(', ')}]; LCP ${vit.lcp} ms; CLS ${vit.cls}; scroll frames n=${fr.length} median ${pct(.5)} ms p95 ${pct(.95)} ms, >50ms: ${long}`);
    await ctx.close();
  }
  await b.close();
})();
