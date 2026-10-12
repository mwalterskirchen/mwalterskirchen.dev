import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { getCollection } from "astro:content";
import fs from "node:fs/promises";
import { render } from "takumi-js";
import { Renderer } from "takumi-js/node";
import { config } from "../../config";

// Runs at build time in Node (see `prerenderEnvironment` in astro.config.mjs),
// so paths are relative to the project root.
const FONT_DIR = "src/assets/fonts/ibm-plex-mono";
const AVATAR = "public/avatar.jpeg";

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog", ({ data }) => !data.cardImage);

  return [
    {
      params: { slug: "site" },
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
    const [regular, bold, avatar] = await Promise.all([
      fs.readFile(`${FONT_DIR}/IBMPlexMono-Regular.ttf`),
      fs.readFile(`${FONT_DIR}/IBMPlexMono-Bold.ttf`),
      fs.readFile(AVATAR),
    ]);
    await renderer.registerFont({ name: "IBM Plex Mono", data: regular, weight: 400 });
    await renderer.registerFont({ name: "IBM Plex Mono", data: bold, weight: 700 });
    return avatar;
  })());

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const template = ({ title, subtitle, cta, avatar }: Props) => `
  <div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 80px;background:#171717;border-left:6px solid #10b981;font-family:'IBM Plex Mono'">
    ${avatar ? `<img src="avatar.jpeg" style="width:96px;height:96px;border-radius:9999px;object-fit:cover;margin-bottom:32px" />` : ""}
    <div style="font-size:56px;font-weight:700;color:#f5f5f5;line-height:1.25">${escapeHtml(title)}</div>
    <div style="font-size:26px;font-weight:400;color:#a3a3a3;margin-top:36px">${escapeHtml(subtitle)}</div>
    <div style="font-size:32px;font-weight:700;color:#10b981;margin-top:18px">${escapeHtml(cta)}</div>
  </div>`;

export const GET: APIRoute<Props> = async ({ props }) => {
  const avatar = await loadAssets();
  const png = await render(template(props), {
    renderer,
    width: 1200,
    height: 630,
    format: "png",
    images: [{ src: "avatar.jpeg", data: avatar }],
  });

  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
