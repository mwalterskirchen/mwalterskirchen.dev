// Lilly, a miniature poodle, who lives on the grass above the footer (Lilly.astro).
//
// She is drawn from parts, so that her tail, eyes, mouth and legs can move on their own. Each
// part is a bitmap like the icons: one string per row and one character per pixel. "#" is her
// coat, "s" its shade, "n" the dark of her eye and nose, "r" her tongue and "." is empty.
// "d" is her shadow. `draw` stamps the parts for one moment onto a grid of `width` by `height`
// pixels, and `picture` adds the space above her and the shadow below her.

export const width = 28;
export const height = 22;
/** Empty rows above her, which a hop uses, and rows below her feet, where her shadow lies. */
export const headroom = 2;
export const footing = 2;
export const pictureHeight = headroom + height + footing;

/** The fixed colours. The coat itself is `--color-apricot` in global.css. */
export const colours = { s: "#c9783f", n: "#4a2a22", r: "#b13e53" } as const;

export type Look = {
  pose: "stand" | "walk" | "run" | "sit" | "lie";
  /** Which frame of the pose: a walk has four, a run two, and lying down two (breathing). */
  step: number;
  /** The tail is to one side. */
  wag: boolean;
  /** The eyes are closed. */
  blink: boolean;
  /** 0 is a closed mouth, and 1 and 2 are the tongue hanging out a little and a lot. */
  pant: 0 | 1 | 2;
};

const head = [
  ".....###......",
  "...#######....",
  "..#########...",
  "..####s####...",
  "...########...",
  "..#####n######",
  "..###########n",
  "....########..",
  "....###.......",
];
// The ear hangs beside the head. At the top of a running stride it lifts by a pixel.
const ear = ["..ss", ".sss", ".sss", "ssss", "ssss", "sss."];

const tail = [".##..", "####.", "####.", ".##..", "..#..", "..#..", "..#..", "..#..", "..#.."];
const tailWag = ["..##.", ".####", ".####", "..##.", "..#..", "..#..", "..#..", "..#..", "..#.."];
// Lying down, only the tuft at the end of the tail shows.
const tuft = [".##.", "####", "####", ".##."];
const tuftWag = [".##.", "####", "####", "..##"];

const torso = [
  ".............####.......",
  "...#.#.#....######......",
  "..################......",
  "..###s####s#######......",
  "..#######s########......",
  "..###############.......",
  "...#############........",
];

const legs = {
  stand: [
    "...###ss....###ss.......",
    "...##.ss....##.ss.......",
    "..####sss..####sss......",
    "..####sss..####sss......",
    "..####sss..####sss......",
  ],
  apart: [
    "...###ss....###ss.......",
    "..##...ss..ss..##.......",
    ".####.sss.sss.####......",
    ".####.sss.sss.####......",
    ".####.sss.sss.####......",
  ],
  crossed: [
    "...s###.....####s.......",
    "..ss.##....##..ss.......",
    ".sss.####.####.sss......",
    ".sss.####.####.sss......",
    ".sss.####.####.sss......",
  ],
  // The two halves of a gallop: stretched out in the air, then gathered under her. The far
  // legs sit inside the near ones, so that all four show. The stretched legs have a row more
  // than the others: its empty last row is the air under her, and its first reaches her body,
  // which is a pixel higher in that frame.
  stretched: [
    "...###.ss.ss.###........",
    "..###.ss...ss.###.......",
    ".###.ss.....ss.###......",
    "####sss......sss####....",
    "####sss......sss####....",
    "........................",
  ],
  gathered: [
    "..ss###....###ss........",
    "...ss###..###ss.........",
    "...sss####.####sss......",
    "...sss####.####sss......",
    "...sss####.####sss......",
  ],
};

const sitting = [
  ".............####.......",
  "............######......",
  "........##########......",
  "......#.#########.......",
  ".....############.......",
  "....#.######.####.......",
  "....########.###ss......",
  "...##s######.##.ss......",
  "...#########.##.ss......",
  "..##########.####sss....",
  "..###########.###sss....",
  "..###########.###sss....",
];

const lying = [
  "....#.#.#.#.............",
  "...############.........",
  "..###s####s####.........",
  "..#######s######........",
  "..###############.......",
  "..################......",
  "..################.###ss",
];

export const draw = ({ pose, step, wag, blink, pant }: Look): string[] => {
  const grid = Array.from({ length: height }, () => new Array<string>(width).fill("."));
  const stamp = (part: readonly string[], left: number, top: number) => {
    part.forEach((row, dy) =>
      [...row].forEach((char, dx) => {
        const line = grid[top + dy];
        if (char !== "." && line && left + dx >= 0 && left + dx < width) line[left + dx] = char;
      }),
    );
  };

  // Where the head goes, and whether the ear is lifted. Everything is two pixels in from
  // the left and one down from the top, which leaves room for the tail's swing and a leap.
  let at = { x: 11, y: 1 };
  let lifted = false;

  if (pose === "sit") {
    stamp(sitting, 2, 10);
    stamp(wag ? tailWag : tail, 2, 12);
  } else if (pose === "lie") {
    // She breathes: every other frame her back is a pixel higher. Her paw, in the last row,
    // stays where it is.
    const rise = step % 2;
    stamp(lying.slice(0, -1), 2, 15 - rise);
    stamp(lying.slice(1), 2, 16);
    stamp(wag ? tuftWag : tuft, 0, 17);
    at = { x: 14, y: 11 };
  } else {
    // A walk drops her body by a pixel as each pair of legs lands, and a gallop lifts it.
    const gait =
      pose === "walk"
        ? (
            [
              [legs.apart, 1],
              [legs.stand, 0],
              [legs.crossed, 1],
              [legs.stand, 0],
            ] as const
          )[step % 4]
        : pose === "run"
          ? (
              [
                [legs.stretched, -1],
                [legs.gathered, 0],
              ] as const
            )[step % 2]
          : ([legs.stand, 0] as const);
    const [stride, drop] = gait;
    stamp(stride, 2, height - stride.length);
    stamp(torso, 2, 10 + drop);
    stamp(wag ? tailWag : tail, 2, 3 + drop);
    at = { x: 11, y: 1 + drop };
    lifted = stride === legs.stretched;
  }

  stamp(head, at.x, at.y);
  if (lifted) stamp(ear.slice(0, -1), at.x, at.y + 4);
  else stamp(ear, at.x, at.y + 5);
  if (blink) stamp(["s"], at.x + 7, at.y + 5);
  if (pant > 0) stamp(pant === 2 ? ["rr", "rr", ".r"] : ["rr", ".r"], at.x + 9, at.y + 8);

  return grid.map((row) => row.join(""));
};

/** The whole picture: Lilly `lift` pixels above the ground, and her shadow on it. */
export const picture = (look: Look, lift = 0): string[] => {
  const sprite = draw(look);
  const grid = Array.from({ length: pictureHeight }, () => new Array<string>(width).fill("."));
  sprite.forEach((row, y) =>
    [...row].forEach((char, x) => {
      const line = grid[headroom + y - lift];
      if (char !== "." && line) line[x] = char;
    }),
  );

  // The shadow is as wide as the lowest part of her, and narrower while she is in the air,
  // which she is in a hop and at the top of a gallop. Its second row is a checkerboard.
  const low = sprite
    .slice(-6)
    .flatMap((row) => [...row].flatMap((char, x) => (char === "." ? [] : [x])));
  const inAir = lift > 0 || !sprite[height - 1].includes("#");
  const left = Math.min(...low) + (inAir ? 2 : 0);
  const right = Math.max(...low) - (inAir ? 2 : 0);
  for (let x = left; x <= right; x++) {
    grid[headroom + height][x] = "d";
    if (x >= left + 2 && x <= right - 2 && x % 2 === 0) grid[headroom + height + 1][x] = "d";
  }

  return grid.map((row) => row.join(""));
};

/** Where her mouth is, in pixels from the left of the picture and up from her feet. */
export const mouth = { x: 24, up: 12 };

/** The "z"s that rise from her while she sleeps: where each one's top left pixel goes. */
export const snores = (step: number): { x: number; y: number }[] =>
  step % 2 === 0
    ? [{ x: 17, y: 6 }]
    : [
        { x: 18, y: 5 },
        { x: 23, y: 0 },
      ];
export const snore = ["zzzzz", "...z.", "..z..", ".z...", "zzzzz"];
