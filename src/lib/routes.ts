/**
 * Source unique des URL internes du site.
 *
 * Astro construit les routes depuis `src/pages/` : ce fichier ne les déclare
 * pas, il centralise les liens. Toute nouvelle page doit y être ajoutée, et
 * `routes.project` doit rester aligné sur `src/pages/projects/[id].astro`.
 *
 * Les liens externes (réseaux, `mailto:`, sites des projets) restent dans
 * `src/data/site.ts` et dans le contenu des projets.
 */
export const routes = {
  home: "/",
  projects: "/projects",
  /** `id` = identifiant de la collection `projects` (nom du fichier markdown). */
  project: (id: string) => `/projects/${id}`,
  about: "/about",
  /** Ancre vers le formulaire de contact, en bas de la page About. */
  aboutContact: "/about#contact",
} as const;
