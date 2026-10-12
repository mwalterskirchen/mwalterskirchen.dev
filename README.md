# mwalterskirchen.dev

[![Deploy](https://github.com/mwalterskirchen/mwalterskirchen.dev/actions/workflows/deploy.yml/badge.svg)](https://github.com/mwalterskirchen/mwalterskirchen.dev/actions/workflows/deploy.yml)

The source of [mwalterskirchen.dev](https://mwalterskirchen.dev), my personal site. I write about software engineering and list the talks I give.

[![mwalterskirchen.dev](https://mwalterskirchen.dev/og/site.png)](https://mwalterskirchen.dev)

## Stack

- [Astro 7](https://astro.build) prerenders every page to static HTML.
- [Tailwind CSS 4](https://tailwindcss.com) and its typography plugin handle the styling.
- [Takumi](https://takumi.kane.tw) renders the Open Graph (OG) cards at build time.
- [Cloudflare Workers](https://workers.cloudflare.com) serves the site.
- [ESLint](https://eslint.org) and [Prettier](https://prettier.io) lint and format the code, including `.astro` files.

## Features

- Blog posts and talks as Markdown content collections
- A generated OG card for each post
- Dark mode without a flash on page load
- RSS feed at [`/rss.xml`](https://mwalterskirchen.dev/rss.xml) and a sitemap
- JSON-LD structured data for search engines

## Getting started

You need Node.js 22.12 or later and pnpm 10. The `packageManager` field pins the pnpm version, and a `preinstall` hook blocks npm and yarn.

```bash
git clone https://github.com/mwalterskirchen/mwalterskirchen.dev.git
cd mwalterskirchen.dev
pnpm install
pnpm dev
```

The dev server runs at [localhost:4321](http://localhost:4321).

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `pnpm dev`       | Start the dev server                         |
| `pnpm build`     | Build the site and the OG cards into `dist/` |
| `pnpm preview`   | Serve the production build                   |
| `pnpm lint`      | Lint with oxlint                             |
| `pnpm lint:fix`  | Lint and apply fixes                         |
| `pnpm fmt`       | Format with oxfmt                            |
| `pnpm fmt:check` | Check formatting without writing             |

## Writing content

Posts go in `content/blogs/` and talks go in `content/talks/`, one Markdown file each. `src/content.config.ts` defines the frontmatter schema for both.

A minimal post looks like this:

```markdown
---
title: My new post
slug: my-new-post
description: One sentence for the post list, RSS and search results.
timestamp: 2026-10-12T09:00:00+02:00
featured: true
---
```

- Set `slug` explicitly. Without it, the slug comes from the title, so a later title edit changes the URL.
- `featured: true` shows the entry on the homepage.
- The build renders an OG card to `/og/<slug>.png` for each post. Set `cardImage` to use your own image instead.

## Project structure

```
content/
├── blogs/              Markdown blog posts
└── talks/              Markdown talks
src/
├── assets/fonts/       Fonts for the OG cards
├── components/         Header, Footer, SEO and other components
├── layouts/            Base layout and blog post layout
├── pages/              File-based routes, the RSS feed and the OG card endpoint
├── styles/             Global CSS
├── config.ts           Site metadata and navigation
└── content.config.ts   Content collection schemas
```

## Deployment

A push to `main` starts a GitHub Actions workflow. It builds the site and deploys it to Cloudflare Workers with Wrangler. Pull requests run lint, the format check and a build first.

## License

The code is available under the [MIT License](LICENSE). The posts and talks in `content/` are © Maximilian Walterskirchen, all rights reserved.
