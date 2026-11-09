import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number().int().nonnegative(),
      category: z.enum(["Web", "Mobile"]),
      description: z.string(),
      tags: z.array(z.string()).default([]),
      role: z.string(),
      platform: z.string(),
      year: z.string(),
      link: z.url().optional(),
      /** Couverture dans src/assets. À défaut, image_placeholder.svg est utilisé. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Ratio de la cover dans la grille Work. */
      coverAspect: z
        .enum(["4/3", "3/4", "4/5", "1/1", "16/9"])
        .default("1/1"),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
