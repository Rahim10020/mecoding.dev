// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Domaine canonique actuel (déploiement Vercel). Repasser sur
  // `https://mecoding.dev` quand le DNS du domaine sera branché.
  site: "https://mecoding-dev.vercel.app",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
