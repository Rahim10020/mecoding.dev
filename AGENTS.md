# Agents.md – Instructions for AI coding agents

## Project Overview

This is a personal/creative portfolio website built with **Astro + Tailwind CSS**.
The design is heavily inspired by the Kelo Framer template (minimal, monochrome, editorial, lots of whitespace).

Primary goals:

- Extremely lightweight
- Excellent SEO
- Clean, modern, editorial aesthetic (black & white, strong typography)

## Tech Stack

- Framework: Astro (latest)
- Styling: Tailwind CSS
- Package manager: pnpm
- Language: TypeScript (preferred)
- Deployment target: Static (Cloudflare Pages / Netlify / Vercel)

## Core Rules (must follow)

1. **Always prefer official / up-to-date documentation**
   - Astro: https://docs.astro.build
   - Tailwind: https://tailwindcss.com/docs
   - Never invent APIs or outdated patterns.

2. **Keep the site extremely light**
   - Prefer pure `.astro` components.
   - Only use client-side JavaScript (React/Vue/Svelte islands) when absolutely necessary.
   - Avoid unnecessary libraries.

3. **Design System (Kelo-inspired)**
   - Colors: Almost exclusively black (`#000`) and white (`#fff`)
   - Typography: Clean sans-serif, strong hierarchy, generous whitespace
   - Layout: Editorial / magazine style, lots of breathing room
   - Avoid colorful designs, gradients, or heavy decorations unless explicitly requested

4. **File & Folder Structure**
   - Components go in `src/components/`
   - Layouts in `src/layouts/`
   - Pages in `src/pages/`
   - Global styles in `src/styles/global.css`
   - Prefer small, focused components over large monolithic files

5. **Code Quality**
   - Use TypeScript when possible
   - Write clean, readable, and maintainable code
   - Prefer semantic HTML
   - Follow Astro best practices (Content Collections if we add projects later)
   - Keep accessibility in mind (proper headings, alt texts, contrast)

6. **What NOT to do**
   - Do not add heavy animation libraries by default
   - Do not introduce new major dependencies without asking
   - Do not change the overall design direction without explicit instruction
   - Do not use outdated Astro or Tailwind syntax

## Useful Commands

- `pnpm dev` → start development server
- `pnpm build` → build for production
- `pnpm preview` → preview production build
- `pnpm astro add <integration>` → add integrations

## Current Status

- Project just initialized with Astro + Tailwind
- Goal: Build a clean portfolio inspired by https://kelo-wbs.framer.website/

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
