const { chromium } = require('playwright');
const URL = 'http://127.0.0.1:5173/index.html';
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const [w, h] of [[390, 844], [1440, 900]]) {
    const m = w < 768; const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, hasTouch: m }); const p = await ctx.newPage();
    await p.goto(URL); await p.waitForTimeout(1500);
    const shot = async (sel, name, off = 0) => { await p.evaluate(([s, o]) => { const e = document.querySelector(s); scrollTo(0, e.getBoundingClientRect().top + scrollY + o); }, [sel, off]); await p.waitForTimeout(1700); await p.screenshot({ path: `shots/v3-${w}-${name}.png` }); };
    await shot('#about', 'about', m ? 700 : 300);
    await shot('.lib', 'materials', -80);
    await shot('#process .proc', 'process', m ? -70 : 0);
    if (m) {
      await p.click('#proc-next'); await p.waitForTimeout(900); await p.click('#proc-next'); await p.waitForTimeout(1200);
      await p.screenshot({ path: `shots/v3-${w}-process-3.png` });
      console.log('active after 2 next:', await p.$eval('.proc-step.is-active h3', e => e.textContent), await p.$eval('#hud-n', e => e.textContent));
      // touch swipe on the card row
      const box = await p.$eval('.proc-steps', e => { const r = e.getBoundingClientRect(); return { x: r.left + r.width * .8, y: r.top + 80 }; });
      await p.mouse.move(box.x, box.y); await p.evaluate(() => document.querySelector('.proc-steps').scrollBy({ left: 330, behavior: 'smooth' })); await p.waitForTimeout(1200);
      console.log('after swipe:', await p.$eval('.proc-step.is-active h3', e => e.textContent));
    } else {
      await shot('.proc-step:nth-of-type(4)', 'process-4', -h * .3);
    }
    await shot('.apps-grid', 'apps', -60);
    await ctx.close();
  }
  await b.close();
})();
