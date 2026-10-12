# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal site and blog built with Astro, Tailwind CSS 4 and the Cloudflare adapter. The README lists the stack and the `pnpm` scripts.

## Commands

- Use `pnpm` only. A `preinstall` hook blocks npm and yarn.
- The repo has no test suite and no type-check script. `pnpm build` is the check: it generates content types, prerenders every page and renders the OG cards, so schema or type errors surface there.
- Run `pnpm lint` and `pnpm fmt:check` before committing. Formatting uses oxfmt.

## Content

- Posts and talks live in `content/blogs/` and `content/talks/` at the repo root, not in `src/content/`. The schemas are in `src/content.config.ts`.
- Routes, RSS links and OG card paths all use `data.slug`, not the entry id. When frontmatter has no `slug`, the schema derives it from `title`. Set `slug` explicitly on a post so that a title edit does not change its URL.
- Talks have no detail page. They link out to `repoUrl` and `slidesUrl`.
- `featured: true` puts an entry on the homepage.

## OG cards

- `src/pages/og/[slug].png.ts` renders a 1200x630 PNG per blog post with takumi-js. It skips posts that set `cardImage`. `BlogLayout.astro` uses `cardImage` when present and `/og/<slug>.png` otherwise.
- The slug `site` is reserved for the site-wide card (`/og/site.png`) that the homepage, talks and 404 pages use. The build fails if a post uses it.
- The endpoint runs in Node at build time (`prerenderEnvironment: "node"` in `astro.config.mjs`). It reads fonts and the avatar with `fs` through paths relative to the project root.

## Theme

Dark mode is class based. `global.css` defines the `dark` variant on `.dark`. An inline script in `Layout.astro` sets the class from `localStorage.theme` before paint, and the toggle in `Header.astro` updates it.

## Deployment

A push to `main` runs `.github/workflows/deploy.yml`, which builds the site and deploys it to Cloudflare Workers with Wrangler. The build writes static files to `dist/client/`. The Cloudflare adapter also writes a generated `dist/client/wrangler.json` from `wrangler.jsonc`, and `.wrangler/deploy/config.json` points Wrangler at that file. The `assets.directory` in `wrangler.jsonc` is therefore not the directory that deploys. Work on a branch and open a PR. `.github/workflows/ci.yml` runs lint, the format check and a build on every PR.
