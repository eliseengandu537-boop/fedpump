import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';

// Package the existing company logo into square browser icons without redrawing it.
const logo = await loadImage(fileURLToPath(new URL('../dist/assets/fedpump-logo.png', import.meta.url)));
async function squareIcon(size) {
  const canvas = createCanvas(size, size);
  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, size, size);
  const scale = (size * 0.92) / Math.max(logo.width, logo.height);
  const width = logo.width * scale;
  const height = logo.height * scale;
  context.drawImage(logo, (size - width) / 2, (size - height) / 2, width, height);
  return canvas.encode('png');
}

for (const [name, size] of [['favicon-96x96.png', 96], ['favicon-192x192.png', 192], ['apple-touch-icon.png', 180]]) {
  await fs.writeFile(new URL(`../dist/${name}`, import.meta.url), await squareIcon(size));
}

// ICO supports PNG entries; include small sizes for browser tabs and bookmarks.
const sizes = [16, 32, 48, 64];
const images = await Promise.all(sizes.map(squareIcon));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index];
  directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(image.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await fs.writeFile(new URL('../dist/favicon.ico', import.meta.url), Buffer.concat([directory, ...images]));
console.log('Prepared square Fedpump favicons and Apple touch icon from the existing logo.');
