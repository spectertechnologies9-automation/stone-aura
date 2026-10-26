// Screenshot individual sections after scrolling them into view. Usage: node sect.js width height sel1 sel2...
const { chromium } = require('playwright');
(async () => {
  const [w, h, ...sels] = process.argv.slice(2); const mobile = +w < 768;
  const b = await chromium.launch(process.env.CH ? { channel: process.env.CH } : {}); const ctx = await b.newContext({ viewport: { width: +w, height: +h }, isMobile: mobile, hasTouch: mobile }); const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:5173/index.html'); await p.waitForTimeout(1500);
  for (const sel of sels) {
    const el = await p.$(sel); await el.scrollIntoViewIfNeeded(); await p.evaluate(s => document.querySelector(s).scrollIntoView({block:'start'}), sel); await p.waitForTimeout(1800);
    await p.screenshot({ path: `shots/sec-${w}-${sel.replace(/[^\w]/g,'')}.png`, fullPage: false });
  }
  await b.close();
})();
