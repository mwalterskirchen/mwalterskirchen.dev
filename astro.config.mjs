// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://mwalterskirchen.dev",
  // Emit `blog/<slug>.html` instead of `blog/<slug>/index.html`, so Cloudflare serves
  // `/blog/<slug>` directly instead of redirecting it to `/blog/<slug>/`.
  trailingSlash: "never",
  build: { format: "file" },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  adapter: cloudflare({ imageService: "compile", prerenderEnvironment: "node" }),
});
