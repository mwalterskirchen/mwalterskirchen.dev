import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const blogsDir = path.join(root, "content/blogs");
const outDir = path.join(root, "public/og");

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

const [boldFont, regularFont, avatarBuf] = await Promise.all([
  fetchFont(FONT_BOLD),
  fetchFont(FONT_REGULAR),
  sharp(path.join(root, "public/avatar.jpeg"))
    .resize(192, 192)
    .jpeg({ quality: 85 })
    .toBuffer(),
]);

const avatarDataUrl = `data:image/jpeg;base64,${avatarBuf.toString("base64")}`;

const fonts = [
  { name: "IBM Plex Mono", data: regularFont, weight: 400, style: "normal" },
  { name: "IBM Plex Mono", data: boldFont, weight: 700, style: "normal" },
];

const containerStyle =
  "width:1200px;height:630px;background:#171717;border-left:6px solid #10b981;display:flex;flex-direction:column;justify-content:center;padding:0 80px;font-family:'IBM Plex Mono'";
const avatarStyle =
  "width:96px;height:96px;border-radius:9999px;margin-bottom:32px";
const titleStyle =
  "font-size:56px;font-weight:700;color:#f5f5f5;line-height:1.25";
const subtitleStyle =
  "font-size:26px;font-weight:400;color:#a3a3a3;margin-top:36px";
const ctaStyle =
  "font-size:32px;font-weight:700;color:#10b981;margin-top:18px";

const templateWithAvatar = ({ title, subtitle, cta }) =>
  html`<div style="${containerStyle}"><img src="${avatarDataUrl}" style="${avatarStyle}" /><div style="${titleStyle}">${title}</div><div style="${subtitleStyle}">${subtitle}</div><div style="${ctaStyle}">${cta}</div></div>`;

const templatePlain = ({ title, subtitle, cta }) =>
  html`<div style="${containerStyle}"><div style="${titleStyle}">${title}</div><div style="${subtitleStyle}">${subtitle}</div><div style="${ctaStyle}">${cta}</div></div>`;

const renderCard = async ({ avatar = false, ...props }) => {
  const node = avatar ? templateWithAvatar(props) : templatePlain(props);
  const svg = await satori(node, { width: 1200, height: 630, fonts });
  return new Resvg(svg).render().asPng();
};

await fs.mkdir(outDir, { recursive: true });

const siteOut = path.join(outDir, "site.png");
await fs.writeFile(
  siteOut,
  await renderCard({
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
    await renderCard({
      title: data.title,
      subtitle: "Maximilian Walterskirchen",
      cta: "Read more →",
    }),
  );
  console.log(`[og] wrote ${path.relative(root, out)}`);
}
