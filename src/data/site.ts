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
  phone: "+228 91 79 61 15",
  whatsappHref,

  /**
   * Formulaire de contact. Sans `accessKey`, le formulaire retombe sur
   * `mailto:` ; renseigner la clé Web3Forms active l'envoi via leur API.
   */
  contact: {
    endpoint: "https://api.web3forms.com/submit",
    accessKey: "",
    subject: "New message from mecoding.dev",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Work", href: "/projects" },
    { label: "About", href: "/about" },
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
