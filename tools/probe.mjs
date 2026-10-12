import puppeteer from 'puppeteer-core';
const url = process.argv[2];
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const log = [];
page.on('console', (m) => log.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => log.push(`[pageerror] ${e.message}`));
page.on('requestfailed', (r) => log.push(`[reqfail] ${r.url()} ${r.failure()?.errorText}`));
page.on('response', (r) => { if (r.status() >= 400) log.push(`[http ${r.status()}] ${r.url()}`); });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 6000));
const state = await page.evaluate(() => ({
  rows: document.querySelectorAll('#gantt-view [role=row]').length,
  ganttHtml: (document.querySelector('#gantt-view')?.innerHTML || '').slice(0, 400),
  scripts: [...document.scripts].map(s => s.src).filter(Boolean),
}));
console.log(JSON.stringify(state, null, 1));
console.log(log.join('\n'));
await browser.close();
