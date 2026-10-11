// Real-Chrome check of the five steps: built on load, an out-of-band update,
// a project swap, Back, and no console errors.
//   npm run serve                    (in another terminal)
//   CHROME=/usr/bin/google-chrome node tools/verify.mjs [http://localhost:8000/]
import puppeteer from 'puppeteer-core';

const url = process.argv[2] || 'http://localhost:8000/';
const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
const sizes = process.env.SIZES ? process.env.SIZES.split(',').map((x) => x.split('x').map(Number)) : [[1280, 800]];
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || process.env.CHROME_DEFAULT || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
let failed = 0;
const check = (ok, what) => { if (!ok) failed += 1; console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); };
const WARN = /\[lattice\]/;
const pressed = () => [...document.querySelectorAll('#gantt-view .filters button[aria-pressed=true]')].map((b) => b.textContent.trim()).join(',');
const rows = () => [...document.querySelectorAll('#gantt-view [role=row]')].map((r) => r.textContent).join('|');

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await page.waitForFunction(() => document.querySelectorAll('#gantt-view [role=row]').length > 3, { timeout: 30000 });
  await sleep(1000);
  const first = await page.evaluate(rows);
  check(first.includes('Stakeholder interviews'), 'built on load from the server task table');
  // The server slips a random unfinished task, which may sit outside the rendered rows, so allow a few tries.
  let moved = false;
  for (let i = 0; i < 6 && !moved; i += 1) {
    await page.click('button[hx-post="/htmx-demo/gantt/slip"]');
    await sleep(1200);
    moved = await page.evaluate(rows) !== first;
  }
  check(moved, 'out of band: one task moved');
  await page.click('button[hx-get*="project=migration"]');
  await sleep(1500);
  check((await page.evaluate(rows)).includes('Inventory servers and apps'), 'swap: the other project is built');
  await page.goBack();
  await sleep(2000);
  check((await page.evaluate(rows)).includes('Stakeholder interviews'), 'Back: the first project returns');
  check(errors.length === 0, `no console errors ${errors.join(' / ')}`);

  // The URL's own filter is rendered on load and refresh, built once, with the matching button pressed.
  const cases = [
    ['bare URL', '', 'Platform rebuild', 'Stakeholder interviews'],
    ['?project=platform', '?project=platform', 'Platform rebuild', 'Stakeholder interviews'],
    ['?project=migration', '?project=migration', 'Data centre migration', 'Inventory servers and apps'],
  ];
  for (const [w, h] of sizes) {
    for (const [name, query, button, task] of cases) {
      const p = await browser.newPage();
      await p.setViewport({ width: w, height: h });
      const bad = [];
      p.on('console', (m) => { if (m.type() === 'error' || WARN.test(m.text())) bad.push(m.text()); });
      p.on('pageerror', (e) => bad.push(e.message));
      const built = async () => {
        await p.waitForFunction(() => document.querySelectorAll('#gantt-view [role=row]').length > 3, { timeout: 15000 });
        const [r, b] = await p.evaluate(() => [[...document.querySelectorAll('#gantt-view [role=row]')].map((x) => x.textContent).join('|'), [...document.querySelectorAll('#gantt-view .filters button[aria-pressed=true]')].map((x) => x.textContent.trim()).join(',')]);
        return r.includes(task) && b === button;
      };
      await p.goto(url + query);
      check(await built(), `${w}x${h} fresh open ${name}: ${button} pressed and built`);
      for (let i = 1; i <= 10; i += 1) {
        await p.reload();
        if (!await built()) { check(false, `${w}x${h} ${name}: reload ${i} did not build ${button}`); break; }
        if (i === 10) check(true, `${w}x${h} ${name}: 10 cached reloads all build ${button}`);
      }
      check(bad.length === 0, `${w}x${h} ${name}: 0 console errors and [lattice] warnings ${bad.join(' / ')}`);
      await p.close();
    }
    // Click a filter, Refresh, then Back after Refresh.
    const p = await browser.newPage();
    await p.setViewport({ width: w, height: h });
    const bad = [];
    p.on('console', (m) => { if (m.type() === 'error' || WARN.test(m.text())) bad.push(m.text()); });
    p.on('pageerror', (e) => bad.push(e.message));
    await p.goto(url);
    await p.waitForFunction(() => document.querySelectorAll('#gantt-view [role=row]').length > 3, { timeout: 15000 });
    await p.click('button[hx-get*="project=migration"]');
    await p.waitForFunction(() => document.body.textContent.includes('Inventory servers'), { timeout: 15000 });
    for (let i = 1; i <= 10; i += 1) {
      await p.reload();
      await p.waitForFunction(() => document.querySelectorAll('#gantt-view [role=row]').length > 3, { timeout: 15000 });
      const [r, b] = await p.evaluate(() => [[...document.querySelectorAll('#gantt-view [role=row]')].map((x) => x.textContent).join('|'), [...document.querySelectorAll('#gantt-view .filters button[aria-pressed=true]')].map((x) => x.textContent.trim()).join(',')]);
      if (!r.includes('Inventory servers and apps') || b !== 'Data centre migration') { check(false, `${w}x${h} click then Refresh ${i}: not migration/built`); break; }
      if (i === 10) check(true, `${w}x${h} click a filter then 10 Refreshes: migration pressed and built`);
    }
    await p.goBack();
    await sleep(2500);
    const [r, b] = await p.evaluate(() => [[...document.querySelectorAll('#gantt-view [role=row]')].map((x) => x.textContent).join('|'), [...document.querySelectorAll('#gantt-view .filters button[aria-pressed=true]')].map((x) => x.textContent.trim()).join(',')]);
    console.log(`     Back after Refresh -> ${p.url()} pressed=${b}`);
    check(r.includes('Stakeholder interviews') && b === 'Platform rebuild', `${w}x${h} Back after Refresh: the first project returns, pressed and built`);
    check(bad.length === 0, `${w}x${h} click/Refresh/Back: 0 console errors and [lattice] warnings ${bad.join(' / ')}`);
    await p.close();
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
