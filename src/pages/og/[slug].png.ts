import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { getCollection } from "astro:content";
import fs from "node:fs/promises";
import sharp from "sharp";
import { render } from "takumi-js";
import { Renderer } from "takumi-js/node";
import { config } from "../../config";

// Runs at build time in Node (see `prerenderEnvironment` in astro.config.mjs),
// so paths are relative to the project root.
const FONT_DIR = "src/assets/fonts/ibm-plex-mono";
const DISPLAY_FONT = "node_modules/@fontsource/jersey-10/files/jersey-10-latin-400-normal.woff2";
const AVATAR = "src/assets/avatar.jpeg";
// The homepage and other pages link to /og/site.png.
const SITE_SLUG = "site";

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog", ({ data }) => !data.cardImage);
  const clash = posts.find(({ data }) => data.slug === SITE_SLUG);
  if (clash) {
    throw new Error(`Blog post "${clash.data.title}" uses the reserved OG slug "${SITE_SLUG}".`);
  }

  return [
    {
      params: { slug: SITE_SLUG },
      props: {
        title: config.personal.name,
        subtitle: "Senior Software Engineer · Zurich",
        cta: "mwalterskirchen.dev →",
        avatar: true,
      },
    },
    ...posts.map(({ data }) => ({
      params: { slug: data.slug },
      props: {
        title: data.title,
        subtitle: config.personal.name,
        cta: "Read more →",
        avatar: false,
      },
    })),
  ];
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

const renderer = new Renderer();
let assets: Promise<Uint8Array> | undefined;

// Registers the fonts once and returns the avatar bytes, shared by every card.
const loadAssets = () =>
  (assets ??= (async () => {
    const [regular, bold, display, avatar] = await Promise.all([
      fs.readFile(`${FONT_DIR}/IBMPlexMono-Regular.ttf`),
      fs.readFile(`${FONT_DIR}/IBMPlexMono-Bold.ttf`),
      fs.readFile(DISPLAY_FONT),
      sharp(AVATAR).resize(320, 320).jpeg({ quality: 85 }).toBuffer(),
    ]);
    await renderer.registerFont({ name: "Jersey 10", data: display, weight: 400 });
    await renderer.registerFont({ name: "IBM Plex Mono", data: regular, weight: 400 });
    await renderer.registerFont({ name: "IBM Plex Mono", data: bold, weight: 700 });
    return avatar;
  })());

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

// Jersey 10 is only sharp at multiples of 56/3 px: these sizes draw its pixels at 6px and 4px.
const TITLE_SIZE = { site: 112, post: 224 / 3 };

// The same notched outline and hard shadow as `pixel-frame` in global.css, at twice the size.
const FRAME =
  "-8px 0 0 0 #e8ecf1, 8px 0 0 0 #e8ecf1, 0 -8px 0 0 #e8ecf1, 0 8px 0 0 #e8ecf1, 16px 8px 0 0 #3264c9, 8px 16px 0 0 #3264c9";

const template = ({ title, subtitle, cta, avatar }: Props) => `
  <div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 80px;background:#1a1c2c;border-left:16px solid #3264c9;font-family:'IBM Plex Mono'">
    ${avatar ? `<img src="avatar.jpeg" style="width:160px;height:160px;object-fit:cover;margin:0 0 48px 8px;box-shadow:${FRAME}" />` : ""}
    <div style="font-family:'Jersey 10';font-size:${avatar ? TITLE_SIZE.site : TITLE_SIZE.post}px;color:#e8ecf1;line-height:1">${escapeHtml(title)}</div>
    <div style="font-size:26px;font-weight:400;color:#94b0c2;margin-top:28px">${escapeHtml(subtitle)}</div>
    <div style="font-size:32px;font-weight:700;color:#e8ecf1;margin-top:18px">${escapeHtml(cta)}</div>
  </div>`;

export const GET: APIRoute<Props> = async ({ props }) => {
  const avatar = await loadAssets();
  const png = await render(template(props), {
    renderer,
    width: 1200,
    height: 630,
    format: "png",
    images: props.avatar ? [{ src: "avatar.jpeg", data: avatar }] : [],
    // Draw emoji from the fonts instead of fetching Twemoji images over the network.
    emoji: "from-font",
  });

  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
