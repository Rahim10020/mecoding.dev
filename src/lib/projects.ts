import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type Project = CollectionEntry<"projects">;

const byOrder = (a: Project, b: Project) => a.data.order - b.data.order;

/** Tous les projets publiés, triés par ordre éditorial. */
export async function getAllProjects(): Promise<Project[]> {
  return (await getCollection("projects", ({ data }) => !data.draft)).sort(
    byOrder,
  );
}

/** Projets marqués `featured`, triés par ordre éditorial. */
export async function getFeaturedProjects(): Promise<Project[]> {
  return (
    await getCollection("projects", ({ data }) => data.featured && !data.draft)
  ).sort(byOrder);
}
