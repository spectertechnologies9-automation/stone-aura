const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const f of ['index.html', 'index-standalone.html']) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true }); const p = await ctx.newPage();
    let bytes = 0, n = 0; p.on('response', async r => { try { const buf = await r.body(); bytes += buf.length; n++; } catch {} });
    const t0 = Date.now(); await p.goto('http://127.0.0.1:5173/' + f, { waitUntil: 'load' });
    const m = await p.evaluate(() => new Promise(res => { new PerformanceObserver(l => { const e = l.getEntries(); res({ lcp: Math.round(e[e.length - 1].startTime), el: e[e.length - 1].element?.className }); }).observe({ type: 'largest-contentful-paint', buffered: true }); setTimeout(() => res({ lcp: 'n/a' }), 3000); }));
    await p.waitForTimeout(1000);
    const cls = await p.evaluate(() => new Promise(res => { let v = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) v += e.value; }).observe({ type: 'layout-shift', buffered: true }); setTimeout(() => res(v.toFixed(4)), 300); }));
    console.log(f, `initial load ${n} responses, ${Math.round(bytes / 1024)} KB (fonts excluded if offline); load ${Date.now() - t0} ms; LCP`, m, 'CLS', cls);
    await ctx.close();
  }
  await b.close();
})();
