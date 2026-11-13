import { routes } from "@/lib/routes";

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

/** Lien WhatsApp unique, partagé par la page About et les socials. */
const whatsappHref = "https://wa.me/22891796115";

/** Domaine canonique courant — repasser sur `https://mecoding.dev` après le DNS. */
const siteUrl = "https://mecoding-dev.vercel.app";

export const site = {
  /** Wordmark et nom du site. */
  name: "mecoding.dev",
  url: siteUrl,
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
  phone: "+228 91 79 61 15",
  whatsappHref,

  /**
   * Formulaire de contact. La clé Web3Forms active l'envoi via leur API ;
   * sans clé, le formulaire retombe sur `mailto:` (et casse les audits HTTPS
   * de Lighthouse : une action de formulaire non-HTTPS est du mixed content).
   */
  contact: {
    endpoint: "https://api.web3forms.com/submit",
    accessKey: "cbcc83a2-a2eb-4154-9b48-a64b4a67b3d4",
    subject: "New message from mecoding.dev",
    /** Retour après envoi : ancre affichée par `:target` sur la page About. */
    redirect: `${siteUrl}/about/#contact-sent`,
  },

  nav: [
    { label: "Home", href: routes.home },
    { label: "Work", href: routes.projects },
    { label: "About", href: routes.about },
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
      href: whatsappHref,
    },
  ] satisfies Social[],
} as const;
