/** Vrai si le lien pointe vers un autre domaine. */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/** Attributs à ajouter aux liens externes. */
export function externalLinkProps(href: string) {
  return isExternal(href)
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};
}
