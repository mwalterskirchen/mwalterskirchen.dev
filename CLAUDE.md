# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal site and blog built with Astro, Tailwind CSS 4 and the Cloudflare adapter. The README lists the stack and the `pnpm` scripts.

## Commands

- Use `pnpm` only. A `preinstall` hook blocks npm and yarn.
- The repo has no test suite and no type-check script. `pnpm build` is the check: it generates content types, prerenders every page and renders the OG cards, so schema or type errors surface there.
- Run `pnpm lint` and `pnpm fmt:check` before committing. ESLint and Prettier both cover `.astro` files. `prettier-plugin-tailwindcss` sorts Tailwind classes.
- typescript-eslint supports TypeScript only below 6.1, so `typescript` stays pinned to 6.0.x.

## Content

- Posts and talks live in `content/blogs/` and `content/talks/` at the repo root, not in `src/content/`. The schemas are in `src/content.config.ts`.
- Routes, RSS links and OG card paths all use `data.slug`, not the entry id. When frontmatter has no `slug`, the schema derives it from `title`. Set `slug` explicitly on a post so that a title edit does not change its URL.
- Talks have no detail page. They link out to `repoUrl` and `slidesUrl`.
- `featured: true` puts an entry on the homepage.
- URLs have no trailing slash (`trailingSlash: "never"` and `build.format: "file"` in `astro.config.mjs`). Write internal links as `/blog/<slug>`. A trailing slash returns 404 in `astro dev`.

## OG cards

- `src/pages/og/[slug].png.ts` renders a 1200x630 PNG per blog post with takumi-js. It skips posts that set `cardImage`. `BlogLayout.astro` uses `cardImage` when present and `/og/<slug>.png` otherwise.
- The slug `site` is reserved for the site-wide card (`/og/site.png`) that the homepage, talks and 404 pages use. The build fails if a post uses it.
- The endpoint runs in Node at build time (`prerenderEnvironment: "node"` in `astro.config.mjs`). It reads fonts and the avatar with `fs` through paths relative to the project root.

## Theme

Dark mode is class based. `global.css` defines the `dark` variant on `.dark`. An inline script in `Layout.astro` sets the class from `localStorage.theme` before paint, and the toggle in `Header.astro` updates it.

The look is pixel art, and `global.css` holds its rules:

- Colours come from a fixed palette: five blue-greys and one accent. Use the role classes (`bg-bg`, `text-fg`, `text-muted`, `border-panel`), which swap with the theme, instead of `dark:` colour variants. The accent is the same in both themes and is only for fills, underlines and shadows (`bg-accent`, `decoration-accent`), never text colour. Do not add gradients, translucent colours or rounded corners.
- Jersey 10 (`font-display`) is only sharp at multiples of 56/3 px. Set it with `text-pixel-sm`, `text-pixel-md` or `text-pixel-lg`, and never bold.
- Icons are text bitmaps in `src/icons.ts`, rendered by `PixelIcon.astro`. Add an icon there instead of importing an icon library.
- The homepage portrait sharpens in four steps on load: three coarse frames from `src/assets/avatar-frames.png`, then the photo. `scripts/pixel-avatar.mjs` draws the frames from `public/avatar.jpeg`, so run `node scripts/pixel-avatar.mjs` after changing the photo.
- The mouse cursors are pixel art too. `scripts/pixel-cursors.mjs` holds their bitmaps and writes the images to `src/assets/cursors/` and a `pixel-cursor-*` utility for every CSS cursor keyword to `src/styles/cursors.css`. Do not edit that file: change the script and run `node scripts/pixel-cursors.mjs`. `global.css` applies the arrow, hand, I-beam and "not allowed" cursors to the matching elements. For any other cursor use `pixel-cursor-<keyword>` (for example `pixel-cursor-grab`), never Tailwind's `cursor-*`, which gives the system cursor.
- The backdrop is a sky and a meadow. `Layout.astro` lays two layers of sky (`.sky`) behind every page: clouds on the light theme and stars on the dark one. They are drawn only in the margins beside the text column, so a narrow screen has none, and scrolling moves them more slowly than the page. The footer stands on hills and grass (`.ground`) and continues their colour with `bg-panel`. Lilly, the poodle on the grass, is alive: the script in `Lilly.astro` makes her wander, sit, wag her tail, pant, blink and nap, and fetch her ball: a press anywhere on the ground throws it, and she runs after it, carries it back and drops it. `src/lilly.ts` holds her parts (head, ear, tail, body, legs) as text bitmaps and `draw`, which stamps them together for one moment; `picture` adds her shadow, which is the `--shadow` role (the next darker palette colour than the panel she stands on), and the script paints the result on a small canvas. To add a movement, add a part or a pose there instead of drawing whole frames. She is apricot (`text-apricot`) in both themes, with a darker shade, a dark eye and nose and a red tongue: colours outside the palette that nothing else uses. She stands still for people who ask for reduced motion. `scripts/pixel-backdrop.mjs` draws the images to `src/assets/backdrop/`, so run `node scripts/pixel-backdrop.mjs` after changing it. Tones between two palette colours are checkerboard dither, not opacity. Keep the scene free of small pale specks and jagged peaks: in this palette they read as snow.
- Motion is smooth: short eased transitions of 100 to 350ms, never `steps()`. The exceptions are the homepage portrait, which sharpens in four steps by design, and Lilly, who moves frame by frame like a game sprite. `global.css` holds the page fade (cross-document view transitions) and `.bob` for menu cursors. The theme toggle and the reading progress bar on posts are in `Header.astro`. Keep page movement behind `prefers-reduced-motion: no-preference`. Apart from the page fade, the portrait and Lilly, nothing animates on load: do not add entrances to sections or list items.

## Deployment

A push to `main` runs `.github/workflows/deploy.yml`, which builds the site and deploys it to Cloudflare Workers with Wrangler. The build writes static files to `dist/client/`. The Cloudflare adapter also writes a generated `dist/client/wrangler.json` from `wrangler.jsonc`, and `.wrangler/deploy/config.json` points Wrangler at that file. The `assets.directory` in `wrangler.jsonc` is therefore not the directory that deploys. Work on a branch and open a PR. `.github/workflows/ci.yml` runs lint, the format check and a build on every PR.
