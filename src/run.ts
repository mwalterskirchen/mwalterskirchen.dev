// Lilly's run, a game hidden on the grass above the footer. She runs on the spot while the
// ground scrolls under her, and things from the garden come at her from the right for her to
// jump. Lilly.astro starts it, draws her and passes on the jumps. This module moves the world,
// keeps the score, and tells when she has bumped into something.
//
// Distances are in screen pixels, speeds in pixels per second, times in ms. `unit` is one
// pixel of the drawings, which are drawn at the same size as Lilly.
import { icons } from "./icons";
import { body } from "./lilly";

const kinds = [icons.pot, icons.fence, icons.cat];

type Hurdle = { x: number; rows: readonly string[] };
type Fills = { hurdle: string; shadow: string };

export const createRun = (unit: number) => {
  // A jump lasts `airtime` and lifts her feet `peak` above the grass, which clears the
  // tallest hurdle with room to spare.
  const airtime = 560;
  const peak = 20 * unit;
  const gravity = (8 * peak) / (airtime / 1000) ** 2;
  const launch = (4 * peak) / (airtime / 1000);
  // The run starts at a trot and picks up speed until it is about twice as fast.
  const speeds = { start: 110 * unit, top: 240 * unit, gain: 4 * unit };
  // A jump pressed a moment before she lands is kept and taken as she lands.
  const buffer = 150;

  let time = 0;
  let speed = speeds.start;
  let distance = 0;
  let lift = 0;
  let rise = 0;
  let pressed = -Infinity;
  let hurdles: Hurdle[] = [];
  let next = 0;

  const between = (min: number, max: number) => min + Math.random() * (max - min);
  // The gap to the next hurdle. Even the shortest leaves time to land and jump again.
  const gap = () => speed * between(0.7, 1.5) + 140;

  return {
    reset() {
      time = 0;
      speed = speeds.start;
      distance = 0;
      lift = 0;
      rise = 0;
      pressed = -Infinity;
      hurdles = [];
      // The first hurdle waits until the hint above the grass has gone.
      next = speed * 2;
    },

    jump() {
      pressed = time;
    },

    /** Moves the run on by `elapsed`, and tells whether she has bumped into a hurdle. A
     *  run that has ended (`moving` false) only lets her come down from a jump. */
    update(elapsed: number, lillyX: number, width: number, moving = true): boolean {
      const seconds = elapsed / 1000;
      time += elapsed;

      if (lift > 0 || rise > 0) {
        lift += rise * seconds - (gravity * seconds ** 2) / 2;
        rise -= gravity * seconds;
        if (lift <= 0) lift = rise = 0;
      }
      if (!moving) return false;
      if (lift === 0 && time - pressed < buffer) {
        rise = launch;
        pressed = -Infinity;
      }

      speed = Math.min(speeds.top, speed + speeds.gain * seconds);
      const step = speed * seconds;
      distance += step;
      for (const hurdle of hurdles) hurdle.x -= step;
      hurdles = hurdles.filter((hurdle) => hurdle.x + hurdle.rows[0].length * unit > 0);
      if (distance >= next) {
        const rows = kinds[Math.floor(Math.random() * kinds.length)];
        hurdles.push({ x: width, rows });
        next = distance + gap();
      }

      // Each hurdle is a pixel smaller on every side than it looks, so that a near miss
      // counts as a miss.
      const left = lillyX + body.left * unit;
      const right = lillyX + body.right * unit;
      return hurdles.some(
        ({ x, rows }) =>
          x + unit < right &&
          x + (rows[0].length - 1) * unit > left &&
          lift < (rows.length - 1) * unit,
      );
    },

    /** How high her feet are above the grass. */
    get lift() {
      return lift;
    },

    get score() {
      return Math.floor(distance / (10 * unit));
    },

    /** How far the ground has scrolled. */
    get distance() {
      return distance;
    },

    /** Draws the hurdles and their shadows standing on `floor`, and her shadow while she is in
     *  the air. Her picture draws its own shadow while she is on the grass. */
    paint(pen: CanvasRenderingContext2D, lillyX: number, floor: number, fills: Fills) {
      const dot = (column: number, row: number) => pen.fillRect(column, row, unit, unit);
      pen.clearRect(0, 0, pen.canvas.width, pen.canvas.height);

      pen.fillStyle = fills.shadow;
      for (const { x, rows } of hurdles) {
        pen.fillRect(Math.round(x) + unit, floor, (rows[0].length - 2) * unit, unit);
      }
      // Like her shadow on the grass, but narrower the higher she is.
      if (lift > 0) {
        const at = Math.round(lillyX);
        const shrink = Math.min(3, Math.floor(lift / (8 * unit)));
        const from = body.left + shrink;
        const to = body.right - 2 - shrink;
        for (let column = from; column <= to; column++) {
          dot(at + column * unit, floor);
          if (column >= from + 2 && column <= to - 2 && column % 2 === 0) {
            dot(at + column * unit, floor + unit);
          }
        }
      }

      pen.fillStyle = fills.hurdle;
      for (const { x, rows } of hurdles) {
        const left = Math.round(x);
        rows.forEach((row, y) =>
          [...row].forEach((char, column) => {
            if (char !== ".") dot(left + column * unit, floor - (rows.length - y) * unit);
          }),
        );
      }
    },
  };
};
