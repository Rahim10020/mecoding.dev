import type { APIRoute } from "astro";

import { site } from "@/data/site";

export const prerender = true;

/**
 * `robots.txt` généré depuis `site.url` : le domaine canonique n'est écrit
 * qu'à un seul endroit, donc le sitemap déclaré ne peut plus diverger du
 * déploiement.
 */
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
