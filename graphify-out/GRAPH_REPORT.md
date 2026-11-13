# Graph Report - mecoding.dev  (2026-11-13)

## Corpus Check
- 81 files · ~91,294 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 272 nodes · 346 edges · 36 communities (18 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0d742764`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- [id].astro
- site.ts
- Agents.md — Instructions for AI coding agents
- about.astro
- README.md
- focusly.md
- murmur.md
- rahim-design.md
- twocoderz.md
- work-masonry.ts
- tsconfig.json
- FeaturedList.astro
- build-fonts.sh
- content.config.ts
- vercel.json
- project-carousel.ts
- habit-tracker.md
- note-app.md
- pixelpulse.md
- rahimdev.md
- lazy-video.ts

## God Nodes (most connected - your core abstractions)
1. `Agents.md — Instructions for AI coding agents` - 15 edges
2. `routes` - 11 edges
3. `scripts` - 8 edges
4. `site` - 8 edges
5. `getAllProjects()` - 5 edges
6. `Design System Contract` - 5 edges
7. `getFeaturedProjects()` - 4 edges
8. `about` - 3 edges
9. `projectDetail` - 3 edges
10. `initLazyVideo()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `getStaticPaths()` --calls--> `getAllProjects()`  [EXTRACTED]
  src/pages/projects/[id].astro → src/lib/projects.ts

## Import Cycles
- None detected.

## Communities (36 total, 4 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (32): dependencies, astro, @astrojs/sitemap, tailwindcss, @tailwindcss/vite, @vercel/analytics, devDependencies, @astrojs/check (+24 more)

### Community 2 - "[id].astro"
Cohesion: 0.20
Nodes (7): columns, projectDetail, byOrder(), getAllProjects(), getFeaturedProjects(), Project, getStaticPaths()

### Community 3 - "site.ts"
Cohesion: 0.11
Nodes (16): astro, year, render(), tick(), NavItem, site, Social, SocialId (+8 more)

### Community 4 - "Agents.md — Instructions for AI coding agents"
Cohesion: 0.10
Nodes (19): Agents.md — Instructions for AI coding agents, Architecture, Assets, Code Conventions, Colors, Content & SEO, Definition of Done, Design System Contract (+11 more)

### Community 5 - "about.astro"
Cohesion: 0.15
Nodes (10): classes, sizes, variants, list, tones, about, AboutEntry, externalLinkProps() (+2 more)

### Community 7 - "focusly.md"
Cohesion: 0.20
Nodes (9): Development, Important decisions, The approach, The challenge, The context, The result, UI Design, UX (+1 more)

### Community 8 - "murmur.md"
Cohesion: 0.20
Nodes (9): Development, Important decisions, The approach, The challenge, The context, The result, UI Design, UX (+1 more)

### Community 9 - "rahim-design.md"
Cohesion: 0.20
Nodes (9): Development, Important decisions, The approach, The challenge, The context, The result, UI Design, UX (+1 more)

### Community 10 - "twocoderz.md"
Cohesion: 0.20
Nodes (9): Development, Important decisions, The approach, The challenge, The context, The result, UI Design, UX (+1 more)

### Community 11 - "work-masonry.ts"
Cohesion: 0.60
Nodes (4): initWorkMasonry(), MasonryElements, read(), wrap()

### Community 12 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): astro/tsconfigs/strict, compilerOptions, paths, exclude, extends, include

### Community 13 - "FeaturedList.astro"
Cohesion: 0.17
Nodes (5): string, copies, logos, home, routes

### Community 18 - "project-carousel.ts"
Cohesion: 0.67
Nodes (3): CarouselElements, initProjectCarousel(), read()

### Community 31 - "habit-tracker.md"
Cohesion: 0.20
Nodes (9): Development, Important decisions, The approach, The challenge, The context, The result, UI Design, UX (+1 more)

### Community 32 - "note-app.md"
Cohesion: 0.20
Nodes (9): Development, Important decisions, The approach, The challenge, The context, The result, UI Design, UX (+1 more)

### Community 33 - "pixelpulse.md"
Cohesion: 0.20
Nodes (9): Development, Important decisions, The approach, The challenge, The context, The result, UI Design, UX (+1 more)

### Community 34 - "rahimdev.md"
Cohesion: 0.20
Nodes (9): Development, Important decisions, The approach, The challenge, The context, The result, UI Design, UX (+1 more)

### Community 35 - "lazy-video.ts"
Cohesion: 0.38
Nodes (5): canPlayAny(), initLazyVideo(), isLiteMode(), NetworkInformation, SOURCE_TYPES

## Knowledge Gaps
- **151 isolated node(s):** `name`, `type`, `version`, `node`, `dev` (+146 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 176 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `astro` connect `site.ts` to `package.json`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `site` connect `site.ts` to `FeaturedList.astro`, `[id].astro`, `about.astro`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `routes` connect `FeaturedList.astro` to `[id].astro`, `site.ts`, `about.astro`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _151 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `site.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Agents.md — Instructions for AI coding agents` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._