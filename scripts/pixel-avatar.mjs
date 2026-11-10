// Draws the coarse frames that the homepage portrait steps through before it shows the photo.
// It writes them to src/assets/avatar-frames.png as a sprite sheet, coarsest frame first.
// Run it again after changing the photo: node scripts/pixel-avatar.mjs
import sharp from "sharp";

// Blocks per side in each frame. The photo itself is the frame after the last one.
const frames = [7, 14, 28];
const size = frames.at(-1);

const tiles = await Promise.all(
  frames.map((side) =>
    sharp("public/avatar.jpeg")
      .resize(side, side)
      .toBuffer()
      .then((small) => sharp(small).resize(size, size, { kernel: "nearest" }).png().toBuffer()),
  ),
);

await sharp({
  create: { width: size * frames.length, height: size, channels: 3, background: "#000" },
})
  .composite(tiles.map((input, frame) => ({ input, left: frame * size, top: 0 })))
  .png()
  .toFile("src/assets/avatar-frames.png");
