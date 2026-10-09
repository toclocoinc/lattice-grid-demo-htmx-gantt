// Real-Chrome check of the five steps: built on load, an out-of-band update,
// a project swap, Back, and no console errors.
//   npm run serve                    (in another terminal)
//   CHROME=/usr/bin/google-chrome node tools/verify.mjs [http://localhost:8000/]
import puppeteer from 'puppeteer-core';

const url = process.argv[2] || 'http://localhost:8000/';
const sleep = (ms) => new Promise((r) => { setTimeout(r, ms); });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
let failed = 0;
const check = (ok, what) => { if (!ok) failed += 1; console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); };
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
  check(first.includes('Scope the launch'), 'built on load from the server task table');
  await page.click('button[hx-post="/htmx-demo/gantt/slip"]');
  await sleep(1200);
  check(await page.evaluate(rows) !== first, 'out of band: one task moved');
  await page.click('button[hx-get*="project=migration"]');
  await sleep(1500);
  check((await page.evaluate(rows)).includes('Audit the old system'), 'swap: the other project is built');
  await page.goBack();
  await sleep(2000);
  check((await page.evaluate(rows)).includes('Scope the launch'), 'Back: the first project returns');
  check(errors.length === 0, `no console errors ${errors.join(' / ')}`);
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
