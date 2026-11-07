export type SocialId = "github" | "linkedin" | "instagram" | "whatsapp";

export interface Social {
  id: SocialId;
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export const site = {
  /** Wordmark et nom du site. */
  name: "mecoding.dev",
  url: "https://mecoding.dev",
  lang: "en",
  locale: "en_US",

  /** Auteur — utilisé dans les métadonnées et le footer. */
  author: "Rahim ALI",

  title: "mecoding — Web developer & UX/UI designer",
  description:
    "Rahim ALI is a web developer and UX/UI designer based in Lomé, Togo, helping turn ideas into useful digital products.",

  location: {
    city: "Lomé",
    country: "Togo",
    timeZone: "Africa/Lome",
  },

  email: "rahim100codeur@gmail.com",

  /** Statut affiché en haut à gauche du header. */
  availability: "Available for work",

  nav: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/projects" },
    { label: "Studio", href: "/about" },
  ] satisfies NavItem[],

  socials: [
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/Rahim10020",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/rahim-ali-a6003226b",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://instagram.com/rahim.aldev",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: "https://wa.me/22891796115",
    },
  ] satisfies Social[],
} as const;
