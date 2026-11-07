# mecoding

Personal portfolio of **Rahim ALI** — web developer and UX/UI designer based in
Lomé, Togo.

Monochrome, editorial, typography-first. Built with Astro and Tailwind CSS v4,
with almost no client-side JavaScript.

## Stack

- [Astro 7](https://docs.astro.build) — static output
- [Tailwind CSS v4](https://tailwindcss.com/docs) — CSS-first configuration
- TypeScript 6 (strict)
- pnpm

## Getting started

```sh
pnpm install
pnpm dev
```

The site runs at `http://localhost:4321`.

```sh
pnpm build     # production build
pnpm preview   # preview the build
pnpm check     # Astro + TypeScript diagnostics
```

## Structure

```text
src/
├── assets/images/        logos + image placeholder
├── components/
│   ├── icons/            inline SVG icons (currentColor)
│   ├── layout/           Frame, Stage
│   ├── home/             home-only composition
│   ├── projects/         work list rows
│   └── ui/               Logo, Placeholder, primitives
├── content/projects/     project entries (markdown)
├── data/site.ts          identity, nav, socials, contact
├── layouts/Layout.astro  SEO, fonts, favicons, skip link
├── pages/                routes
└── styles/global.css     typography, design tokens, base styles
```

## Design system

A single black (`#171717`) on white, declined in opacity steps from
`black-5` to `black-90`. Typography is set with **Rethink Sans** and eight
tokens: `text-display`, `text-headline`, `text-title`, `text-statement`,
`text-caption`, `text-body-lg`, `text-body`, `text-label`.

Full rules live in [`AGENTS.md`](./AGENTS.md). An internal
[`/styleguide`](src/pages/styleguide.astro) page renders the palette, type
scale, spacing, icons and assets. It is `noindex` and excluded from the
sitemap.

## Fonts

Rethink Sans is self-hosted as woff2. `scripts/build-fonts.sh` keeps the
`wght` 400–800 range and outputs latin / latin-ext subsets, upright and
italic:

```sh
pnpm fonts
```

Requires [`uv`](https://docs.astral.sh/uv/). The source paths can be
overridden:

```sh
RETHINK_SANS_SRC=/path/to/RethinkSans-VariableFont_wght.ttf pnpm fonts
```

Output: `public/fonts/` (latin, latin-ext, italic, `OFL.txt`).

## Icons & favicons

```sh
pnpm icons
```

Generates `favicon.svg`, `favicon.ico` (16/32/48) and `apple-touch-icon.png`
from `src/assets/images/logo128.svg`, using `sharp`.

## License

Source code is personal. Fonts are licensed under the SIL Open Font License —
see `public/fonts/OFL.txt`.
