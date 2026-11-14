// Draws the favicons from Lilly's bitmaps in src/lilly.ts and writes them to public/. The small
// ones, which a browser tab shows, are her head. The large ones, which a phone's home screen
// shows, are all of her, sitting. Run it again after changing her: node scripts/pixel-favicon.mjs
//
// Each icon is a square of ink with Lilly in the middle of it. She is placed on a grid of
// `cells` by `cells` pixels, which is then scaled up to the icon's size, so the size has to be
// a multiple of `cells`. Node reads lilly.ts as it is, without a build.
import { writeFile } from "node:fs/promises";
import sharp from "sharp";
import { colours, draw, face } from "../src/lilly.ts";

const ink = [0x1a, 0x1c, 0x2c];
const hex = (colour) => [1, 3, 5].map((at) => parseInt(colour.slice(at, at + 2), 16));
// "#" is `--color-apricot` in global.css.
const fills = { "#": hex("#f2a65e"), s: hex(colours.s), n: hex(colours.n), r: hex(colours.r) };

/** Cuts the empty rows and columns from around a bitmap. */
function trim(rows) {
  const drawn = rows.filter((row) => /[^.]/.test(row));
  const left = Math.min(...drawn.map((row) => row.search(/[^.]/)));
  const right = Math.max(...drawn.map((row) => row.trimEnd().replace(/\.+$/, "").length));
  return drawn.map((row) => row.slice(left, right));
}

/** A PNG of `size` pixels a side, with the bitmap in the middle of a grid of `cells` a side. */
function icon(rows, cells, size) {
  if (size % cells !== 0) throw new Error(`${size} is not a multiple of ${cells}`);
  const left = Math.floor((cells - rows[0].length) / 2);
  const top = Math.floor((cells - rows.length) / 2);
  const pixels = Buffer.from(
    Array.from({ length: cells * cells }, (_, at) => {
      const char = rows[Math.floor(at / cells) - top]?.[(at % cells) - left];
      return [...(fills[char] ?? ink), 255];
    }).flat(),
  );
  return sharp(pixels, { raw: { width: cells, height: cells, channels: 4 } })
    .resize({ width: size, kernel: "nearest" })
    .png()
    .toBuffer();
}

/** An .ico file that holds the given PNGs, each with its size in pixels. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

const head = face();
const sitting = trim(draw({ pose: "sit", step: 0, wag: false, blink: false, pant: 0 }));

const small = await Promise.all(
  [16, 32].map(async (size) => ({ size, png: await icon(head, 16, size) })),
);
for (const { size, png } of small) await writeFile(`public/favicon-${size}x${size}.png`, png);
await writeFile("public/favicon.ico", ico(small));

await writeFile("public/apple-touch-icon.png", await icon(sitting, 30, 180));
await writeFile("public/android-chrome-192x192.png", await icon(sitting, 32, 192));
await writeFile("public/android-chrome-512x512.png", await icon(sitting, 32, 512));
