import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const dir = 'artifacts/reference';
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, reducedMotion: 'no-preference' });
  page.setDefaultTimeout(25000);
  await page.goto('https://3000-i87xfy192s0pgv5jcy46s.sandbox.webild.io/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelectorAll('section').length > 4);
  await page.waitForTimeout(2500);
  console.log('Sections:', JSON.stringify(await page.locator('section').evaluateAll(elements => elements.map(e => ({ id: e.id, top: e.offsetTop, height: e.offsetHeight, heading: e.querySelector('h2,h1')?.textContent }))), null, 2));
  const readings = [];
  const positions = [0, 650, 1100, 1600, 2500, 3100, 3700, 4300, 4900, 5700];
  for (const y of positions) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${dir}/scroll-${y}.png` });
    readings.push(await page.evaluate(() => ({ y: scrollY, elements: [...document.querySelectorAll('img, [class*=sticky]')].filter(e => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }).map(e => { const s = getComputedStyle(e), p = getComputedStyle(e.parentElement); return { tag: e.tagName, alt: e.alt, className: e.className, transform: s.transform, opacity: s.opacity, filter: s.filter, clipPath: s.clipPath, parentTransform: p.transform, parentClipPath: p.clipPath, parentFilter: p.filter, position: s.position }; }) })));
  }
  await fs.writeFile(`${dir}/scroll-readings.json`, JSON.stringify(readings, null, 2));
  const canvas = createCanvas(1200, Math.ceil(positions.length / 3) * 284), ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ddd'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const [i, y] of positions.entries()) { const img = await loadImage(`${dir}/scroll-${y}.png`); const x = i % 3 * 400, top = Math.floor(i / 3) * 284; ctx.drawImage(img, x, top + 20, 400, 264); ctx.fillStyle = '#111'; ctx.font = '12px sans-serif'; ctx.fillText(`Scroll ${y}px`, x + 8, top + 14); }
  await fs.writeFile(`${dir}/scroll-contact-sheet.jpg`, canvas.toBuffer('image/jpeg'));
  console.log(JSON.stringify(readings, null, 2));
} finally { await browser.close(); }
