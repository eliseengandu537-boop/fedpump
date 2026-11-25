import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';

const directory = 'artifacts/reference';
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, reducedMotion: 'no-preference' });
  page.setDefaultTimeout(20000);
  page.on('pageerror', error => console.log('Reference page error:', error.message.slice(0, 600)));
  await page.goto('https://www.webild.io/preview/ee5ffd0f-82bd-41fc-8586-fa8eaf563b09', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);
  const preview = page.frames().find(frame => frame.url().includes('.sandbox.webild.io'));
  if (preview) {
    await preview.waitForFunction(() => document.body?.innerText.length > 100, { timeout: 30000 }).catch(error => console.log('Preview content wait:', error.message.slice(0, 150)));
    await page.waitForTimeout(2500);
  }
  await page.screenshot({ path: `${directory}/initial.png` });
  const report = [];
  for (const [index, frame] of page.frames().entries()) {
    const details = await frame.evaluate(() => ({
      title: document.title,
      text: document.body?.innerText.slice(0, 16000),
      dimensions: { width: innerWidth, height: innerHeight, pageHeight: document.documentElement.scrollHeight },
      images: [...document.querySelectorAll('img')].map(image => ({ src: image.currentSrc || image.src, alt: image.alt })),
      scripts: [...document.scripts].map(script => script.src).filter(Boolean),
      styles: [...document.querySelectorAll('style')].map(style => style.textContent),
      scrollContainers: [...document.querySelectorAll('*')].filter(element => element.scrollHeight > element.clientHeight + 150 && ['auto', 'scroll'].includes(getComputedStyle(element).overflowY)).slice(0, 12).map(element => ({ tag: element.tagName, class: element.className, id: element.id, height: element.clientHeight, scrollHeight: element.scrollHeight })),
      animations: document.getAnimations().map(animation => ({ target: animation.effect?.target?.className, frames: animation.effect?.getKeyframes() })).slice(0, 30)
    }));
    await fs.writeFile(`${directory}/frame-${index}.html`, await frame.content());
    report.push({ index, url: frame.url(), ...details });
  }
  await fs.writeFile(`${directory}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.map(({ styles, images, animations, scripts, ...rest }) => ({ ...rest, imageCount: images.length, animationCount: animations.length })), null, 2));
} finally { await browser.close(); }
