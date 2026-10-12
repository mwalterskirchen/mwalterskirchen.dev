# mwalterskirchen.dev

Personal portfolio and blog — [mwalterskirchen.dev](https://mwalterskirchen.dev)

## Tech Stack

- [Astro 7](https://astro.build) — Static site generation
- [TypeScript](https://www.typescriptlang.org) — Strict mode
- [Tailwind CSS 4](https://tailwindcss.com) — Styling + typography plugin
- [Takumi](https://takumi.kane.tw) — OG card rendering
- [Cloudflare Workers](https://workers.cloudflare.com) — Hosting and deployment

## Features

- Dark mode with flash-free page loads
- Blog and talks via Astro content collections (Markdown)
- OG cards per post, generated at build time
- RSS feed (`/rss.xml`) and sitemap (`@astrojs/sitemap`)
- SEO with structured data (JSON-LD)
- Entry animations and hover effects
- Responsive design

## Project Structure

```
src/
├── components/         # UI components (Header, Footer, SEO, ...)
├── layouts/            # Layout.astro (base), BlogLayout.astro (posts)
├── pages/              # File-based routing
│   ├── blog/           # Blog index + dynamic [id] route
│   ├── og/             # OG card endpoint ([slug].png.ts)
│   ├── talks/          # Talks index
│   ├── rss.xml.ts      # RSS feed endpoint
│   └── index.astro     # Homepage
├── assets/fonts/       # TTF fonts for OG cards
├── styles/             # Global CSS, fonts, animations
├── config.ts           # Site metadata and navigation
└── content.config.ts
content/
├── blogs/              # Markdown blog posts
└── talks/              # Markdown talks
```

## Getting Started

Requires [Node.js 22](https://nodejs.org) and [pnpm 10](https://pnpm.io) (pinned via `packageManager`; non-pnpm installs are blocked).

```bash
git clone https://github.com/mwalterskirchen/mwalterskirchen.dev.git
cd mwalterskirchen.dev
pnpm install
pnpm dev
```

Open [localhost:4321](http://localhost:4321).

### Other Commands

| Command          | Description                      |
| ---------------- | -------------------------------- |
| `pnpm build`     | Production build                 |
| `pnpm preview`   | Preview production build         |
| `pnpm lint`      | Lint with oxlint                 |
| `pnpm lint:fix`  | Lint and auto-fix                |
| `pnpm fmt`       | Format with oxfmt                |
| `pnpm fmt:check` | Check formatting without writing |

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that builds the site and deploys to Cloudflare Workers via Wrangler.
