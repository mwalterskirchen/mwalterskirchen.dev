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

- Colours come from a fixed palette: five blue-greys and one accent. Use the role classes (`bg-bg`, `text-fg`, `text-muted`, `border-panel`), which swap with the theme, instead of `dark:` colour variants. The accent is the same in both themes and is only for fills, underlines and shadows (`bg-accent`, `decoration-accent`), never text colour. Do not add gradients, opacity, rounded corners or eased transitions.
- Jersey 10 (`font-display`) is only sharp at multiples of 56/3 px. Set it with `text-pixel-sm`, `text-pixel-md` or `text-pixel-lg`, and never bold.
- Icons are text bitmaps in `src/icons.ts`, rendered by `PixelIcon.astro`. Add an icon there instead of importing an icon library.
- The homepage portrait sharpens in four steps on load: three coarse frames from `src/assets/avatar-frames.png`, then the photo. `scripts/pixel-avatar.mjs` draws the frames from `public/avatar.jpeg`, so run `node scripts/pixel-avatar.mjs` after changing the photo.
- The portrait sharpening is the only entrance animation. Do not add entrances to sections or list items. Motion that answers an action, such as the pressed email button, steps instead of easing.

## Deployment

A push to `main` runs `.github/workflows/deploy.yml`, which builds the site and deploys it to Cloudflare Workers with Wrangler. The build writes static files to `dist/client/`. The Cloudflare adapter also writes a generated `dist/client/wrangler.json` from `wrangler.jsonc`, and `.wrangler/deploy/config.json` points Wrangler at that file. The `assets.directory` in `wrangler.jsonc` is therefore not the directory that deploys. Work on a branch and open a PR. `.github/workflows/ci.yml` runs lint, the format check and a build on every PR.
