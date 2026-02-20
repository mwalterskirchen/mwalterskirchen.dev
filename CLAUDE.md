# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (localhost:4321)
pnpm build      # Production build to dist/
pnpm preview    # Preview production build
pnpm lint       # oxlint check
pnpm lint:fix   # oxlint auto-fix
pnpm fmt        # oxfmt format
pnpm fmt:check  # oxfmt check (no write)
```

No test runner is configured.

## Architecture

Astro 5 static site (personal portfolio + blog) deployed to Cloudflare Workers via `@astrojs/cloudflare`. Styled with Tailwind CSS 4 + `@tailwindcss/typography`. TypeScript strict mode.

### Routing

File-based in `src/pages/`. Blog posts use dynamic route `src/pages/blog/[id].astro` with `getStaticPaths()` generating pages from content collections.

### Content

Blog posts are Markdown files in `content/blogs/`. Schema defined in `src/content.config.ts` using Astro's content collections with glob loader. Required frontmatter: `title`, `description`, `timestamp`. Slug auto-generated from title if not provided. Set `featured: true` to show on homepage.

### Layouts

`Layout.astro` is the base (head, header, footer, theme script). `BlogLayout.astro` extends it for posts, wrapping content in `Prose.astro` for typography styling.

### Config

`src/config.ts` holds all site metadata, personal info, and nav links. Typed with `as const`.

### Dark Mode

Class-based (`.dark` on `<html>`). An inline script in `Layout.astro` runs before render to prevent flash. `ThemeToggle.astro` toggles the class and persists to localStorage. Tailwind's `dark:` variant is configured via `@variant dark (&:where(.dark, .dark *))` in `global.css`.

### Styling

`src/styles/global.css` contains Tailwind imports, custom font definitions (`--font-mono`, `--font-display`, `--font-serif`), animation utilities (`animate-in`, `animate-in-up`, `delay-0` through `delay-8`), the `hover-dotted-grid` hover effect, and the `@utility tag` for skill badges.

## Commit Style

Single-line commit messages only (e.g. `fix: resize avatar image to 320x320`). No body, no "Co-Authored-By" lines.
