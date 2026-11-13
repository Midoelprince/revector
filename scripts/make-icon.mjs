// Draws the Revector mark and writes the desktop icons:
//   build/icon.ico    (installer, .exe and taskbar icon; 16 to 256 px)
//   electron/icon.png (window icon)
// No extra packages: shapes are drawn by hand and saved with Node's zlib.
// Run: npm run icons
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const INK = [0x12, 0x18, 0x2b];
const WHITE = [0xff, 0xff, 0xff];
const SPARK = [0xe4, 0x57, 0x2e];

// Distance helpers, in the logo's own 34 x 34 units.
function toSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function toRoundRect(px, py, x, y, w, h, r) {
  const qx = Math.abs(px - (x + w / 2)) - (w / 2 - r);
  const qy = Math.abs(py - (y + h / 2)) - (h / 2 - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

// The colour of the logo at one point, or null where it is see-through.
// Same shapes, in the same order, as the logo in build.mjs.
function colourAt(x, y) {
  let c = null;
  if (toSegment(x, y, 21.5, 6.5, 24, 2) <= 1) c = INK;
  if (Math.hypot(x - 24.6, y - 2.6) <= 2.2) c = SPARK;
  const box = toRoundRect(x, y, 2.5, 7.5, 29, 23, 8);
  if (box <= 1.3) c = box < -1.3 ? WHITE : INK;
  if (Math.abs(Math.hypot(x - 12.5, y - 19) - 5.2) <= 1.3) c = INK;
  if (Math.hypot(x - 23.5, y - 19) <= 2.1) c = INK;
  return c;
}

function draw(size) {
  const samples = size >= 128 ? 4 : 6; // sub-samples per pixel side, for smooth edges
  const margin = size * 0.04;
  const scale = (size - margin * 2) / 34;
  const pixels = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0, hit = 0;
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const c = colourAt((px + (sx + 0.5) / samples - margin) / scale, (py + (sy + 0.5) / samples - margin) / scale);
          if (c) { r += c[0]; g += c[1]; b += c[2]; hit++; }
        }
      }
      const at = (py * size + px) * 4;
      if (hit) {
        pixels[at] = Math.round(r / hit);
        pixels[at + 1] = Math.round(g / hit);
        pixels[at + 2] = Math.round(b / hit);
        pixels[at + 3] = Math.round((hit / (samples * samples)) * 255);
      }
    }
  }
  return pixels;
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}
function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "ascii");
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, tail]);
}
function png(size, pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;  // bits per channel
  header[9] = 6;  // colour type: RGBA
  const rows = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    pixels.copy(rows, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", zlib.deflateSync(rows, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

function ico(images) {
  const head = Buffer.alloc(6 + images.length * 16);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2); // 1 = icon
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach((image, i) => {
    const at = 6 + i * 16;
    head[at] = image.size >= 256 ? 0 : image.size;     // 0 means 256
    head[at + 1] = image.size >= 256 ? 0 : image.size;
    head.writeUInt16LE(1, at + 4);                     // colour planes
    head.writeUInt16LE(32, at + 6);                    // bits per pixel
    head.writeUInt32LE(image.data.length, at + 8);
    head.writeUInt32LE(offset, at + 12);
    offset += image.data.length;
  });
  return Buffer.concat([head, ...images.map((image) => image.data)]);
}

const sizes = [16, 24, 32, 48, 64, 128, 256];
const images = sizes.map((size) => ({ size, data: png(size, draw(size)) }));

fs.mkdirSync(path.join(root, "build"), { recursive: true });
fs.writeFileSync(path.join(root, "build", "icon.ico"), ico(images));
fs.writeFileSync(path.join(root, "electron", "icon.png"), images[images.length - 1].data);
console.log("Wrote build/icon.ico (" + sizes.join(", ") + " px) and electron/icon.png");
