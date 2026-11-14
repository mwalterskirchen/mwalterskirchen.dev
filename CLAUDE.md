# CLAUDE.md

## Workflow

- Work on a branch and open a PR. A push to `main` deploys.
- Wrangler deploys the adapter-generated `dist/client/wrangler.json`. The adapter sets `assets.directory` there, so `wrangler.jsonc` leaves it out.
- Response headers are in `public/_headers`. The adapter appends the cache rule for `/_astro/*` at build time.
- Keep `typescript` on 6.0.x when bumping dependencies: typescript-eslint supports only `<6.1`, and `^6.0.3` would allow 6.1.

## Content

- Set `slug` in every post's frontmatter, in lowercase words joined by hyphens. The build fails without it, so that a title edit never changes the URL.
- A post's reading time is worked out from its length, so there is no `readTime` in the frontmatter.
- Write internal links without a trailing slash (`/blog/<slug>`). A trailing slash 404s in `astro dev`.

## Pixel art theme

The comments in `src/styles/global.css` and in each generator script describe the theme. On top of those:

- Colour with the role classes (`bg-bg`, `text-fg`, `text-muted`, `border-panel`), not `dark:` colour variants.
- Keep corners square. Blend two palette colours with a checkerboard dither.
- Set Jersey 10 (`font-display`) with `text-pixel-sm`, `text-pixel-md` or `text-pixel-lg`, at normal weight.
- Add icons as bitmaps in `src/icons.ts`, not from an icon library.
- Use `pixel-cursor-<keyword>` for cursors. Tailwind's `cursor-*` gives the system cursor.
- Give Lilly a new movement by adding a part or pose in `src/lilly.ts`, not whole frames.
- Leave small pale specks and jagged peaks out of the backdrop: in this palette they read as snow.
- Motion is eased, 100 to 350ms. Only the portrait and Lilly move in steps. Apart from the page fade, the portrait and Lilly, nothing animates on load: sections and list items appear in place. Put new movement behind `prefers-reduced-motion: no-preference`.
