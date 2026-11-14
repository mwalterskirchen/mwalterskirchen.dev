// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import { readdirSync, readFileSync } from "node:fs";
import { satteri } from "@astrojs/markdown-satteri";
import { externalLinks } from "./src/external-links.mjs";

const site = "https://mwalterskirchen.dev";

// The date each post last changed, for the sitemap: `updated` from its frontmatter, or else
// `timestamp`. The other pages are lists that change with their entries, so they get no date.
const postDates = new Map(
  readdirSync("content/blogs", { recursive: true })
    .filter((file) => String(file).endsWith(".md"))
    .map((file) => {
      const frontmatter = readFileSync(`content/blogs/${file}`, "utf8").split("---")[1] ?? "";
      /** @param {string} name */
      const field = (name) =>
        frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].replace(/^["']|["']$/g, "");
      return [`/blog/${field("slug")}`, new Date(field("updated") ?? field("timestamp") ?? "")];
    }),
);

// https://astro.build/config
export default defineConfig({
  site,
  // Emit `blog/<slug>.html` instead of `blog/<slug>/index.html`, so Cloudflare serves
  // `/blog/<slug>` directly instead of redirecting it to `/blog/<slug>/`.
  trailingSlash: "never",
  build: { format: "file" },
  // Code colours come from the `--astro-code-*` variables in `src/styles/global.css`.
  markdown: {
    shikiConfig: { theme: "css-variables" },
    processor: satteri({ hastPlugins: [externalLinks(site)] }),
  },
  vite: {
    plugins: [tailwindcss()],
    // Leave the cursor images as files instead of inlining them into the stylesheet, so a page
    // fetches only the ones for its theme and pixel density.
    build: {
      assetsInlineLimit: (file) => (file.includes("/assets/cursors/") ? false : undefined),
    },
  },
  integrations: [
    sitemap({
      serialize: (item) => {
        const lastmod = postDates.get(new URL(item.url).pathname)?.toISOString();
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  adapter: cloudflare({ imageService: "compile", prerenderEnvironment: "node" }),
});
