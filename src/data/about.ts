export interface AboutEntry {
  name: string;
  detail?: string;
  href?: string;
}

/**
 * Contenu éditorial de la page About.
 * La sélection de projets est construite depuis la collection `projects`.
 */
export const about = {
  statement:
    "I'm Rahim, a designer and developer building clear, fast interfaces for the web.",

  bio: [
    "I'm the kind of developer who notices when a button is off by four pixels.",
    "I work at the intersection of web design and front-end development, with an obsession for clean interfaces, details that matter, and experiences that feel natural. My goal is simple: build products you'll be proud to show, and that people will enjoy using.",
  ],

  /** Une seule ligne, comme la liste « Expertise » de la référence. */
  expertise: [
    "Interface design",
    "Front-end",
    "Mobile Development",
    "Performance",
    "Accessibility",
  ],

  focus: [
    { name: "Design", detail: "UX/UI, design systems" },
    { name: "Front-end", detail: "Astro, React, TypeScript" },
    { name: "Product", detail: "from idea to shipped interface" },
    { name: "Performance", detail: "speed and accessibility" },
  ] satisfies AboutEntry[],

  stack: [
    { name: "Astro", detail: "Framework" },
    { name: "Next js", detail: "Framework" },
    { name: "React", detail: "UI library" },
    { name: "TypeScript", detail: "Language" },
    { name: "Tailwind CSS", detail: "Styling" },
    { name: "Flutter", detail: "Mobile" },
    { name: "JetPack Compose/Kotlin", detail: "Mobile" },
    { name: "Figma", detail: "Design" },
  ] satisfies AboutEntry[],

  certifications: [
    {
      name: "Meta Android Developer",
      detail: "Coursera — 2025 · 12 courses",
      href: "https://coursera.org/verify/professional-cert/D9NRRKT23S0A",
    },
    {
      name: "Meta Back-End Developer",
      detail: "Coursera — 2025 · 9 courses",
      href: "https://coursera.org/verify/professional-cert/5371WRWBPVRH",
    },
  ] satisfies AboutEntry[],

  languages: ["French", "English"],
} as const;
