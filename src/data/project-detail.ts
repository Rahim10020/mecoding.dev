/**
 * Libellés de la page détail projet.
 * La copie vit ici, jamais en dur dans les composants.
 */
export const projectDetail = {
  back: "Back to projects",
  recent: "Recent Project",
  next: "Next Project",
  navigation: "Project navigation",
  openProject: (title: string) => `Open ${title}`,
  meta: {
    role: "Role",
    platform: "Platform",
    year: "Year",
  },
} as const;
