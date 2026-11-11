# Agents.md — Instructions for AI coding agents

## Project Overview

**mecoding** is a personal portfolio built with **Astro + Tailwind CSS**.
The visual direction is inspired by the Kelo Framer template: monochrome,
editorial, generous whitespace, strong typography.

- Brand wordmark: **mecoding**
- Language (v1): **English only** — the structure should stay ready for i18n later
- Scope (v1): **Home + Projects + About**
- Contact lives inside the About page (like Kelo), not on a separate route

Primary goals:

- Extremely lightweight (no client framework by default)
- Excellent SEO
- Clean, modern, editorial aesthetic (black & white, strong typography)

## Tech Stack

- Framework: Astro 7 (static output)
- Styling: Tailwind CSS v4 (CSS-first `@theme` config)
- Language: TypeScript 6 (strict) — `astro check` does not support TS 7 yet
- Package manager: pnpm 12
- Image tooling: `sharp` (devDependency, also used by Astro)
- Deployment target: static (Cloudflare Pages / Netlify / Vercel)

## Design System Contract

These rules are not suggestions. Do not introduce values outside this system
without explicit approval.

### Colors

Only one hue: black `#171717` on white `#FFFFFF`.

```text
black       #171717
black-90    black @ 90%
black-80    black @ 80%
black-70    black @ 70%
black-60    black @ 60%
black-50    black @ 50%
black-40    black @ 40%
black-30    black @ 30%
black-20    black @ 20%
black-10    black @ 10%
black-5     black @ 5%
white       #FFFFFF
```

Usage:

- Body copy: `text-black` or `text-black-80`
- Secondary copy: `text-black-60` minimum (≈ 4.6:1 on white)
- `text-black-50` only for large text or decorative content
- Hairlines and borders: `border-black-10`
- Subtle surfaces: `bg-black-5`
- Inverted sections: `bg-black text-white`, secondary copy `text-white/60`

**Never write raw hex values in components.** Always use the Tailwind tokens.

### Typography

- Primary family: **Inter**, self-hosted only. No Google Fonts CDN.
- Editorial family: **Rethink Sans**, self-hosted only, reserved for page
  `h1` titles via `--font-editorial` (`font-editorial`).
- Tokens: `text-display`, `text-headline`, `text-title`, `text-statement`,
  `text-caption`, `text-body-lg`, `text-body`, `text-reading`, `text-label`
- `text-reading` (20px / 35px) is reserved for long-form copy: project detail
  body, description and bottom navigation
- Weights available: **400 → 800** (variable `wght`) for both families
- Inter keeps the `opsz` 14–32 axis; optical sizing is enabled on `body`
- Italic: real italic faces, loaded only when used
- Labels are uppercase with tracking: `text-label uppercase`
- One `<h1>` per page, headings follow document order

### Layout

- Page frame: `Frame` — `max-w-frame` (1920px) + `px-gutter` (20px, fixed)
- Header: in flow by default. Work composes its own header (`fixed`), the
  project detail passes `headerClass="sticky top-0 z-40"` to `Layout` so it
  stays in flow at rest and pins on scroll. About passes
  `headerClass="max-md:sticky max-md:top-0 max-md:z-40"`: below 810px the
  header pins so the menu stays reachable on the long page, and from `md` up
  it stays in flow. It is white below 810px
  (`bg-white md:bg-transparent`) so content never scrolls through the logo
  and the menu on mobile. From `md` up it is transparent on purpose: the
  article keeps its y=122 resting position and scrolls up beneath the
  header instead of being clipped by a white band
- Desktop stage: `Stage` — `md:h-svh` + `md:overflow-hidden`; below 810px it
  falls back to normal document flow
- Footer: `sticky bottom-0 z-40` from `md` up — permanently visible, pinned to
  the bottom of the viewport like the header is pinned to the top. It stays in
  flow, so its space is reserved at the end of the document and the last
  content is never hidden for good. `z-40` keeps it under the mobile menu
  (`z-50`). Below 810px it is `max-md:relative`: it follows the document flow,
  appears after the content and no longer overlays it. Home and Work override
  it to `md:fixed` so their desktop composition keeps the fixed overlay.
  `body` is a full-height flex column and `main` absorbs the free space, so
  the footer's natural position is the bottom of the screen even on short
  pages; `html` keeps `scroll-padding-bottom: 8rem` above `md` only, so
  keyboard focus never lands under the pinned footer
- Rythme: `gap-grid` (10px), `gap-meta` (16px), `gap-stack` (30px),
  `gap-center` (50px), `pb-column` (54px); composition sizes `w-tile` /
  `h-tile` (300px), `w-card` (448px, carousel tile width from `lg` up — the
  tile stays 300px wide between 810 and 1199 so it never overlaps the hero
  columns) and `w-step` (310px)
- Breakpoints: `md` = 810px, `lg` = 1200px (Kelo's own)
- No clamped spacing scale: values are measured on Kelo, not derived
- Default border width is 1px; no shadows; no decorative radii. Pills use
  `rounded-full`.
- Gradients are forbidden except for the project-card hover overlay
  (`bg-linear-to-t from-black/85 via-black/40 to-transparent`), approved as the
  single exception.

### Motion

- Tokens: `ease-kelo` (expo-out) and `ease-soft` (in-out)
- Durations: 150–600ms
- Animate `transform` and `opacity` only (avoid layout properties)
- `prefers-reduced-motion` is handled globally in `global.css`; do not
  circumvent it. The only override is the reading-progress rail: its CSS
  scroll timeline follows the scroll position, it is not autonomous motion.
- Accepted exception: project videos autoplay muted on a loop, without native
  controls, even under `prefers-reduced-motion` (same as rahim-design).
- Client JS is limited to: mobile menu, local clock, project carousel, the
  Work masonry scroll and the project videos (lazy autoplay). Everything else
  must be CSS — the reading progress rail uses
  `animation-timeline: scroll(root block)`, no JavaScript.
- Mobile menu: a curtain. The panel slides from `translateY(-100%)` to `0`
  in 500ms `ease-soft` and slides back out in 420ms. `hidden`
  (`display: none`) rules out a CSS-only transition, so the JS keeps `hidden`
  as the accessible state, drives the visual state with `data-open`, forces a
  style recalculation on open and only reapplies `hidden` once the exit ends
  (immediately under `prefers-reduced-motion`).

## Typography Pipeline

The sources are variable TTFs (Inter and Rethink Sans, upright and italic).
They are never served directly.

- Script: `scripts/build-fonts.sh` (`pnpm fonts`)
- Tooling: `uv run --with fonttools --with brotli` (no Node dependency)
- Inter: keeps `opsz` 14–32, restricts `wght` to 400–800
- Rethink Sans: restricts the single `wght` axis to 400–800
- Subsets: latin and latin-ext, upright and italic, with `unicode-range`
- Output: `public/fonts/inter-*.woff2`, `rethink-sans-*.woff2` +
  `OFL-Inter.txt`, `OFL-RethinkSans.txt`
- Both upright latin files are preloaded in `src/layouts/Layout.astro`; the
  italic files are only downloaded when italic text is rendered

If a new weight or glyph range is genuinely needed, update the script and
regenerate. Do not hand-edit the generated files.

## Icons

- Location: `src/components/icons/*.astro`
- Each icon accepts `size`, `class`, `title`
- Stroke and fill use `currentColor`; color is inherited from the parent
- Decorative icons are `aria-hidden="true"` by default; pass `title` to expose
  a label when the icon carries meaning on its own
- Do not add an icon until a component needs it

## Assets

- Logos: `src/assets/images/logo{16,32,64,128}.svg`, used through `Logo.astro`
- Placeholder: `src/assets/images/image_placeholder.svg`, used through
  `Placeholder.astro`
- Favicons are generated from the logo source:
  `pnpm icons` → `favicon.svg`, `favicon.ico` (16/32/48), `apple-touch-icon.png`
- Project images are placeholders for now. When real assets arrive, put them in
  `src/assets/images/projects/` and let Astro process them

## Architecture

```text
src/
├── assets/images/        logos + placeholder
├── components/
│   ├── icons/            SVG icon components (currentColor)
│   ├── layout/           Frame, Stage
│   ├── home/             home-only composition (hero, carousel, featured list)
│   ├── projects/         Work + détail (ProjectCard, ProjectsMasonry, ProjectProse,
│   │                     ProjectMeta, ProjectNav, ReadingProgress)
│   └── ui/               Logo, Placeholder, Cartoon, Button, Overline, Input, Textarea
├── content/projects/     project markdown (schema in src/content.config.ts)
├── data/site.ts          identity, nav, socials, contact, location
├── data/project-detail.ts  libellés de la page détail projet
├── layouts/Layout.astro  SEO, fonts, favicons, skip link, main landmark
├── lib/                  project queries, URL helpers, carousel, masonry scroll
├── pages/                routes
├── styles/global.css     font-face + @theme tokens + base
└── content.config.ts     projects collection schema
```

Rules:

- `pages/` only composes; no business content inline
- `home/` owns home-only composition; a component used by two pages moves to `ui/`
- `ui/` owns reusable primitives
- Use `Button`, `Overline`, `Input` and `Textarea` instead of duplicating
  button or field classes in pages. Per-instance spacing and geometry stay at
  the call site via `class` to preserve the intended layout.
- Do not normalize existing spacing, padding or typography without approval
- Copy lives in `src/data/` or `src/content/`, not hardcoded in components
- Import alias: `@/*` → `src/*`

## Code Conventions

- `.astro` components by default. React/Vue/Svelte requires explicit approval
- Props typed with `interface Props`, no `any`
- Semantic HTML first; `class:list` for conditional classes
- Comments in French, identifiers in English
- Prefer `const` and small focused components
- Use `Astro.props` destructuring with defaults
- Images always have `width`/`height`; `loading="lazy"` below the fold,
  `fetchpriority="high"` for the LCP image

## Content & SEO

- Projects: markdown in `src/content/projects/`, validated by
  `src/content.config.ts`. Required: `title`, `order`, `category`,
  `description`, `role`, `platform`, `year`
- `coverAspect` (`4/3`, `3/4`, `4/5`, `1/1`, `16/9`) drives the masonry rhythm
  on the Work page; it defaults to `1/1`
- `featured: true` marks projects for the home selection
- Identity, nav, socials, email and location live in `src/data/site.ts`
- Each page passes `title` and `description` to `Layout.astro`
- `site` is set in `astro.config.mjs`; sitemap is generated automatically
- `/styleguide` is internal: `noindex`, excluded from the sitemap and robots
- No lorem ipsum and no placeholder copy in production

## Useful Commands

- `pnpm dev` → development server
- `pnpm build` → production build
- `pnpm preview` → preview the production build
- `pnpm check` → Astro + TypeScript diagnostics
- `pnpm fonts` → regenerate `public/fonts/*.woff2`
- `pnpm icons` → regenerate favicons from the logo
- `pnpm astro add <integration>` → add an integration

## Development Server

Start it in background mode:

```sh
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Definition of Done

- `pnpm check` and `pnpm build` pass
- Responsive at 360 / 768 / 1200 / 1920
- Keyboard navigation works, focus is visible
- `prefers-reduced-motion` is respected
- Lighthouse mobile: Performance ≥ 95, Accessibility 100, SEO 100
- No new dependency without approval
- No raw hex, no inline copy blocks, no client JS outside the allowed list

## What NOT to do

- Do not add a heavy animation library (GSAP, Framer Motion, etc.)
- Do not introduce a client framework for static content
- Do not change the palette, type scale or layout direction without approval
- Do not use outdated Astro or Tailwind syntax
- Do not modify the provided logo SVGs
- Do not hand-edit the generated `public/fonts/*.woff2`; regenerate them with
  `pnpm fonts`

## Documentation

Full documentation: https://docs.astro.build

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling & Tailwind](https://docs.astro.build/en/guides/styling/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)
