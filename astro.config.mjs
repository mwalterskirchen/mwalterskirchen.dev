// @ts-check
import { defineConfig, fontProviders } from "astro/config";
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
  // Code colours come from the `--astro-code-*` variables in `src/styles/global.css`.
  markdown: { shikiConfig: { theme: "css-variables" } },
  vite: {
    plugins: [tailwindcss()],
    // Leave the cursor images as files instead of inlining them into the stylesheet, so a page
    // fetches only the ones for its theme and pixel density.
    build: {
      assetsInlineLimit: (file) => (file.includes("/assets/cursors/") ? false : undefined),
    },
  },
  // Self-hosted from src/assets/fonts. Astro writes the @font-face rules and a fallback font
  // sized to match, so text does not jump when the web font arrives.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "IBM Plex Mono",
      cssVariable: "--font-plex-mono",
      fallbacks: ["ui-monospace", "monospace"],
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/ibm-plex-mono/ibm-plex-mono-latin-400-normal.woff2"],
          },
          {
            weight: 400,
            style: "italic",
            src: ["./src/assets/fonts/ibm-plex-mono/ibm-plex-mono-latin-400-italic.woff2"],
          },
          {
            weight: 500,
            style: "normal",
            src: ["./src/assets/fonts/ibm-plex-mono/ibm-plex-mono-latin-500-normal.woff2"],
          },
          {
            weight: 600,
            style: "normal",
            src: ["./src/assets/fonts/ibm-plex-mono/ibm-plex-mono-latin-600-normal.woff2"],
          },
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/ibm-plex-mono/ibm-plex-mono-latin-700-normal.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Jersey 10",
      cssVariable: "--font-jersey-10",
      fallbacks: ["ui-monospace", "monospace"],
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/jersey-10/jersey-10-latin-400-normal.woff2"],
          },
        ],
      },
    },
  ],
  integrations: [sitemap()],
  adapter: cloudflare({ imageService: "compile", prerenderEnvironment: "node" }),
});
