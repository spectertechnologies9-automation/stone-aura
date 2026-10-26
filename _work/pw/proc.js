const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(process.env.CH ? { channel: process.env.CH } : {}); const out = [];
  for (const [w,h] of [[390,844],[1440,900]]) {
    const m = w < 768; const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, hasTouch: m }); const p = await ctx.newPage();
    await p.goto('http://127.0.0.1:5173/index.html'); await p.waitForTimeout(1200);
    for (const i of [0, 3, 6]) {
      await p.evaluate(i => { const s = document.querySelectorAll('.proc-step')[i]; scrollTo(0, s.getBoundingClientRect().top + scrollY - innerHeight * (innerWidth < 821 ? .55 : .3)); }, i);
      await p.waitForTimeout(1500);
      await p.screenshot({ path: `shots/proc-${w}-${i}.png` });
      out.push(await p.evaluate(() => [innerWidth, document.querySelector('.proc-step.is-active h3').textContent, document.querySelector('#hud-n').textContent]));
    }
    await ctx.close();
  }
  console.log(out); await b.close();
})();
