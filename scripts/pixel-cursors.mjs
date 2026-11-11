// Draws the mouse cursors and writes two things: the images in src/assets/cursors, and
// src/styles/cursors.css, which holds a `pixel-cursor-*` utility for every CSS cursor keyword.
// Run it again after changing a bitmap: node scripts/pixel-cursors.mjs
//
// A bitmap is one string per row and one character per pixel: "#" is the fill, "w" is the
// outline and "." is empty. A bitmap with no "w" in it gets an outline drawn around its fill.
// On the light theme the fill is ink and the outline mist, and on the dark theme they swap, so
// the cursor is always a solid shape in the text colour. Each image is written at 2 screen
// pixels per bitmap pixel, and again at 4 for dense screens. Keep a finished bitmap within
// 16 x 16: browsers restrict cursors larger than 32 x 32 screen pixels.
import { mkdir, writeFile } from "node:fs/promises";
import { format, resolveConfig } from "prettier";
import sharp from "sharp";

const ink = [0x1a, 0x1c, 0x2c, 255];
const mist = [0xe8, 0xec, 0xf1, 255];

const arrow = [
  "w.........",
  "ww........",
  "w#w.......",
  "w##w......",
  "w###w.....",
  "w####w....",
  "w#####w...",
  "w######w..",
  "w#######w.",
  "w####wwwww",
  "w#ww##w...",
  "ww..w##w..",
  "w...w##w..",
  ".....w##w.",
  ".....w##w.",
  "......ww..",
];

const hand = [
  "....ww.......",
  "...w##w......",
  "...w##w......",
  "...w##w......",
  "...w##www....",
  "...w##w##www.",
  "...w##w##w##w",
  "ww.w##w##w##w",
  "w#ww########w",
  "w##w########w",
  ".w##########w",
  "..w#########w",
  "..w########w.",
  "...w#######w.",
  "...w######w..",
  "...wwwwwwww..",
];

const text = [
  "wwwwwww",
  "w##w##w",
  "www#www",
  "..w#w..",
  "..w#w..",
  "..w#w..",
  "..w#w..",
  "..w#w..",
  "..w#w..",
  "www#www",
  "w##w##w",
  "wwwwwww",
];

const notAllowed = [
  "...#####...",
  ".#########.",
  ".###...###.",
  "#####....##",
  "##.###...##",
  "##..###..##",
  "##...###.##",
  "##....#####",
  ".###...###.",
  ".#########.",
  "...#####...",
];

const hourglass = [
  "#########",
  ".#wwwww#.",
  ".#w###w#.",
  ".#w###w#.",
  "..#w#w#..",
  "...#w#...",
  "...#w#...",
  "..#www#..",
  ".#ww#ww#.",
  ".#w###w#.",
  ".#w###w#.",
  "#########",
];

const openHand = [
  ".....##.##...",
  "..##.##.##...",
  "..##.##.##.##",
  "..##.##.##.##",
  "..###########",
  "##.##########",
  "#############",
  ".############",
  "..###########",
  "..##########.",
  "...#########.",
  "....#######..",
];

const fist = [
  "..##.##.##...",
  "..##.##.##.##",
  ".############",
  "#############",
  "#############",
  ".############",
  "..###########",
  "..##########.",
  "...#########.",
  "....#######..",
];

const zoomIn = [
  "...#####......",
  ".#########....",
  ".##wwwww##....",
  "##www#www##...",
  "##www#www##...",
  "##w#####w##...",
  "##www#www##...",
  "##www#www##...",
  ".##wwwww##....",
  ".#########....",
  "...#####.###..",
  "..........###.",
  "...........###",
  "............##",
];

// The same lens with the upright bar of the plus taken out.
const zoomOut = zoomIn.map((row, y) =>
  [3, 4, 6, 7].includes(y) ? `${row.slice(0, 5)}w${row.slice(6)}` : row,
);

const crosshair = [
  "......#......",
  "......#......",
  "......#......",
  "......#......",
  "......#......",
  ".............",
  "#####.#.#####",
  ".............",
  "......#......",
  "......#......",
  "......#......",
  "......#......",
  "......#......",
];

const move = [
  "......#......",
  ".....###.....",
  "....#####....",
  "......#......",
  "..#...#...#..",
  ".##...#...##.",
  "#############",
  ".##...#...##.",
  "..#...#...#..",
  "......#......",
  "....#####....",
  ".....###.....",
  "......#......",
];

const resizeAcross = [
  "...#.....#...",
  "..##.....##..",
  ".###.....###.",
  "#############",
  ".###.....###.",
  "..##.....##..",
  "...#.....#...",
];

const resizeDiagonal = [
  "#####......",
  "####.......",
  "###........",
  "##.#.......",
  "#...#......",
  ".....#.....",
  "......#...#",
  ".......#.##",
  "........###",
  ".......####",
  "......#####",
];

// Small marks that sit at the arrow's lower right.
const badges = {
  hourglass: ["#####", ".###.", "..#..", ".###.", "#####"],
  plus: ["..#..", "..#..", "#####", "..#..", "..#.."],
  question: [".###.", "#...#", "...#.", "..#..", ".....", "..#.."],
  shortcut: [".####", "...##", "..#.#", ".#..#", "#...."],
  menu: ["#####", ".....", "#####", ".....", "#####"],
};

const transpose = (rows) => [...rows[0]].map((_, x) => rows.map((row) => row[x]).join(""));
const mirror = (rows) => rows.map((row) => [...row].reverse().join(""));

/** Adds an outline around the fill, which makes the bitmap one pixel larger on each side. */
function outline(rows) {
  const width = rows[0].length + 2;
  const padded = [".".repeat(width), ...rows.map((row) => `.${row}.`), ".".repeat(width)];
  return padded.map((row, y) =>
    [...row]
      .map((char, x) => {
        if (char !== ".") return char;
        const nearFill = [-1, 0, 1].some((dy) =>
          [-1, 0, 1].some((dx) => padded[y + dy]?.[x + dx] === "#"),
        );
        return nearFill ? "w" : ".";
      })
      .join(""),
  );
}

/** The arrow with an outlined badge at its lower right, on a 16 x 16 bitmap. */
function arrowWith(badge) {
  const mark = outline(badge);
  const canvas = Array.from({ length: 16 }, (_, y) => [...(arrow[y] ?? "").padEnd(16, ".")]);
  const left = 16 - mark[0].length;
  const top = 16 - mark.length;
  mark.forEach((row, y) =>
    [...row].forEach((char, x) => {
      if (char !== ".") canvas[top + y][left + x] = char;
    }),
  );
  return canvas.map((row) => row.join(""));
}

// Each image with its hotspot in bitmap pixels: the point of the cursor that does the clicking.
const centred = (rows) => {
  const outlined = outline(rows);
  return { rows: outlined, hotspot: [outlined[0].length / 2, outlined.length / 2] };
};
const images = {
  arrow: { rows: arrow, hotspot: [1, 1] },
  hand: { rows: hand, hotspot: [5, 1] },
  text: { rows: text, hotspot: [3.5, 6] },
  "vertical-text": { rows: transpose(text), hotspot: [6, 3.5] },
  progress: { rows: arrowWith(badges.hourglass), hotspot: [1, 1] },
  copy: { rows: arrowWith(badges.plus), hotspot: [1, 1] },
  help: { rows: arrowWith(badges.question), hotspot: [1, 1] },
  alias: { rows: arrowWith(badges.shortcut), hotspot: [1, 1] },
  "context-menu": { rows: arrowWith(badges.menu), hotspot: [1, 1] },
  wait: centred(hourglass),
  "not-allowed": centred(notAllowed),
  grab: centred(openHand),
  grabbing: centred(fist),
  crosshair: centred(crosshair),
  move: centred(move),
  "zoom-in": { rows: outline(zoomIn), hotspot: [6, 6] },
  "zoom-out": { rows: outline(zoomOut), hotspot: [6, 6] },
  "ew-resize": centred(resizeAcross),
  "ns-resize": centred(transpose(resizeAcross)),
  "nwse-resize": centred(resizeDiagonal),
  "nesw-resize": centred(mirror(resizeDiagonal)),
};

// Every CSS cursor keyword and the image that stands in for it. `none` is left alone.
const keywords = {
  auto: "arrow",
  default: "arrow",
  pointer: "hand",
  "no-drop": "not-allowed",
  cell: "crosshair",
  "all-scroll": "move",
  "col-resize": "ew-resize",
  "e-resize": "ew-resize",
  "w-resize": "ew-resize",
  "row-resize": "ns-resize",
  "n-resize": "ns-resize",
  "s-resize": "ns-resize",
  "nw-resize": "nwse-resize",
  "se-resize": "nwse-resize",
  "ne-resize": "nesw-resize",
  "sw-resize": "nesw-resize",
  ...Object.fromEntries(
    Object.keys(images)
      .filter((name) => name !== "arrow" && name !== "hand")
      .map((name) => [name, name]),
  ),
};

await mkdir("src/assets/cursors", { recursive: true });

for (const [name, { rows }] of Object.entries(images)) {
  const width = rows[0].length;
  if (width > 16 || rows.length > 16) throw new Error(`${name} is larger than 16 x 16`);
  if (rows.some((row) => row.length !== width)) throw new Error(`${name} has uneven rows`);
  for (const [theme, fill, line] of [
    ["", ink, mist],
    ["-dark", mist, ink],
  ]) {
    const pixels = Buffer.from(
      rows.flatMap((row) =>
        [...row].flatMap((char) => (char === "#" ? fill : char === "w" ? line : [0, 0, 0, 0])),
      ),
    );
    for (const [scale, density] of [
      [2, ""],
      [4, "@2x"],
    ]) {
      await sharp(pixels, { raw: { width, height: rows.length, channels: 4 } })
        .resize({ width: width * scale, kernel: "nearest" })
        .png()
        .toFile(`src/assets/cursors/${name}${theme}${density}.png`);
    }
  }
}

// Each utility gives the plain image first and then a set with a sharper image for dense
// screens, which browsers that do not understand it skip. The keyword at the end is the
// system cursor to fall back on.
const utilities = Object.entries(keywords)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([keyword, name]) => {
    const hotspot = images[name].hotspot.map((value) => Math.round(value * 2)).join(" ");
    const rules = (theme) => {
      const file = `"../assets/cursors/${name}${theme}`;
      return `cursor: url(${file}.png") ${hotspot}, ${keyword};
  cursor: image-set(url(${file}.png") 1x, url(${file}@2x.png") 2x) ${hotspot}, ${keyword};`;
    };
    return `@utility pixel-cursor-${keyword} {
  ${rules("")}
  @variant dark {
    ${rules("-dark")}
  }
}`;
  });

const css = `/* Generated by scripts/pixel-cursors.mjs. Do not edit: change the script and run it again.
   There is one \`pixel-cursor-*\` utility for each CSS cursor keyword. Use them in place of
   Tailwind's \`cursor-*\` classes, which give the system cursor. Only the ones a page uses
   end up in the built stylesheet. */

${utilities.join("\n\n")}
`;

const path = "src/styles/cursors.css";
await writeFile(path, await format(css, { ...(await resolveConfig(path)), filepath: path }));
