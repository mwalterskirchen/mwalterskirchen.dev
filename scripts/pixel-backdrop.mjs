// Draws the page backdrop and writes it to src/assets/backdrop: the sky that global.css lays
// in the margins of every page (clouds on the light theme, stars on the dark one) and the
// ground that the footer stands on.
// Run it again after changing anything here: node scripts/pixel-backdrop.mjs
//
// Every image is written at one image pixel per drawn pixel. The stylesheet scales them up
// with `image-rendering: pixelated`. The drawing is seeded, so a run without changes writes
// the same images.
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const ink = [0x1a, 0x1c, 0x2c, 255];
const dusk = [0x33, 0x3c, 0x57, 255];
const slate = [0x56, 0x6c, 0x86, 255];
const steel = [0x94, 0xb0, 0xc2, 255];
const mist = [0xe8, 0xec, 0xf1, 255];
const clear = [0, 0, 0, 0];

// mulberry32: a small seeded random number generator.
const random = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const write = (name, width, height, colourAt) => {
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) pixels.set(colourAt(x, y), (y * width + x) * 4);
  }
  return sharp(pixels, { raw: { width, height, channels: 4 } })
    .png({ palette: true })
    .toFile(`src/assets/backdrop/${name}.png`);
};

// Stamps bitmaps onto an empty grid and returns a lookup of the character at each pixel.
// A bitmap is one string per row and one character per pixel, and "." is empty.
const stamp = (width, height, sprites) => {
  const grid = new Map();
  for (const { rows, x, y } of sprites) {
    if (rows.some((row) => row.length !== rows[0].length)) throw new Error("uneven rows");
    if (x < 0 || y < 0 || x + rows[0].length > width || y + rows.length > height) {
      throw new Error("a bitmap crosses the edge of its image");
    }
    rows.forEach((row, dy) =>
      [...row].forEach((char, dx) => {
        if (char !== ".") grid.set((y + dy) * width + x + dx, char);
      }),
    );
  }
  return (x, y) => grid.get(y * width + x);
};

await mkdir("src/assets/backdrop", { recursive: true });

// Clouds, for the light theme. The tiles repeat down the page margins. No cloud touches the
// side of its tile, because the stylesheet lines that side up with the edge of the text
// column and a cloud must not be cut off there.
const puff = ["....####......", "..########.##.", ".#############", "##############"];
const drift = [
  "......#####.......",
  "....#########.....",
  ".##.##########.##.",
  "##################",
  ".################.",
];
const bank = [
  "..........######..........",
  "........##########........",
  "...####.###########.......",
  ".#######################..",
  "##########################",
  "##########################",
  ".########################.",
];
const heap = [
  "........#####...............",
  "......#########.....####....",
  "....############..########..",
  "..#########################.",
  ".###########################",
  "############################",
  "############################",
  "..########################..",
];

// The far clouds are a checkerboard of cloud and sky, which reads as a paler tone.
const farClouds = stamp(96, 160, [
  { rows: drift, x: 8, y: 20 },
  { rows: puff, x: 62, y: 76 },
  { rows: drift, x: 34, y: 128 },
]);
const nearClouds = stamp(96, 224, [
  { rows: bank, x: 54, y: 44 },
  { rows: heap, x: 10, y: 152 },
]);

await write("clouds-far", 96, 160, (x, y) => (farClouds(x, y) && (x + y) % 2 ? steel : clear));
await write("clouds-near", 96, 224, (x, y) => (nearClouds(x, y) ? steel : clear));

// Stars, for the dark theme: a square tile that repeats in both directions. Stars keep `gap`
// pixels apart, also across the tile's edges, so they never clump.
const stars = ({ size, count, gap, seed }) => {
  const next = random(seed);
  const placed = [];
  const apart = (a, b) => Math.min(Math.abs(a - b), size - Math.abs(a - b));
  while (placed.length < count) {
    const x = Math.floor(next() * size);
    const y = Math.floor(next() * size);
    if (placed.some((star) => Math.hypot(apart(star.x, x), apart(star.y, y)) < gap)) continue;
    placed.push({ x, y });
  }
  const lit = new Set(placed.map((star) => star.y * size + star.x));
  return (x, y) => lit.has(y * size + x);
};

const farStars = stars({ size: 192, count: 30, gap: 22, seed: 7 });
const nearStars = stars({ size: 160, count: 6, gap: 44, seed: 3 });

await write("stars-far", 192, 192, (x, y) => (farStars(x, y) ? dusk : clear));
await write("stars-near", 160, 160, (x, y) => (nearStars(x, y) ? slate : clear));

// The ground that the footer stands on: far hills and a strip of grass. It repeats sideways.
// `land` is also the footer's fill (`bg-panel`), so the image joins the footer without a seam.
// Lilly and her ball are not part of the image: Footer.astro stands them on the grass, whose
// top is `ground.grass` pixels above the bottom edge.
const themes = {
  "": { sky: mist, land: steel },
  "-dark": { sky: ink, land: dusk },
};
const ground = { width: 480, height: 28, grass: 6 };

// The hills, as the height of each column above the grass.
const hills = (() => {
  const next = random(11);
  const waves = [
    [3, 1],
    [5, 0.6],
    [11, 0.3],
  ].map(([count, weight]) => ({ count, weight, phase: next() * 2 * Math.PI }));
  const total = waves.reduce((sum, { weight }) => sum + weight, 0);
  return Array.from({ length: ground.width }, (_, x) => {
    const level = waves.reduce(
      (sum, { count, weight, phase }) =>
        sum + weight * (0.5 + 0.5 * Math.sin((2 * Math.PI * count * x) / ground.width + phase)),
      0,
    );
    return Math.round(2 + 16 * (level / total) ** 1.4);
  });
})();

// Tufts that stand a pixel or two above the grass, as the height of each column.
const tufts = (() => {
  const next = random(29);
  const heights = new Array(ground.width).fill(0);
  const shapes = [
    [1, 2, 1],
    [2, 1],
    [1, 2],
    [1, 0, 2, 1],
  ];
  for (let x = 2; x < ground.width - 12; x += 7 + Math.floor(next() * 12)) {
    shapes[Math.floor(next() * shapes.length)].forEach((height, i) => (heights[x + i] = height));
  }
  return heights;
})();

for (const [suffix, theme] of Object.entries(themes)) {
  await write(`ground${suffix}`, ground.width, ground.height, (x, y) => {
    const up = ground.height - ground.grass - y;
    if (up <= tufts[x]) return theme.land;
    // The hills are a checkerboard of land and sky, which reads as a tone between the two.
    if (up <= hills[x]) return (x + y) % 2 ? theme.land : theme.sky;
    return clear;
  });
}
