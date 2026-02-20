# mwalterskirchen.dev

Personal portfolio and blog — [mwalterskirchen.dev](https://mwalterskirchen.dev)

## Tech Stack

- [Astro 5](https://astro.build) — Static site generation
- [TypeScript](https://www.typescriptlang.org) — Strict mode
- [Tailwind CSS 4](https://tailwindcss.com) — Styling + typography plugin
- [Cloudflare Workers](https://workers.cloudflare.com) — Hosting and deployment

## Features

- Dark mode with flash-free page loads
- Blog powered by Astro content collections (Markdown)
- RSS feed and sitemap generation
- SEO with structured data (JSON-LD)
- Entry animations and hover effects
- Responsive design

## Project Structure

```
src/
├── components/     # UI components (Header, Footer, SEO, ThemeToggle, ...)
├── layouts/        # Layout.astro (base), BlogLayout.astro (posts)
├── pages/          # File-based routing
│   ├── blog/       # Blog index + dynamic [id] route
│   ├── rss.xml.ts  # RSS feed endpoint
│   └── index.astro # Homepage
├── styles/         # Global CSS, fonts, animations
├── lib/            # Utility functions
├── config.ts       # Site metadata and navigation
└── content.config.ts
content/
└── blogs/          # Markdown blog posts
```

## Getting Started

Requires [Node.js 22](https://nodejs.org) and [pnpm](https://pnpm.io).

```bash
git clone https://github.com/mwalterskirchen/mwalterskirchen.dev.git
cd mwalterskirchen.dev
pnpm install
pnpm dev
```

Open [localhost:4321](http://localhost:4321).

### Other Commands

| Command | Description |
|---|---|
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Lint with oxlint |
| `pnpm fmt` | Format with oxfmt |

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that builds the site and deploys to Cloudflare Workers via Wrangler.
