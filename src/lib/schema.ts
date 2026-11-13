import { site } from "@/data/site";

/** Identifiants stables du graphe, partagés entre toutes les pages. */
export const schemaIds = {
  person: `${site.url}/#person`,
  website: `${site.url}/#website`,
} as const;

/**
 * Graphe global : l'auteur et le site. Rendu par `Layout.astro` sur chaque
 * page, les pages ajoutent leurs propres nœuds via la prop `structuredData`.
 */
export function siteSchema(): Record<string, unknown>[] {
  return [
    {
      "@type": "Person",
      "@id": schemaIds.person,
      name: site.author,
      url: site.url,
      email: `mailto:${site.email}`,
      jobTitle: "Web developer & UX/UI designer",
      description: site.description,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.location.city,
        addressCountry: "TG",
      },
      sameAs: site.socials.map((social) => social.href),
    },
    {
      "@type": "WebSite",
      "@id": schemaIds.website,
      name: site.name,
      url: site.url,
      inLanguage: site.lang,
      publisher: { "@id": schemaIds.person },
    },
  ];
}

interface ProjectSchemaInput {
  title: string;
  description: string;
  category: string;
  year: string;
  /** URL absolue de la page projet. */
  url: string;
  /** URL absolue de la couverture. */
  image: string;
  tags?: string[];
}

/** Nœud `CreativeWork` d'une page projet, rattaché au site et à l'auteur. */
export function projectSchema({
  title,
  description,
  category,
  year,
  url,
  image,
  tags = [],
}: ProjectSchemaInput): Record<string, unknown> {
  return {
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    name: title,
    description,
    url,
    image,
    datePublished: year,
    genre: category,
    inLanguage: site.lang,
    ...(tags.length > 0 && { keywords: tags.join(", ") }),
    creator: { "@id": schemaIds.person },
    isPartOf: { "@id": schemaIds.website },
  };
}
