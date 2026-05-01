import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { default: canvaskitInit } = await import("canvaskit-wasm/full");

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const blogsDir = path.join(root, "content/blogs");
const outDir = path.join(root, "public/og");

const W = 1200;
const H = 630;
const PAD = 80;
const BORDER = 6;
const TITLE_SIZE = 56;
const AUTHOR_SIZE = 26;
const CTA_SIZE = 32;
const GAP_TITLE_AUTHOR = 36;
const GAP_AUTHOR_CTA = 18;
const AVATAR_SIZE = 96;
const GAP_AVATAR_TITLE = 32;

const NEUTRAL_900 = [23, 23, 23];
const NEUTRAL_100 = [245, 245, 245];
const NEUTRAL_400 = [163, 163, 163];
const EMERALD = [16, 185, 129];

const FONT_BOLD =
  "https://raw.githubusercontent.com/IBM/plex/master/packages/plex-mono/fonts/complete/ttf/IBMPlexMono-Bold.ttf";
const FONT_REGULAR =
  "https://raw.githubusercontent.com/IBM/plex/master/packages/plex-mono/fonts/complete/ttf/IBMPlexMono-Regular.ttf";

const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const fetchFont = async (url) => {
  const cacheDir = path.join(root, "node_modules/.cache/og-fonts");
  await fs.mkdir(cacheDir, { recursive: true });
  const cachePath = path.join(cacheDir, path.basename(url));
  try {
    return await fs.readFile(cachePath);
  } catch {
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    await fs.writeFile(cachePath, buf);
    return buf;
  }
};

const CanvasKit = await canvaskitInit({
  locateFile: (f) => require.resolve(`canvaskit-wasm/bin/full/${f}`),
});

const [boldFont, regularFont] = await Promise.all([
  fetchFont(FONT_BOLD),
  fetchFont(FONT_REGULAR),
]);
const fontMgr = CanvasKit.FontMgr.FromData(boldFont, regularFont);

const avatarBytes = await fs.readFile(path.join(root, "public/avatar.jpeg"));
const avatarImg = CanvasKit.MakeImageFromEncoded(avatarBytes);

const rgb = ([r, g, b]) => CanvasKit.Color(r, g, b, 1);

const makeParagraph = (text, { color, size, weight, family = "IBM Plex Mono" }) => {
  const style = new CanvasKit.ParagraphStyle({
    textStyle: {
      color: rgb(color),
      fontFamilies: [family],
      fontSize: size,
      fontStyle: { weight },
      heightMultiplier: 1.25,
    },
    textAlign: CanvasKit.TextAlign.Left,
  });
  const builder = CanvasKit.ParagraphBuilder.Make(style, fontMgr);
  builder.addText(text);
  const para = builder.build();
  para.layout(W - PAD * 2);
  builder.delete();
  return para;
};

const renderCard = ({ title, subtitle, cta, avatar = false }) => {
  const titlePara = makeParagraph(title, {
    color: NEUTRAL_100,
    size: TITLE_SIZE,
    weight: CanvasKit.FontWeight.Bold,
  });
  const subtitlePara = makeParagraph(subtitle, {
    color: NEUTRAL_400,
    size: AUTHOR_SIZE,
    weight: CanvasKit.FontWeight.Normal,
  });
  const ctaPara = makeParagraph(cta, {
    color: EMERALD,
    size: CTA_SIZE,
    weight: CanvasKit.FontWeight.Bold,
  });

  const titleH = titlePara.getHeight();
  const subtitleH = subtitlePara.getHeight();
  const ctaH = ctaPara.getHeight();
  const avatarBlock = avatar ? AVATAR_SIZE + GAP_AVATAR_TITLE : 0;
  const totalH =
    avatarBlock + titleH + GAP_TITLE_AUTHOR + subtitleH + GAP_AUTHOR_CTA + ctaH;
  const startY = Math.round((H - totalH) / 2);

  const surface = CanvasKit.MakeSurface(W, H);
  const canvas = surface.getCanvas();
  canvas.clear(rgb(NEUTRAL_900));

  const borderPaint = new CanvasKit.Paint();
  borderPaint.setColor(rgb(EMERALD));
  borderPaint.setStyle(CanvasKit.PaintStyle.Fill);
  canvas.drawRect(CanvasKit.LTRBRect(0, 0, BORDER, H), borderPaint);

  let y = startY;

  if (avatar) {
    canvas.save();
    const builder = new CanvasKit.PathBuilder();
    builder.addCircle(PAD + AVATAR_SIZE / 2, y + AVATAR_SIZE / 2, AVATAR_SIZE / 2);
    const clip = builder.detach();
    builder.delete();
    canvas.clipPath(clip, CanvasKit.ClipOp.Intersect, true);
    const imgPaint = new CanvasKit.Paint();
    canvas.drawImageRect(
      avatarImg,
      CanvasKit.LTRBRect(0, 0, avatarImg.width(), avatarImg.height()),
      CanvasKit.LTRBRect(PAD, y, PAD + AVATAR_SIZE, y + AVATAR_SIZE),
      imgPaint,
    );
    canvas.restore();
    clip.delete();
    imgPaint.delete();
    y += AVATAR_SIZE + GAP_AVATAR_TITLE;
  }

  canvas.drawParagraph(titlePara, PAD, y);
  y += titleH + GAP_TITLE_AUTHOR;
  canvas.drawParagraph(subtitlePara, PAD, y);
  y += subtitleH + GAP_AUTHOR_CTA;
  canvas.drawParagraph(ctaPara, PAD, y);

  const img = surface.makeImageSnapshot();
  const png = img.encodeToBytes();

  img.delete();
  surface.delete();
  borderPaint.delete();
  titlePara.delete();
  subtitlePara.delete();
  ctaPara.delete();

  return Buffer.from(png);
};

await fs.mkdir(outDir, { recursive: true });

const siteOut = path.join(outDir, "site.png");
await fs.writeFile(
  siteOut,
  renderCard({
    title: "Maximilian Walterskirchen",
    subtitle: "Senior Software Engineer · Zurich",
    cta: "mwalterskirchen.dev →",
    avatar: true,
  }),
);
console.log(`[og] wrote ${path.relative(root, siteOut)}`);

const files = (await fs.readdir(blogsDir)).filter((f) => f.endsWith(".md"));

for (const file of files) {
  const raw = await fs.readFile(path.join(blogsDir, file), "utf8");
  const { data } = matter(raw);
  if (data.cardImage) {
    console.log(`[og] skip ${file} (has cardImage)`);
    continue;
  }
  const slug = data.slug ?? slugify(data.title);
  const out = path.join(outDir, `${slug}.png`);
  await fs.writeFile(
    out,
    renderCard({
      title: data.title,
      subtitle: "Maximilian Walterskirchen",
      cta: "Read more →",
    }),
  );
  console.log(`[og] wrote ${path.relative(root, out)}`);
}
