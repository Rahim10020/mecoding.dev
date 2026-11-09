# Graph Report - mecoding.dev  (2026-11-09)

## Corpus Check
- 67 files · ~55,609 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 212 nodes · 282 edges · 17 communities (14 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `26f677d0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- styleguide.astro
- [id].astro
- site.ts
- Agents.md — Instructions for AI coding agents
- about.astro
- mecoding
- focusly.md
- murmur.md
- rahim-design.md
- twocoderz.md
- scripts
- tsconfig.json
- ProjectCarousel.astro
- build-fonts.sh
- content.config.ts

## God Nodes (most connected - your core abstractions)
1. `Agents.md — Instructions for AI coding agents` - 15 edges
2. `scripts` - 8 edges
3. `mecoding` - 8 edges
4. `site` - 7 edges
5. `getAllProjects()` - 6 edges
6. `Design System Contract` - 5 edges
7. `about` - 3 edges
8. `byOrder()` - 3 edges
9. `getFeaturedProjects()` - 3 edges
10. `externalLinkProps()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `getStaticPaths()` --calls--> `getAllProjects()`  [EXTRACTED]
  src/pages/projects/[id].astro → src/lib/projects.ts

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.08
Nodes (23): dependencies, astro, @astrojs/sitemap, tailwindcss, @tailwindcss/vite, devDependencies, @astrojs/check, sharp (+15 more)

### Community 1 - "styleguide.astro"
Cohesion: 0.09
Nodes (6): list, brandIcons, interfaceIcons, palette, rhythm, typeScale

### Community 2 - "[id].astro"
Cohesion: 0.33
Nodes (5): byOrder(), getAllProjects(), getFeaturedProjects(), Project, getStaticPaths()

### Community 3 - "site.ts"
Cohesion: 0.19
Nodes (9): year, render(), tick(), logos, NavItem, site, Social, SocialId (+1 more)

### Community 4 - "Agents.md — Instructions for AI coding agents"
Cohesion: 0.11
Nodes (19): Agents.md — Instructions for AI coding agents, Architecture, Assets, Code Conventions, Colors, Content & SEO, Definition of Done, Design System Contract (+11 more)

### Community 5 - "about.astro"
Cohesion: 0.17
Nodes (9): classes, sizes, variants, tones, about, AboutEntry, externalLinkProps(), isExternal() (+1 more)

### Community 6 - "mecoding"
Cohesion: 0.20
Nodes (8): Design system, Fonts, Getting started, Icons & favicons, License, mecoding, Stack, Structure

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

### Community 11 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, astro, build, check, dev, fonts, icons, preview

### Community 12 - "tsconfig.json"
Cohesion: 0.25
Nodes (7): astro/tsconfigs/strict, compilerOptions, baseUrl, paths, exclude, extends, include

### Community 13 - "ProjectCarousel.astro"
Cohesion: 0.14
Nodes (9): string, copies, CarouselElements, initProjectCarousel(), read(), initWorkMasonry(), MasonryElements, read() (+1 more)

## Knowledge Gaps
- **116 isolated node(s):** `name`, `type`, `version`, `node`, `dev` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 133 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Agents.md — Instructions for AI coding agents` connect `Agents.md — Instructions for AI coding agents` to `mecoding`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `styleguide.astro` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Agents.md — Instructions for AI coding agents` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `ProjectCarousel.astro` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._